import re

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlmodel import Session, select

from app.models import (
    Allocation,
    Asset,
    AssetCategory,
    Department,
    MaintenanceRequest,
    User,
)
from app.schemas.asset import (
    AllocationHistoryItem,
    AssetCreate,
    AssetHistoryResponse,
    AssetResponse,
    AssetStatusUpdate,
    AssetUpdate,
    MaintenanceHistoryItem,
)

TAG_PREFIX = "AF"
TAG_PATTERN = re.compile(r"^AF-(\d+)$")

ALLOWED_TRANSITIONS: dict[str, set[str]] = {
    "available": {
        "allocated",
        "reserved",
        "under_maintenance",
        "lost",
        "retired",
        "disposed",
    },
    "allocated": {"available", "under_maintenance", "lost"},
    "reserved": {"available", "allocated", "under_maintenance"},
    "under_maintenance": {"available", "retired", "disposed"},
    "lost": {"available"},
    "retired": {"disposed"},
    "disposed": set(),
}


class AssetService:
    def __init__(self, session: Session):
        self.session = session

    def register(self, data: AssetCreate) -> AssetResponse:
        self._validate_category(data.category_id)
        self._validate_department(data.department_id)
        self._validate_unique_serial(data.serial_number)

        asset = Asset(
            name=data.name,
            category_id=data.category_id,
            tag=self._generate_tag(),
            serial_number=data.serial_number,
            acquisition_date=data.acquisition_date,
            acquisition_cost=data.acquisition_cost,
            condition=data.condition,
            location=data.location,
            photo_url=data.photo_url,
            is_shared=data.is_shared,
            department_id=data.department_id,
            status="available",
        )
        self.session.add(asset)
        self.session.commit()
        self.session.refresh(asset)
        return self.get_asset(asset.id)

    def search_assets(
        self,
        tag: str | None = None,
        serial_number: str | None = None,
        status_filter: str | None = None,
        category_id: int | None = None,
        department_id: int | None = None,
        location: str | None = None,
    ) -> list[AssetResponse]:
        query = (
            select(Asset, AssetCategory.name, Department.name)
            .join(AssetCategory, Asset.category_id == AssetCategory.id)
            .outerjoin(Department, Asset.department_id == Department.id)
        )

        if tag:
            query = query.where(func.lower(Asset.tag).like(f"%{tag.lower()}%"))
        if serial_number:
            query = query.where(
                func.lower(Asset.serial_number).like(f"%{serial_number.lower()}%")
            )
        if status_filter:
            query = query.where(Asset.status == status_filter)
        if category_id is not None:
            query = query.where(Asset.category_id == category_id)
        if department_id is not None:
            query = query.where(Asset.department_id == department_id)
        if location:
            query = query.where(
                func.lower(Asset.location).like(f"%{location.lower()}%")
            )

        rows = self.session.exec(query.order_by(Asset.tag)).all()
        return [
            self._to_response(asset, category_name, department_name)
            for asset, category_name, department_name in rows
        ]

    def get_asset_history(self, asset_id: int) -> AssetHistoryResponse:
        asset = self.session.get(Asset, asset_id)
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Asset not found",
            )

        allocations = self.session.exec(
            select(Allocation)
            .where(Allocation.asset_id == asset_id)
            .order_by(Allocation.created_at.desc())
        ).all()

        maintenance_requests = self.session.exec(
            select(MaintenanceRequest)
            .where(MaintenanceRequest.asset_id == asset_id)
            .order_by(MaintenanceRequest.created_at.desc())
        ).all()

        user_ids: set[int] = set()
        dept_ids: set[int] = set()
        for allocation in allocations:
            if allocation.user_id:
                user_ids.add(allocation.user_id)
            if allocation.department_id:
                dept_ids.add(allocation.department_id)
            user_ids.add(allocation.allocated_by)
        for request in maintenance_requests:
            user_ids.add(request.requested_by)
            if request.approved_by:
                user_ids.add(request.approved_by)
            if request.assigned_technician_id:
                user_ids.add(request.assigned_technician_id)

        users = {
            user.id: user.name
            for user in self.session.exec(
                select(User).where(User.id.in_(user_ids))
            ).all()
        } if user_ids else {}
        departments = {
            dept.id: dept.name
            for dept in self.session.exec(
                select(Department).where(Department.id.in_(dept_ids))
            ).all()
        } if dept_ids else {}

        return AssetHistoryResponse(
            asset_id=asset.id,
            asset_tag=asset.tag,
            allocations=[
                AllocationHistoryItem(
                    id=allocation.id,
                    user_id=allocation.user_id,
                    user_name=users.get(allocation.user_id) if allocation.user_id else None,
                    department_id=allocation.department_id,
                    department_name=departments.get(allocation.department_id)
                    if allocation.department_id
                    else None,
                    allocated_by=allocation.allocated_by,
                    allocated_by_name=users.get(allocation.allocated_by),
                    expected_return_date=allocation.expected_return_date,
                    actual_return_date=allocation.actual_return_date,
                    status=allocation.status,
                    notes=allocation.notes,
                    created_at=allocation.created_at,
                )
                for allocation in allocations
            ],
            maintenance_requests=[
                MaintenanceHistoryItem(
                    id=request.id,
                    requested_by=request.requested_by,
                    requested_by_name=users.get(request.requested_by),
                    description=request.description,
                    priority=request.priority,
                    approved_by=request.approved_by,
                    approved_by_name=users.get(request.approved_by)
                    if request.approved_by
                    else None,
                    assigned_technician_id=request.assigned_technician_id,
                    assigned_technician_name=users.get(request.assigned_technician_id)
                    if request.assigned_technician_id
                    else None,
                    status=request.status,
                    resolution_notes=request.resolution_notes,
                    created_at=request.created_at,
                )
                for request in maintenance_requests
            ],
        )

    def get_asset(self, asset_id: int) -> AssetResponse:
        row = self.session.exec(
            select(Asset, AssetCategory.name, Department.name)
            .join(AssetCategory, Asset.category_id == AssetCategory.id)
            .outerjoin(Department, Asset.department_id == Department.id)
            .where(Asset.id == asset_id)
        ).first()
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Asset not found",
            )
        asset, category_name, department_name = row
        return self._to_response(asset, category_name, department_name)

    def update(self, asset_id: int, data: AssetUpdate) -> AssetResponse:
        asset = self.session.get(Asset, asset_id)
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Asset not found",
            )
            
        update_data = data.model_dump(exclude_unset=True)
        
        if "category_id" in update_data and update_data["category_id"] is not None:
            self._validate_category(update_data["category_id"])
            
        if "department_id" in update_data and update_data["department_id"] is not None:
            self._validate_department(update_data["department_id"])
            
        if "serial_number" in update_data and update_data["serial_number"] != asset.serial_number:
            self._validate_unique_serial(update_data["serial_number"])

        for key, value in update_data.items():
            setattr(asset, key, value)

        self.session.add(asset)
        self.session.commit()
        self.session.refresh(asset)
        return self.get_asset(asset.id)

    def update_status(self, asset_id: int, data: AssetStatusUpdate) -> AssetResponse:
        asset = self.session.get(Asset, asset_id)
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Asset not found",
            )

        if data.status == asset.status:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Asset is already {asset.status}",
            )

        allowed = ALLOWED_TRANSITIONS.get(asset.status, set())
        if data.status not in allowed:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Cannot transition from '{asset.status}' to '{data.status}'",
            )

        asset.status = data.status
        self.session.add(asset)
        self.session.commit()
        self.session.refresh(asset)
        return self.get_asset(asset.id)

    def _generate_tag(self) -> str:
        tags = self.session.exec(select(Asset.tag)).all()
        max_number = 0
        for tag in tags:
            match = TAG_PATTERN.match(tag)
            if match:
                max_number = max(max_number, int(match.group(1)))
        return f"{TAG_PREFIX}-{max_number + 1:04d}"

    def _validate_category(self, category_id: int) -> None:
        category = self.session.get(AssetCategory, category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )

    def _validate_department(self, department_id: int | None) -> None:
        if department_id is None:
            return
        department = self.session.get(Department, department_id)
        if not department or department.status != "active":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found or inactive",
            )

    def _validate_unique_serial(self, serial_number: str) -> None:
        existing = self.session.exec(
            select(Asset).where(Asset.serial_number == serial_number)
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Serial number already registered",
            )

    def _to_response(
        self,
        asset: Asset,
        category_name: str | None,
        department_name: str | None,
    ) -> AssetResponse:
        return AssetResponse(
            id=asset.id,
            name=asset.name,
            category_id=asset.category_id,
            category_name=category_name,
            tag=asset.tag,
            serial_number=asset.serial_number,
            acquisition_date=asset.acquisition_date,
            acquisition_cost=asset.acquisition_cost,
            condition=asset.condition,
            location=asset.location,
            photo_url=asset.photo_url,
            is_shared=asset.is_shared,
            status=asset.status,
            department_id=asset.department_id,
            department_name=department_name,
            created_at=asset.created_at,
        )
