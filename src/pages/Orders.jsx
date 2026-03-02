import React, { useState } from 'react';
import { Search, Plus, Minus, RotateCcw, MessageCircle, ArrowLeft, ScanLine, Box, Tag, ShoppingCart, Lock, Unlock, Users, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

import useOrderStore from '../store/orderStore';
import SelectProductModal from '../components/SelectProductModal';
import BarcodeScannerModal from '../components/BarcodeScannerModal';

const Orders = () => {
    const {
        orderItems,
        lastOrder,
        addOrderItem,
        removeOrderItem,
        updateOrderQuantity,
        clearOrder,
        scanProductForOrder,
        sendWhatsAppOrder,
        fetchLastOrder,
        isLoading,
        error
    } = useOrderStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    // New Feature States
    const [isCustomizationMode, setIsCustomizationMode] = useState(true);
    const [isDistributorModalOpen, setIsDistributorModalOpen] = useState(false);
    const [selectedDistributor, setSelectedDistributor] = useState({ name: '', phone: '' });

    // Load last order details on mount
    React.useEffect(() => {
        fetchLastOrder();

        // Load saved distributor info if exists
        const savedDist = localStorage.getItem('lastDistributor');
        if (savedDist) {
            try {
                setSelectedDistributor(JSON.parse(savedDist));
            } catch (e) { }
        }
    }, [fetchLastOrder]);

    const handleLoadLastOrder = () => {
        if (!lastOrder || !lastOrder.order_details) return;

        clearOrder();
        // The store currently adds items one by one via scanProduct, 
        // but since we want to blast them all in, we can update the store state directly 
        // or simulate adding them. Since Zustand allows direct mutation via set in external scripts,
        // let's do a bulk add (we'll just use useOrderStore.setState).
        useOrderStore.setState({ orderItems: lastOrder.order_details.map(item => ({ ...item, price: item.price || 0 })) });
        setIsCustomizationMode(false); // Default to locked mode when loading previous
    };

    const handleConfirmDistributor = async (e) => {
        e.preventDefault();
        if (!selectedDistributor.phone) return;

        // Save for next time
        localStorage.setItem('lastDistributor', JSON.stringify(selectedDistributor));

        setIsDistributorModalOpen(false);
        await sendWhatsAppOrder(selectedDistributor.phone);
    };

    const totalCases = orderItems.reduce((acc, i) => acc + i.qty, 0);
    const estimatedTotal = orderItems.reduce((acc, i) => acc + (i.price * i.qty), 0);

    const handleSearch = async (e) => {
        if (e.key === 'Enter' && searchTerm) {
            await scanProductForOrder(searchTerm);
            setSearchTerm('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans px-4 pt-10 pb-6">

            {/* Header section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Link to="/dashboard" className="p-1 -ml-1">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </Link>
                    <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Distributor Order</h1>
                </div>
                <button
                    onClick={clearOrder}
                    disabled={!isCustomizationMode || orderItems.length === 0}
                    className={`text-xs font-bold uppercase tracking-wider pr-1 transition-opacity ${!isCustomizationMode || orderItems.length === 0 ? 'text-gray-300' : 'text-brand active:scale-95'}`}
                >
                    Clear
                </button>
            </div>

            {/* Barcode Search / Scan Bar */}
            <div className={`relative mb-4 transition-opacity ${!isCustomizationMode ? 'opacity-50 pointer-events-none' : ''}`}>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                    disabled={isLoading}
                    placeholder="Search product or scan..."
                    className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl py-3.5 pl-12 pr-12 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition font-medium text-[15px] placeholder-gray-400 text-gray-900 disabled:opacity-50"
                />
                <button
                    onClick={() => setIsScannerOpen(true)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand active:scale-95"
                >
                    <ScanLine className="w-6 h-6 opacity-80" />
                </button>
            </div>

            {error && <div className="text-red-500 text-sm font-bold text-center mb-4 bg-red-50 p-2 rounded-xl border border-red-100">{error}</div>}

            {/* Hero Action: Repeat Last Order */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-3xl mb-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2.5 rounded-full text-blue-600 shrink-0">
                        <RotateCcw className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 pr-2">
                        <h4 className="text-sm font-extrabold text-blue-900 truncate">Repeat Last Order</h4>
                        {lastOrder ? (
                            <p className="text-[10px] font-bold text-blue-600/70 mt-0.5 truncate">
                                {new Date(lastOrder.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} • {lastOrder.order_details?.length || 0} Items
                            </p>
                        ) : (
                            <p className="text-[10px] font-medium text-blue-600/70 mt-0.5">No previous orders found</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleLoadLastOrder}
                    disabled={!lastOrder}
                    className="shrink-0 bg-blue-600 text-white font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl shadow-sm shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:shadow-none"
                >
                    Load
                </button>
            </div>

            <div className="flex justify-between items-center mb-6 px-1">
                <span className="text-xs font-bold text-gray-500 tracking-wide flex items-center gap-1.5">
                    Quick Customization Mode
                    {isCustomizationMode ? <Unlock className="w-3.5 h-3.5 text-brand" /> : <Lock className="w-3.5 h-3.5 text-gray-400" />}
                </span>
                <div
                    onClick={() => setIsCustomizationMode(!isCustomizationMode)}
                    className={`w-12 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300 flex items-center ${isCustomizationMode ? 'bg-brand' : 'bg-gray-300'}`}
                >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm mx-0.5 absolute transition-transform duration-300 ${isCustomizationMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
            </div>

            {/* Scrollable order list */}
            <div className="flex-1 overflow-y-auto mb-40">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="font-extrabold text-gray-900">Current Order List</h3>
                    <span className="bg-primary-100 text-brand text-[10px] font-bold px-2.5 py-1 rounded-full">{orderItems.length} items</span>
                </div>

                <div className="space-y-4">
                    {orderItems.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-[24px] bg-white">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Box className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-sm font-bold text-gray-500">No items selected</p>
                            <p className="text-xs text-gray-400 mt-1">Search or scan items above</p>
                        </div>
                    ) : orderItems.map((item, idx) => (
                        <div key={item.barcode || idx} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-3.5 flex items-center gap-3 relative">
                            <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center p-2 shrink-0 border border-primary-100">
                                <Tag className="w-6 h-6 text-brand" />
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                                <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1 truncate">{item.name}</h4>
                                <p className="text-[10px] font-bold text-gray-500 tracking-wide">₹{item.price?.toFixed(2)} / case</p>
                                <p className="text-[10px] font-bold text-brand uppercase tracking-widest mt-0.5">In Stock: {item.stock || 'N/A'}</p>
                            </div>
                            <div className={`flex items-center gap-3 shrink-0 transition-opacity ${!isCustomizationMode ? 'opacity-50 pointer-events-none' : ''}`}>
                                <button
                                    onClick={() => item.qty === 1 ? removeOrderItem(item.barcode) : updateOrderQuantity(item.barcode, -1)}
                                    className="w-7 h-7 bg-gray-50 rounded-full border border-gray-200 text-gray-400 flex items-center justify-center shadow-sm active:scale-95"
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-sm font-extrabold text-gray-900 min-w-[20px] text-center">{item.qty}</span>
                                <button
                                    onClick={() => updateOrderQuantity(item.barcode, 1)}
                                    className="w-7 h-7 bg-brand rounded-full text-white flex items-center justify-center shadow-sm shadow-brand/30 active:scale-95"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={!isCustomizationMode}
                    className={`w-full border-2 border-dashed border-primary-200 bg-primary-50/50 text-brand font-bold py-4 rounded-3xl flex items-center justify-center gap-2 text-sm mt-6 transition-all ${!isCustomizationMode ? 'opacity-50 pointer-events-none' : 'hover:bg-primary-50 active:scale-95'}`}
                >
                    <Plus className="w-4 h-4" /> Add Item from Inventory
                </button>
            </div>

            <SelectProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={(product) => scanProductForOrder(product.barcode || product.name)}
            />

            <BarcodeScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={(decodedText) => {
                    scanProductForOrder(decodedText);
                }}
            />

            {/* Persistent Bottom Order Summary */}
            <div className="bg-white p-5 rounded-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border border-gray-100 fixed bottom-[100px] left-4 right-4 z-40">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-500 tracking-wide">Total Items</span>
                    <span className="text-sm font-extrabold text-gray-900">{totalCases} cases</span>
                </div>
                <div className="flex justify-between items-end mb-5 border-b border-gray-100 pb-5">
                    <span className="text-sm font-bold text-gray-500 tracking-wide">Estimated Total</span>
                    <span className="text-2xl font-extrabold text-gray-900">₹{estimatedTotal.toFixed(2)}</span>
                </div>

                {/* Deep Green Action Button */}
                <button
                    onClick={() => setIsDistributorModalOpen(true)}
                    disabled={orderItems.length === 0}
                    className="w-full bg-[#00C853] text-white font-extrabold text-base py-4 rounded-2xl shadow-[0_8px_20px_rgba(0,200,83,0.3)] hover:shadow-[0_8px_25px_rgba(0,200,83,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:shadow-none"
                >
                    <MessageCircle className="w-5 h-5 fill-current" /> Send Order to WhatsApp
                </button>

                {/* Floating Notification stub matching design */}
                <div className="absolute -top-6 right-8 w-12 h-12 bg-white rounded-full shadow-lg border-2 border-brand flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-brand" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
                </div>
            </div>

            {/* Distributor Selection Modal */}
            {isDistributorModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm p-4 pb-8 sm:items-center">
                    <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden flex flex-col pt-2">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-2 mb-4"></div>
                        <div className="px-6 pb-2">
                            <h3 className="font-extrabold text-xl text-gray-900 mb-1">Select Distributor</h3>
                            <p className="text-sm font-medium text-gray-500 leading-snug">Who are you sending this order to?</p>
                        </div>

                        <div className="p-6 pt-4">
                            <form onSubmit={handleConfirmDistributor} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Distributor Name</label>
                                    <div className="relative">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={selectedDistributor.name}
                                            onChange={(e) => setSelectedDistributor({ ...selectedDistributor, name: e.target.value })}
                                            placeholder="e.g. Sharma Traders"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-[#00C853] focus:border-[#00C853] focus:outline-none transition-all font-bold text-gray-900 placeholder-gray-400"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={selectedDistributor.phone}
                                            onChange={(e) => setSelectedDistributor({ ...selectedDistributor, phone: e.target.value })}
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
                                        onClick={() => setIsDistributorModalOpen(false)}
                                        className="py-3.5 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl active:scale-95 transition-transform"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !selectedDistributor.phone}
                                        className="py-3.5 px-4 bg-[#00C853] text-white font-extrabold rounded-xl shadow-[0_4px_14px_rgba(0,200,83,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                                    >
                                        {isLoading ? 'Sending...' : 'Send WhatsApp'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Orders;
