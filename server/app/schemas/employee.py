from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


class EmployeeResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    department_id: Optional[int] = None
    department_name: Optional[str] = None
    status: str
    created_at: datetime


class EmployeePromoteRequest(BaseModel):
    role: Literal["dept_head", "asset_manager"]
    department_id: Optional[int] = None
