import os
from dotenv import load_dotenv
from sqlmodel import create_engine, Session, SQLModel
# Import models so SQLModel registers them before create_all
import models

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    # Fallback to local SQLite if DATABASE_URL is not provided (for fallback/testing)
    DATABASE_URL = "sqlite:///./database.db"
    print("WARNING: DATABASE_URL not set in environment, falling back to local SQLite: database.db")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
