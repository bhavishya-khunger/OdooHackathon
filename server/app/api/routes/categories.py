from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.api.deps import get_current_user, require_roles
from app.database import get_session
from app.models import User
from app.schemas.auth import MessageResponse
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["categories"])

MANAGE_CATEGORIES = require_roles("admin", "asset_manager")


def get_category_service(session: Session = Depends(get_session)) -> CategoryService:
    return CategoryService(session)


@router.get("", response_model=list[CategoryResponse])
def list_categories(
    _: User = Depends(get_current_user),
    service: CategoryService = Depends(get_category_service),
):
    return service.list_categories()


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: int,
    _: User = Depends(get_current_user),
    service: CategoryService = Depends(get_category_service),
):
    return service.get_category(category_id)


@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_category(
    body: CategoryCreate,
    _: User = Depends(MANAGE_CATEGORIES),
    service: CategoryService = Depends(get_category_service),
):
    return service.create(body)


@router.patch("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    body: CategoryUpdate,
    _: User = Depends(MANAGE_CATEGORIES),
    service: CategoryService = Depends(get_category_service),
):
    return service.update(category_id, body)


@router.delete("/{category_id}", response_model=MessageResponse)
def delete_category(
    category_id: int,
    _: User = Depends(MANAGE_CATEGORIES),
    service: CategoryService = Depends(get_category_service),
):
    service.delete(category_id)
    return MessageResponse(message="Category deleted successfully")
