import {create} from 'zustand';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios.js';

export const useUserStore = create ((set,get) => ({
    user:null,
    loading: false,
    checkingAuth: false,
    signup: async (username, email, password, confirmPassword) => {
        set({ loading: true });
        if(password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Passwords do not match");
        }
        try {
            const response = await axiosInstance.post("/auth/signup", {
                username,
                email,
                password
            });
            set({ user: response.data.user, loading: false });
            toast.success("Account created successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "Failed to create account")
        }
    },
    login: async (email, password) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.post("/auth/login", {
                email,
                password}
            );
            set({ user: response.data.user, loading: false });
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Failed to log in");
            set({ loading: false });
        }
    },
    logout: async (confirm=true) => {
        if(confirm){
            const confirmLogout = window.confirm("Do you want to log out?");
            if (!confirmLogout) return;
        }
        set({ loading: true });
        try {
            const response = await axiosInstance.post("/auth/logout");
            set({ user: null, loading: false });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Failed to log out");
            set({ loading: false });
        }
    },
    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axiosInstance.get("/auth/profile", { withCredentials: true });
            set({ user: response.data.user, checkingAuth: false });
        } catch (error) {
            const status = error.response?.status;
            if (status !== 401 && status !== 403) {
                toast.error(error.response?.data?.message || "Failed to check authentication");
            }
            set({ user: null, checkingAuth: false });
        }
    },

    refreshToken: async () => {
        if(get().checkAuth) return;
        set({checkAuth:true});
        try {
            const res = await axiosInstance.post('/auth/refresh-token');
            set({checkAuth:false});
            return res.data;
        } catch (error) {
            set({user:null,checkAuth:false});
            throw error;
        }
    }
}));

    let refreshPromise = null;

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if(error.response?.status===401 && !originalRequest._retry){
                originalRequest._retry = true;
                try {
                    if(refreshPromise){
                        await refreshPromise;
                        return axiosInstance(originalRequest);
                    }

                    refreshPromise = useUserStore.getState().refreshToken();
                    await refreshPromise;
                    refreshPromise = null;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    refreshPromise = null;
                    await useUserStore.getState().logout(false);
                    return Promise.reject(refreshError)
                }
            }
            return Promise.reject(error);
        }
    )

