from datetime import date, datetime
from typing import List, Literal, Optional

from pydantic import BaseModel


# ── Audit Cycle ─────────────────────────────────────────────────────


class AuditCycleCreate(BaseModel):
    name: str
    scope_department_id: Optional[int] = None
    scope_location: Optional[str] = None
    start_date: date
    end_date: date


class AuditCycleResponse(BaseModel):
    id: int
    name: str
    scope_department_id: Optional[int] = None
    scope_location: Optional[str] = None
    start_date: date
    end_date: date
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AuditCycleListResponse(BaseModel):
    items: List[AuditCycleResponse]
    total: int
    skip: int
    limit: int


# ── Audit Assignment ────────────────────────────────────────────────


class AuditAssignmentCreate(BaseModel):
    auditor_ids: List[int]


class AuditAssignmentResponse(BaseModel):
    id: int
    audit_cycle_id: int
    auditor_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Audit Result ────────────────────────────────────────────────────


class AuditResultCreate(BaseModel):
    asset_id: int
    status: Literal["verified", "missing", "damaged"]
    notes: Optional[str] = None


class AuditResultResponse(BaseModel):
    id: int
    audit_cycle_id: int
    asset_id: int
    auditor_id: int
    status: str
    notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AuditResultListResponse(BaseModel):
    items: List[AuditResultResponse]
    total: int
    skip: int
    limit: int


# ── Discrepancy Report ──────────────────────────────────────────────


class DiscrepancyItem(BaseModel):
    asset_id: int
    asset_tag: str
    status: str
    notes: Optional[str] = None


class AuditDiscrepancyReport(BaseModel):
    audit_cycle_id: int
    cycle_name: str
    total_assets_in_scope: int
    verified_count: int
    missing_count: int
    damaged_count: int
    discrepancies: List[DiscrepancyItem]
