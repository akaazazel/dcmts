# 🚀 Deployment Guide

This guide details the steps to deploy the Digital Complaint Management System (DCMS) using **Vercel** for the frontend and **Render** for the backend.

---

## 🏗️ Backend (Render)

Render is excellent for hosting FastAPI applications with MongoDB support.

### 1. Database Setup

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster and database (e.g., `dcmts`).
3. Ensure Network Access (White-list IP `0.0.0.0/0` for Render's dynamic IPs).
4. Note your **Connection String**.

### 2. Deployment Steps

1. Push your code to a GitHub repository.
2. Log in to [Render](https://render.com/).
3. Create a **New Web Service**:
    - **Root Directory**: `backend`
    - **Runtime**: `Python`
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `gunicorn -c gunicorn_config.py app.main:app`
4. Add the following **Environment Variables**:
    - `MONGO_URI`: (Your MongoDB Connection String)
    - `JWT_SECRET`: (A strong random string)

---

## 🎨 Frontend (Vercel)

Vercel is the best platform for React (Vite) applications.

### 1. Configuration Check

- Ensure `frontend/vercel.json` exists for handling SPA routing.

### 2. Deployment Steps

1. Log in to [Vercel](https://vercel.com/).
2. Create a **New Project**:
    - Select your GitHub repository.
    - **Root Directory**: `frontend`
    - **Framework Preset**: `Vite` (Detects `npm run build` and `dist` output).
3. Add the following **Environment Variables**:
    - `VITE_API_URL`: (The URL of your deployed backend on Render, e.g., `https://dcmts-api.onrender.com`)

---

## 🧪 Post-Deployment Checklist

- [ ] Verify that the frontend can successfully connect to the backend API.
- [ ] Check CORS headers if API requests fail with 403 or 405.
- [ ] Run `backend/create_admin.py` if the production database is fresh to set up an admin user.

> [!TIP]
> Use `.env.example` in both folders as a template for your production configuration.
