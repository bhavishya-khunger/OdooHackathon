from fastapi import APIRouter

from app.api.routes import assets, allocations, auth, categories, departments, employees, transfers

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(departments.router)
api_router.include_router(categories.router)
api_router.include_router(employees.router)
api_router.include_router(assets.router)
api_router.include_router(allocations.router)
api_router.include_router(transfers.router)

