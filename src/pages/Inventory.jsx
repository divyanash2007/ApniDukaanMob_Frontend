import React, { useEffect, useRef, useState } from 'react';
import { Search, ChevronDown, Plus, Edit2, Upload, Box, ArrowLeft, X, Save, ArrowUpDown, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useProductStore from '../store/productStore';
import BarcodeScannerModal from '../components/BarcodeScannerModal';

const Inventory = () => {
    const { products, isLoading, fetchProducts, uploadBulkCSV, updateProduct, addProduct, deleteProduct } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);

    // Edit Product State
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Add Product State
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', mrp: '', buying_price: '', stock: '', barcode: '' });
    const [isAdding, setIsAdding] = useState(false);

    // Scanner state
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [scanTarget, setScanTarget] = useState(null); // 'search' or 'add'

    // Sorting State
    const [sortBy, setSortBy] = useState('name'); // 'name', 'stock', 'price', 'mrp'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Filtering State
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);

    // Multi-select State
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [isDeletingBulk, setIsDeletingBulk] = useState(false);
    const longPressTimerRef = useRef(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Handle External App Scan Return and Query Filters
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('scanned_barcode');
        const filterStr = params.get('filter');

        if (code) {
            setSearchTerm(code);
        }
        if (filterStr === 'low_stock') {
            setShowLowStockOnly(true);
        }

        if (code || filterStr) {
            // Remove the param without full reload
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            await uploadBulkCSV(file);
            toast.success('Upload successful');
        } catch (error) {
            // Handled by global axios interceptor
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset
        }
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        if (!editingProduct) return;

        setIsSaving(true);
        try {
            await updateProduct(editingProduct.id, {
                barcode: editingProduct.barcode,
                name: editingProduct.name,
                price: parseFloat(editingProduct.price) || 0,
                buying_price: parseFloat(editingProduct.buying_price) || 0,
                mrp: parseFloat(editingProduct.mrp) || 0,
                stock: parseInt(editingProduct.stock) || 0,
            });
            setEditingProduct(null);
        } catch (error) {
            console.error("Failed to update product:", error);
            // Error toast handled globally
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddSave = async (e) => {
        e.preventDefault();

        setIsAdding(true);
        try {
            await addProduct({
                barcode: newProduct.barcode,
                name: newProduct.name,
                price: parseFloat(newProduct.price) || 0,
                buying_price: parseFloat(newProduct.buying_price) || 0,
                mrp: parseFloat(newProduct.mrp) || 0,
                stock: parseInt(newProduct.stock) || 0,
            });
            setIsAddingProduct(false);
            setNewProduct({ name: '', price: '', mrp: '', buying_price: '', stock: '', barcode: '' });
        } catch (error) {
            console.error("Failed to add product:", error);
            // Error toast handled globally
        } finally {
            setIsAdding(false);
        }
    };

    const handleSortChange = (criteria) => {
        if (sortBy === criteria) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(criteria);
            setSortOrder('desc'); // Default to desc for new criteria except name
        }
        setIsSortOpen(false);
    };

    // --- Select & Delete Logic ---
    const startPress = (product) => {
        if (isSelectionMode) return;
        longPressTimerRef.current = setTimeout(() => {
            setIsSelectionMode(true);
            toggleSelection(product.id);
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50); // Small haptic feedback for long press
            }
        }, 500); // 500ms for long press
    };

    const clearPress = () => {
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    const toggleSelection = (productId) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            if (newSet.size === 0) {
                setIsSelectionMode(false); // Auto exit selection mode if nothing selected
            }
            return newSet;
        });
    };

    const handleItemClick = (product, e) => {
        if (isSelectionMode) {
            e.preventDefault();
            toggleSelection(product.id);
        }
        // If not in selection mode, normal click happens (e.g., nothing here since Edit is a button overlay)
    };

    const cancelSelection = () => {
        setIsSelectionMode(false);
        setSelectedItems(new Set());
    };

    const handleBulkDelete = async () => {
        if (selectedItems.size === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedItems.size} items?`)) return;

        setIsDeletingBulk(true);
        try {
            // Delete all selected items concurrently
            await Promise.all(Array.from(selectedItems).map(id => deleteProduct(id)));
            cancelSelection();
        } catch (error) {
            console.error("Failed to delete some items:", error);
            // Refresh explicitly just in case of partial success
            fetchProducts();
        } finally {
            setIsDeletingBulk(false);
        }
    };
    // ----------------------------

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.barcode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLowStock = showLowStockOnly ? p.stock < 5 : true;
        return matchesSearch && matchesLowStock;
    }).sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (sortBy === 'name') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans px-4 pt-10 pb-6 relative">

            {/* Header section */}
            {isSelectionMode ? (
                <div className="flex justify-between items-center mb-6 bg-brand/10 p-3 rounded-2xl border border-brand/20">
                    <div className="flex items-center gap-3">
                        <button onClick={cancelSelection} className="p-1 -ml-1 text-gray-500 hover:text-gray-900 transition">
                            <X className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold text-brand tracking-tight">
                            {selectedItems.size} Selected
                        </h1>
                    </div>
                    <button
                        onClick={handleBulkDelete}
                        disabled={isDeletingBulk}
                        className={`flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg shadow-sm text-sm font-bold active:scale-95 transition ${isDeletingBulk ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
                    >
                        {isDeletingBulk ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                        Delete
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <Link to="/dashboard" className="p-1 -ml-1">
                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                        </Link>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Inventory</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="file"
                            accept=".csv"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center gap-1 border border-gray-200 bg-white px-3 py-1.5 rounded-lg shadow-sm text-sm font-bold text-gray-700 active:scale-95 disabled:opacity-50"
                        >
                            {uploading ? <Box className="w-5 h-5 animate-pulse" /> : <Upload className="w-4 h-4" />}
                            {uploading ? '...' : 'CSV'}
                        </button>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand w-5 h-5 pointer-events-none" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products by name or barcode"
                    className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl py-3.5 pl-12 pr-12 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition font-medium text-[15px] placeholder-gray-400"
                />
                <button
                    onClick={() => {
                        setScanTarget('search');
                        setIsScannerOpen(true);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand/10 text-brand p-1.5 rounded-xl active:scale-95"
                >
                    <ArrowUpDown className="hidden" /> {/* Temp hidden unused import to prevent lint error */}
                    <Box className="w-5 h-5" />
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2 -mx-4 px-4 relative">
                <button
                    onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                    className={`flex items-center gap-1.5 whitespace-nowrap border px-4 py-2 rounded-full text-sm font-bold shadow-sm shrink-0 transition-colors ${showLowStockOnly ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white border-gray-200 text-gray-700'}`}
                >
                    Low Stock {showLowStockOnly ? <X className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                <div className="relative shrink-0">
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-1.5 whitespace-nowrap bg-brand border border-brand px-4 py-2 rounded-full text-sm font-bold text-white shadow-sm"
                    >
                        Sort By: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} {sortOrder === 'asc' ? '↑' : '↓'}
                        <ArrowUpDown className="w-4 h-4 ml-1 text-white/80" />
                    </button>

                    {isSortOpen && (
                        <div className="absolute top-12 left-0 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20">
                            {[
                                { key: 'name', label: 'Name (A-Z)' },
                                { key: 'stock', label: 'Quantity' },
                                { key: 'price', label: 'Selling Price' },
                                { key: 'mrp', label: 'MRP' }
                            ].map((option) => (
                                <button
                                    key={option.key}
                                    onClick={() => handleSortChange(option.key)}
                                    className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors ${sortBy === option.key ? 'text-brand bg-primary-50/50 block font-bold' : 'text-gray-700'}`}
                                >
                                    {option.label}
                                    {sortBy === option.key && (
                                        <span className="float-right">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Product List */}
            <div className="space-y-3 pb-20">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-400 font-bold">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-10 bg-white border border-dashed rounded-3xl border-gray-300">
                        <Box className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-gray-500">No products found</p>
                        <p className="text-xs text-gray-400 mt-1">Add items manually or via CSV.</p>
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
                                className={`p-3 rounded-2xl shadow-sm border flex items-center gap-4 relative transition-colors ${isSelected ? 'bg-brand/10 border-brand' : 'bg-white border-gray-100'} ${isSelectionMode ? 'cursor-pointer' : ''}`}
                            >
                                {/* Selection Checkbox (visible in selection mode) */}
                                {isSelectionMode && (
                                    <div className="shrink-0 -mr-2">
                                        {isSelected ? (
                                            <CheckCircle2 className="w-6 h-6 text-brand" fill="currentColor" strokeWidth={1} />
                                        ) : (
                                            <Circle className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
                                        )}
                                    </div>
                                )}

                                {/* Product Image Thumb */}
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center shrink-0 border border-primary-200 pointer-events-none">
                                    <Box className="w-8 h-8 text-brand/60" />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0 pr-8 pointer-events-none">
                                    <h3 className="font-bold text-gray-900 truncate text-[15px] mb-0.5">{product.name}</h3>
                                    <div className="flex items-baseline gap-1.5 mb-1.5">
                                        <span className="font-extrabold text-sm text-gray-800">₹{product.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider ${product.stock < 5 ? 'bg-orange-50 text-orange-600' : 'bg-primary-50 text-brand'}`}>
                                            {product.stock < 5 ? 'Low Stock' : 'Stock'}: {product.stock}
                                        </span>
                                        <span className="text-[10px] font-medium text-gray-400 uppercase">Code: {product.barcode}</span>
                                    </div>
                                </div>

                                {/* Edit Button - Hidden in selection mode to avoid misclicks */}
                                {!isSelectionMode && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingProduct({ ...product });
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-brand p-2 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            {/* Edit Product Modal */}
            {editingProduct && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                <Edit2 className="w-5 h-5 text-gray-500" />
                                Edit Product
                            </h3>
                            <button
                                onClick={() => setEditingProduct(null)}
                                className="p-2 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="editProductForm" onSubmit={handleEditSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand focus:outline-none transition-shadow font-medium"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Selling Price (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editingProduct.price}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand focus:outline-none transition-shadow font-medium"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Current Stock</label>
                                        <input
                                            type="number"
                                            value={editingProduct.stock}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand focus:outline-none transition-shadow font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Buying Price (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editingProduct.buying_price || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, buying_price: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand focus:outline-none transition-shadow font-medium placeholder-gray-400"
                                            placeholder="Optional"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">MRP (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editingProduct.mrp || ''}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, mrp: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand focus:outline-none transition-shadow font-medium placeholder-gray-400"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 flex justify-between">
                                        Barcode
                                        <span className="text-xs text-brand bg-primary-50 px-2 py-0.5 rounded uppercase">Unique</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={editingProduct.barcode}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, barcode: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-brand focus:outline-none transition-shadow font-medium text-gray-500 text-sm"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setScanTarget('edit');
                                                setIsScannerOpen(true);
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 text-brand p-1.5 rounded-lg active:scale-95"
                                        >
                                            <Box className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 grid grid-cols-2 gap-3 sticky bottom-0">
                            <button
                                onClick={() => setEditingProduct(null)}
                                type="button"
                                className="py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="editProductForm"
                                disabled={isSaving}
                                className={`py-3 px-4 bg-brand text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-brand/30 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand/90 active:scale-[0.98]'}`}
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {isAddingProduct && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-gray-500" />
                                Add New Product
                            </h3>
                            <button
                                onClick={() => setIsAddingProduct(false)}
                                className="p-2 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="addProductForm" onSubmit={handleAddSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand focus:outline-none transition-shadow font-medium"
                                        placeholder="e.g. Amul Butter 100g"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Selling Price (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand focus:outline-none transition-shadow font-medium"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Initial Stock</label>
                                        <input
                                            type="number"
                                            value={newProduct.stock}
                                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand focus:outline-none transition-shadow font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Buying Price (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={newProduct.buying_price}
                                            onChange={(e) => setNewProduct({ ...newProduct, buying_price: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand focus:outline-none transition-shadow font-medium placeholder-gray-400"
                                            placeholder="Optional"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">MRP (₹)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={newProduct.mrp}
                                            onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand focus:outline-none transition-shadow font-medium placeholder-gray-400"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 flex justify-between">
                                        Barcode
                                        <span className="text-xs text-brand bg-primary-50 px-2 py-0.5 rounded uppercase">Unique</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={newProduct.barcode}
                                            onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-brand focus:outline-none transition-shadow font-medium"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setScanTarget('add');
                                                setIsScannerOpen(true);
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 text-brand p-1.5 rounded-lg active:scale-95"
                                        >
                                            <Box className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 grid grid-cols-2 gap-3 sticky bottom-0">
                            <button
                                onClick={() => setIsAddingProduct(false)}
                                type="button"
                                className="py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="addProductForm"
                                disabled={isAdding}
                                className={`py-3 px-4 bg-brand text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-brand/30 ${isAdding ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand/90 active:scale-[0.98]'}`}
                            >
                                {isAdding ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Add Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Action Button for manual add */}
            <button
                onClick={() => setIsAddingProduct(true)}
                className="fixed bottom-24 right-5 w-14 h-14 bg-brand text-white rounded-full shadow-lg shadow-brand/40 flex items-center justify-center transform hover:scale-105 active:scale-95 transition-transform z-40"
            >
                <Plus className="w-7 h-7" />
            </button>

            <BarcodeScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={(decodedText) => {
                    if (scanTarget === 'search') {
                        setSearchTerm(decodedText);
                    } else if (scanTarget === 'add') {
                        setNewProduct({ ...newProduct, barcode: decodedText });
                    } else if (scanTarget === 'edit') {
                        setEditingProduct({ ...editingProduct, barcode: decodedText });
                    }
                }}
            />

        </div>
    );
};

export default Inventory;
