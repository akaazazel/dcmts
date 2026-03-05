import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogOut, User, LayoutTemplate, Moon, Sun } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [darkMode, setDarkMode] = React.useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved === null ? false : saved === "true";
    });

    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive(path)
                ? "text-primary bg-muted-background"
                : "text-muted hover:text-foreground hover:bg-muted-background"
        }`;

    return (
        <nav className="bg-[var(--card)]/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-14">
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-black font-semibold text-lg hover:opacity-80 transition-opacity"
                        >
                            <LayoutTemplate className="h-5 w-5" />
                            <span className="tracking-tight">DCMTS</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-2">
                        {user ? (
                            <>
                                <div className="hidden md:flex space-x-1 mr-4">
                                    {user.role === "student" && (
                                        <>
                                            <Link
                                                to="/dashboard"
                                                className={navLinkClass(
                                                    "/dashboard",
                                                )}
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/submit"
                                                className={navLinkClass(
                                                    "/submit",
                                                )}
                                            >
                                                Submit
                                            </Link>
                                        </>
                                    )}
                                    {user.role === "staff" && (
                                        <Link
                                            to="/staff"
                                            className={navLinkClass("/staff")}
                                        >
                                            Staff
                                        </Link>
                                    )}
                                    {user.role === "admin" && (
                                        <>
                                            <Link
                                                to="/admin"
                                                className={navLinkClass(
                                                    "/admin",
                                                )}
                                            >
                                                Tickets
                                            </Link>
                                            <Link
                                                to="/admin/users"
                                                className={navLinkClass(
                                                    "/admin/users",
                                                )}
                                            >
                                                Users
                                            </Link>
                                        </>
                                    )}
                                </div>

                                <div className="h-5 w-px bg-gray-200 hidden md:block mx-2"></div>

                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-2 text-sm font-medium px-2 py-1.5 rounded-md hover:bg-muted-background transition shadow-sm border border-transparent hover:border-border"
                                >
                                    <div className="bg-muted-background flex items-center justify-center rounded-full h-6 w-6 border border-border">
                                        <User
                                            size={14}
                                            className="text-muted"
                                        />
                                    </div>
                                    <span className="hidden sm:inline-block">
                                        {user.name.split(" ")[0]}
                                    </span>
                                </Link>
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-muted-background transition-colors"
                                    title={
                                        darkMode
                                            ? "Switch to Light Mode"
                                            : "Switch to Dark Mode"
                                    }
                                >
                                    {darkMode ? (
                                        <Sun size={18} />
                                    ) : (
                                        <Moon size={18} />
                                    )}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-muted-background transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <div className="space-x-4 flex items-center">
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-1.5 rounded-md text-gray-500 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-2"
                                    title={
                                        darkMode
                                            ? "Switch to Light Mode"
                                            : "Switch to Dark Mode"
                                    }
                                >
                                    {darkMode ? (
                                        <Sun size={18} />
                                    ) : (
                                        <Moon size={18} />
                                    )}
                                </button>
                                <Link
                                    to="/login"
                                    className="text-gray-500 text-sm hover:text-black font-medium transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-black text-white px-3 py-1.5 text-sm rounded-md font-medium hover:bg-gray-800 transition-colors shadow-sm"
                                >
                                    Sign Up
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
