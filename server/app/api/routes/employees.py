from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from app.api.deps import get_current_user, require_roles
from app.database import get_session
from app.models import User
from app.schemas.employee import EmployeePromoteRequest, EmployeeResponse
from app.services.employee_service import EmployeeService

router = APIRouter(prefix="/employees", tags=["employees"])

ADMIN_ONLY = require_roles("admin")


def get_employee_service(session: Session = Depends(get_session)) -> EmployeeService:
    return EmployeeService(session)


@router.get("", response_model=list[EmployeeResponse])
def list_employees(
    q: Optional[str] = Query(default=None, description="Search by name or email"),
    role: Optional[str] = Query(default=None),
    department_id: Optional[int] = Query(default=None),
    status_filter: Optional[str] = Query(default=None, alias="status"),
    _: User = Depends(get_current_user),
    service: EmployeeService = Depends(get_employee_service),
):
    return service.list_employees(
        search=q,
        role=role,
        department_id=department_id,
        status_filter=status_filter,
    )


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(
    employee_id: int,
    _: User = Depends(get_current_user),
    service: EmployeeService = Depends(get_employee_service),
):
    return service.get_employee(employee_id)


@router.post("/{employee_id}/promote", response_model=EmployeeResponse)
def promote_employee(
    employee_id: int,
    body: EmployeePromoteRequest,
    _: User = Depends(ADMIN_ONLY),
    service: EmployeeService = Depends(get_employee_service),
):
    return service.promote(employee_id, body)


@router.post("/{employee_id}/demote", response_model=EmployeeResponse)
def demote_employee(
    employee_id: int,
    _: User = Depends(ADMIN_ONLY),
    service: EmployeeService = Depends(get_employee_service),
):
    return service.demote(employee_id)
