import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

const useOrderStore = create(
    persist(
        (set, get) => ({
            orderItems: [],
            lastOrder: null,
            isLoading: false,
            error: null,

            addOrderItem: (product) => {
                set((state) => {
                    const existing = state.orderItems.find(item => item.barcode === product.barcode);
                    if (existing) {
                        return {
                            orderItems: state.orderItems.map(item =>
                                item.barcode === product.barcode
                                    ? { ...item, qty: item.qty + 1 }
                                    : item
                            )
                        };
                    }
                    return { orderItems: [...state.orderItems, { ...product, qty: 1 }] };
                });
            },

            removeOrderItem: (barcode) => {
                set((state) => ({
                    orderItems: state.orderItems.filter(item => item.barcode !== barcode)
                }));
            },

            updateOrderQuantity: (barcode, delta) => {
                set((state) => ({
                    orderItems: state.orderItems.map(item => {
                        if (item.barcode === barcode) {
                            const newQty = Math.max(1, item.qty + delta);
                            return { ...item, qty: newQty };
                        }
                        return item;
                    })
                }));
            },

            clearOrder: () => set({ orderItems: [] }),

            scanProductForOrder: async (barcode) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/products/');
                    const product = response.data.find(p => p.barcode === barcode);

                    if (product) {
                        get().addOrderItem(product);
                    } else {
                        set({ error: 'Product not found' });
                    }
                    set({ isLoading: false });
                } catch (error) {
                    set({ error: error.message, isLoading: false });
                }
            },

            fetchLastOrder: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/distributor_orders/last');
                    set({ lastOrder: response.data, isLoading: false });
                } catch (error) {
                    // It's normal for a user to have no past orders
                    if (error.response?.status === 404) {
                        set({ lastOrder: null, isLoading: false });
                    } else {
                        set({ error: "Failed to load last order info", isLoading: false });
                    }
                }
            },

            sendWhatsAppOrder: async (distributorPhone) => {
                const { orderItems } = get();
                if (orderItems.length === 0) return;

                set({ isLoading: true, error: null });

                try {
                    // Send order to backend
                    const orderPayload = {
                        order_details: orderItems.map(item => ({
                            barcode: item.barcode,
                            name: item.name,
                            qty: item.qty,
                            price: item.buying_price || item.price
                        }))
                    };

                    await api.post('/distributor_orders/', orderPayload);

                    // Construct WhatsApp message
                    let message = `*🌟 New Stock Order 🌟*\n\n`;
                    orderItems.forEach((item, idx) => {
                        message += `${idx + 1}. *${item.name}*\t`;
                        message += `   Qty: ${item.qty}\n`;
                        // message += `   Code: ${item.barcode}\n\n`;
                    });

                    const totalEstimated = orderItems.reduce((acc, item) => acc + ((item.buying_price || item.price) * item.qty), 0);
                    // message += `*Estimated Total: ₹${totalEstimated.toFixed(2)}*\n\n`;
                    // message += `Please confirm receipt of this order. Thank you!`;

                    // Format for URL, passing in the selected distributor phone
                    const url = `https://wa.me/${distributorPhone}?text=${encodeURIComponent(message)}`;

                    // Open WhatsApp in new tab
                    window.open(url, '_blank');

                    // Clear the order after sending
                    set({ orderItems: [], isLoading: false });
                } catch (error) {
                    console.error("Failed to submit distributor order", error);
                    set({ error: "Failed to submit order to the system. WhatsApp message not sent.", isLoading: false });
                }
            }
        }), {
        name: 'order-cart-storage',
    }));

export default useOrderStore;
