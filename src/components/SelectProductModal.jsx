import React, { useState, useEffect } from 'react';
import { Search, X, Box, Plus } from 'lucide-react';
import useProductStore from '../store/productStore';

const SelectProductModal = ({ isOpen, onClose, onSelect, sortByStock = false }) => {
    const { products, fetchProducts, isLoading } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen, fetchProducts]);

    if (!isOpen) return null;

    let filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortByStock) {
        filteredProducts = filteredProducts.sort((a, b) => a.stock - b.stock);
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-md h-[80vh] sm:h-[600px] rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-slide-up sm:animate-fade-in relative">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white z-10 sticky top-0">
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Select Product</h3>
                    <button
                        onClick={onClose}
                        className="bg-gray-100 text-gray-500 p-2 rounded-full hover:bg-gray-200 transition-colors active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand w-5 h-5 pointer-events-none" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or barcode..."
                            className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition font-medium text-[15px]"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Product List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
                    {isLoading ? (
                        <div className="text-center py-10 text-gray-400 font-bold">Loading products...</div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 border border-dashed rounded-3xl border-gray-300">
                            <Box className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm font-bold text-gray-500">No products found</p>
                            <p className="text-xs text-gray-400 mt-1">Try a different search term.</p>
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => {
                                    onSelect(product);
                                    onClose();
                                }}
                                className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-brand/40 active:bg-primary-50 transition-all group"
                            >
                                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0 border border-primary-100">
                                    <Box className="w-6 h-6 text-brand/60" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-[14px] truncate mb-0.5 group-hover:text-brand transition-colors">{product.name}</h4>
                                    <div className="flex justify-between items-center">
                                        <span className="font-extrabold text-gray-800 text-sm">₹{product.price.toFixed(2)}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock: {product.stock}</span>
                                    </div>
                                </div>
                                <button className="w-8 h-8 rounded-full bg-primary-50 text-brand flex items-center justify-center ml-2 shadow-sm shrink-0 group-hover:bg-brand group-hover:text-white transition-colors">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default SelectProductModal;
