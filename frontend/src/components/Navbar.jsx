import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogOut, User, Activity } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex h-full items-center">
                        <Link
                            to="/"
                            className="flex flex-shrink-0 items-center gap-2 text-primary font-bold text-xl hover:text-primary-hover transition-colors"
                        >
                            <Activity className="h-6 w-6" />
                            <span>DCMTS</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="hidden md:flex space-x-4 mr-4">
                                    {user.role === "student" && (
                                        <>
                                            <Link
                                                to="/dashboard"
                                                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition"
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/submit"
                                                className="text-primary hover:text-primary-hover px-3 py-2 rounded-md text-sm font-bold transition"
                                            >
                                                Submit Complaint
                                            </Link>
                                        </>
                                    )}
                                    {user.role === "staff" && (
                                        <Link
                                            to="/staff"
                                            className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition"
                                        >
                                            Staff Dashboard
                                        </Link>
                                    )}
                                    {user.role === "admin" && (
                                        <Link
                                            to="/admin"
                                            className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
                                    <User size={18} />
                                    <span>
                                        {user.name} ({user.role})
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 ml-4 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <div className="space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-500 hover:text-gray-900 font-medium transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-hover transition shadow-sm"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
