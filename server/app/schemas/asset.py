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


class AssetUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    category_id: Optional[int] = None
    serial_number: Optional[str] = Field(default=None, min_length=1, max_length=100)
    acquisition_date: Optional[date] = None
    acquisition_cost: Optional[float] = Field(default=None, gt=0)
    condition: Optional[AssetCondition] = None
    location: Optional[str] = Field(default=None, min_length=1, max_length=200)
    photo_url: Optional[str] = Field(default=None, max_length=500)
    is_shared: Optional[bool] = None
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


class AllocationHistoryItem(BaseModel):
    id: int
    user_id: Optional[int] = None
    user_name: Optional[str] = None
    department_id: Optional[int] = None
    department_name: Optional[str] = None
    allocated_by: int
    allocated_by_name: Optional[str] = None
    expected_return_date: Optional[datetime] = None
    actual_return_date: Optional[datetime] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime


class MaintenanceHistoryItem(BaseModel):
    id: int
    requested_by: int
    requested_by_name: Optional[str] = None
    description: str
    priority: str
    approved_by: Optional[int] = None
    approved_by_name: Optional[str] = None
    assigned_technician_id: Optional[int] = None
    assigned_technician_name: Optional[str] = None
    status: str
    resolution_notes: Optional[str] = None
    created_at: datetime


class AssetHistoryResponse(BaseModel):
    asset_id: int
    asset_tag: str
    allocations: list[AllocationHistoryItem]
    maintenance_requests: list[MaintenanceHistoryItem]
