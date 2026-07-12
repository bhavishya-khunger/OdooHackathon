from fastapi import APIRouter, Depends, Response, status
from sqlmodel import Session

from app.api.deps import get_current_user
from app.config import settings
from app.database import get_session
from app.models import User
from app.schemas.auth import MessageResponse, UserLogin, UserRegister, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


def get_auth_service(session: Session = Depends(get_session)) -> AuthService:
    return AuthService(session)


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_HOURS * 3600,
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    body: UserRegister,
    auth_service: AuthService = Depends(get_auth_service),
):
    return auth_service.register(body)


@router.post("/login", response_model=UserResponse)
def login(
    body: UserLogin,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service),
):
    user, token = auth_service.login(body)
    _set_auth_cookie(response, token)
    return user


@router.post("/logout", response_model=MessageResponse)
def logout(response: Response):
    response.delete_cookie(key=settings.COOKIE_NAME)
    return MessageResponse(message="Logged out successfully")


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
