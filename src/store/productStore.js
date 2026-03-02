import { create } from 'zustand';
import api from '../lib/axios';

const useProductStore = create((set, get) => ({
    products: [],
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/products/');
            set({ products: response.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    addProduct: async (productData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/products/', productData);
            set((state) => ({
                products: [...state.products, response.data],
                isLoading: false
            }));
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.detail || error.message, isLoading: false });
            throw error;
        }
    },

    updateProduct: async (id, productData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/products/${id}`, productData);
            set((state) => ({
                products: state.products.map(p => p.id === id ? response.data : p),
                isLoading: false
            }));
            return response.data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    deleteProduct: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/products/${id}`);
            set((state) => ({
                products: state.products.filter(p => p.id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    uploadBulkCSV: async (file) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post('/products/bulk-upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Refresh products after upload
            await get().fetchProducts();
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.detail || error.message, isLoading: false });
            throw error;
        }
    }
}));

export default useProductStore;
