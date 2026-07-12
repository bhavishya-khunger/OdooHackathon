# AssetFlow ERP API Documentation

**Version:** 1.0.0

A comprehensive API for managing company assets, departments, users, and allocations.
Features include:
- **Authentication**: JWT cookie-based role-based access.
- **Asset Allocation**: Allocate assets, handle returns, and flag overdue allocations.
- **Transfer Requests**: Request, approve, or reject asset transfers.
- **Overlap-free Booking**: Booking of shared resources.
- **Maintenance**: Multi-stage maintenance approval workflow.
- **Department Management**: Hierarchical department structure.
- **Asset Categories**: Dynamic fields for asset categories.

---

## 🔐 Auth Endpoints

* **POST** `/auth/register`
  * **Summary**: Register a new employee account (defaults to `employee` role).
  * **Body**: `name`, `email`, `password`
* **POST** `/auth/login`
  * **Summary**: Login and receive a JWT cookie.
  * **Body**: `email`, `password`
* **POST** `/auth/logout`
  * **Summary**: Clear the JWT cookie.
* **GET** `/auth/me`
  * **Summary**: Get current authenticated user details.

---

## 🏢 Departments

* **POST** `/departments`
  * **Summary**: Create a new department.
* **GET** `/departments`
  * **Summary**: List all departments (optional `status` query filter).
* **GET** `/departments/{department_id}`
  * **Summary**: Get a specific department's details.
* **PATCH** `/departments/{department_id}`
  * **Summary**: Update a department's details.
* **PATCH** `/departments/{department_id}/deactivate`
  * **Summary**: Deactivate a department.

---

## 📦 Asset Categories

* **POST** `/categories`
  * **Summary**: Create a new asset category with dynamic fields.
* **GET** `/categories`
  * **Summary**: List all asset categories.
* **GET** `/categories/{category_id}`
  * **Summary**: Get a specific category.
* **PATCH** `/categories/{category_id}`
  * **Summary**: Update a category.
* **DELETE** `/categories/{category_id}`
  * **Summary**: Delete a category.

---

## 👥 Employees (Directory)

* **GET** `/employees`
  * **Summary**: List all employees. Filters: `q` (name/email), `role`, `department_id`, `status`.
* **GET** `/employees/{employee_id}`
  * **Summary**: Get specific employee details.
* **POST** `/employees/{employee_id}/promote`
  * **Summary**: Promote an employee to `dept_head` or `asset_manager`.
* **POST** `/employees/{employee_id}/demote`
  * **Summary**: Demote an employee back to base `employee` role.

---

## 💻 Assets (Directory)

* **POST** `/assets`
  * **Summary**: Register a new asset (auto-generates Asset Tag).
* **GET** `/assets/{asset_id}`
  * **Summary**: Get specific asset details.
* **PATCH** `/assets/{asset_id}/status`
  * **Summary**: Manually override an asset's status.

---

## 🔄 Allocations & Returns

* **POST** `/allocations`
  * **Summary**: Allocate an asset to an employee or department. Returns `409 Conflict` if already allocated.
* **GET** `/allocations`
  * **Summary**: List allocations. Filters: `asset_id`, `user_id`, `department_id`, `status`.
* **GET** `/allocations/{allocation_id}`
  * **Summary**: Get specific allocation details.
* **POST** `/allocations/flag-overdue`
  * **Summary**: Automatically flag all past-due allocations as `overdue`.
* **POST** `/allocations/{allocation_id}/return`
  * **Summary**: Return an allocated asset and save condition notes.

---

## 🔀 Transfer Requests

* **POST** `/transfers`
  * **Summary**: Create a transfer request (usually triggered when allocation hits a conflict).
* **GET** `/transfers`
  * **Summary**: List transfer requests. Filters: `allocation_id`, `status`, `requested_by`.
* **GET** `/transfers/{transfer_id}`
  * **Summary**: Get specific transfer request details.
* **POST** `/transfers/{transfer_id}/approve`
  * **Summary**: Approve a transfer request (Asset Manager or Dept Head).
* **POST** `/transfers/{transfer_id}/reject`
  * **Summary**: Reject a transfer request.

---

## 📅 Shared Resource Bookings

* **POST** `/bookings`
  * **Summary**: Book a shared resource by time slot. Overlaps are rejected automatically.
* **GET** `/bookings`
  * **Summary**: List resource bookings. Filters: `asset_id`, `user_id`, `status`.
* **GET** `/bookings/{booking_id}`
  * **Summary**: Get specific booking details.
* **PATCH** `/bookings/{booking_id}`
  * **Summary**: Reschedule a booking (runs overlap check again).
* **POST** `/bookings/{booking_id}/cancel`
  * **Summary**: Cancel an upcoming booking.

---

## 🛠️ Maintenance Approval Workflow

* **POST** `/maintenance`
  * **Summary**: Raise a new maintenance request (Any Employee).
* **GET** `/maintenance`
  * **Summary**: List maintenance requests. Filters: `asset_id`, `status`, `priority`, `assigned_technician_id`.
* **GET** `/maintenance/{request_id}`
  * **Summary**: Get specific maintenance request details.
* **POST** `/maintenance/{request_id}/approve`
  * **Summary**: Approve a maintenance request. Changes asset status to `under_maintenance` (Asset Manager).
* **POST** `/maintenance/{request_id}/reject`
  * **Summary**: Reject a maintenance request (Asset Manager).
* **POST** `/maintenance/{request_id}/assign`
  * **Summary**: Assign a technician to an approved request.
* **POST** `/maintenance/{request_id}/start`
  * **Summary**: Start work on an assigned maintenance request (Status -> `in_progress`).
* **POST** `/maintenance/{request_id}/resolve`
  * **Summary**: Resolve request and save notes. Reverts Asset status to `available`.
