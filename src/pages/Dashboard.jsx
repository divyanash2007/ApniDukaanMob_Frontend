import React, { useState, useEffect } from 'react';
import { Bell, CreditCard, PackagePlus, Receipt, TrendingUp, AlertTriangle, ArrowRight, UserCircle2, ShoppingCart, PackageCheck, X, FileText, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../lib/axios';

const Dashboard = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [selectedSale, setSelectedSale] = useState(null);
    const [stats, setStats] = useState({
        total_products: 0,
        low_stock_products: 0,
        total_sales: 0,
        todays_sales: 0,
        monthly_sales: 0,
        total_stock_value: 0,
        recent_sales: []
    });
    const [pendingOrder, setPendingOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/stats/');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchPendingOrder = async () => {
            try {
                const response = await api.get('/distributor_orders/pending');
                setPendingOrder(response.data);
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    console.error("Failed to fetch pending order", error);
                }
            }
        };

        fetchStats();
        fetchPendingOrder();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const downloadReport = async () => {
        try {
            const response = await api.get('/stats/download-report', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sales_report.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Failed to download report", error);
            alert("Failed to download report. Please try again.");
        }
    };

    const handleResendWhatsApp = (sale) => {
        let message = `*Receipt from ${user?.sub || 'Shop'}*\n`;
        message += `Order #${sale.id}\n`;
        message += `Date: ${new Date(sale.time).toLocaleString()}\n\n`;

        message += `*Items:*\n`;
        if (sale.cart_details && sale.cart_details.length > 0) {
            sale.cart_details.forEach(item => {
                message += `- ${item.name} x${item.qty} (₹${item.price}/ea)\n`;
            });
        }

        message += `\n*Total Amount: ₹${sale.amount.toFixed(2)}*\n\n`;
        message += `Thank you for shopping with us!`;

        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleMarkDelivered = async () => {
        if (!pendingOrder) return;
        try {
            await api.put(`/distributor_orders/${pendingOrder.id}/deliver`);
            setPendingOrder(null);

            // Re-fetch stats to get updated stock value
            const response = await api.get('/stats/');
            setStats(response.data);
        } catch (error) {
            console.error("Failed to mark order as delivered", error);
            alert("Failed to mark order as delivered. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans px-4 pt-10 pb-6">

            {/* Header section with Shop Profile */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center p-1 border-2 border-brand overflow-hidden cursor-pointer"
                        title="Logout"
                        onClick={handleLogout}
                    >
                        {/* Profile stub */}
                        <UserCircle2 className="w-full h-full text-brand" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold mb-0.5">Welcome back,</p>
                        <h1 className="text-lg font-extrabold text-gray-900 leading-none">{user?.sub || 'Shopkeeper'}</h1>
                    </div>
                </div>
                <button className="bg-white p-2 rounded-full border border-gray-100 shadow-sm relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {stats.low_stock_products > 0 && (
                        <span className="w-2.5 h-2.5 bg-red-500 absolute top-1.5 right-2 rounded-full border-2 border-white"></span>
                    )}
                </button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Today's Sales Card */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-primary-50 p-2.5 rounded-xl">
                            <CreditCard className="w-5 h-5 text-brand" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight truncate">
                            {loading ? '...' : `₹${stats.todays_sales.toFixed(0)}`}
                        </h2>
                        <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Today's Sales</p>
                    </div>
                </div>

                {/* Monthly Sales Card */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-50 p-2.5 rounded-xl">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight truncate">
                            {loading ? '...' : `₹${stats.monthly_sales.toFixed(0)}`}
                        </h2>
                        <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Monthly Sales</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Stock Value Card */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-purple-50 p-2.5 rounded-xl">
                            <PackageCheck className="w-5 h-5 text-purple-500" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight truncate">
                            {loading ? '...' : `₹${stats.total_stock_value.toFixed(0)}`}
                        </h2>
                        <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Stock Value</p>
                    </div>
                </div>

                {/* Low Stock Card */}
                <Link to="/inventory" className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-orange-50 p-2.5 rounded-xl">
                            <PackagePlus className="w-5 h-5 text-orange-500" />
                        </div>
                        {stats.low_stock_products > 0 && (
                            <span className="bg-red-50 text-red-500 text-xs font-bold px-2 py-1 rounded-full">Action</span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            {loading ? '...' : stats.low_stock_products}
                        </h2>
                        <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Low Stock</p>
                    </div>
                </Link>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h3 className="font-extrabold text-gray-900 mb-4 tracking-tight">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/billing" className="bg-gradient-to-br from-brand to-[#00A123] p-5 rounded-3xl text-white shadow-lg shadow-brand/30 flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 transform group-hover:scale-110 transition-transform hidden"></div>
                        <Receipt className="w-8 h-8 mb-6 z-10" />
                        <div className="z-10 mt-auto">
                            <h4 className="font-extrabold text-lg leading-tight mb-0.5">New Bill</h4>
                            <p className="text-xs text-white/80 font-medium">Create invoice</p>
                        </div>
                    </Link>

                    <Link to="/orders" className="bg-gray-900 p-5 rounded-3xl shadow-lg relative overflow-hidden flex flex-col group text-white">
                        <div className="absolute right-[-10px] top-[-10px] opacity-20 transform rotate-12 group-hover:rotate-6 transition-transform">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
                        </div>

                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6 z-10 backdrop-blur-sm">
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <div className="z-10 mt-auto">
                            <h4 className="font-extrabold text-lg leading-tight mb-0.5">Stock Order</h4>
                            <p className="text-xs text-gray-400 font-medium">Restock items</p>
                        </div>
                    </Link>

                    <button onClick={downloadReport} className="col-span-2 bg-white p-5 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col text-left group">
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-6 z-10">
                            <TrendingUp className="w-5 h-5 text-brand" />
                        </div>
                        <div className="z-10 mt-auto">
                            <h4 className="font-extrabold text-gray-900 text-lg leading-tight mb-0.5">Detailed Report</h4>
                            <p className="text-xs text-gray-500 font-medium">Download CSV analysis</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-extrabold text-gray-900 tracking-tight">Recent Sales</h3>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center text-sm font-bold text-gray-400">Loading...</div>
                    ) : stats.recent_sales.length === 0 ? (
                        <div className="text-center text-sm font-bold text-gray-400 p-4 border border-dashed rounded-3xl">No recent sales</div>
                    ) : (
                        stats.recent_sales.map(sale => (
                            <button
                                key={sale.id}
                                onClick={() => setSelectedSale(sale)}
                                className="w-full text-left bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:bg-gray-50 transition"
                            >
                                <div className="bg-blue-50 p-3 rounded-2xl w-12 h-12 flex items-center justify-center shrink-0">
                                    <Receipt className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm truncate">Order #{sale.id}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                        {new Date(sale.time).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-extrabold text-gray-900">₹{sale.amount.toFixed(2)}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Pending Distributor Order Widget */}
            {pendingOrder && (
                <div className="mt-8 bg-blue-50 p-5 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-5 rounded-full -mr-6 -mt-6"></div>

                    <div className="flex items-center gap-3 mb-4 shrink-0">
                        <div className="bg-white p-2.5 rounded-xl shadow-sm">
                            <PackageCheck className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h4 className="font-extrabold text-blue-900 tracking-tight leading-none">Incoming Stock</h4>
                            <p className="text-[11px] font-bold text-blue-400 mt-1 uppercase tracking-wider">Ordered {new Date(pendingOrder.timestamp).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="bg-white/60 p-3 rounded-2xl mb-4 text-sm font-medium text-blue-900 flex flex-wrap gap-2">
                        {pendingOrder.order_details.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-blue-50">
                                {item.name} <span className="text-blue-400 ml-1">x{item.qty}</span>
                            </span>
                        ))}
                        {pendingOrder.order_details.length > 3 && (
                            <span className="bg-white px-2.5 py-1 rounded-lg shadow-sm border border-blue-50 text-blue-400">
                                +{pendingOrder.order_details.length - 3} more
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleMarkDelivered}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm shadow-blue-600/20 active:scale-[0.98]"
                    >
                        Mark as Delivered & Update Stock
                    </button>
                </div>
            )}

            {/* Recent Sale Details Modal */}
            {selectedSale && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-gray-500" />
                                Order #{selectedSale.id} Details
                            </h3>
                            <button
                                onClick={() => setSelectedSale(null)}
                                className="p-2 bg-white rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="mb-6">
                                <p className="text-sm font-bold text-gray-500 mb-1">Date & Time</p>
                                <p className="text-gray-900 font-medium">{new Date(selectedSale.time).toLocaleString()}</p>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm font-bold text-gray-500 mb-3 block">Items Purchased</p>
                                <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    {selectedSale.cart_details && selectedSale.cart_details.length > 0 ? (
                                        selectedSale.cart_details.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center text-sm">
                                                <div className="font-medium text-gray-900">
                                                    {item.name} <span className="text-gray-500 ml-1">x{item.qty}</span>
                                                </div>
                                                <div className="font-bold text-gray-900">₹{(item.price * item.qty).toFixed(2)}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No item details available.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 bg-white">
                                <span className="font-bold text-gray-500">Total Amount</span>
                                <span className="text-2xl font-extrabold text-brand">₹{selectedSale.amount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 grid grid-cols-2 gap-3 sticky bottom-0">
                            <button
                                onClick={() => setSelectedSale(null)}
                                className="py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => handleResendWhatsApp(selectedSale)}
                                className="py-3 px-4 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#20BE5A] transition flex items-center justify-center gap-2 shadow-sm shadow-[#25D366]/30"
                            >
                                <Send className="w-4 h-4" />
                                Send Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="h-24"></div> {/* Bottom nav spacing */}

        </div>
    );
};

export default Dashboard;
