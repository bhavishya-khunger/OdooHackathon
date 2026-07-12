from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session

from app.api.deps import get_current_user
from app.database import get_session
from app.models import User
from app.schemas.allocation import (
    AllocationCreate,
    AllocationListResponse,
    AllocationResponse,
    AllocationReturnRequest,
    OverdueFlagResponse,
)
from app.services.allocation_service import AllocationService

router = APIRouter(prefix="/allocations", tags=["allocations"])


def get_allocation_service(
    session: Session = Depends(get_session),
) -> AllocationService:
    return AllocationService(session)


# ── B1: POST /allocations/ ──────────────────────────────────────────


@router.post(
    "",
    response_model=AllocationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Allocate an asset to an employee or department",
)
def create_allocation(
    body: AllocationCreate,
    current_user: User = Depends(get_current_user),
    service: AllocationService = Depends(get_allocation_service),
):
    return service.create_allocation(body, current_user)


# ── B1: GET /allocations/ ───────────────────────────────────────────


@router.get(
    "",
    response_model=AllocationListResponse,
    summary="List allocations with optional filters",
)
def list_allocations(
    asset_id: Optional[int] = Query(None),
    user_id: Optional[int] = Query(None),
    department_id: Optional[int] = Query(None),
    allocation_status: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    _: User = Depends(get_current_user),
    service: AllocationService = Depends(get_allocation_service),
):
    items, total = service.list_allocations(
        asset_id=asset_id,
        user_id=user_id,
        department_id=department_id,
        allocation_status=allocation_status,
        skip=skip,
        limit=limit,
    )
    return AllocationListResponse(items=items, total=total, skip=skip, limit=limit)


# ── B2: POST /allocations/flag-overdue (BEFORE path params) ─────────


@router.post(
    "/flag-overdue",
    response_model=OverdueFlagResponse,
    summary="Flag all past-due allocations as overdue",
)
def flag_overdue(
    current_user: User = Depends(get_current_user),
    service: AllocationService = Depends(get_allocation_service),
):
    if current_user.role not in {"admin", "asset_manager"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin or asset_manager can flag overdue allocations.",
        )
    count = service.flag_overdue_allocations()
    return OverdueFlagResponse(
        flagged_count=count,
        message=f"{count} allocation(s) flagged as overdue.",
    )


# ── B1: GET /allocations/{id} ───────────────────────────────────────


@router.get(
    "/{allocation_id}",
    response_model=AllocationResponse,
    summary="Get a single allocation by ID",
)
def get_allocation(
    allocation_id: int,
    _: User = Depends(get_current_user),
    service: AllocationService = Depends(get_allocation_service),
):
    return service.get_allocation(allocation_id)


# ── B2: POST /allocations/{id}/return ────────────────────────────────


@router.post(
    "/{allocation_id}/return",
    response_model=AllocationResponse,
    summary="Return an allocated asset",
)
def return_allocation(
    allocation_id: int,
    body: AllocationReturnRequest,
    current_user: User = Depends(get_current_user),
    service: AllocationService = Depends(get_allocation_service),
):
    return service.return_allocation(allocation_id, body.condition_notes, current_user)
