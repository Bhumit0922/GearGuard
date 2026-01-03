import axios from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🌐 Network error
    if (!error.response) {
      return Promise.reject({
        message: "Server unreachable. Check your internet connection.",
      });
    }

    // 🚫 DO NOT intercept auth routes
    const authRoutes = ["/users/login", "/users/signup", "/users/refresh"];

    if (authRoutes.some((url) => originalRequest.url.includes(url))) {
      return Promise.reject(error);
    }

    // 🔐 Handle 401 ONLY ONCE
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        forceLogout();
        return;
      }

      try {
        const res = await axios.post(`${BASE_URL}/users/refresh`, {
          refreshToken,
        });

        const newAccessToken = res.data.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        forceLogout();
      }
    }

    // 🔴 Normalized error
    return Promise.reject({
      message:
        error.response?.data?.message ||
        "Something went wrong. Please try again.",
    });
  }
);

/* ---------------- HELPERS ---------------- */
function forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  toast.error("Session expired. Please login again.");
  window.location.href = "/login";
}

export default api;
