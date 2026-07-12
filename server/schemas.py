from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, model_validator


# ── Allocation Schemas ──────────────────────────────────────────────


class AllocationCreate(BaseModel):
    """Request body for creating a new allocation."""
    asset_id: int
    user_id: Optional[int] = None
    department_id: Optional[int] = None
    expected_return_date: Optional[datetime] = None
    notes: Optional[str] = None

    @model_validator(mode="after")
    def exactly_one_target(self):
        has_user = self.user_id is not None
        has_dept = self.department_id is not None
        if has_user and has_dept:
            raise ValueError("Provide either user_id or department_id, not both.")
        if not has_user and not has_dept:
            raise ValueError("Provide at least one of user_id or department_id.")
        return self


class AllocationResponse(BaseModel):
    """Response body for a single allocation."""
    id: int
    asset_id: int
    asset_tag: str
    user_id: Optional[int] = None
    department_id: Optional[int] = None
    allocated_to_name: str
    allocated_by: int
    expected_return_date: Optional[datetime] = None
    actual_return_date: Optional[datetime] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AllocationConflictDetail(BaseModel):
    """409 response body when an asset cannot be allocated."""
    error: str
    held_by: str
    allocation_id: Optional[int] = None
    transfer_request_hint: bool = False


class AllocationListResponse(BaseModel):
    """Paginated list of allocations."""
    items: List[AllocationResponse]
    total: int
    skip: int
    limit: int
