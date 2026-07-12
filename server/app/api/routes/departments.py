from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from app.api.deps import get_current_user, require_roles
from app.database import get_session
from app.models import User
from app.schemas.department import (
    DepartmentCreate,
    DepartmentResponse,
    DepartmentUpdate,
)
from app.services.department_service import DepartmentService

router = APIRouter(prefix="/departments", tags=["departments"])

ADMIN_ONLY = require_roles("admin")


def get_department_service(session: Session = Depends(get_session)) -> DepartmentService:
    return DepartmentService(session)


@router.get("", response_model=list[DepartmentResponse])
def list_departments(
    status_filter: Optional[str] = Query(default=None, alias="status"),
    _: User = Depends(get_current_user),
    service: DepartmentService = Depends(get_department_service),
):
    return service.list_departments(status_filter=status_filter)


@router.get("/{department_id}", response_model=DepartmentResponse)
def get_department(
    department_id: int,
    _: User = Depends(get_current_user),
    service: DepartmentService = Depends(get_department_service),
):
    return service.get_department(department_id)


@router.post(
    "",
    response_model=DepartmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_department(
    body: DepartmentCreate,
    _: User = Depends(ADMIN_ONLY),
    service: DepartmentService = Depends(get_department_service),
):
    return service.create(body)


@router.patch("/{department_id}", response_model=DepartmentResponse)
def update_department(
    department_id: int,
    body: DepartmentUpdate,
    _: User = Depends(ADMIN_ONLY),
    service: DepartmentService = Depends(get_department_service),
):
    return service.update(department_id, body)


@router.patch("/{department_id}/deactivate", response_model=DepartmentResponse)
def deactivate_department(
    department_id: int,
    _: User = Depends(ADMIN_ONLY),
    service: DepartmentService = Depends(get_department_service),
):
    return service.deactivate(department_id)
