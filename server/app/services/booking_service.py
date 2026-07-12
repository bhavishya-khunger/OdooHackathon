from datetime import datetime
from typing import Optional

from fastapi import HTTPException, status
from sqlmodel import Session, func, select

from app.models import Asset, ResourceBooking, User
from app.schemas.booking import BookingCreate, BookingResponse, BookingUpdate


class BookingService:
    def __init__(self, session: Session):
        self.session = session

    # ── Helpers ────────────────────────────────────────────────────────

    def _check_overlap(self, asset_id: int, start_time: datetime, end_time: datetime, exclude_booking_id: Optional[int] = None) -> None:
        """
        Overlap logic: NewStart < ExistingEnd AND NewEnd > ExistingStart
        """
        query = select(ResourceBooking).where(
            ResourceBooking.asset_id == asset_id,
            ResourceBooking.status.in_(["upcoming", "ongoing"]),
            ResourceBooking.start_time < end_time,
            ResourceBooking.end_time > start_time,
        )
        if exclude_booking_id is not None:
            query = query.where(ResourceBooking.id != exclude_booking_id)

        overlapping = self.session.exec(query).first()
        if overlapping:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Time slot overlaps with an existing booking (ID: {overlapping.id}, from {overlapping.start_time} to {overlapping.end_time}).",
            )

    def _build_response(self, booking: ResourceBooking) -> BookingResponse:
        return BookingResponse.model_validate(booking)

    # ── B4: Create Booking ─────────────────────────────────────────────

    def create_booking(self, data: BookingCreate, current_user: User) -> BookingResponse:
        asset = self.session.get(Asset, data.asset_id)
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Asset with id {data.asset_id} not found.",
            )
        if not asset.is_shared:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Asset is not marked as a shared/bookable resource.",
            )
        if asset.status not in ["available", "allocated"]:
            # If asset is under maintenance or lost, it shouldn't be booked.
            # But the requirements didn't explicitly mention this. It's a good practice though.
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Asset is currently {asset.status} and cannot be booked.",
            )

        self._check_overlap(data.asset_id, data.start_time, data.end_time)

        booking = ResourceBooking(
            asset_id=data.asset_id,
            user_id=current_user.id,
            start_time=data.start_time,
            end_time=data.end_time,
            status="upcoming",
        )
        self.session.add(booking)
        self.session.commit()
        self.session.refresh(booking)

        return self._build_response(booking)

    # ── B4: Update Booking ─────────────────────────────────────────────

    def update_booking(self, booking_id: int, data: BookingUpdate, current_user: User) -> BookingResponse:
        booking = self.session.get(ResourceBooking, booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")
        
        if booking.user_id != current_user.id and current_user.role not in {"admin", "asset_manager"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You can only reschedule your own bookings."
            )
        
        if booking.status not in ["upcoming", "ongoing"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Cannot reschedule a booking with status: {booking.status}"
            )

        self._check_overlap(booking.asset_id, data.start_time, data.end_time, exclude_booking_id=booking_id)

        booking.start_time = data.start_time
        booking.end_time = data.end_time
        self.session.add(booking)
        self.session.commit()
        self.session.refresh(booking)
        return self._build_response(booking)

    # ── B4: Cancel Booking ─────────────────────────────────────────────

    def cancel_booking(self, booking_id: int, current_user: User) -> BookingResponse:
        booking = self.session.get(ResourceBooking, booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")
        
        if booking.user_id != current_user.id and current_user.role not in {"admin", "asset_manager"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You can only cancel your own bookings."
            )
            
        if booking.status in ["completed", "cancelled"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Booking is already {booking.status}."
            )

        booking.status = "cancelled"
        self.session.add(booking)
        self.session.commit()
        self.session.refresh(booking)
        return self._build_response(booking)

    # ── B4: List/Get Bookings ──────────────────────────────────────────

    def get_booking(self, booking_id: int) -> BookingResponse:
        booking = self.session.get(ResourceBooking, booking_id)
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")
        return self._build_response(booking)

    def list_bookings(
        self,
        asset_id: Optional[int] = None,
        user_id: Optional[int] = None,
        booking_status: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[list[BookingResponse], int]:
        query = select(ResourceBooking)

        if asset_id is not None:
            query = query.where(ResourceBooking.asset_id == asset_id)
        if user_id is not None:
            query = query.where(ResourceBooking.user_id == user_id)
        if booking_status is not None:
            query = query.where(ResourceBooking.status == booking_status)

        total = self.session.exec(select(func.count()).select_from(query.subquery())).one()
        bookings = self.session.exec(query.order_by(ResourceBooking.start_time.asc()).offset(skip).limit(limit)).all()

        return [self._build_response(b) for b in bookings], total
