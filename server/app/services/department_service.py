from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models import Department, User
from app.schemas.department import DepartmentCreate, DepartmentUpdate


class DepartmentService:
    def __init__(self, session: Session):
        self.session = session

    def list_departments(self, status_filter: str | None = None) -> list[Department]:
        query = select(Department)
        if status_filter:
            query = query.where(Department.status == status_filter)
        return list(self.session.exec(query.order_by(Department.name)).all())

    def get_department(self, department_id: int) -> Department:
        department = self.session.get(Department, department_id)
        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found",
            )
        return department

    def create(self, data: DepartmentCreate) -> Department:
        self._validate_unique_name(data.name)
        self._validate_head(data.head_id)
        self._validate_parent(data.parent_department_id)

        department = Department(
            name=data.name,
            head_id=data.head_id,
            parent_department_id=data.parent_department_id,
        )
        self.session.add(department)
        self.session.commit()
        self.session.refresh(department)
        return department

    def update(self, department_id: int, data: DepartmentUpdate) -> Department:
        department = self.get_department(department_id)

        if data.name is not None and data.name != department.name:
            self._validate_unique_name(data.name, exclude_id=department_id)
            department.name = data.name

        if "head_id" in data.model_fields_set:
            self._validate_head(data.head_id)
            department.head_id = data.head_id

        if "parent_department_id" in data.model_fields_set:
            self._validate_parent(
                data.parent_department_id,
                department_id=department_id,
            )
            department.parent_department_id = data.parent_department_id

        self.session.add(department)
        self.session.commit()
        self.session.refresh(department)
        return department

    def deactivate(self, department_id: int) -> Department:
        department = self.get_department(department_id)
        if department.status == "inactive":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Department is already inactive",
            )

        children = self.session.exec(
            select(Department).where(
                Department.parent_department_id == department_id,
                Department.status == "active",
            )
        ).first()
        if children:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Cannot deactivate department with active child departments",
            )

        department.status = "inactive"
        self.session.add(department)
        self.session.commit()
        self.session.refresh(department)
        return department

    def _validate_unique_name(self, name: str, exclude_id: int | None = None) -> None:
        existing = self.session.exec(
            select(Department).where(Department.name == name)
        ).first()
        if existing and existing.id != exclude_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Department name already exists",
            )

    def _validate_head(self, head_id: int | None) -> None:
        if head_id is None:
            return

        user = self.session.get(User, head_id)
        if not user or user.status != "active":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department head user not found or inactive",
            )

    def _validate_parent(
        self,
        parent_department_id: int | None,
        department_id: int | None = None,
    ) -> None:
        if parent_department_id is None:
            return

        if department_id is not None and parent_department_id == department_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Department cannot be its own parent",
            )

        parent = self.session.get(Department, parent_department_id)
        if not parent or parent.status != "active":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent department not found or inactive",
            )

        if department_id is not None:
            self._ensure_no_cycle(department_id, parent_department_id)

    def _ensure_no_cycle(self, department_id: int, parent_id: int) -> None:
        current_id = parent_id
        visited: set[int] = set()

        while current_id is not None:
            if current_id == department_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Parent assignment would create a circular hierarchy",
                )
            if current_id in visited:
                break
            visited.add(current_id)

            parent = self.session.get(Department, current_id)
            if not parent:
                break
            current_id = parent.parent_department_id
