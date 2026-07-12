from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ActivityLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    action: str
    details: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    message: str
    is_read: bool
    type: str
    created_at: datetime

    model_config = {"from_attributes": True}
