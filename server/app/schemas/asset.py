from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

AssetStatus = Literal[
    "available",
    "allocated",
    "reserved",
    "under_maintenance",
    "lost",
    "retired",
    "disposed",
]

AssetCondition = Literal["new", "good", "fair", "poor"]


class AssetCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    category_id: int
    serial_number: str = Field(min_length=1, max_length=100)
    acquisition_date: date
    acquisition_cost: float = Field(gt=0)
    condition: AssetCondition = "good"
    location: str = Field(min_length=1, max_length=200)
    photo_url: Optional[str] = Field(default=None, max_length=500)
    is_shared: bool = False
    department_id: Optional[int] = None


class AssetStatusUpdate(BaseModel):
    status: AssetStatus


class AssetResponse(BaseModel):
    id: int
    name: str
    category_id: int
    category_name: Optional[str] = None
    tag: str
    serial_number: str
    acquisition_date: date
    acquisition_cost: float
    condition: str
    location: str
    photo_url: Optional[str] = None
    is_shared: bool
    status: str
    department_id: Optional[int] = None
    department_name: Optional[str] = None
    created_at: datetime
