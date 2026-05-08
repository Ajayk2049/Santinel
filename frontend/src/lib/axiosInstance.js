import axios from 'axios';
import { store } from '../store';
import { clearAuth } from '../store/authSlice';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5500';

const axiosInstance = axios.create({
    baseURL: API_BASE,
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401s
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Session expired or invalid. Clearing auth state.');
            store.dispatch(clearAuth());
            // Optionally redirect to login if not already there
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
