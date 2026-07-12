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
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate        # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env` and set your Supabase credentials.

3. **Run the Server**:
   ```bash
   uvicorn app.main:app --reload
   ```

4. **Verify API Endpoints**:
   Use the OpenAPI Swagger docs at `/docs` or write integration tests to confirm endpoints behave correctly.

---

## Project Structure

```
server/
├── app/
│   ├── main.py              # FastAPI app factory & entry point
│   ├── config.py            # Environment settings
│   ├── database.py          # DB engine, session, init
│   ├── core/
│   │   ├── security.py      # Password hashing & JWT helpers
│   │   └── middleware.py    # Auth session middleware
│   ├── models/
│   │   └── tables.py        # SQLModel table definitions
│   ├── schemas/
│   │   └── auth.py          # Pydantic request/response models
│   ├── services/
│   │   └── auth_service.py  # Auth business logic
│   └── api/
│       ├── deps.py          # Route dependencies (auth, roles)
│       ├── router.py        # Aggregates all route modules
│       └── routes/
│           └── auth.py      # /auth endpoints
├── main.py                  # Backward-compatible re-export
├── requirements.txt
└── .env.example
```

For a detailed breakdown of the task list, refer to the [tobemade.md](file:///d:/Odoo/OdooHackathon/server/tobemade.md) file.
