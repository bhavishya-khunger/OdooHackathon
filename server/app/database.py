from sqlmodel import Session, SQLModel, create_engine

from app.config import settings
from app.models import tables  # noqa: F401 — register models with SQLModel metadata

engine = create_engine(settings.DATABASE_URL, echo=True)


def init_db() -> None:
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
