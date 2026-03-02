import { create } from 'zustand';
import api from '../lib/axios';

const useBillingStore = create((set, get) => ({
    cart: [],
    isLoading: false,
    error: null,

    addToCart: (product) => {
        set((state) => {
            const existing = state.cart.find(item => item.barcode === product.barcode);
            if (existing) {
                return {
                    cart: state.cart.map(item =>
                        item.barcode === product.barcode
                            ? { ...item, qty: item.qty + 1 }
                            : item
                    )
                };
            }
            return { cart: [...state.cart, { ...product, qty: 1 }] };
        });
    },

    removeFromCart: (barcode) => {
        set((state) => ({
            cart: state.cart.filter(item => item.barcode !== barcode)
        }));
    },

    updateQuantity: (barcode, delta) => {
        set((state) => ({
            cart: state.cart.map(item => {
                if (item.barcode === barcode) {
                    const newQty = Math.max(1, item.qty + delta);
                    return { ...item, qty: newQty };
                }
                return item;
            })
        }));
    },

    clearCart: () => set({ cart: [] }),

    generateBill: async () => {
        const { cart } = get();
        if (cart.length === 0) return null;

        set({ isLoading: true, error: null });
        try {
            const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

            const payload = {
                total_amount: totalAmount,
                cart_details: cart.map(item => ({
                    barcode: item.barcode,
                    name: item.name,
                    price: item.price,
                    qty: item.qty
                }))
            };

            const response = await api.post('/bills/', payload);
            set({ cart: [], isLoading: false }); // Clear cart after successful bill
            return response.data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Simulate barcode scan by fetching product from backend
    scanProduct: async (barcode) => {
        set({ isLoading: true, error: null });
        try {
            // In real app, we might have a specific endpoint or just filter on frontend if all products loaded
            // Assuming we fetch all products for demo and find it
            const response = await api.get('/products/');
            const product = response.data.find(p => p.barcode === barcode || p.name === barcode);

            if (product) {
                get().addToCart(product);
            } else {
                set({ error: 'Product not found' });
            }
            set({ isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    }
}));

export default useBillingStore;
