from fastapi import Depends, Header, HTTPException, status
from sqlmodel import Session, select
from db import get_session
from models import User


def get_current_user(
    x_user_id: str = Header(..., description="User ID for authentication (stub — will be replaced by JWT)"),
    session: Session = Depends(get_session),
) -> User:
    """
    Stub auth dependency.
    Reads X-User-Id header, fetches the User from DB.
    Will be replaced by real JWT middleware when Task A2 lands.
    """
    try:
        user_id = int(x_user_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid X-User-Id header: must be an integer.",
        )

    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )
    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )
    return user


def require_roles(*allowed_roles: str):
    """
    Returns a dependency that checks the current user has one of the allowed roles.
    Usage: current_user: User = Depends(require_roles("admin", "asset_manager"))
    """
    def _role_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role(s): {', '.join(allowed_roles)}. Your role: {current_user.role}.",
            )
        return current_user
    return _role_checker
