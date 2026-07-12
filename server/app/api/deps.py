from typing import Callable, Optional

from fastapi import Depends, HTTPException, Request, status
from sqlmodel import Session

from app.config import settings
from app.core.security import decode_access_token
from app.database import get_session
from app.models import User


def get_current_user(
    request: Request,
    session: Session = Depends(get_session),
) -> User:
    user_id = getattr(request.state, "user_id", None)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )
    return user


def require_roles(*allowed_roles: str) -> Callable:
    def role_checker(
        request: Request,
        current_user: User = Depends(get_current_user),
    ) -> User:
        role = current_user.role
        if role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user

    return role_checker


def get_optional_user(
    request: Request,
    session: Session = Depends(get_session),
) -> Optional[User]:
    token = request.cookies.get(settings.COOKIE_NAME)
    if not token:
        return None

    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
    except (TypeError, ValueError):
        return None
    except Exception:
        return None

    return session.get(User, user_id)
