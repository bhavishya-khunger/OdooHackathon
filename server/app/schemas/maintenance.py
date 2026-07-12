from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field


# ── Maintenance Create ──────────────────────────────────────────────


class MaintenanceCreate(BaseModel):
    asset_id: int
    description: str = Field(min_length=1)
    priority: Literal["low", "medium", "high", "critical"] = "medium"
    photo_url: Optional[str] = None


# ── Maintenance Actions ─────────────────────────────────────────────


class MaintenanceApprove(BaseModel):
    assigned_technician_id: Optional[int] = None


class MaintenanceAssign(BaseModel):
    assigned_technician_id: int


class MaintenanceResolve(BaseModel):
    resolution_notes: str = Field(min_length=1)


# ── Responses ───────────────────────────────────────────────────────


class MaintenanceResponse(BaseModel):
    id: int
    asset_id: int
    requested_by: int
    description: str
    priority: str
    photo_url: Optional[str]
    approved_by: Optional[int]
    assigned_technician_id: Optional[int]
    status: str
    resolution_notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class MaintenanceListResponse(BaseModel):
    items: List[MaintenanceResponse]
    total: int
    skip: int
    limit: int
