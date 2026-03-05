import React, { createContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("access_token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    // Attempt to get the current user profile using the token
                    const res = await apiClient.get("/auth/me");
                    setUser(res.data);
                } catch (err) {
                    console.error("Token invalid or expired", err);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            // The FastAPI endpoint uses OAuth2PasswordRequestForm
            // which expects x-www-form-urlencoded data.
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const res = await apiClient.post("/auth/token", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            const { access_token } = res.data;
            setToken(access_token);
            localStorage.setItem("access_token", access_token);

            // Fetch user profile immediately after login
            const userRes = await apiClient.get("/auth/me");
            setUser(userRes.data);
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.detail || "Login failed",
            };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            await apiClient.post("/auth/register", {
                name,
                email,
                password,
                role,
            });
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.detail || "Registration failed",
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("access_token");
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loading, login, logout, register }}
        >
            {children}
        </AuthContext.Provider>
    );
};
