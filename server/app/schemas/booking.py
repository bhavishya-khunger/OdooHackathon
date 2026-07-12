from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, model_validator


# ── Booking Create ──────────────────────────────────────────────────


class BookingCreate(BaseModel):
    asset_id: int
    start_time: datetime
    end_time: datetime

    @model_validator(mode="after")
    def validate_times(self):
        if self.start_time >= self.end_time:
            raise ValueError("end_time must be strictly after start_time")
        if self.start_time < datetime.now(self.start_time.tzinfo):
            raise ValueError("start_time must be in the future")
        return self


# ── Booking Update ──────────────────────────────────────────────────


class BookingUpdate(BaseModel):
    start_time: datetime
    end_time: datetime

    @model_validator(mode="after")
    def validate_times(self):
        if self.start_time >= self.end_time:
            raise ValueError("end_time must be strictly after start_time")
        return self


# ── Responses ───────────────────────────────────────────────────────


class BookingResponse(BaseModel):
    id: int
    asset_id: int
    user_id: int
    start_time: datetime
    end_time: datetime
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class BookingListResponse(BaseModel):
    items: List[BookingResponse]
    total: int
    skip: int
    limit: int
