import axios from "axios";
import axiosInstance from "./axios";

const authService = {
    login: async (email: string, password: string) => {
        const res = await axiosInstance.post("/auth/login", { email, password });
        return res.data;
    },

    register: async (email: string, password: string, role?: string) => {
        const res = await axiosInstance.post("/auth/signup", { email, password, role });
        return res.data;
    },

    getMe: async () => {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
    },

    refreshToken: async (token: string) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }
}

export default authService;
