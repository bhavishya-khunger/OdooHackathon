from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from app.api.deps import get_current_user
from app.database import get_session
from app.models import User
from app.schemas.audit import (
    AuditAssignmentCreate,
    AuditAssignmentResponse,
    AuditCycleCreate,
    AuditCycleListResponse,
    AuditCycleResponse,
    AuditDiscrepancyReport,
    AuditResultCreate,
    AuditResultListResponse,
    AuditResultResponse,
)
from app.services.audit_service import AuditService

router = APIRouter(prefix="/audits", tags=["audits"])


def get_audit_service(session: Session = Depends(get_session)) -> AuditService:
    return AuditService(session)


# ── B6: POST /audits/ ───────────────────────────────────────────────


@router.post(
    "",
    response_model=AuditCycleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new audit cycle (Admin)",
)
def create_cycle(
    body: AuditCycleCreate,
    current_user: User = Depends(get_current_user),
    service: AuditService = Depends(get_audit_service),
):
    return service.create_cycle(body, current_user)


# ── B6: GET /audits/ ────────────────────────────────────────────────


@router.get(
    "",
    response_model=AuditCycleListResponse,
    summary="List audit cycles",
)
def list_cycles(
    cycle_status: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    _: User = Depends(get_current_user),
    service: AuditService = Depends(get_audit_service),
):
    items, total = service.list_cycles(cycle_status, skip, limit)
    return AuditCycleListResponse(items=items, total=total, skip=skip, limit=limit)


# ── B6: POST /audits/{id}/assign ────────────────────────────────────


@router.post(
    "/{cycle_id}/assign",
    response_model=List[AuditAssignmentResponse],
    summary="Assign auditors to an audit cycle (Admin)",
)
def assign_auditors(
    cycle_id: int,
    body: AuditAssignmentCreate,
    current_user: User = Depends(get_current_user),
    service: AuditService = Depends(get_audit_service),
):
    return service.assign_auditors(cycle_id, body, current_user)


# ── B7: POST /audits/{id}/results ───────────────────────────────────


@router.post(
    "/{cycle_id}/results",
    response_model=AuditResultResponse,
    summary="Log an asset result during an audit (Assigned Auditor)",
)
def log_result(
    cycle_id: int,
    body: AuditResultCreate,
    current_user: User = Depends(get_current_user),
    service: AuditService = Depends(get_audit_service),
):
    return service.log_result(cycle_id, body, current_user)


# ── B7: GET /audits/{id}/results ────────────────────────────────────


@router.get(
    "/{cycle_id}/results",
    response_model=AuditResultListResponse,
    summary="List results logged for an audit cycle",
)
def list_results(
    cycle_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    _: User = Depends(get_current_user),
    service: AuditService = Depends(get_audit_service),
):
    items, total = service.list_results(cycle_id, skip, limit)
    return AuditResultListResponse(items=items, total=total, skip=skip, limit=limit)


# ── B7: POST /audits/{id}/close ─────────────────────────────────────


@router.post(
    "/{cycle_id}/close",
    response_model=AuditDiscrepancyReport,
    summary="Close an audit cycle and generate the discrepancy report (Manager/Admin)",
)
def close_cycle(
    cycle_id: int,
    current_user: User = Depends(get_current_user),
    service: AuditService = Depends(get_audit_service),
):
    return service.close_cycle(cycle_id, current_user)


# ── B7: GET /audits/{id}/report ─────────────────────────────────────


@router.get(
    "/{cycle_id}/report",
    response_model=AuditDiscrepancyReport,
    summary="Get the discrepancy report for a closed audit cycle",
)
def get_report(
    cycle_id: int,
    current_user: User = Depends(get_current_user),
    service: AuditService = Depends(get_audit_service),
):
    return service.get_report(cycle_id, current_user)
