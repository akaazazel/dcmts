import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Lock, Mail, ArrowRight } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, user, loading } = useAuth();
    const navigate = useNavigate();

    // If already logged in, redirect away from login
    if (!loading && user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        const result = await login(email, password);
        setIsSubmitting(false);

        if (result.success) {
            toast.success("Login successful!");
            navigate("/");
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[85vh]">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-10 transition-all hover:shadow-md">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-black mb-1.5">
                        Welcome back
                    </h2>
                    <p className="text-sm text-gray-500">
                        Enter your credentials to access DCMTS
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                                type="email"
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors bg-white text-gray-900 text-sm placeholder-gray-400"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label
                                className="block text-sm font-medium text-gray-700"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <a
                                href="#"
                                className="text-xs text-black hover:underline hidden"
                            >
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Lock size={16} />
                            </div>
                            <input
                                id="password"
                                type="password"
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors bg-white text-gray-900 text-sm placeholder-gray-400"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                <span>Verifying...</span>
                            </div>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm">
                    <p className="text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-black hover:underline transition-all"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
