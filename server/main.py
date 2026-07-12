from fastapi import FastAPI
from db import init_db
from routes.allocations import router as allocations_router

app = FastAPI(title="AssetFlow ERP API", version="1.0.0")

# ── Register routers ───────────────────────────────────────────────
app.include_router(allocations_router)

@app.on_event("startup")
def on_startup():
    # Attempt database table creation
    init_db()
    print("Database tables initialized successfully.")

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the AssetFlow ERP API server.",
        "docs": "/docs",
        "redoc": "/redoc"
    }
