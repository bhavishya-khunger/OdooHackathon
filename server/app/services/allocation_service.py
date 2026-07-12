from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlmodel import Session, func, select

from app.models import Allocation, Asset, Department, User
from app.schemas.allocation import AllocationCreate, AllocationResponse


# Statuses that permit allocation
ALLOCATABLE_STATUSES = {"available", "reserved"}

NON_ALLOCATABLE_MESSAGES = {
    "allocated": "Asset is currently allocated",
    "under_maintenance": "Asset is currently under maintenance",
    "lost": "Asset is marked as lost",
    "retired": "Asset has been retired",
    "disposed": "Asset has been disposed",
}


class AllocationService:
    def __init__(self, session: Session):
        self.session = session

    # ── helpers ──────────────────────────────────────────────────────

    def _resolve_holder_name(self, allocation: Allocation) -> str:
        if allocation.user_id:
            user = self.session.get(User, allocation.user_id)
            return user.name if user else "Unknown User"
        if allocation.department_id:
            dept = self.session.get(Department, allocation.department_id)
            return dept.name if dept else "Unknown Department"
        return "Unknown"

    def _build_response(
        self, allocation: Allocation, asset: Asset
    ) -> AllocationResponse:
        return AllocationResponse(
            id=allocation.id,
            asset_id=allocation.asset_id,
            asset_tag=asset.tag,
            user_id=allocation.user_id,
            department_id=allocation.department_id,
            allocated_to_name=self._resolve_holder_name(allocation),
            allocated_by=allocation.allocated_by,
            expected_return_date=allocation.expected_return_date,
            actual_return_date=allocation.actual_return_date,
            status=allocation.status,
            notes=allocation.notes,
            created_at=allocation.created_at,
        )

    # ── B1: create allocation ────────────────────────────────────────

    def create_allocation(
        self, data: AllocationCreate, current_user: User
    ) -> AllocationResponse:
        # Role gate
        allowed = {"admin", "asset_manager", "dept_head"}
        if current_user.role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admin, asset_manager, or dept_head can allocate assets.",
            )

        # Fetch asset
        asset = self.session.get(Asset, data.asset_id)
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Asset with id {data.asset_id} not found.",
            )

        # Conflict check
        if asset.status not in ALLOCATABLE_STATUSES:
            error_msg = NON_ALLOCATABLE_MESSAGES.get(
                asset.status,
                f"Asset cannot be allocated in its current state: {asset.status}",
            )
            current_alloc = self.session.exec(
                select(Allocation).where(
                    Allocation.asset_id == asset.id,
                    Allocation.status.in_(["active", "overdue"]),
                )
            ).first()

            held_by = "N/A"
            alloc_id = None
            transfer_hint = False

            if current_alloc:
                held_by = self._resolve_holder_name(current_alloc)
                alloc_id = current_alloc.id
                transfer_hint = True

            if asset.status == "under_maintenance":
                held_by = "Maintenance"
                transfer_hint = False

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "error": error_msg,
                    "held_by": held_by,
                    "allocation_id": alloc_id,
                    "transfer_request_hint": transfer_hint,
                },
            )

        # Validate target
        if data.user_id is not None:
            target_user = self.session.get(User, data.user_id)
            if not target_user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with id {data.user_id} not found.",
                )
            if target_user.status != "active":
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"User '{target_user.name}' is inactive.",
                )
            # Dept head scope check
            if current_user.role == "dept_head":
                if target_user.department_id != current_user.department_id:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Department Heads can only allocate to users within their department.",
                    )

        elif data.department_id is not None:
            target_dept = self.session.get(Department, data.department_id)
            if not target_dept:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Department with id {data.department_id} not found.",
                )
            if target_dept.status != "active":
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Department '{target_dept.name}' is inactive.",
                )
            if current_user.role == "dept_head":
                if target_dept.id != current_user.department_id:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Department Heads can only allocate to their own department.",
                    )

        # Create allocation + update asset
        allocation = Allocation(
            asset_id=data.asset_id,
            user_id=data.user_id,
            department_id=data.department_id,
            allocated_by=current_user.id,
            expected_return_date=data.expected_return_date,
            notes=data.notes,
            status="active",
        )
        self.session.add(allocation)
        asset.status = "allocated"
        self.session.add(asset)
        self.session.commit()
        self.session.refresh(allocation)
        self.session.refresh(asset)

        return self._build_response(allocation, asset)

    # ── B1: list allocations ─────────────────────────────────────────

    def list_allocations(
        self,
        asset_id: Optional[int] = None,
        user_id: Optional[int] = None,
        department_id: Optional[int] = None,
        allocation_status: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[list[AllocationResponse], int]:
        query = select(Allocation)

        if asset_id is not None:
            query = query.where(Allocation.asset_id == asset_id)
        if user_id is not None:
            query = query.where(Allocation.user_id == user_id)
        if department_id is not None:
            query = query.where(Allocation.department_id == department_id)
        if allocation_status is not None:
            query = query.where(Allocation.status == allocation_status)

        total = self.session.exec(
            select(func.count()).select_from(query.subquery())
        ).one()

        allocations = self.session.exec(
            query.order_by(Allocation.created_at.desc()).offset(skip).limit(limit)
        ).all()

        items = []
        for alloc in allocations:
            asset = self.session.get(Asset, alloc.asset_id)
            if asset:
                items.append(self._build_response(alloc, asset))

        return items, total

    # ── B1: get single allocation ────────────────────────────────────

    def get_allocation(self, allocation_id: int) -> AllocationResponse:
        allocation = self.session.get(Allocation, allocation_id)
        if not allocation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Allocation with id {allocation_id} not found.",
            )
        asset = self.session.get(Asset, allocation.asset_id)
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Associated asset not found for allocation {allocation_id}.",
            )
        return self._build_response(allocation, asset)

    # ── B2: return allocation ────────────────────────────────────────

    def return_allocation(
        self,
        allocation_id: int,
        condition_notes: Optional[str],
        current_user: User,
    ) -> AllocationResponse:
        # Role gate
        if current_user.role not in {"admin", "asset_manager"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admin or asset_manager can process returns.",
            )

        allocation = self.session.get(Allocation, allocation_id)
        if not allocation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Allocation with id {allocation_id} not found.",
            )
        if allocation.status not in ("active", "overdue"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Allocation is already '{allocation.status}', cannot return.",
            )

        asset = self.session.get(Asset, allocation.asset_id)
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Associated asset not found.",
            )

        # Mark returned
        allocation.status = "returned"
        allocation.actual_return_date = datetime.now(timezone.utc)
        if condition_notes:
            allocation.notes = (
                f"{allocation.notes}\n[Return] {condition_notes}"
                if allocation.notes
                else f"[Return] {condition_notes}"
            )
        self.session.add(allocation)

        # Revert asset
        asset.status = "available"
        self.session.add(asset)

        self.session.commit()
        self.session.refresh(allocation)
        self.session.refresh(asset)

        return self._build_response(allocation, asset)

    # ── B2: flag overdue allocations ─────────────────────────────────

    def flag_overdue_allocations(self) -> int:
        now = datetime.now(timezone.utc)
        overdue = self.session.exec(
            select(Allocation).where(
                Allocation.status == "active",
                Allocation.expected_return_date != None,  # noqa: E711
                Allocation.expected_return_date < now,
            )
        ).all()

        for alloc in overdue:
            alloc.status = "overdue"
            self.session.add(alloc)

        self.session.commit()
        return len(overdue)
