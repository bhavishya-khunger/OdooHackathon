from fastapi import FastAPI
from db import init_db

app = FastAPI(title="AssetFlow ERP API", version="1.0.0")

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
