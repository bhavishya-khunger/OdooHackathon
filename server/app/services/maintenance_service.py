from typing import Optional

from fastapi import HTTPException, status
from sqlmodel import Session, func, select

from app.models import Asset, MaintenanceRequest, User
from app.schemas.maintenance import (
    MaintenanceApprove,
    MaintenanceAssign,
    MaintenanceCreate,
    MaintenanceResolve,
    MaintenanceResponse,
)


class MaintenanceService:
    def __init__(self, session: Session):
        self.session = session

    def _build_response(self, req: MaintenanceRequest) -> MaintenanceResponse:
        return MaintenanceResponse.model_validate(req)

    def _get_request(self, request_id: int) -> MaintenanceRequest:
        req = self.session.get(MaintenanceRequest, request_id)
        if not req:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Maintenance request not found.")
        return req

    # ── B5: Create Request ─────────────────────────────────────────────

    def create_request(self, data: MaintenanceCreate, current_user: User) -> MaintenanceResponse:
        asset = self.session.get(Asset, data.asset_id)
        if not asset:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found.")
        
        req = MaintenanceRequest(
            asset_id=data.asset_id,
            requested_by=current_user.id,
            description=data.description,
            priority=data.priority,
            photo_url=data.photo_url,
            status="pending",
        )
        self.session.add(req)
        self.session.commit()
        self.session.refresh(req)
        return self._build_response(req)

    # ── B5: Workflow Transitions (Strict) ──────────────────────────────

    def _require_manager(self, user: User) -> None:
        if user.role not in {"admin", "asset_manager"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Only admin or asset_manager can perform this action."
            )

    def approve_request(self, request_id: int, data: MaintenanceApprove, current_user: User) -> MaintenanceResponse:
        self._require_manager(current_user)
        req = self._get_request(request_id)

        if req.status != "pending":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Cannot approve a {req.status} request.")

        asset = self.session.get(Asset, req.asset_id)
        if not asset:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found.")

        req.status = "approved"
        req.approved_by = current_user.id
        
        if data.assigned_technician_id:
            # Although we enforce strict transitions, if the manager provides a technician right at approval, 
            # we can advance the state to technician_assigned immediately for convenience, or reject it.
            # To strictly follow step-by-step, we just save the ID but don't jump to 'technician_assigned'
            # Let's save the ID but require them to hit the /assign endpoint to transition the state.
            req.assigned_technician_id = data.assigned_technician_id

        # Update Asset status
        asset.status = "under_maintenance"
        
        self.session.add(req)
        self.session.add(asset)
        self.session.commit()
        self.session.refresh(req)
        return self._build_response(req)

    def reject_request(self, request_id: int, current_user: User) -> MaintenanceResponse:
        self._require_manager(current_user)
        req = self._get_request(request_id)

        if req.status != "pending":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Cannot reject a {req.status} request.")

        req.status = "rejected"
        req.approved_by = current_user.id
        self.session.add(req)
        self.session.commit()
        self.session.refresh(req)
        return self._build_response(req)

    def assign_technician(self, request_id: int, data: MaintenanceAssign, current_user: User) -> MaintenanceResponse:
        self._require_manager(current_user)
        req = self._get_request(request_id)

        if req.status != "approved":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Request must be 'approved' to assign a technician. Current: {req.status}"
            )

        technician = self.session.get(User, data.assigned_technician_id)
        if not technician or technician.status != "active":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Valid active technician not found.")

        req.assigned_technician_id = technician.id
        req.status = "technician_assigned"
        self.session.add(req)
        self.session.commit()
        self.session.refresh(req)
        return self._build_response(req)

    def start_work(self, request_id: int, current_user: User) -> MaintenanceResponse:
        req = self._get_request(request_id)

        if req.status != "technician_assigned":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Request must be 'technician_assigned' to start work. Current: {req.status}"
            )

        if current_user.role not in {"admin", "asset_manager"} and current_user.id != req.assigned_technician_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only managers or the assigned technician can start work.")

        req.status = "in_progress"
        self.session.add(req)
        self.session.commit()
        self.session.refresh(req)
        return self._build_response(req)

    def resolve_request(self, request_id: int, data: MaintenanceResolve, current_user: User) -> MaintenanceResponse:
        req = self._get_request(request_id)

        if req.status != "in_progress":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Request must be 'in_progress' to resolve. Current: {req.status}"
            )

        if current_user.role not in {"admin", "asset_manager"} and current_user.id != req.assigned_technician_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only managers or the assigned technician can resolve.")

        asset = self.session.get(Asset, req.asset_id)
        if not asset:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found.")

        req.status = "resolved"
        req.resolution_notes = data.resolution_notes
        
        # Revert Asset Status
        asset.status = "available"
        
        self.session.add(req)
        self.session.add(asset)
        self.session.commit()
        self.session.refresh(req)
        return self._build_response(req)

    # ── B5: List/Get ───────────────────────────────────────────────────

    def get_maintenance(self, request_id: int) -> MaintenanceResponse:
        return self._build_response(self._get_request(request_id))

    def list_maintenance(
        self,
        asset_id: Optional[int] = None,
        maintenance_status: Optional[str] = None,
        priority: Optional[str] = None,
        assigned_technician_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> tuple[list[MaintenanceResponse], int]:
        query = select(MaintenanceRequest)

        if asset_id is not None:
            query = query.where(MaintenanceRequest.asset_id == asset_id)
        if maintenance_status is not None:
            query = query.where(MaintenanceRequest.status == maintenance_status)
        if priority is not None:
            query = query.where(MaintenanceRequest.priority == priority)
        if assigned_technician_id is not None:
            query = query.where(MaintenanceRequest.assigned_technician_id == assigned_technician_id)

        total = self.session.exec(select(func.count()).select_from(query.subquery())).one()
        requests = self.session.exec(query.order_by(MaintenanceRequest.created_at.desc()).offset(skip).limit(limit)).all()

        return [self._build_response(r) for r in requests], total
