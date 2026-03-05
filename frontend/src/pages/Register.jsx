import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { User, Lock, Mail, ArrowRight, Shield } from "lucide-react";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, login, user, loading } = useAuth();
    const navigate = useNavigate();

    // If already logged in, redirect away from register
    if (!loading && user) {
        return <Navigate to="/" replace />;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword, role } = formData;

        if (!name || !email || !password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsSubmitting(true);
        const result = await register(name, email, password, role);
        setIsSubmitting(false);

        if (result.success) {
            toast.success("Registration successful! Logging in...");
            // Auto-login after registration
            await login(email, password);
            navigate("/");
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-sm w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-10 transition-all hover:shadow-md">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-black mb-1.5">
                        Create an account
                    </h2>
                    <p className="text-sm text-gray-500">
                        Join the DCMTS platform
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                            htmlFor="name"
                        >
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <User size={16} />
                            </div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors bg-white text-gray-900 text-sm placeholder-gray-400"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Mail size={16} />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors bg-white text-gray-900 text-sm placeholder-gray-400"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                            htmlFor="role"
                        >
                            Role
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Shield size={16} />
                            </div>
                            <select
                                id="role"
                                name="role"
                                className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors bg-white text-gray-900 text-sm appearance-none"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="student">Student</option>
                                <option value="staff">Staff</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Lock size={16} />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors bg-white text-gray-900 text-sm placeholder-gray-400"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                            htmlFor="confirmPassword"
                        >
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Lock size={16} />
                            </div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors bg-white text-gray-900 text-sm placeholder-gray-400"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center py-2 px-4 mt-2 border border-transparent rounded-md text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Registering...</span>
                            </div>
                        ) : (
                            <span>Create Account</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm">
                    <p className="text-gray-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-black hover:underline transition-all"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
