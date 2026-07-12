from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlmodel import Session, func, select

from app.models import Allocation, Asset, Department, TransferRequest, User
from app.schemas.transfer import TransferRequestCreate, TransferRequestResponse


class TransferService:
    def __init__(self, session: Session):
        self.session = session

    # ── helpers ──────────────────────────────────────────────────────

    def _resolve_name_for_user(self, user_id: Optional[int]) -> str:
        if user_id is None:
            return ""
        user = self.session.get(User, user_id)
        return user.name if user else "Unknown User"

    def _resolve_name_for_dept(self, dept_id: Optional[int]) -> str:
        if dept_id is None:
            return ""
        dept = self.session.get(Department, dept_id)
        return dept.name if dept else "Unknown Department"

    def _resolve_target_name(self, transfer: TransferRequest) -> str:
        if transfer.target_user_id:
            return self._resolve_name_for_user(transfer.target_user_id)
        if transfer.target_department_id:
            return self._resolve_name_for_dept(transfer.target_department_id)
        return "Unknown"

    def _build_response(self, transfer: TransferRequest) -> TransferRequestResponse:
        return TransferRequestResponse(
            id=transfer.id,
            allocation_id=transfer.allocation_id,
            requested_by=transfer.requested_by,
            requester_name=self._resolve_name_for_user(transfer.requested_by),
            target_user_id=transfer.target_user_id,
            target_department_id=transfer.target_department_id,
            target_name=self._resolve_target_name(transfer),
            approved_by=transfer.approved_by,
            status=transfer.status,
            created_at=transfer.created_at,
        )

    # ── B3: create transfer request ──────────────────────────────────

    def create_transfer(
        self, data: TransferRequestCreate, current_user: User
    ) -> TransferRequestResponse:
        # Validate allocation exists and is active
        allocation = self.session.get(Allocation, data.allocation_id)
        if not allocation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Allocation with id {data.allocation_id} not found.",
            )
        if allocation.status not in ("active", "overdue"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Allocation is '{allocation.status}', transfer can only be requested for active/overdue allocations.",
            )

        # Validate target exists
        if data.target_user_id is not None:
            target = self.session.get(User, data.target_user_id)
            if not target:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Target user with id {data.target_user_id} not found.",
                )
            if target.status != "active":
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Target user '{target.name}' is inactive.",
                )
        elif data.target_department_id is not None:
            target = self.session.get(Department, data.target_department_id)
            if not target:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Target department with id {data.target_department_id} not found.",
                )
            if target.status != "active":
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Target department '{target.name}' is inactive.",
                )

        # Check for duplicate pending transfer
        existing = self.session.exec(
            select(TransferRequest).where(
                TransferRequest.allocation_id == data.allocation_id,
                TransferRequest.status == "pending",
            )
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A pending transfer request already exists for this allocation.",
            )

        transfer = TransferRequest(
            allocation_id=data.allocation_id,
            requested_by=current_user.id,
            target_user_id=data.target_user_id,
            target_department_id=data.target_department_id,
            status="pending",
        )
        self.session.add(transfer)
        self.session.commit()
        self.session.refresh(transfer)

        return self._build_response(transfer)

    # ── B3: approve transfer ─────────────────────────────────────────

    def approve_transfer(
        self, transfer_id: int, current_user: User
    ) -> TransferRequestResponse:
        self._check_approver_role(current_user)

        transfer = self._get_pending_transfer(transfer_id)
        allocation = self.session.get(Allocation, transfer.allocation_id)
        if not allocation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Original allocation not found.",
            )

        asset = self.session.get(Asset, allocation.asset_id)
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Associated asset not found.",
            )

        # Dept head scope: can only approve if asset/target belongs to their dept
        if current_user.role == "dept_head":
            self._check_dept_head_scope(current_user, transfer, allocation)

        # Close old allocation
        allocation.status = "returned"
        allocation.actual_return_date = datetime.now(timezone.utc)
        allocation.notes = (
            f"{allocation.notes}\n[Transfer] Transferred via request #{transfer.id}"
            if allocation.notes
            else f"[Transfer] Transferred via request #{transfer.id}"
        )
        self.session.add(allocation)

        # Create new allocation for the target
        new_allocation = Allocation(
            asset_id=asset.id,
            user_id=transfer.target_user_id,
            department_id=transfer.target_department_id,
            allocated_by=current_user.id,
            status="active",
        )
        self.session.add(new_allocation)

        # Asset stays allocated
        asset.status = "allocated"
        self.session.add(asset)

        # Update transfer
        transfer.status = "approved"
        transfer.approved_by = current_user.id
        self.session.add(transfer)

        self.session.commit()
        self.session.refresh(transfer)

        return self._build_response(transfer)

    # ── B3: reject transfer ──────────────────────────────────────────

    def reject_transfer(
        self, transfer_id: int, current_user: User
    ) -> TransferRequestResponse:
        self._check_approver_role(current_user)

        transfer = self._get_pending_transfer(transfer_id)

        # Dept head scope
        if current_user.role == "dept_head":
            allocation = self.session.get(Allocation, transfer.allocation_id)
            if allocation:
                self._check_dept_head_scope(current_user, transfer, allocation)

        transfer.status = "rejected"
        transfer.approved_by = current_user.id
        self.session.add(transfer)
        self.session.commit()
        self.session.refresh(transfer)

        return self._build_response(transfer)

    # ── B3: list transfers ───────────────────────────────────────────

    def list_transfers(
        self,
        allocation_id: Optional[int] = None,
        transfer_status: Optional[str] = None,
        requested_by: Optional[int] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[list[TransferRequestResponse], int]:
        query = select(TransferRequest)

        if allocation_id is not None:
            query = query.where(TransferRequest.allocation_id == allocation_id)
        if transfer_status is not None:
            query = query.where(TransferRequest.status == transfer_status)
        if requested_by is not None:
            query = query.where(TransferRequest.requested_by == requested_by)

        total = self.session.exec(
            select(func.count()).select_from(query.subquery())
        ).one()

        transfers = self.session.exec(
            query.order_by(TransferRequest.created_at.desc()).offset(skip).limit(limit)
        ).all()

        items = [self._build_response(t) for t in transfers]
        return items, total

    # ── B3: get single transfer ──────────────────────────────────────

    def get_transfer(self, transfer_id: int) -> TransferRequestResponse:
        transfer = self.session.get(TransferRequest, transfer_id)
        if not transfer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Transfer request with id {transfer_id} not found.",
            )
        return self._build_response(transfer)

    # ── internal helpers ─────────────────────────────────────────────

    def _check_approver_role(self, user: User) -> None:
        if user.role not in {"admin", "asset_manager", "dept_head"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admin, asset_manager, or dept_head can approve/reject transfers.",
            )

    def _get_pending_transfer(self, transfer_id: int) -> TransferRequest:
        transfer = self.session.get(TransferRequest, transfer_id)
        if not transfer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Transfer request with id {transfer_id} not found.",
            )
        if transfer.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Transfer is already '{transfer.status}', cannot modify.",
            )
        return transfer

    def _check_dept_head_scope(
        self,
        current_user: User,
        transfer: TransferRequest,
        allocation: Allocation,
    ) -> None:
        """Dept heads can only approve transfers involving their department."""
        involved_dept_ids = set()
        if allocation.department_id:
            involved_dept_ids.add(allocation.department_id)
        if allocation.user_id:
            alloc_user = self.session.get(User, allocation.user_id)
            if alloc_user and alloc_user.department_id:
                involved_dept_ids.add(alloc_user.department_id)
        if transfer.target_department_id:
            involved_dept_ids.add(transfer.target_department_id)
        if transfer.target_user_id:
            target_user = self.session.get(User, transfer.target_user_id)
            if target_user and target_user.department_id:
                involved_dept_ids.add(target_user.department_id)

        if current_user.department_id not in involved_dept_ids:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Department Heads can only manage transfers within their department.",
            )
