import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Box, ShoppingCart, Receipt, User } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: '/dashboard', icon: Home },
        { name: 'Inventory', path: '/inventory', icon: Box },
        { name: 'Orders', path: '/orders', icon: ShoppingCart, isFloating: true },
        { name: 'Sales', path: '/billing', icon: Receipt },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[92%] max-w-[400px] bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2rem] flex justify-between items-end px-6 py-3 z-50">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                if (item.isFloating) {
                    return (
                        <div key={item.name} className="relative flex flex-col items-center justify-end">
                            <NavLink
                                to={item.path}
                                className={`absolute bottom-5 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transform transition-transform active:scale-95 z-20 ${isActive ? 'bg-brand text-white shadow-brand/40' : 'bg-gray-900 border-2 border-transparent text-white'}`}
                            >
                                <Icon className="w-6 h-6" />
                            </NavLink>
                            <span className={`text-[10px] font-bold mt-10 ${isActive ? 'text-brand' : 'text-gray-400'}`}>
                                {item.name}
                            </span>
                        </div>
                    );
                }

                return (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className="flex flex-col items-center gap-1 min-w-[50px] relative z-10"
                    >
                        <div className={`transition-colors flex flex-col items-center`}>
                            <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-brand fill-primary-50 stroke-[2px]' : 'text-gray-400 stroke-2'}`} />
                            <span className={`text-[10px] font-bold ${isActive ? 'text-brand' : 'text-gray-400'}`}>
                                {item.name}
                            </span>
                        </div>
                    </NavLink>
                );
            })}
        </div>
    );
};

export default BottomNav;
