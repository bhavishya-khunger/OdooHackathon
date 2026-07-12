from fastapi import HTTPException, status
from sqlalchemy import func, or_
from sqlmodel import Session, select

from app.models import Department, User
from app.schemas.employee import EmployeePromoteRequest, EmployeeResponse

DEMOTABLE_ROLES = {"dept_head", "asset_manager"}


class EmployeeService:
    def __init__(self, session: Session):
        self.session = session

    def list_employees(
        self,
        search: str | None = None,
        role: str | None = None,
        department_id: int | None = None,
        status_filter: str | None = None,
    ) -> list[EmployeeResponse]:
        query = select(User, Department.name).outerjoin(
            Department, User.department_id == Department.id
        )

        if search:
            term = f"%{search.lower()}%"
            query = query.where(
                or_(
                    func.lower(User.name).like(term),
                    func.lower(User.email).like(term),
                )
            )
        if role:
            query = query.where(User.role == role)
        if department_id is not None:
            query = query.where(User.department_id == department_id)
        if status_filter:
            query = query.where(User.status == status_filter)

        rows = self.session.exec(query.order_by(User.name)).all()
        return [
            self._to_response(user, department_name)
            for user, department_name in rows
        ]

    def get_employee(self, employee_id: int) -> EmployeeResponse:
        row = self.session.exec(
            select(User, Department.name)
            .outerjoin(Department, User.department_id == Department.id)
            .where(User.id == employee_id)
        ).first()
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )
        user, department_name = row
        return self._to_response(user, department_name)

    def promote(self, employee_id: int, data: EmployeePromoteRequest) -> EmployeeResponse:
        user = self._get_user(employee_id)
        self._ensure_promotable(user)

        if user.role == data.role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Employee is already a {data.role}",
            )

        if data.department_id is not None:
            department = self.session.get(Department, data.department_id)
            if not department or department.status != "active":
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Department not found or inactive",
                )
            user.department_id = data.department_id

        user.role = data.role

        if data.role == "dept_head" and user.department_id is not None:
            department = self.session.get(Department, user.department_id)
            if department:
                department.head_id = user.id
                self.session.add(department)

        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return self.get_employee(user.id)

    def demote(self, employee_id: int) -> EmployeeResponse:
        user = self._get_user(employee_id)

        if user.role == "employee":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee already has the employee role",
            )
        if user.role == "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot demote an admin user",
            )
        if user.role not in DEMOTABLE_ROLES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User role cannot be demoted through this endpoint",
            )

        if user.role == "dept_head":
            departments = self.session.exec(
                select(Department).where(Department.head_id == user.id)
            ).all()
            for department in departments:
                department.head_id = None
                self.session.add(department)

        user.role = "employee"
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return self.get_employee(user.id)

    def _get_user(self, employee_id: int) -> User:
        user = self.session.get(User, employee_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found",
            )
        return user

    def _ensure_promotable(self, user: User) -> None:
        if user.status != "active":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot change role for an inactive employee",
            )
        if user.role == "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot change role for an admin user",
            )

    def _to_response(
        self,
        user: User,
        department_name: str | None,
    ) -> EmployeeResponse:
        return EmployeeResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            department_id=user.department_id,
            department_name=department_name,
            status=user.status,
            created_at=user.created_at,
        )
