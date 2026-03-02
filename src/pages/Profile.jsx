import React, { useEffect, useState } from 'react';
import { User, Mail, Store, LogOut, ChevronRight, Shield, Bell, CircleUserRound, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Profile = () => {
    const { userProfile, fetchProfile, updateProfile, logout, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const [isShopModalOpen, setIsShopModalOpen] = useState(false);
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
    const [shopData, setShopData] = useState({ username: '', business_email: '' });
    const [securityData, setSecurityData] = useState({ oldPassword: '', password: '', confirmPassword: '' });
    const [updateError, setUpdateError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleOpenShopModal = () => {
        setShopData({
            username: userProfile?.username || '',
            business_email: userProfile?.business_email || ''
        });
        setUpdateError('');
        setIsShopModalOpen(true);
    };

    const handleOpenSecurityModal = () => {
        setSecurityData({ oldPassword: '', password: '', confirmPassword: '' });
        setUpdateError('');
        setIsSecurityModalOpen(true);
    };

    const handleShopUpdate = async (e) => {
        e.preventDefault();
        setUpdateError('');
        try {
            await updateProfile(shopData);
            setIsShopModalOpen(false);
        } catch (err) {
            setUpdateError(err.response?.data?.detail || 'Failed to update profile');
        }
    };

    const handleSecurityUpdate = async (e) => {
        e.preventDefault();
        setUpdateError('');
        if (!securityData.oldPassword) {
            setUpdateError("Current password is required");
            return;
        }
        if (securityData.password !== securityData.confirmPassword) {
            setUpdateError("Passwords do not match");
            return;
        }
        if (securityData.password.length < 6) {
            setUpdateError("New password must be at least 6 characters");
            return;
        }
        try {
            await updateProfile({
                password: securityData.password,
                old_password: securityData.oldPassword
            });
            setIsSecurityModalOpen(false);
        } catch (err) {
            setUpdateError(err.response?.data?.detail || 'Failed to update password');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans px-4 pt-10 pb-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Profile</h1>
            </div>

            {/* Profile Card */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-brand to-primary-600"></div>

                <div className="w-24 h-24 bg-white rounded-full p-1.5 z-10 mt-6 shadow-md border border-gray-100">
                    <div className="w-full h-full bg-primary-50 rounded-full flex items-center justify-center text-brand">
                        <CircleUserRound className="w-12 h-12" />
                    </div>
                </div>

                <h2 className="text-xl font-extrabold text-gray-900 mt-4 tracking-tight">
                    {userProfile?.username || "Loading..."}
                </h2>
                <p className="text-sm font-bold text-gray-500 mt-1 flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {userProfile?.business_email || "..."}
                </p>
            </div>

            {/* Settings List */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50 mb-6">

                <div
                    onClick={handleOpenShopModal}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition active:bg-gray-100"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                            <Store className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-[15px]">Shop Details</h4>
                            <p className="text-xs font-bold text-gray-400">Manage business info</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <div
                    onClick={handleOpenSecurityModal}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition active:bg-gray-100"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-[15px]">Security</h4>
                            <p className="text-xs font-bold text-gray-400">Password & Auth</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <div
                    onClick={() => alert("Notification preferences coming soon!")}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition active:bg-gray-100"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-[15px]">Notifications</h4>
                            <p className="text-xs font-bold text-gray-400">Alert preferences</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="mt-2 text-red-500 bg-red-50 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-[15px] hover:bg-red-100 active:scale-95 transition-all w-full border border-red-100"
            >
                <LogOut className="w-5 h-5" /> Log Out
            </button>

            {/* Shop Details Modal */}
            {isShopModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden p-6 relative">
                        <button onClick={() => setIsShopModalOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="font-extrabold text-xl text-gray-900 mb-6">Shop Details</h3>

                        {updateError && <div className="text-red-500 text-sm font-bold text-center mb-4 bg-red-50 p-3 rounded-xl border border-red-100">{updateError}</div>}

                        <form onSubmit={handleShopUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Shop Name</label>
                                <div className="relative">
                                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={shopData.username}
                                        onChange={(e) => setShopData({ ...shopData, username: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand focus:outline-none font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Business Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={shopData.business_email}
                                        onChange={(e) => setShopData({ ...shopData, business_email: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand focus:outline-none font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand/30 active:scale-95 transition-transform mt-4 disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Security Modal */}
            {isSecurityModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden p-6 relative">
                        <button onClick={() => setIsSecurityModalOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="font-extrabold text-xl text-gray-900 mb-6">Security Settings</h3>

                        {updateError && <div className="text-red-500 text-sm font-bold text-center mb-4 bg-red-50 p-3 rounded-xl border border-red-100">{updateError}</div>}

                        <form onSubmit={handleSecurityUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={securityData.oldPassword}
                                    onChange={(e) => setSecurityData({ ...securityData, oldPassword: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand focus:outline-none font-medium"
                                    required
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={securityData.password}
                                    onChange={(e) => setSecurityData({ ...securityData, password: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand focus:outline-none font-medium"
                                    required
                                    minLength="6"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={securityData.confirmPassword}
                                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand focus:outline-none font-medium"
                                    required
                                    minLength="6"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand/30 active:scale-95 transition-transform mt-4 disabled:opacity-50"
                            >
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Profile;
