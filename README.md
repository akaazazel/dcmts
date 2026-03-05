# 🏙️ Digital Complaint Management System (DCMS)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

A modern, secure, and user-friendly portal for **Students**, **Staff**, and **Administrators** to manage complaints and maintenance tasks efficiently. Built with a high-performance FastAPI backend and a beautiful, responsive React frontend.

---

## ✨ Features

- **🔐 Secure Authentication:** JWT-based login and registration with Role-Based Access Control (RBAC).
- **📋 Student Portal:** Submit complaints with attachments and track resolution progress in real-time.
- **🛠️ Staff Dashboard:** View assigned maintenance tasks, update statuses, and communicate resolution details.
- **🛡️ Admin Control Panel:** Complete system oversight, user management (remove staff/students), and bulk ticket operations.
- **🌗 Theme Support:** Seamless transition between dark and light modes with premium aesthetics.
- **📊 Real-time Stats:** Instant visual feedback on ticket counts and staff activity.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:

1. **Python (3.10 or higher)**: [Download here](https://www.python.org/downloads/)
2. **Node.js (18.x or higher)**: [Download here](https://nodejs.org/)
3. **MongoDB Atlas Account**: [Create one for free](https://www.mongodb.com/cloud/atlas)
4. **Git**: [Download here](https://git-scm.com/downloads)

---

## 🚀 Local Setup Guide

### 1. Clone the Project

```bash
git clone https://github.com/akaazazel/dcmts.git
cd dcmts
```

### 2. Backend Setup (API)

Open your terminal in the `backend/` folder:

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a file named `.env` in the `backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup (UI)

Open a **new** terminal in the `frontend/` folder:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

#### Configure Environment Variables

Create a file named `.env` in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:8000
```

---

## 🏃 Running the Application

1. **Start Backend**: In the backend terminal (with venv active), run:
    ```bash
    uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
    ```
2. **Start Frontend**: In the frontend terminal, run:
    ```bash
    npm run dev
    ```
3. **Access the App**: Open your browser and navigate to `http://localhost:5173`.

---

## 🛡️ Administrative Setup

To create your first admin user, run the following script in the backend folder:

```bash
python create_admin.py
```

---

## 📄 Documentation

- [Deployment Guide](docs/DEPLOYMENT.md) - How to deploy to Vercel and Render.
- [Project Architecture](docs/project_guide.md) - Deep dive into the tech stack and code structure.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
