import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor (Add Token)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (Rotate Refresh Token)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
                    refresh_token: refreshToken
                });

                if (res.status === 200) {
                    localStorage.setItem('access_token', res.data.access_token);
                    localStorage.setItem('refresh_token', res.data.refresh_token);
                    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
                    return api(originalRequest);
                }
            } catch (err) {
                // Refresh token failed, force logout
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        } else if (error.response && error.response.status >= 400 && error.response.status !== 401) {
            // Global error handler for all API errors EXCEPT 401s (handled above)
            const errorData = error.response.data;
            let errorMessage = "An unexpected error occurred.";

            if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData && errorData.detail) {
                errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
            } else if (error.message) {
                errorMessage = error.message;
            }

            // Show toast notification
            toast.error(errorMessage);
        } else if (!error.response) {
            // Network error
            toast.error("Network error. Please check your connection.");
        }
        return Promise.reject(error);
    }
);

export default api;
