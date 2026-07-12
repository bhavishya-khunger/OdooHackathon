import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_TITLE: str = "AssetFlow ERP API"
    APP_VERSION: str = "1.0.0"

    DATABASE_URL: str = os.environ.get("DATABASE_URL", "sqlite:///./database.db")
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24
    COOKIE_NAME: str = "access_token"

    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    ]

    PUBLIC_PATHS: set[str] = {
        "/",
        "/docs",
        "/redoc",
        "/openapi.json",
        "/auth/register",
        "/auth/login",
        "/auth/logout",
    }
    PUBLIC_PREFIXES: tuple[str, ...] = ("/docs/", "/redoc/")


settings = Settings()

if not os.environ.get("DATABASE_URL"):
    print(
        "WARNING: DATABASE_URL not set in environment, "
        "falling back to local SQLite: database.db"
    )

if settings.DATABASE_URL.startswith("postgres://"):
    settings.DATABASE_URL = settings.DATABASE_URL.replace(
        "postgres://", "postgresql://", 1
    )
