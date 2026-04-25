import axios from "axios";
import axiosInstance from "./axios";

const authService = {
    login: async (email: string, password: string) => {
        try {
            const res = await axiosInstance.post("/auth/login", { email, password });
            return res.data;
        } catch (err) {
            throw err;
        }
    },

    register: async (email: string, password: string, role?: string) => {
        try {
            const res = await axiosInstance.post("/auth/signup", { email, password, role });
            return res.data;
        } catch (err) {
            throw err;
        }
    },

    getMe: async () => {
        try {
            const res = await axiosInstance.get("/auth/me");
            return res.data;
        } catch (err) {
            throw err;
        }
    },

    refreshToken: async (token: string) => {
        try {
            // Using standard axios to avoid interceptor loops
            const res = await axios.post(import.meta.env.VITE_API_URL + "/api/auth/refresh", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            throw err;
        }
    }
}

export default authService;
