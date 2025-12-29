import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        window.location.href = "/login";
        return;
      }

      try {
        const res = await axios.post(
          "http://localhost:5000/api/users/refresh",
          { refreshToken }
        );

        error.config.headers.Authorization = `Bearer ${res.data.data.accessToken}`;

        return axios(error.config);
      } catch {
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
