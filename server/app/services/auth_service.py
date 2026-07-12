from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.core.security import create_access_token, hash_password, verify_password
from app.models import User
from app.schemas.auth import UserLogin, UserRegister

DEFAULT_ROLE = "employee"


class AuthService:
    def __init__(self, session: Session):
        self.session = session

    def register(self, data: UserRegister) -> User:
        existing = self.session.exec(
            select(User).where(User.email == data.email)
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        user = User(
            name=data.name,
            email=data.email,
            password_hash=hash_password(data.password),
            role=DEFAULT_ROLE,
        )
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def login(self, data: UserLogin) -> tuple[User, str]:
        user = self.session.exec(
            select(User).where(User.email == data.email)
        ).first()
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        if user.status != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive",
            )

        token = create_access_token(user.id, user.role)
        return user, token
