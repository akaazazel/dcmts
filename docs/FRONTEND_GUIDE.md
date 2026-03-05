# 🎨 Frontend Architecture Guide

This document provides a comprehensive overview of the React + Vite frontend for the Digital Complaint Management System (DCMS).

---

## 📂 Directory Structure

The frontend is built as a modern Single Page Application (SPA):

```text
frontend/
├── src/
│   ├── api/                # Axios instance & Centralized API client
│   ├── components/         # Reusable UI components (Navbar, Cards, Badges)
│   ├── context/            # Global state (AuthContext)
│   ├── hooks/              # Custom React hooks (useAuth)
│   ├── pages/              # Full page views (Login, Dashboards, Lists)
│   ├── App.jsx             # Main router & Route protection logic
│   ├── App.css             # Global layout & Component-specific overrides
│   ├── index.css           # Tailwind/CSS Variables & Core theme tokens
│   └── main.jsx            # Entry point & Context Provider wrapping
├── public/                 # Static assets (Favicons, Logos)
├── vercel.json             # Deployment configuration for Vercel
└── package.json            # Dependencies & Project scripts
```

---

## 🔐 Authentication System

The frontend manages authentication using a centralized **React Context Provider**.

### AuthContext

Managed in `src/context/AuthContext.jsx`, it:

- Tracks the `currentUser` state globally.
- Persists JWT tokens in `localStorage`.
- Automatically fetches user details on initialization to ensure session continuity.
- provides `login`, `logout`, and `register` methods to components.

### useAuth Hook

A custom hook (`src/hooks/useAuth.js`) is used to access the authentication state/methods throughout the application without prop-drilling.

---

## 🛣️ Routing & Route Protection

Routing is handled by **React Router 7**.

### Protected Routes

Route protection is implemented directly in `App.jsx`. It uses the `ProtectedRoute` component to:

1. Verify if a user is authenticated.
2. Check if the user's **Role** (`student`, `staff`, or `admin`) has permission to access the specific route.

Example:

- `/admin/*` can only be accessed by users with the `admin` role.
- `/staff/*` is reserved for maintenance staff.

---

## 🏗️ Component Library

The UI is built using a custom design system focused on premium aesthetics:

- **Surface Area**: Clear separation between `pages` (logic-heavy views) and `components` (reusable UI).
- **Design Tokens**: Defined in `index.css` as CSS variables (`--primary`, `--background`, `--card`, etc.) to support seamless theme switching and consistent branding.
- **Dynamic Cards**: `TicketCard.jsx` is the primary data display component, featuring interactive selection logic and status badges.

---

## 📡 API Integration

Integration with the FastAPI backend is managed via a centralized **Axios** client in `src/api/apiClient.js`:

- **Base Configuration**: Automatically sets the backend URL based on environment variables.
- **Interceptors**:
    - **Request**: Automatically injects the JWT token from `localStorage` into every outgoing request.
    - **Response**: Globally handles common errors, such as clearing local sessions on `401 Unauthorized` responses.

---

## 💅 Styling Philosophy

- **Modern & Premium**: Uses a "Vercel-inspired" minimal design with deep shadows, smooth transitions, and high-contrast typography.
- **Glassmorphism & Gradients**: Subtle use of transparency and gradients for a premium feel.
- **Theme Support**: The system defaults to Light mode with a high-contrast palette specifically requested for visibility and accessibility.
