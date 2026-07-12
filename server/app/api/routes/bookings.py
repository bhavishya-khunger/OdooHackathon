from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from app.api.deps import get_current_user
from app.database import get_session
from app.models import User
from app.schemas.booking import (
    BookingCreate,
    BookingListResponse,
    BookingResponse,
    BookingUpdate,
)
from app.services.booking_service import BookingService

router = APIRouter(prefix="/bookings", tags=["bookings"])


def get_booking_service(session: Session = Depends(get_session)) -> BookingService:
    return BookingService(session)


# ── B4: POST /bookings/ ─────────────────────────────────────────────


@router.post(
    "",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Book a shared resource by time slot",
)
def create_booking(
    body: BookingCreate,
    current_user: User = Depends(get_current_user),
    service: BookingService = Depends(get_booking_service),
):
    return service.create_booking(body, current_user)


# ── B4: GET /bookings/ ──────────────────────────────────────────────


@router.get(
    "",
    response_model=BookingListResponse,
    summary="List resource bookings with optional filters",
)
def list_bookings(
    asset_id: Optional[int] = Query(None),
    user_id: Optional[int] = Query(None),
    booking_status: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    _: User = Depends(get_current_user),
    service: BookingService = Depends(get_booking_service),
):
    items, total = service.list_bookings(
        asset_id=asset_id,
        user_id=user_id,
        booking_status=booking_status,
        skip=skip,
        limit=limit,
    )
    return BookingListResponse(items=items, total=total, skip=skip, limit=limit)


# ── B4: GET /bookings/{id} ──────────────────────────────────────────


@router.get(
    "/{booking_id}",
    response_model=BookingResponse,
    summary="Get a single booking by ID",
)
def get_booking(
    booking_id: int,
    _: User = Depends(get_current_user),
    service: BookingService = Depends(get_booking_service),
):
    return service.get_booking(booking_id)


# ── B4: PATCH /bookings/{id} ────────────────────────────────────────


@router.patch(
    "/{booking_id}",
    response_model=BookingResponse,
    summary="Reschedule a booking",
)
def update_booking(
    booking_id: int,
    body: BookingUpdate,
    current_user: User = Depends(get_current_user),
    service: BookingService = Depends(get_booking_service),
):
    return service.update_booking(booking_id, body, current_user)


# ── B4: POST /bookings/{id}/cancel ──────────────────────────────────


@router.post(
    "/{booking_id}/cancel",
    response_model=BookingResponse,
    summary="Cancel a booking",
)
def cancel_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    service: BookingService = Depends(get_booking_service),
):
    return service.cancel_booking(booking_id, current_user)
