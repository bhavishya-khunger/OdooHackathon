import re

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models import Asset, AssetCategory, Department
from app.schemas.asset import AssetCreate, AssetResponse, AssetStatusUpdate

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
