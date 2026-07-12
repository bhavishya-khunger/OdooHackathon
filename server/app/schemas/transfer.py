from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, model_validator


# ── Transfer Create ─────────────────────────────────────────────────


class TransferRequestCreate(BaseModel):
    """Request body for creating a transfer request."""

    allocation_id: int
    target_user_id: Optional[int] = None
    target_department_id: Optional[int] = None

    @model_validator(mode="after")
    def exactly_one_target(self):
        has_user = self.target_user_id is not None
        has_dept = self.target_department_id is not None
        if has_user and has_dept:
            raise ValueError(
                "Provide either target_user_id or target_department_id, not both."
            )
        if not has_user and not has_dept:
            raise ValueError(
                "Provide at least one of target_user_id or target_department_id."
            )
        return self


# ── Transfer Action ─────────────────────────────────────────────────


class TransferActionRequest(BaseModel):
    """Body is intentionally empty; action is encoded in the URL path."""

    pass


# ── Responses ───────────────────────────────────────────────────────


class TransferRequestResponse(BaseModel):
    id: int
    allocation_id: int
    requested_by: int
    requester_name: str
    target_user_id: Optional[int] = None
    target_department_id: Optional[int] = None
    target_name: str
    approved_by: Optional[int] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TransferListResponse(BaseModel):
    items: List[TransferRequestResponse]
    total: int
    skip: int
    limit: int
