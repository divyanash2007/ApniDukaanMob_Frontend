import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Mail, Eye, EyeOff, User, ArrowLeft } from 'lucide-react';
import useAuthStore from '../store/authStore';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [shopName, setShopName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { register, isLoading } = useAuthStore();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register({
                username: shopName, // Map shopName to username in backend
                business_email: email,
                password: password
            });
            // Auto redirect to login upon success
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Left Side: Image Banner (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-brand">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1080&q=80")' }}
                ></div>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

                <div className="relative z-10 flex flex-col justify-between p-16 text-white w-full">
                    <div>
                        <div className="flex items-center gap-2 mb-10">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                                <Store className="w-8 h-8 text-white" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight">ShopManager</span>
                        </div>
                        <h2 className="text-4xl font-extrabold mb-6 leading-tight">
                            Start growing your business today.
                        </h2>
                        <p className="text-xl text-gray-200 font-medium max-w-md leading-relaxed">
                            Join thousands of modern shopkeepers saving time and increasing profits with our tools.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 bg-white relative">
                <Link to="/" className="absolute top-8 left-6 sm:left-12 lg:left-24 text-gray-500 hover:text-gray-900 transition flex items-center gap-2 font-medium">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Home</span>
                </Link>

                <div className="w-full max-w-md mx-auto mt-12 lg:mt-0">
                    <div className="text-center lg:text-left mb-10">
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                            <div className="bg-primary-50 p-2 rounded-xl">
                                <Store className="w-8 h-8 text-brand" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-gray-900">ShopManager</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Create an account</h1>
                        <p className="text-gray-500 font-medium text-lg">Set up your shop profile to get started.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50/50 text-red-600 border border-red-100 rounded-2xl text-sm font-medium flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignUp} className="space-y-5">
                        <div className="space-y-2.5">
                            <label className="text-sm font-bold text-gray-700 block">Shop Name</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={shopName}
                                    onChange={(e) => setShopName(e.target.value)}
                                    placeholder="Green Valley Grocers"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all placeholder-gray-400 font-medium text-gray-900 pr-12 group-hover:border-gray-300"
                                    required
                                />
                                <Store className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-focus-within:text-brand transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-sm font-bold text-gray-700 block">Your Name</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Alex M."
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all placeholder-gray-400 font-medium text-gray-900 pr-12 group-hover:border-gray-300"
                                    required
                                />
                                <User className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-focus-within:text-brand transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-sm font-bold text-gray-700 block">Email Address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="shopkeeper@example.com"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all placeholder-gray-400 font-medium text-gray-900 pr-12 group-hover:border-gray-300"
                                    required
                                />
                                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-focus-within:text-brand transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-sm font-bold text-gray-700 block">Password</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a strong password"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all placeholder-gray-400 font-medium text-gray-900 pr-12 group-hover:border-gray-300"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-brand/25 hover:shadow-brand/40 hover:-translate-y-0.5 transition-all mt-8 active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0 relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : 'Create Account'}
                            </span>
                        </button>
                    </form>

                    <p className="mt-10 text-center text-gray-600 font-medium text-lg">
                        Already have an account? <Link to="/login" className="text-brand font-bold hover:text-primary-700 ml-1 transition-colors">Log In here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
