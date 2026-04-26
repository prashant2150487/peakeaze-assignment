import axios from "axios";
import { store } from "../store";
import { setCredentials, logout } from "../store/slices/authSlice";

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL  }/api`,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor (attach token)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor (handle errors globally)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !(originalRequest as Record<string, boolean>).retry) {
            (originalRequest as Record<string, boolean>).retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error("No refresh token available");

                // Try to refresh token using a new axios instance to avoid interceptors
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {}, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`
                    }
                });
                const { token, user, refreshToken: newRefreshToken } = res.data;
                
                // Dispatch to Redux store & localStorage via slice
                store.dispatch(setCredentials({ user, token, refreshToken: newRefreshToken || refreshToken }));
                
                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return await axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh token failed, clear everything and logout
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;