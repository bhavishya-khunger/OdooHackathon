from fastapi import APIRouter

from app.api.routes import allocations, auth, categories, departments, transfers

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(departments.router)
api_router.include_router(categories.router)
api_router.include_router(allocations.router)
api_router.include_router(transfers.router)

