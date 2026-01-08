import { useEffect, useState } from "react";
import api from "@/api/axios";
import { toast } from "sonner";
import { AuthContext } from "./AuthContext.jsx";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        try {
            const res = await api.post("/users/login", { email, password });
            const { accessToken, refreshToken, user } = res.data.data;

            setUser(user);
            setAccessToken(accessToken);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);


            toast.success("Login successful");
            return user;
        } catch (err) {
            toast.error(err?.response?.data?.message || "Login failed");
            throw err;
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                await api.post("/users/logout", { refreshToken });
            }
        } finally {
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            setUser(null);
            setAccessToken(null);
            toast.success("Logged out");
        }
    };

    const bootstrapAuth = async () => {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            setLoading(false);
            return;
        }

        try {
            const res = await api.post("/users/refresh", { refreshToken });
            const { accessToken, user } = res.data.data;

            setAccessToken(accessToken);
            setUser(user); // ✅ FULL USER OBJECT

            localStorage.setItem("accessToken", accessToken);
        } catch {
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            setUser(null);
            setAccessToken(null);
            toast.error("Session expired. Please login again.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        bootstrapAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
