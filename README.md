# Digital Complaint Management System (DCMTS)

A modern, full-stack digital complaint management system with a FastAPI backend. This project allows students to submit complaints, while providing dedicated dashboards and workflows for maintenance staff and administrators.

Currently, the **backend API** is fully implemented.

## 🚀 Features (Backend)

- **FastAPI Framework:** High-performance async Python backend.
- **MongoDB Atlas Integration:** Data storage using PyMongo.
- **JWT Authentication:** Secure login, registration, and session management using hashed passwords (Bcrypt).
- **Role-Based Access Control (RBAC):** Three dedicated roles: `student`, `staff`, `admin`.
- **Automated Ticket Generation:** Unique incremental complaint IDs (e.g., `CMP-2026-0001`).
- **Ticket Workflows:**
    - **Students:** Create complaints and view their own tickets.
    - **Admin:** View all tickets, manage users, and assign tickets to specific maintenance staff.
    - **Staff:** View assigned tickets and update their status (Open -> In Progress -> Resolved).

## 🛠️ Tech Stack

- **Backend:** Python, FastAPI, Uvicorn, Pydantic
- **Database:** MongoDB
- **Security:** Passlib (Bcrypt), Python-JOSE (JWT)

## 📦 Setup Instructions

1. **Prerequisites**
    - Python 3.9+
    - A MongoDB Atlas connection string

2. **Backend Setup**

    ```bash
    cd backend
    python -m venv venv

    # Activate virtual environment
    # Windows:
    .\venv\Scripts\activate
    # macOS/Linux:
    source venv/bin/activate

    pip install -r requirements.txt
    ```

3. **Environment Setup**
   Create a `.env` file in the `backend/` directory:

    ```env
    MONGO_URI=mongodb+srv://<your-username>:<your-password>@cluster.mongodb.net/
    JWT_SECRET=your_super_secret_key
    ```

4. **Running the API**
    ```bash
    uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
    ```
    _The Swagger API documentation will be available at `http://127.0.0.1:8000/docs`_

## 🚧 Next Steps

- Initialize the React + Vite frontend.
- Implement the user interface (Login, Dashboard, Complaint Submission).
- Integrate the frontend with the FastAPI backend.
