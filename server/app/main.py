from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config import settings
from app.core.middleware import ActivityLoggingMiddleware, AuthMiddleware
from app.database import init_db


def create_app() -> FastAPI:
    app = FastAPI(title=settings.APP_TITLE, version=settings.APP_VERSION)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(AuthMiddleware)
    app.add_middleware(ActivityLoggingMiddleware)

    app.include_router(api_router)

    @app.on_event("startup")
    def on_startup():
        init_db()
        print("Database tables initialized successfully.")

    @app.get("/")
    def read_root():
        return {
            "message": "Welcome to the AssetFlow ERP API server.",
            "docs": "/docs",
            "redoc": "/redoc",
        }

    return app


app = create_app()
