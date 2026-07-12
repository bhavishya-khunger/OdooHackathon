from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.models import Asset, AssetCategory
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    serialize_category_fields,
)


class CategoryService:
    def __init__(self, session: Session):
        self.session = session

    def list_categories(self) -> list[AssetCategory]:
        return list(
            self.session.exec(
                select(AssetCategory).order_by(AssetCategory.name)
            ).all()
        )

    def get_category(self, category_id: int) -> AssetCategory:
        category = self.session.get(AssetCategory, category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
        return category

    def create(self, data: CategoryCreate) -> AssetCategory:
        self._validate_unique_name(data.name)

        category = AssetCategory(
            name=data.name,
            fields=serialize_category_fields(data.fields),
        )
        self.session.add(category)
        self.session.commit()
        self.session.refresh(category)
        return category

    def update(self, category_id: int, data: CategoryUpdate) -> AssetCategory:
        category = self.get_category(category_id)

        if data.name is not None and data.name != category.name:
            self._validate_unique_name(data.name, exclude_id=category_id)
            category.name = data.name

        if data.fields is not None:
            category.fields = serialize_category_fields(data.fields)

        self.session.add(category)
        self.session.commit()
        self.session.refresh(category)
        return category

    def delete(self, category_id: int) -> None:
        category = self.get_category(category_id)

        asset = self.session.exec(
            select(Asset).where(Asset.category_id == category_id)
        ).first()
        if asset:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Cannot delete category with linked assets",
            )

        self.session.delete(category)
        self.session.commit()

    def _validate_unique_name(self, name: str, exclude_id: int | None = None) -> None:
        existing = self.session.exec(
            select(AssetCategory).where(AssetCategory.name == name)
        ).first()
        if existing and existing.id != exclude_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Category name already exists",
            )
