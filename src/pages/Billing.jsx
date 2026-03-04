import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Minus, Trash2, Printer, Receipt, ArrowLeft, MoreVertical, ScanLine, ShoppingCart, Box, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import useBillingStore from '../store/billingStore';
import SelectProductModal from '../components/SelectProductModal';
import BarcodeScannerModal from '../components/BarcodeScannerModal';
import useProductStore from '../store/productStore';

const Billing = () => {
    const { cart, addToCart, removeFromCart, updateQuantity, clearCart, generateBill, scanProduct, isLoading, error } = useBillingStore();
    const { products, fetchProducts } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
    const [customerPhone, setCustomerPhone] = useState('');

    // Derived state
    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    // Handle External App Scan Return
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('scanned_barcode');
        if (code) {
            scanProduct(code);
            // Remove the param without full reload
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }, [scanProduct]);

    useEffect(() => {
        if (products.length === 0) {
            fetchProducts();
        }
    }, [products.length, fetchProducts]);

    const quickAddItems = useMemo(() => {
        if (!products || products.length === 0) return [];
        // Shuffle and take up to 6 random products
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 6).map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            barcode: p.barcode,
            img: `https://picsum.photos/seed/${p.id}/100` // Using consistent deterministic random placeholder per product ID
        }));
    }, [products]);

    const handleShareWhatsApp = () => {
        if (cart.length === 0) return;
        setIsPhoneModalOpen(true);
    };

    const handleConfirmWhatsAppShare = (e) => {
        e.preventDefault();
        if (!customerPhone) return;

        let message = `*🧾 Apna Dukaan Receipt*\n\n`;
        cart.forEach((item, idx) => {
            message += `${idx + 1}. *${item.name}*\t`;
            message += `   Qty: ${item.qty} x ₹${item.price.toFixed(2)} = ₹${(item.qty * item.price).toFixed(2)}\n`;
        });
        message += `\n*Total Amount: ₹${totalAmount.toFixed(2)}*\n\n`;
        message += `Thank you for shopping!`;

        // Clean the number format if needed (e.g. remove spaces). Assuming they typed clean number or included '+'
        const formattedPhone = customerPhone.replace(/\s+/g, '');
        const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        setIsPhoneModalOpen(false);
    };

    const handleSearch = async (e) => {
        if (e.key === 'Enter' && searchTerm) {
            await scanProduct(searchTerm);
            setSearchTerm('');
        }
    };

    const handleGenerateBill = async () => {
        try {
            await generateBill();
            toast.success('Bill generated successfully!');
        } catch (err) {
            // Error toast handled by axios interceptor
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans px-4 pt-10 pb-[320px] print:hidden">

                {/* Header section */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <Link to="/dashboard" className="p-1 -ml-1">
                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                        </Link>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">New Sale</h1>
                    </div>
                    <button className="p-1 text-gray-600">
                        <MoreVertical className="w-6 h-6" />
                    </button>
                </div>

                {/* Barcode Search / Scan Bar */}
                <div className="relative mb-4">
                    <button
                        onClick={() => setIsScannerOpen(true)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-brand active:scale-95"
                    >
                        <ScanLine className="w-6 h-6 border-2 border-dashed border-brand p-0.5 rounded-lg opacity-80" />
                    </button>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder="Scan barcode or type and press Enter"
                        className="w-full bg-white border-2 border-brand/20 shadow-sm rounded-2xl py-4 pl-14 pr-12 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition font-medium text-[15px] placeholder-brand/60"
                    />
                    <button
                        onClick={() => handleSearch({ key: 'Enter' })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand/10 text-brand p-1.5 rounded-xl active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {error && <div className="text-red-500 text-sm font-bold text-center mb-4 bg-red-50 p-2 rounded-xl border border-red-100">{error}</div>}

                {/* Quick Add Scroll area */}
                <div className="mb-6">
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest pl-1">Quick Add</h3>
                        <button className="text-[10px] font-bold text-brand uppercase tracking-wider pr-1">View All</button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                        {quickAddItems.map(item => (
                            <div
                                key={item.id}
                                onClick={() => scanProduct(item.barcode || item.name)}
                                className="bg-white border border-gray-100 shadow-sm rounded-[20px] p-2 flex items-center gap-2 shrink-0 min-w-[140px] relative mt-1 active:scale-95 cursor-pointer transition-transform"
                            >
                                <img src={item.img} className="w-10 h-10 object-cover rounded-xl" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                                    <p className="text-[10px] font-bold text-brand mt-0.5">₹{item.price.toFixed(2)}</p>
                                </div>
                                <div className="absolute -top-1 -right-1 bg-white border border-gray-100 rounded-full text-brand shadow p-0.5">
                                    <Plus className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full border-2 border-dashed border-primary-200 bg-primary-50/50 text-brand font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm mb-6 hover:bg-primary-50 transition-colors active:scale-95"
                >
                    <Search className="w-4 h-4" /> Browse Inventory
                </button>

                {/* Current Cart List */}
                <div className="flex-1 flex flex-col min-h-0 mb-6 relative">
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-sm font-extrabold text-gray-900 pl-1 flex items-center gap-2">
                            Current Cart
                            <span className="bg-primary-100 text-brand text-[10px] px-2 py-0.5 rounded-full">{cart.length} items</span>
                        </h3>
                        <button onClick={clearCart} className="text-[10px] font-bold text-red-500 uppercase tracking-wider pr-1 active:scale-95">Clear All</button>
                    </div>

                    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex-1 overflow-y-auto overflow-hidden divide-y divide-gray-50 flex flex-col">
                        {cart.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                <ShoppingCart className="w-10 h-10 mb-2 opacity-30 mx-auto" strokeWidth={1.5} />
                                <p className="font-bold text-sm">Cart is empty</p>
                                <p className="text-xs">Scan a barcode to add products</p>
                            </div>
                        ) : cart.map((item, idx) => (
                            <div key={item.barcode || idx} className="p-4 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl shrink-0 bg-primary-50 flex items-center justify-center border border-primary-100">
                                    <Box className="w-6 h-6 text-brand" />
                                </div>
                                <div className="flex-1 min-w-0 pr-2">
                                    <h4 className="font-bold text-sm text-gray-900 truncate">{item.name}</h4>
                                    <p className="text-[10px] text-gray-400 font-medium">Unit Price: ₹{item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <span className="font-extrabold text-sm text-gray-900">₹{(item.price * item.qty).toFixed(2)}</span>
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1 border border-gray-100">
                                        <button
                                            onClick={() => item.qty === 1 ? removeFromCart(item.barcode) : updateQuantity(item.barcode, -1)}
                                            className="text-gray-400 hover:text-gray-600 p-0.5 active:scale-95"
                                        >
                                            {item.qty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                                        </button>
                                        <span className="text-xs font-bold text-gray-900 min-w-[12px] text-center">{item.qty}</span>
                                        <button
                                            onClick={() => updateQuantity(item.barcode, 1)}
                                            className="text-brand font-bold bg-white rounded-full p-0.5 shadow-sm active:scale-95"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <SelectProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSelect={(product) => scanProduct(product.barcode || product.name)}
                />

                <BarcodeScannerModal
                    isOpen={isScannerOpen}
                    onClose={() => setIsScannerOpen(false)}
                    onScan={(decodedText) => {
                        scanProduct(decodedText);
                    }}
                />

                {/* Persistent Bottom Checkout Summary */}
                <div className="bg-white p-5 rounded-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border border-gray-100 fixed bottom-[100px] left-4 right-4 z-40">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                        <span className="text-sm font-extrabold text-gray-900">₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-4">
                        <span className="text-base font-extrabold text-gray-900">Total Amount</span>
                        <span className="text-3xl font-extrabold text-brand tracking-tight">₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.print()}
                            disabled={cart.length === 0}
                            className="p-4 rounded-2xl border border-gray-200 text-brand bg-primary-50 flex items-center justify-center shrink-0 active:scale-95 disabled:opacity-50"
                        >
                            <Printer className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleGenerateBill}
                            disabled={cart.length === 0 || isLoading}
                            className="flex-1 bg-brand text-white font-bold text-lg py-4 rounded-2xl shadow-[0_8px_20px_rgba(0,209,46,0.2)] hover:shadow-[0_8px_25px_rgba(0,209,46,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:shadow-none"
                        >
                            {isLoading ? 'Processing...' : 'Generate Bill'} <Receipt className="w-5 h-5 ml-1" />
                        </button>
                    </div>
                    <button
                        onClick={handleShareWhatsApp}
                        disabled={cart.length === 0}
                        className="w-full text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-4 flex items-center justify-center gap-1 hover:text-green-500 transition-colors disabled:opacity-50"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
                        Share via WhatsApp
                    </button>
                </div>

            </div>

            {/* WhatsApp Phone Modal */}
            {isPhoneModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm p-4 pb-8 sm:items-center print:hidden">
                    <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden flex flex-col pt-2">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-2 mb-4"></div>
                        <div className="px-6 pb-2">
                            <h3 className="font-extrabold text-xl text-gray-900 mb-1">WhatsApp Receipt</h3>
                            <p className="text-sm font-medium text-gray-500 leading-snug">Enter customer's WhatsApp number.</p>
                        </div>

                        <div className="p-6 pt-4">
                            <form onSubmit={handleConfirmWhatsAppShare} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="e.g. +91 9876543210"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-[#00C853] focus:border-[#00C853] focus:outline-none transition-all font-bold text-gray-900 placeholder-gray-400"
                                            required
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 font-medium">Include country code (e.g. +91) for best results.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsPhoneModalOpen(false)}
                                        className="py-3.5 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl active:scale-95 transition-transform"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!customerPhone}
                                        className="py-3.5 px-4 bg-[#00C853] text-white font-extrabold rounded-xl shadow-[0_4px_14px_rgba(0,200,83,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                                    >
                                        Send
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Only Receipt Layout */}
            <div className="hidden print:block font-mono text-black p-4 text-xs">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold">APNI DUKAAN</h1>
                    <p>Tax Invoice / Bill of Supply</p>
                    <p>Date: {new Date().toLocaleString()}</p>
                </div>

                <table className="w-full mb-6">
                    <thead>
                        <tr className="border-b border-black font-bold text-left">
                            <th className="py-2">Item</th>
                            <th className="py-2 text-right">Qty</th>
                            <th className="py-2 text-right">Price</th>
                            <th className="py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-200 border-dashed">
                                <td className="py-2">{item.name}</td>
                                <td className="py-2 text-right">{item.qty}</td>
                                <td className="py-2 text-right">{(item.price).toFixed(2)}</td>
                                <td className="py-2 text-right">{(item.price * item.qty).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-right font-bold text-base mb-8">
                    <p>Total Amount: ₹{totalAmount.toFixed(2)}</p>
                </div>

                <div className="text-center">
                    <p>Thank you for shopping with us!</p>
                    <p>Visit Again</p>
                    <p className="mt-4 text-[10px] text-gray-500">System Generated Receipt</p>
                </div>
            </div>
        </>
    );
};

export default Billing;
