import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, loginWithGoogle, isLoading } = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please check credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex font-sans">
            {/* Left Side: Image Banner (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-brand">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1080&q=80")' }}
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
                            Your shop's command center.
                        </h2>
                        <p className="text-xl text-gray-200 font-medium max-w-md leading-relaxed">
                            Access your inventory, oversee billing, and manage your business from anywhere.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 bg-transparent relative z-10 backdrop-blur-md">
                <Link to="/" className="absolute top-8 left-6 sm:left-12 lg:left-24 text-gray-600 hover:text-gray-900 transition flex items-center gap-2 font-bold">
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
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome back</h1>
                        <p className="text-gray-500 font-medium text-lg">Enter your details to access your account.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50/50 text-red-600 border border-red-100 rounded-2xl text-sm font-medium flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2.5">
                            <label className="text-sm font-bold text-gray-700 block">Email Address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="shopkeeper@example.com"
                                    className="w-full px-5 py-4 glass-input rounded-2xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder-gray-500 font-bold text-gray-900 pr-12"
                                    required
                                />
                                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-focus-within:text-brand transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-700 block">Password</label>
                                <button type="button" className="text-sm font-bold text-brand hover:text-primary-700 transition-colors">Forgot password?</button>
                            </div>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 glass-input rounded-2xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder-gray-500 font-bold text-gray-900 pr-12"
                                    required
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
                            className="w-full bg-brand text-white font-bold text-lg py-4 rounded-2xl clay-btn mt-6 disabled:opacity-70 disabled:hover:translate-y-0 relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </>
                                ) : 'Log In'}
                            </span>
                        </button>
                    </form>

                    <div className="mt-6 flex flex-col gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    loginWithGoogle(credentialResponse.credential)
                                        .then(() => navigate('/dashboard'))
                                        .catch(err => setError(err.response?.data?.detail || 'Google Login failed.'));
                                }}
                                onError={() => {
                                    setError('Google Login Failed');
                                }}
                                useOneTap
                                useFedCmForPrompt={true}
                            />
                        </div>
                    </div>

                    <p className="mt-10 text-center text-gray-600 font-medium text-lg">
                        Don't have an account? <Link to="/signup" className="text-brand font-bold hover:text-primary-700 ml-1 transition-colors">Sign up for free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
