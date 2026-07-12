from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select, func

from db import get_session
from dependencies import get_current_user
from models import Allocation, Asset, Department, User
from schemas import (
    AllocationConflictDetail,
    AllocationCreate,
    AllocationListResponse,
    AllocationResponse,
)

router = APIRouter(prefix="/api/allocations", tags=["Allocations"])


# ── Helpers ─────────────────────────────────────────────────────────


def _resolve_holder_name(session: Session, allocation: Allocation) -> str:
    """Return the name of whoever currently holds an allocation."""
    if allocation.user_id:
        user = session.get(User, allocation.user_id)
        return user.name if user else "Unknown User"
    if allocation.department_id:
        dept = session.get(Department, allocation.department_id)
        return dept.name if dept else "Unknown Department"
    return "Unknown"


def _build_response(session: Session, allocation: Allocation, asset: Asset) -> AllocationResponse:
    """Build an AllocationResponse from an Allocation + its Asset."""
    return AllocationResponse(
        id=allocation.id,
        asset_id=allocation.asset_id,
        asset_tag=asset.tag,
        user_id=allocation.user_id,
        department_id=allocation.department_id,
        allocated_to_name=_resolve_holder_name(session, allocation),
        allocated_by=allocation.allocated_by,
        expected_return_date=allocation.expected_return_date,
        actual_return_date=allocation.actual_return_date,
        status=allocation.status,
        notes=allocation.notes,
        created_at=allocation.created_at,
    )


# ── POST /api/allocations/ ─────────────────────────────────────────


ALLOCATABLE_STATUSES = {"available", "reserved"}
NON_ALLOCATABLE_MESSAGES = {
    "allocated": "Asset is currently allocated",
    "under_maintenance": "Asset is currently under maintenance",
    "lost": "Asset is marked as lost",
    "retired": "Asset has been retired",
    "disposed": "Asset has been disposed",
}


@router.post(
    "/",
    response_model=AllocationResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        409: {"model": AllocationConflictDetail, "description": "Asset not available for allocation"},
        403: {"description": "Insufficient permissions"},
        404: {"description": "Asset or target not found"},
        422: {"description": "Validation error (e.g. both user_id and department_id)"},
    },
    summary="Allocate an asset to an employee or department",
)
def create_allocation(
    body: AllocationCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    # ── 1. Role gate ────────────────────────────────────────────────
    allowed_roles = {"admin", "asset_manager", "dept_head"}
    if current_user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied. Only {', '.join(sorted(allowed_roles))} can allocate assets. Your role: {current_user.role}.",
        )

    # ── 2. Fetch asset ──────────────────────────────────────────────
    asset = session.get(Asset, body.asset_id)
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Asset with id {body.asset_id} not found.",
        )

    # ── 3. Conflict check (core B1 constraint) ──────────────────────
    if asset.status not in ALLOCATABLE_STATUSES:
        # Build 409 response
        error_msg = NON_ALLOCATABLE_MESSAGES.get(
            asset.status,
            f"Asset cannot be allocated in its current state: {asset.status}",
        )

        # Try to find current active allocation for richer context
        current_alloc = session.exec(
            select(Allocation).where(
                Allocation.asset_id == asset.id,
                Allocation.status == "active",
            )
        ).first()

        held_by = "N/A"
        alloc_id = None
        transfer_hint = False

        if current_alloc:
            held_by = _resolve_holder_name(session, current_alloc)
            alloc_id = current_alloc.id
            transfer_hint = True  # frontend can offer "Request Transfer"

        if asset.status == "under_maintenance":
            held_by = "Maintenance"
            transfer_hint = False

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=AllocationConflictDetail(
                error=error_msg,
                held_by=held_by,
                allocation_id=alloc_id,
                transfer_request_hint=transfer_hint,
            ).model_dump(),
        )

    # ── 4. Validate target exists and is active ─────────────────────
    target_name = ""
    if body.user_id is not None:
        target_user = session.get(User, body.user_id)
        if not target_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {body.user_id} not found.",
            )
        if target_user.status != "active":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"User '{target_user.name}' is inactive and cannot receive allocations.",
            )
        target_name = target_user.name

        # Dept head scope check: target user must be in their department
        if current_user.role == "dept_head":
            if target_user.department_id != current_user.department_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Department Heads can only allocate to users within their own department.",
                )

    elif body.department_id is not None:
        target_dept = session.get(Department, body.department_id)
        if not target_dept:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Department with id {body.department_id} not found.",
            )
        if target_dept.status != "active":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Department '{target_dept.name}' is inactive and cannot receive allocations.",
            )
        target_name = target_dept.name

        # Dept head scope check: must be their own department
        if current_user.role == "dept_head":
            if target_dept.id != current_user.department_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Department Heads can only allocate to their own department.",
                )

    # ── 5. Create allocation + update asset status ──────────────────
    allocation = Allocation(
        asset_id=body.asset_id,
        user_id=body.user_id,
        department_id=body.department_id,
        allocated_by=current_user.id,
        expected_return_date=body.expected_return_date,
        notes=body.notes,
        status="active",
    )
    session.add(allocation)

    asset.status = "allocated"
    session.add(asset)

    session.commit()
    session.refresh(allocation)
    session.refresh(asset)

    return _build_response(session, allocation, asset)


# ── GET /api/allocations/ ──────────────────────────────────────────


@router.get(
    "/",
    response_model=AllocationListResponse,
    summary="List allocations with optional filters",
)
def list_allocations(
    asset_id: Optional[int] = Query(None, description="Filter by asset ID"),
    user_id: Optional[int] = Query(None, description="Filter by allocated user ID"),
    department_id: Optional[int] = Query(None, description="Filter by allocated department ID"),
    allocation_status: Optional[str] = Query(None, alias="status", description="Filter by status: active, returned, overdue"),
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(50, ge=1, le=100, description="Page size"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    query = select(Allocation)

    if asset_id is not None:
        query = query.where(Allocation.asset_id == asset_id)
    if user_id is not None:
        query = query.where(Allocation.user_id == user_id)
    if department_id is not None:
        query = query.where(Allocation.department_id == department_id)
    if allocation_status is not None:
        query = query.where(Allocation.status == allocation_status)

    # Total count (before pagination)
    count_query = select(func.count()).select_from(query.subquery())
    total = session.exec(count_query).one()

    # Paginated results
    allocations = session.exec(
        query.order_by(Allocation.created_at.desc()).offset(skip).limit(limit)
    ).all()

    items = []
    for alloc in allocations:
        asset = session.get(Asset, alloc.asset_id)
        if asset:
            items.append(_build_response(session, alloc, asset))

    return AllocationListResponse(items=items, total=total, skip=skip, limit=limit)


# ── GET /api/allocations/{id} ──────────────────────────────────────


@router.get(
    "/{allocation_id}",
    response_model=AllocationResponse,
    responses={404: {"description": "Allocation not found"}},
    summary="Get a single allocation by ID",
)
def get_allocation(
    allocation_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    allocation = session.get(Allocation, allocation_id)
    if not allocation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Allocation with id {allocation_id} not found.",
        )

    asset = session.get(Asset, allocation.asset_id)
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Associated asset not found for allocation {allocation_id}.",
        )

    return _build_response(session, allocation, asset)
