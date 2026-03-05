import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages (These will be created next)
import Login from "./pages/Login";
import Register from "./pages/Register";
import SubmitComplaint from "./pages/SubmitComplaint";
// import Dashboard from './pages/Dashboard';
// import AdminDashboard from './pages/AdminDashboard';
// import StaffDashboard from './pages/StaffDashboard';

const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
            <Toaster position="top-right" />
        </div>
    );
};

// Root route redirects based on user role or logged out state
const RootRedirect = () => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
        case "admin":
            return <Navigate to="/admin" replace />;
        case "staff":
            return <Navigate to="/staff" replace />;
        default:
            return <Navigate to="/dashboard" replace />;
    }
};

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppLayout>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Root Redirect based on user state */}
                        <Route path="/" element={<RootRedirect />} />

                        {/* Protected Routes (Placeholders for now) */}
                        <Route
                            element={
                                <ProtectedRoute
                                    allowedRoles={["student", "admin"]}
                                />
                            }
                        >
                            <Route
                                path="/dashboard"
                                element={
                                    <div className="p-4 bg-white rounded shadow text-center">
                                        Student Dashboard Placeholder
                                    </div>
                                }
                            />
                        </Route>

                        <Route
                            element={
                                <ProtectedRoute allowedRoles={["admin"]} />
                            }
                        >
                            <Route
                                path="/admin"
                                element={
                                    <div className="p-4 bg-white rounded shadow text-center text-primary font-bold">
                                        Admin Dashboard Placeholder
                                    </div>
                                }
                            />
                        </Route>

                        <Route
                            element={
                                <ProtectedRoute
                                    allowedRoles={["staff", "admin"]}
                                />
                            }
                        >
                            <Route
                                path="/staff"
                                element={
                                    <div className="p-4 bg-white rounded shadow text-center text-orange-600 font-bold">
                                        Staff Dashboard Placeholder
                                    </div>
                                }
                            />
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AppLayout>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
