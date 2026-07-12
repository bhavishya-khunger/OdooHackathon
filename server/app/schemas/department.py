from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class DepartmentCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    head_id: Optional[int] = None
    parent_department_id: Optional[int] = None


class DepartmentUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    head_id: Optional[int] = None
    parent_department_id: Optional[int] = None


class DepartmentResponse(BaseModel):
    id: int
    name: str
    head_id: Optional[int] = None
    parent_department_id: Optional[int] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
