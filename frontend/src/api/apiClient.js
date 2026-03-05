import axios from "axios";

// Determine base URL, fallback to localhost:8000
const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Configure Interceptors for JWT token insertion
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Optional: Intercept responses to handle 401 Unauthorized globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear token and optionally redirect to login
            localStorage.removeItem("access_token");
            // We handle redirect logic higher up typically, via AuthContext or router
        }
        return Promise.reject(error);
    },
);

export default apiClient;
