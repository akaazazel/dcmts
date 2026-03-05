# 🏗️ Backend Architecture Guide

This document provides a comprehensive overview of the FastAPI backend for the Digital Complaint Management System (DCMS).

---

## 📂 Directory Structure

The backend follows a modular architecture to separate concerns:

```text
backend/
├── app/
│   ├── config.py           # Pydantic settings & Environment config
│   ├── main.py             # Entry point, Middleware, & Router inclusion
│   ├── database.py         # MongoDB connection & Collection initialization
│   ├── constants/          # Static values (e.g., Roles)
│   ├── middleware/         # Security & Auth logic (JWT verification)
│   ├── models/             # Database schemas (Pydantic / MongoDB)
│   ├── routes/             # API Endpoints (Auth, Tickets, Admin, Staff)
│   ├── schemas/            # Request/Response data validation
│   ├── services/           # Core business logic & DB operations
│   └── utils/              # Helper functions (Security, Date formatting)
├── create_admin.py         # One-time script to seed the first admin
├── gunicorn_config.py      # Production server configuration
└── requirements.txt        # Backend dependencies
```

---

## 🔐 Authentication & Security

The system uses **JWT (JSON Web Tokens)** for stateless authentication.

### Flow

1. **Registration**: User registers; password is hashed using **Bcrypt** before storage.
2. **Login**: User provides credentials; system verifies the hash and issues an Access Token.
3. **Verification**: Frontend sends the token in the `Authorization: Bearer <token>` header.
4. **Middleware**: `auth_middleware.py` intercepts requests to verify the token and injects the `current_user` into the route.

### Role-Based Access Control (RBAC)

Roles are defined in `app/constants/roles.py`:

- `student`: Can submit and view their own complaints.
- `staff`: Can view assigned tasks and update statuses.
- `admin`: Full system access, including user deletion and bulk operations.

---

## 🗄️ Data Management (MongoDB)

The system integrates with **MongoDB Atlas** using the `pymongo` driver.

### Connection

Initialised in `app/database.py`. It uses a singleton-style connection that shares a single client across the application for efficiency.

### Data Models & Schemas

- **Models**: Define how data looks in MongoDB.
- **Schemas**: (Pydantic) Define how data is validated during API requests/responses. We use custom `PyObjectId` helpers to bridge the gap between MongoDB's `_id` and JSON's `id` string requirements.

---

## 🚀 API Routing Logic

Routes are split by domain for maintainability:

1. **Auth (`/auth`)**: Handles `login`, `register`, and `me` (current session) endpoints.
2. **Tickets (`/tickets`)**: Core student operations for creating and viewing complaints.
3. **Staff (`/staff`)**: Dashboard endpoints for maintenance staff to manage their work queue.
4. **Admin (`/admin`)**: Power-user endpoints for system-wide ticket and user management.

---

## 💼 Business Logic (Services)

To keep routes clean, all database operations and heavy logic reside in the `services/` layer:

- `auth_service.py`: Password validation, user lookups.
- `ticket_service.py`: Status updates, bulk deletions, and ID generation.

---

## 🛠️ Configuration

Configuration is managed via Pydantic's `BaseSettings` in `app/config.py`. This allows the system to:

- Automatically read from `.env` files.
- Fall back to safe defaults for local development.
- Prioritize environment variables in production (Perfect for Render/Vercel).
