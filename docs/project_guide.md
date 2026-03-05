# Overall Project Structure

```
digital-complaint-system/
│
├── backend/
│
├── frontend/
│
├── docs/
│
├── README.md
│
└── .gitignore
```

Purpose:

- `backend` → FastAPI application
- `frontend` → React application
- `docs` → diagrams, API docs, report material
- `README.md` → project overview

---

# Backend Structure (FastAPI)

```
backend/
│
├── app/
│   │
│   ├── main.py
│   ├── config.py
│   ├── database.py
│
│   ├── models/
│   │    ├── user_model.py
│   │    ├── ticket_model.py
│   │
│   ├── schemas/
│   │    ├── user_schema.py
│   │    ├── ticket_schema.py
│   │
│   ├── routes/
│   │    ├── auth_routes.py
│   │    ├── ticket_routes.py
│   │    ├── admin_routes.py
│   │    ├── staff_routes.py
│   │
│   ├── services/
│   │    ├── auth_service.py
│   │    ├── ticket_service.py
│   │
│   ├── utils/
│   │    ├── jwt_handler.py
│   │    ├── password_utils.py
│   │    ├── ticket_id_generator.py
│   │
│   ├── middleware/
│   │    ├── auth_middleware.py
│   │
│   └── constants/
│        ├── roles.py
│        ├── ticket_status.py
│
├── requirements.txt
├── start.sh
├── render.yaml
└── .env
```

---

# Backend Core Files

## main.py

Entry point of FastAPI.

Responsibilities:

- Start FastAPI app
- Include all routes
- Configure CORS

Example structure:

```
create FastAPI app

include:
auth_routes
ticket_routes
admin_routes
staff_routes

enable CORS for frontend domain
```

---

## config.py

Loads environment variables.

```
MONGO_URI
JWT_SECRET
JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES
```

---

## database.py

Handles MongoDB Atlas connection.

```
MongoClient connection
database instance
collections:
    users
    tickets
```

---

# Backend Models (Database Structure)

### user_model.py

Represents users stored in MongoDB.

Fields:

```
id
name
email
password_hash
role
created_at
```

Roles:

```
student
staff
admin
```

---

### ticket_model.py

Fields:

```
id
ticket_id
title
description
category
priority
status
created_by
assigned_to
created_at
updated_at
```

Ticket statuses:

```
OPEN
ASSIGNED
IN_PROGRESS
RESOLVED
CLOSED
```

---

# Backend Schemas (Pydantic)

Schemas define **request and response validation**.

### user_schema.py

```
UserCreate
UserLogin
UserResponse
```

---

### ticket_schema.py

```
TicketCreate
TicketUpdate
TicketAssign
TicketResponse
```

---

# Backend Routes

Each route file handles a domain.

---

## auth_routes.py

Endpoints:

```
POST /auth/register
POST /auth/login
GET  /auth/me
```

Responsibilities:

- Register users
- Login
- Generate JWT

---

## ticket_routes.py

User actions.

```
POST /tickets/create
GET  /tickets/my
GET  /tickets/{ticket_id}
```

Students/staff can submit complaints and track them.

---

## admin_routes.py

Admin dashboard.

```
GET  /admin/tickets
PUT  /admin/tickets/{id}/assign
PUT  /admin/tickets/{id}/status
GET  /admin/users
```

Admin can:

- view all tickets
- assign maintenance staff
- change ticket status

---

## staff_routes.py

Maintenance staff.

```
GET  /staff/tickets
PUT  /staff/tickets/{id}/progress
PUT  /staff/tickets/{id}/complete
```

---

# Backend Services Layer

Business logic goes here.

Example:

### ticket_service.py

Functions:

```
create_ticket()
assign_ticket()
update_ticket_status()
get_user_tickets()
get_all_tickets()
```

Keeps routes clean.

---

# Backend Utils

### jwt_handler.py

Handles:

```
create_token()
verify_token()
decode_token()
```

---

### password_utils.py

Uses **bcrypt**.

```
hash_password()
verify_password()
```

---

### ticket_id_generator.py

Generates unique IDs like:

```
CMP-2026-0001
CMP-2026-0002
```

---

# Backend Dependencies (requirements.txt)

```
fastapi
uvicorn
pymongo
python-dotenv
passlib[bcrypt]
python-jose
pydantic
```

---

# Backend Deployment (Render)

Create:

```
render.yaml
```

Example structure:

```
services:
  - type: web
    name: complaint-api
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Environment variables in Render dashboard:

```
MONGO_URI
JWT_SECRET
```

---

# Frontend Structure (React)

```
frontend/
│
├── public/
│
├── src/
│   │
│   ├── main.jsx
│   ├── App.jsx
│
│   ├── pages/
│   │    ├── Login.jsx
│   │    ├── Register.jsx
│   │    ├── Dashboard.jsx
│   │    ├── SubmitComplaint.jsx
│   │    ├── TicketDetails.jsx
│   │    ├── AdminDashboard.jsx
│   │    ├── StaffDashboard.jsx
│   │
│   ├── components/
│   │    ├── Navbar.jsx
│   │    ├── TicketCard.jsx
│   │    ├── TicketTable.jsx
│   │    ├── StatusBadge.jsx
│   │    ├── ProtectedRoute.jsx
│   │
│   ├── api/
│   │    ├── apiClient.js
│   │    ├── authApi.js
│   │    ├── ticketApi.js
│   │
│   ├── context/
│   │    ├── AuthContext.jsx
│   │
│   ├── hooks/
│   │    ├── useAuth.js
│   │
│   ├── utils/
│   │    ├── formatDate.js
│   │
│   ├── styles/
│   │    ├── global.css
│   │
│   └── constants/
│        ├── roles.js
│        ├── status.js
│
├── package.json
└── vercel.json
```

---

# Frontend Key Concepts

## apiClient.js

Central Axios configuration.

```
baseURL = backend render url
attach JWT token
handle errors
```

---

## AuthContext

Stores login state globally.

```
user
token
login()
logout()
```

---

## ProtectedRoute

Blocks access to pages unless logged in.

Example:

```
AdminDashboard → admin only
StaffDashboard → staff only
```

---

# UI Pages

### Login Page

- email
- password

---

### Submit Complaint

Form fields:

```
title
description
category
priority
image(optional)
```

---

### Dashboard

Shows:

```
total tickets
open tickets
resolved tickets
```

---

### Admin Dashboard

Features:

```
view all complaints
assign staff
change status
filter tickets
```

---

### Staff Dashboard

Shows only:

```
assigned tickets
update progress
mark resolved
```

---

# Frontend Dependencies

```
react
react-router-dom
axios
tailwindcss
react-query
```

---

# Frontend Deployment (Vercel)

Create:

```
vercel.json
```

```
{
  "routes": [
    { "src": "/(.*)", "dest": "/" }
  ]
}
```

Set environment variable:

```
VITE_API_URL
```

Example:

```
https://complaint-api.onrender.com
```

---

# MongoDB Atlas Structure

Database:

```
complaint_system
```

Collections:

```
users
tickets
ticket_updates (optional)
```

Indexes:

```
ticket_id unique
email unique
```

---

# Development Order (Important)

Follow this order:

### Phase 1

```
MongoDB setup
FastAPI project
User authentication
JWT system
```

### Phase 2

```
Ticket CRUD
Ticket ID generator
User tickets API
```

### Phase 3

```
Admin assignment system
Status updates
Staff dashboard APIs
```

### Phase 4

```
React frontend
Authentication pages
Ticket submission UI
```

### Phase 5

```
Dashboards
Filtering
Deployment
```

---

# Final Architecture

```
Vercel (React)
      │
      │ HTTPS
      ▼
Render (FastAPI)
      │
      │
      ▼
MongoDB Atlas
```
