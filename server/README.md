# AssetFlow ERP Backend Server

This is the backend server for **AssetFlow - Enterprise Asset & Resource Management System**.

---

## Technical Stack: Python + FastAPI + Supabase (PostgreSQL)

The backend server will be built using Python with FastAPI and integrated with Supabase (Postgres).

### Architecture & Setup
- **Framework**: FastAPI (highly performant, asynchronous Python framework with auto-generated Swagger/OpenAPI documentation).
- **Database**: Supabase PostgreSQL.
- **ORM / Client**:
  - *Option 1 (Recommended)*: **SQLModel** or **SQLAlchemy** pointing to the Supabase connection string (Direct Database Connection).
  - *Option 2*: **Supabase Python Client** (`supabase`) for API-driven database operations.
- **Setup Command**: Create a Python virtual environment and install dependencies:
  ```bash
  python -m venv venv
  source venv/bin/activate  # Or venv\Scripts\activate on Windows
  pip install fastapi uvicorn supabase sqlmodel psycopg2-binary
  ```

---

## Core System Validation Algorithms

To ensure the integrity of ERP transactions, developers must implement the following business validations:

### 1. Asset Double-Allocation Prevention (Task B1)
Before executing an allocation request:
1. Query the status of the target `Asset`.
2. If `status` is already `'allocated'` or `'under_maintenance'`:
   - Reject the request with a `409 Conflict` status code.
   - Return the payload containing details of the current owner/department:
     ```json
     {
       "error": "Asset is currently allocated",
       "heldBy": "Priya",
       "allocationId": 114
     }
     ```
   - Provide a hook for initiating a `TransferRequest`.

### 2. Time-Slot Overlap Booking Check (Task B4)
Before inserting a booking for resource $R$ at interval $[\text{start}, \text{end}]$:
1. Check for any existing active booking $B$ where:
   $$\text{B.startTime} < \text{end} \quad \text{and} \quad \text{B.endTime} > \text{start}$$
2. If any matching record is found:
   - Reject the request with `422 Unprocessable Entity`.
   - Return the conflicting schedule details so the frontend can display them to the user.

---

## Getting Started

1. **Initialize the Server Project**:
   Run initialization scripts depending on the selected backend stack.
2. **Configure Local Database**:
   - Run migrations to configure the SQLite schema.
   - Configure dummy seeds (a set of default Categories, Departments, and an initial Admin account).
3. **Verify API Endpoints**:
   Use the OpenAPI Swagger docs or write integration scripts (postman/jest/pytest) to confirm endpoints behave correctly.

For a detailed breakdown of the task list, refer to the [tobemade.md](file:///d:/Odoo/OdooHackathon/server/tobemade.md) file.
