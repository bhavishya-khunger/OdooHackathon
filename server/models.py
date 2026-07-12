from datetime import date, datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(index=True, unique=True)
    password_hash: str
    role: str = Field(default="employee")  # employee, admin, asset_manager, dept_head
    department_id: Optional[int] = Field(default=None, foreign_key="department.id")
    status: str = Field(default="active")  # active, inactive
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Department(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
    head_id: Optional[int] = Field(default=None, foreign_key="user.id")
    parent_department_id: Optional[int] = Field(default=None, foreign_key="department.id")
    status: str = Field(default="active")  # active, inactive
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AssetCategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
    fields: Optional[str] = Field(default=None)  # JSON string of category-specific fields list
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Asset(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category_id: int = Field(foreign_key="assetcategory.id")
    tag: str = Field(unique=True, index=True)  # AF-0001
    serial_number: str = Field(unique=True, index=True)
    acquisition_date: date
    acquisition_cost: float
    condition: str = Field(default="good")  # new, good, fair, poor
    location: str
    photo_url: Optional[str] = Field(default=None)
    is_shared: bool = Field(default=False)
    status: str = Field(default="available")  # available, allocated, reserved, under_maintenance, lost, retired, disposed
    department_id: Optional[int] = Field(default=None, foreign_key="department.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Allocation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    asset_id: int = Field(foreign_key="asset.id")
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    department_id: Optional[int] = Field(default=None, foreign_key="department.id")
    allocated_by: int = Field(foreign_key="user.id")
    expected_return_date: Optional[datetime] = Field(default=None)
    actual_return_date: Optional[datetime] = Field(default=None)
    status: str = Field(default="active")  # active, returned, overdue
    notes: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TransferRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    allocation_id: int = Field(foreign_key="allocation.id")
    requested_by: int = Field(foreign_key="user.id")
    target_user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    target_department_id: Optional[int] = Field(default=None, foreign_key="department.id")
    approved_by: Optional[int] = Field(default=None, foreign_key="user.id")
    status: str = Field(default="pending")  # pending, approved, rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ResourceBooking(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    asset_id: int = Field(foreign_key="asset.id")
    user_id: int = Field(foreign_key="user.id")
    start_time: datetime
    end_time: datetime
    status: str = Field(default="upcoming")  # upcoming, ongoing, completed, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MaintenanceRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    asset_id: int = Field(foreign_key="asset.id")
    requested_by: int = Field(foreign_key="user.id")
    description: str
    priority: str = Field(default="medium")  # low, medium, high, critical
    photo_url: Optional[str] = Field(default=None)
    approved_by: Optional[int] = Field(default=None, foreign_key="user.id")
    assigned_technician_id: Optional[int] = Field(default=None, foreign_key="user.id")
    status: str = Field(default="pending")  # pending, approved, rejected, technician_assigned, in_progress, resolved
    resolution_notes: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AuditCycle(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    scope_department_id: Optional[int] = Field(default=None, foreign_key="department.id")
    scope_location: Optional[str] = Field(default=None)
    start_date: date
    end_date: date
    status: str = Field(default="active")  # active, closed
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AuditAssignment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    audit_cycle_id: int = Field(foreign_key="auditcycle.id")
    auditor_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AuditResult(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    audit_cycle_id: int = Field(foreign_key="auditcycle.id")
    asset_id: int = Field(foreign_key="asset.id")
    auditor_id: int = Field(foreign_key="user.id")
    status: str  # verified, missing, damaged
    notes: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ActivityLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    action: str
    details: Optional[str] = Field(default=None)  # JSON string
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Notification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    message: str
    is_read: bool = Field(default=False)
    type: str = Field(default="info")  # info, warning, alert
    created_at: datetime = Field(default_factory=datetime.utcnow)
