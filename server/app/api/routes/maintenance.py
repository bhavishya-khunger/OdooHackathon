from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from app.api.deps import get_current_user
from app.database import get_session
from app.models import User
from app.schemas.maintenance import (
    MaintenanceApprove,
    MaintenanceAssign,
    MaintenanceCreate,
    MaintenanceListResponse,
    MaintenanceResolve,
    MaintenanceResponse,
)
from app.services.maintenance_service import MaintenanceService

router = APIRouter(prefix="/maintenance", tags=["maintenance"])


def get_maintenance_service(session: Session = Depends(get_session)) -> MaintenanceService:
    return MaintenanceService(session)


# ── B5: POST /maintenance/ ──────────────────────────────────────────


@router.post(
    "",
    response_model=MaintenanceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Raise a new maintenance request",
)
def create_request(
    body: MaintenanceCreate,
    current_user: User = Depends(get_current_user),
    service: MaintenanceService = Depends(get_maintenance_service),
):
    return service.create_request(body, current_user)


# ── B5: GET /maintenance/ ───────────────────────────────────────────


@router.get(
    "",
    response_model=MaintenanceListResponse,
    summary="List maintenance requests with optional filters",
)
def list_maintenance(
    asset_id: Optional[int] = Query(None),
    maintenance_status: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = Query(None),
    assigned_technician_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    _: User = Depends(get_current_user),
    service: MaintenanceService = Depends(get_maintenance_service),
):
    items, total = service.list_maintenance(
        asset_id=asset_id,
        maintenance_status=maintenance_status,
        priority=priority,
        assigned_technician_id=assigned_technician_id,
        skip=skip,
        limit=limit,
    )
    return MaintenanceListResponse(items=items, total=total, skip=skip, limit=limit)


# ── B5: GET /maintenance/{id} ───────────────────────────────────────


@router.get(
    "/{request_id}",
    response_model=MaintenanceResponse,
    summary="Get a single maintenance request by ID",
)
def get_maintenance(
    request_id: int,
    _: User = Depends(get_current_user),
    service: MaintenanceService = Depends(get_maintenance_service),
):
    return service.get_maintenance(request_id)


# ── B5: POST /maintenance/{id}/approve ──────────────────────────────


@router.post(
    "/{request_id}/approve",
    response_model=MaintenanceResponse,
    summary="Approve a maintenance request (Asset Manager)",
)
def approve_request(
    request_id: int,
    body: MaintenanceApprove,
    current_user: User = Depends(get_current_user),
    service: MaintenanceService = Depends(get_maintenance_service),
):
    return service.approve_request(request_id, body, current_user)


# ── B5: POST /maintenance/{id}/reject ───────────────────────────────


@router.post(
    "/{request_id}/reject",
    response_model=MaintenanceResponse,
    summary="Reject a maintenance request (Asset Manager)",
)
def reject_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    service: MaintenanceService = Depends(get_maintenance_service),
):
    return service.reject_request(request_id, current_user)


# ── B5: POST /maintenance/{id}/assign ───────────────────────────────


@router.post(
    "/{request_id}/assign",
    response_model=MaintenanceResponse,
    summary="Assign a technician to an approved request",
)
def assign_technician(
    request_id: int,
    body: MaintenanceAssign,
    current_user: User = Depends(get_current_user),
    service: MaintenanceService = Depends(get_maintenance_service),
):
    return service.assign_technician(request_id, body, current_user)


# ── B5: POST /maintenance/{id}/start ────────────────────────────────


@router.post(
    "/{request_id}/start",
    response_model=MaintenanceResponse,
    summary="Start work on an assigned maintenance request",
)
def start_work(
    request_id: int,
    current_user: User = Depends(get_current_user),
    service: MaintenanceService = Depends(get_maintenance_service),
):
    return service.start_work(request_id, current_user)


# ── B5: POST /maintenance/{id}/resolve ──────────────────────────────


@router.post(
    "/{request_id}/resolve",
    response_model=MaintenanceResponse,
    summary="Resolve a maintenance request and make the asset available",
)
def resolve_request(
    request_id: int,
    body: MaintenanceResolve,
    current_user: User = Depends(get_current_user),
    service: MaintenanceService = Depends(get_maintenance_service),
):
    return service.resolve_request(request_id, body, current_user)
