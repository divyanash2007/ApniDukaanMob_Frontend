import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Box, Plus, CheckCircle2, Circle, Check } from 'lucide-react';
import useProductStore from '../store/productStore';

const SelectProductModal = ({ isOpen, onClose, onSelect, onSelectMultiple, sortByStock = false }) => {
    const { products, fetchProducts, isLoading } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');

    // Multi-select State
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const longPressTimerRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
            setSearchTerm('');
            setIsSelectionMode(false);
            setSelectedItems(new Set());
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

    // --- Select Logic ---
    const startPress = (product) => {
        if (isSelectionMode) return;
        longPressTimerRef.current = setTimeout(() => {
            setIsSelectionMode(true);
            toggleSelection(product);
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        }, 500);
    };

    const clearPress = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    const toggleSelection = (product) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            // We use product.id to track in Set, but we need the full product to return later. 
            // So we'll store stringified full product or just store IDs and filter them out on submit.
            // Let's store IDs and find objects later to be clean.
            if (newSet.has(product.id)) {
                newSet.delete(product.id);
            } else {
                newSet.add(product.id);
            }
            if (newSet.size === 0) {
                setIsSelectionMode(false);
            }
            return newSet;
        });
    };

    const handleItemClick = (product, e) => {
        if (isSelectionMode) {
            e.preventDefault();
            e.stopPropagation();
            toggleSelection(product);
        } else {
            // Normal fallback if not in multiselect
            onSelect(product);
            onClose();
        }
    };

    const cancelSelection = () => {
        setIsSelectionMode(false);
        setSelectedItems(new Set());
    };

    const handleAddSelected = () => {
        if (selectedItems.size === 0) return;

        // Find all selected product objects
        const selectedProducts = products.filter(p => selectedItems.has(p.id));

        if (onSelectMultiple) {
            onSelectMultiple(selectedProducts);
        } else {
            // Fallback for older implementation if ever passing it normally (though updated everywhere)
            selectedProducts.forEach(p => onSelect(p));
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-md p-0 sm:p-4">
            <div className="glass w-full sm:max-w-md h-[80vh] sm:h-[600px] rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-slide-up sm:animate-fade-in relative border border-white/40">

                {/* Header */}
                <div className="px-6 py-5 border-b border-white/40 flex justify-between items-center bg-white/30 z-10 sticky top-0 transition-colors duration-200">
                    {isSelectionMode ? (
                        <div className="flex items-center gap-3 w-full">
                            <button onClick={cancelSelection} className="p-1 -ml-1 text-gray-500 hover:text-gray-900 transition outline-none">
                                <X className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-bold text-brand tracking-tight flex-1">
                                {selectedItems.size} Selected
                            </h1>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Select Product</h3>
                            <button
                                onClick={onClose}
                                className="bg-gray-100 text-gray-500 p-2 rounded-full hover:bg-gray-200 transition-colors active:scale-95"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>

                {/* Search Bar - hidden in selection mode for cleaner UI */}
                {!isSelectionMode && (
                    <div className="p-4 bg-white/20 border-b border-white/40">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand w-5 h-5 pointer-events-none" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name or barcode... (Long press to multiselect)"
                                className="w-full glass-input rounded-2xl py-3 pl-12 pr-4 text-[15px] placeholder-gray-500 font-bold"
                                autoFocus
                            />
                        </div>
                    </div>
                )}

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
                        filteredProducts.map((product) => {
                            const isSelected = selectedItems.has(product.id);

                            return (
                                <div
                                    key={product.id}
                                    onMouseDown={() => startPress(product)}
                                    onMouseUp={clearPress}
                                    onMouseLeave={clearPress}
                                    onTouchStart={() => startPress(product)}
                                    onTouchEnd={clearPress}
                                    onTouchCancel={clearPress}
                                    onClick={(e) => handleItemClick(product, e)}
                                    className={`p-3 rounded-2xl flex items-center gap-4 cursor-pointer transition-all group ${isSelected ? 'bg-brand/20 border border-brand' : 'glass-panel hover:border-brand/40 active:bg-white/40'}`}
                                >
                                    {isSelectionMode && (
                                        <div className="shrink-0 -mr-2">
                                            {isSelected ? (
                                                <CheckCircle2 className="w-6 h-6 text-brand" fill="currentColor" strokeWidth={1} />
                                            ) : (
                                                <Circle className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
                                            )}
                                        </div>
                                    )}

                                    <div className="w-12 h-12 bg-white/40 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 border border-white/50 pointer-events-none">
                                        <Box className="w-6 h-6 text-brand/80" />
                                    </div>

                                    <div className="flex-1 min-w-0 pointer-events-none">
                                        <h4 className={`font-bold text-[14px] truncate mb-0.5 transition-colors ${isSelected ? 'text-brand' : 'text-gray-900 group-hover:text-brand'}`}>{product.name}</h4>
                                        <div className="flex justify-between items-center">
                                            <span className="font-extrabold text-gray-800 text-sm">₹{product.price.toFixed(2)}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock: {product.stock}</span>
                                        </div>
                                    </div>

                                    {!isSelectionMode && (
                                        <button className="w-8 h-8 rounded-full bg-primary-50 text-brand flex items-center justify-center ml-2 shadow-sm shrink-0 group-hover:bg-brand group-hover:text-white transition-colors">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Sticky Selection Action Bar */}
                {isSelectionMode && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/40 glass-nav animate-slide-up z-20">
                        <button
                            onClick={handleAddSelected}
                            className="w-full bg-brand text-white font-bold py-3.5 rounded-2xl shadow-[0_8px_20px_rgba(0,209,46,0.3)] hover:shadow-[0_8px_25px_rgba(0,209,46,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <Check className="w-5 h-5" /> Add {selectedItems.size} Items
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SelectProductModal;

