from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from app.api.deps import get_current_user, require_roles
from app.database import get_session
from app.models import User
from app.schemas.asset import (
    AssetCreate,
    AssetHistoryResponse,
    AssetResponse,
    AssetStatusUpdate,
)
from app.services.asset_service import AssetService

router = APIRouter(prefix="/assets", tags=["assets"])

MANAGE_ASSETS = require_roles("admin", "asset_manager")


def get_asset_service(session: Session = Depends(get_session)) -> AssetService:
    return AssetService(session)


@router.get("", response_model=list[AssetResponse])
def search_assets(
    tag: Optional[str] = Query(default=None),
    serial_number: Optional[str] = Query(default=None),
    status_filter: Optional[str] = Query(default=None, alias="status"),
    category_id: Optional[int] = Query(default=None),
    department_id: Optional[int] = Query(default=None),
    location: Optional[str] = Query(default=None),
    _: User = Depends(get_current_user),
    service: AssetService = Depends(get_asset_service),
):
    return service.search_assets(
        tag=tag,
        serial_number=serial_number,
        status_filter=status_filter,
        category_id=category_id,
        department_id=department_id,
        location=location,
    )


@router.post(
    "",
    response_model=AssetResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_asset(
    body: AssetCreate,
    _: User = Depends(MANAGE_ASSETS),
    service: AssetService = Depends(get_asset_service),
):
    return service.register(body)


@router.get("/{asset_id}/history", response_model=AssetHistoryResponse)
def get_asset_history(
    asset_id: int,
    _: User = Depends(get_current_user),
    service: AssetService = Depends(get_asset_service),
):
    return service.get_asset_history(asset_id)


@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(
    asset_id: int,
    _: User = Depends(get_current_user),
    service: AssetService = Depends(get_asset_service),
):
    return service.get_asset(asset_id)


@router.patch("/{asset_id}/status", response_model=AssetResponse)
def update_asset_status(
    asset_id: int,
    body: AssetStatusUpdate,
    _: User = Depends(MANAGE_ASSETS),
    service: AssetService = Depends(get_asset_service),
):
    return service.update_status(asset_id, body)
