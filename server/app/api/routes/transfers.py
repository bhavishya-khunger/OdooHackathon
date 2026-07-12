from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from app.api.deps import get_current_user
from app.database import get_session
from app.models import User
from app.schemas.transfer import (
    TransferListResponse,
    TransferRequestCreate,
    TransferRequestResponse,
)
from app.services.transfer_service import TransferService

router = APIRouter(prefix="/transfers", tags=["transfers"])


def get_transfer_service(
    session: Session = Depends(get_session),
) -> TransferService:
    return TransferService(session)


# ── B3: POST /transfers/ ────────────────────────────────────────────


@router.post(
    "",
    response_model=TransferRequestResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a transfer request",
)
def create_transfer(
    body: TransferRequestCreate,
    current_user: User = Depends(get_current_user),
    service: TransferService = Depends(get_transfer_service),
):
    return service.create_transfer(body, current_user)


# ── B3: POST /transfers/{id}/approve ─────────────────────────────────


@router.post(
    "/{transfer_id}/approve",
    response_model=TransferRequestResponse,
    summary="Approve a transfer request",
)
def approve_transfer(
    transfer_id: int,
    current_user: User = Depends(get_current_user),
    service: TransferService = Depends(get_transfer_service),
):
    return service.approve_transfer(transfer_id, current_user)


# ── B3: POST /transfers/{id}/reject ──────────────────────────────────


@router.post(
    "/{transfer_id}/reject",
    response_model=TransferRequestResponse,
    summary="Reject a transfer request",
)
def reject_transfer(
    transfer_id: int,
    current_user: User = Depends(get_current_user),
    service: TransferService = Depends(get_transfer_service),
):
    return service.reject_transfer(transfer_id, current_user)


# ── B3: GET /transfers/ ─────────────────────────────────────────────


@router.get(
    "",
    response_model=TransferListResponse,
    summary="List transfer requests with optional filters",
)
def list_transfers(
    allocation_id: Optional[int] = Query(None),
    transfer_status: Optional[str] = Query(None, alias="status"),
    requested_by: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    _: User = Depends(get_current_user),
    service: TransferService = Depends(get_transfer_service),
):
    items, total = service.list_transfers(
        allocation_id=allocation_id,
        transfer_status=transfer_status,
        requested_by=requested_by,
        skip=skip,
        limit=limit,
    )
    return TransferListResponse(items=items, total=total, skip=skip, limit=limit)


# ── B3: GET /transfers/{id} ─────────────────────────────────────────


@router.get(
    "/{transfer_id}",
    response_model=TransferRequestResponse,
    summary="Get a single transfer request by ID",
)
def get_transfer(
    transfer_id: int,
    _: User = Depends(get_current_user),
    service: TransferService = Depends(get_transfer_service),
):
    return service.get_transfer(transfer_id)
