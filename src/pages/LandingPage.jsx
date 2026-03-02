import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Package, Receipt, MessageCircle, CheckCircle2, ScanLine } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            {/* Header */}
            <header className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-primary-50 p-2 rounded-xl">
                        <Store className="text-brand w-6 h-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">ShopManager</span>
                </div>
                <div className="flex gap-4 items-center font-medium">
                    <Link to="/login" className="text-brand hover:text-primary-700 transition">Login</Link>
                    <Link to="/signup" className="bg-brand text-white px-5 py-2 rounded-full hover:bg-primary-600 transition shadow-lg shadow-brand/30">Sign Up</Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative px-6 py-24 md:py-32 overflow-hidden flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-[#2C2720]">
                    {/* Real hero image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80")' }}
                    ></div>
                    {/* Dark gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/90"></div>
                </div>

                <div className="relative z-10 max-w-3xl mx-auto text-white">
                    <span className="inline-block bg-white/10 backdrop-blur-md text-brand font-bold px-4 py-1 rounded-full text-sm mb-6 border border-white/10 uppercase tracking-widest shadow-md">
                        #1 Shop App
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Manage your shop <br /> with ease
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl mx-auto">
                        The all-in-one mobile solution for inventory tracking, instant billing, and seamless distributor orders.
                    </p>
                    <Link to="/signup" className="inline-block bg-brand text-white font-bold text-lg px-8 py-4 rounded-full shadow-[0_0_30px_rgba(0,209,46,0.4)] hover:shadow-[0_0_40px_rgba(0,209,46,0.6)] transition-all transform hover:-translate-y-1">
                        Get Started Free
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-primary-50">
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Everything you need</h2>
                    <p className="text-xl text-primary-700 font-medium">
                        Run your business from your pocket with powerful tools designed for modern shopkeepers.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary-50 p-3 rounded-2xl">
                                <Package className="text-brand w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold">Smart Inventory</h3>
                        </div>
                        <p className="text-primary-700 font-medium leading-relaxed">
                            Never run out of stock. Track levels in real-time, categorize items, and get automatic low stock alerts on your phone.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary-50 p-3 rounded-2xl">
                                <Receipt className="text-brand w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold">Instant Billing</h3>
                        </div>
                        <p className="text-primary-700 font-medium leading-relaxed">
                            Create professional digital bills in seconds. Print via thermal printer or share instantly with customers via SMS or email.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary-50 p-3 rounded-2xl">
                                <MessageCircle className="text-brand w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold">WhatsApp Orders</h3>
                        </div>
                        <p className="text-primary-700 font-medium leading-relaxed">
                            Direct integration allows you to send formatted supply orders to your distributors via WhatsApp with a single click.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6 bg-primary-50/50">
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <span className="text-brand font-bold uppercase tracking-widest text-sm mb-2 block">Simple Setup</span>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">How it works</h2>
                    <p className="text-lg text-primary-700 font-medium">
                        Get your shop digital in just three simple steps.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto relative px-4 md:px-0 mt-8">
                    {/* Steps Path Line (horizontal line on desktop) */}
                    <div className="absolute top-7 left-[15%] right-[15%] border-t-2 border-dashed border-brand/30 hidden md:block z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-full border-4 border-brand bg-white flex items-center justify-center text-brand font-bold text-xl mb-6 shadow-sm shadow-brand/20 z-10">
                                1
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-sm w-full">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Package className="text-brand w-6 h-6" />
                                    <h3 className="font-bold text-xl">Add Products</h3>
                                </div>
                                <p className="text-primary-700 font-medium">Quickly add your inventory manually or import from a list. Set prices and quantities instantly.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-full border-4 border-brand bg-white flex items-center justify-center text-brand font-bold text-xl mb-6 shadow-sm shadow-brand/20 z-10">
                                2
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-sm w-full">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <ScanLine className="text-brand w-7 h-7" />
                                    <h3 className="font-bold text-xl">Scan Items</h3>
                                </div>
                                <p className="text-primary-700 font-medium">Use your phone's camera as a barcode scanner to quickly find items during sales.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-full bg-brand border-4 border-brand flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-brand/40 z-10">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-brand/20 max-w-sm w-full relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-brand"></div>
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Receipt className="text-brand w-6 h-6" />
                                    <h3 className="font-bold text-xl">Bill & Order</h3>
                                </div>
                                <p className="text-primary-700 font-medium">Generate receipts instantly for customers and reorder stock when low with a single tap.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA section */}
            <section className="py-20 px-6 bg-white text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight max-w-md mx-auto">Ready to upgrade your shop?</h2>
                <p className="text-lg text-primary-600 font-medium max-w-lg mx-auto mb-10">
                    Join thousands of shopkeepers who are saving time and growing their business with ShopManager.
                </p>
                <Link to="/signup" className="inline-block bg-black text-white font-bold text-lg px-10 py-5 rounded-full shadow-2xl hover:scale-105 transition-all transform">
                    Download App
                </Link>
                <p className="text-sm font-medium text-emerald-600 mt-6">Available on iOS and Android</p>
            </section>

        </div>
    );
};

export default LandingPage;
