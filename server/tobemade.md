# Backend Task Division - 14 Target Deliverables

The backend server is split into 14 distinct tasks, divided equally (7 tasks each) between two team members. This ensures parallel development of the core infrastructure and validation workflows.

---

## Team Member A: Core Infrastructure, Auth, Directory & Assets

### Task A1: Database Schema & ORM Setup (done)
- Set up the Supabase (PostgreSQL) database.
- Configure ORM / migration scripts for all 12 tables:
  1. `User`
  2. `Department`
  3. `AssetCategory`
  4. `Asset`
  5. `Allocation`
  6. `TransferRequest`
  7. `ResourceBooking`
  8. `MaintenanceRequest`
  9. `AuditCycle`
  10. `AuditAssignment`
  11. `AuditResult`
  12. `ActivityLog`

### Task A2: Authentication & Role Enforcement API (done)
- Implement registration and login API endpoints.
- **Rule**: Registration defaults to the `'employee'` role with zero self-elevation.
- Implement cookie/session verification middleware for API route protection.

### Task A3: Department & Category CRUD APIs (done)
- Implement endpoints to create/edit/deactivate Departments (supporting hierarchy with parent departments and head assignment).
- Implement Category CRUD handling dynamic category-specific fields (JSON model).

### Task A4: Employee Directory & Promotion API (done)
- Implement search/filter endpoints for the Employee Directory.
- Implement Admin-only endpoints to promote/demote employees to Department Head or Asset Manager.

### Task A5: Asset Registration & Lifecycle API (done)
- Implement Asset Registration endpoint.
- **Rule**: Auto-generate unique sequential asset tags (e.g., `AF-0001`, `AF-0002`).
- Track asset lifecycle transitions (`available`, `allocated`, `reserved`, `under_maintenance`, `lost`, `retired`, `disposed`).

### Task A6: Asset Search, Filtering & Audit Trail API
- Implement multi-parameter search/filters for assets (by tag, serial number, status, category, department, location).
- Implement per-asset history endpoints returning past allocations and maintenance actions.

### Task A7: Activity Logs & Notifications Engine
- Implement a global system middleware to log all user actions to the database.
- Implement a notification queue with read/unread state triggers for all operational events.

---

## Team Member B: Operations, Validations, Bookings & Audits

### Task B1: Asset Allocation Engine
- Implement Asset Allocation endpoints (to employee or department) with expected return dates.
- **Constraint**: Block allocation and return `409 Conflict` if the asset is already marked `'allocated'` or `'under_maintenance'`.

### Task B2: Allocation Return Flow API
- Implement the return endpoint: mark allocation as returned, save check-in condition notes, and revert asset status back to `'available'`.
- Flag past-due allocations automatically as `'overdue'`.

### Task B3: Transfer Request System
- Implement the Transfer Request endpoint (offered when an allocation fails due to double-allocation).
- Implement approval/rejection endpoints for Department Heads and Asset Managers.

### Task B4: Overlap-Free Resource Booking API
- Implement shared resource booking endpoints.
- **Constraint**: Perform overlap checks:
  $$\text{NewStart} < \text{ExistingEnd} \quad \text{and} \quad \text{NewEnd} > \text{ExistingStart}$$
  Reject overlaps with standard validation messages.

### Task B5: Maintenance Approval Workflow API
- Implement repair request raising (description, priority, attachments).
- Implement status workflow transitions:
  `Pending` $\rightarrow$ `Approved/Rejected` (Asset Manager) $\rightarrow$ `Technician Assigned` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`.
- Automatically transition asset status to `'under_maintenance'` on approval, and back to `'available'` on resolution.

### Task B6: Audit Cycle & Auditor Assignment API
- Implement cycles management (scope by department/location, target dates).
- Implement auditor assignment endpoints.

### Task B7: Audit Result Logging & Closure Engine
- Implement auditor portals allowing check-ins (`Verified`, `Missing`, `Damaged`).
- Implement cycle closure: lock records, auto-generate discrepancy reports, and automatically flag missing assets as `'lost'`.