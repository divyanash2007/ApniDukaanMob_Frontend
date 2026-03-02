import { create } from 'zustand';
import api from '../lib/axios';
import { jwtDecode } from "jwt-decode";

const getInitialAuthState = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        try {
            const decodedUser = jwtDecode(token);
            return { user: decodedUser, isAuthenticated: true };
        } catch (e) {
            return { user: null, isAuthenticated: false };
        }
    }
    return { user: null, isAuthenticated: false };
};

const initialState = getInitialAuthState();

const useAuthStore = create((set) => ({
    user: initialState.user,
    userProfile: null,
    isAuthenticated: initialState.isAuthenticated,
    isLoading: false,

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            // Assuming FastAPI OAuth2PasswordRequestForm expects form data
            const formData = new FormData();
            formData.append('username', email); // OAuth2 expects 'username' instead of 'email'
            formData.append('password', password);

            const response = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { access_token, refresh_token } = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            const decodedUser = jwtDecode(access_token);
            set({ user: decodedUser, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    register: async (userData) => {
        set({ isLoading: true });
        try {
            await api.post('/auth/signup', userData);
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    fetchProfile: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/users/me');
            set({ userProfile: response.data, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            set({ isLoading: false });
        }
    },

    updateProfile: async (userData) => {
        set({ isLoading: true });
        try {
            const response = await api.put('/users/me', userData);
            set({
                userProfile: response.data,
                // Also update local username if it changed so the token/user state stays somewhat in sync visually
                user: { ...get().user, sub: response.data.username },
                isLoading: false
            });
            return true;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, userProfile: null, isAuthenticated: false });
    },

    checkAuth: () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                // Basic expiration check
                if (decodedUser.exp * 1000 < Date.now()) {
                    // Will rotate on next request naturally due to interceptor
                    set({ isAuthenticated: true });
                } else {
                    set({ user: decodedUser, isAuthenticated: true });
                }
            } catch (e) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
            }
        }
    }
}));

export default useAuthStore;
