from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config import settings
from app.core.middleware import ActivityLoggingMiddleware, AuthMiddleware
from app.database import init_db


def create_app() -> FastAPI:
    description = """
    **AssetFlow ERP API**
    
    A comprehensive API for managing company assets, departments, users, and allocations.
    Features include:
    - **Authentication**: JWT cookie-based role-based access.
    - **Asset Allocation**: Allocate assets, handle returns, and flag overdue allocations.
    - **Transfer Requests**: Request, approve, or reject asset transfers.
    - **Department Management**: Hierarchical department structure.
    - **Asset Categories**: Dynamic fields for asset categories.
    """

    tags_metadata = [
        {"name": "auth", "description": "Operations with users and authentication. Registration and Login."},
        {"name": "allocations", "description": "Manage asset allocations, returns, and overdue flagging."},
        {"name": "transfers", "description": "Manage asset transfer requests between users or departments."},
        {"name": "bookings", "description": "Overlap-free booking of shared resources."},
        {"name": "maintenance", "description": "Multi-stage maintenance approval workflow."},
        {"name": "audits", "description": "Audit cycle management and discrepancy reporting."},
        {"name": "departments", "description": "Manage organizational hierarchy and departments."},
        {"name": "categories", "description": "Manage asset categories with dynamic field definitions."},
    ]

    app = FastAPI(
        title=settings.APP_TITLE,
        version=settings.APP_VERSION,
        description=description,
        openapi_tags=tags_metadata,
    )

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
