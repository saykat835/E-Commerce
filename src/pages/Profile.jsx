import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Loader2, Save, LogOut, ShieldCheck, CreditCard, ShoppingBag, Globe, City } from 'lucide-react';
import Swal from 'sweetalert2';

const Profile = () => {
    const { user, updateProfile, logout } = useAuth();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(user?.profilePic || '');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        country: user?.country || 'Bangladesh',
        profilePic: user?.profilePic || ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                country: user.country || 'Bangladesh',
                profilePic: user.profilePic || ''
            });
            setImagePreview(user.profilePic || '');
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB Limit
                Swal.fire('Error', 'Image size should be less than 1MB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({ ...formData, profilePic: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await updateProfile(formData);
        setLoading(false);

        if (res.success) {
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your profile information has been successfully updated.',
                timer: 2000,
                showConfirmButton: false,
                background: '#fff',
                color: '#1e293b',
                customClass: { popup: 'rounded-[1.5rem]' }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: res.message,
                confirmButtonColor: '#6366f1',
                customClass: { popup: 'rounded-[1.5rem]' }
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                        <p className="text-slate-500 font-medium">Manage your profile information and preferences.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Static Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4"
                        >
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-xl">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <User size={48} />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors border-4 border-white">
                                    <Camera size={18} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
                                <p className="text-slate-500 text-sm font-medium">{user?.email}</p>
                            </div>

                            <div className="w-full pt-4 space-y-2">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Balance</span>
                                    <span className="text-lg font-black text-indigo-600">${user?.balance?.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Status</span>
                                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                                        <ShieldCheck size={16} /> Verified
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Navigation Links */}
                        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-2">
                            <button className="w-full flex items-center gap-3 p-4 bg-indigo-50 text-indigo-600 rounded-2xl font-bold text-sm transition-all">
                                <User size={20} /> Personal Info
                            </button>
                            <button onClick={() => Swal.fire('Orders', 'Redirecting to orders page...', 'info')} className="w-full flex items-center gap-3 p-4 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all">
                                <ShoppingBag size={20} /> My Orders
                            </button>
                            <button className="w-full flex items-center gap-3 p-4 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all">
                                <CreditCard size={20} /> Payment Methods
                            </button>
                            <div className="h-[1px] bg-slate-100 my-2" />
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 p-4 text-rose-500 hover:bg-rose-50 rounded-2xl font-bold text-sm transition-all"
                            >
                                <LogOut size={20} /> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden"
                        >
                            <div className="p-8 sm:p-10">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Personal Info Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                                                <User size={18} />
                                            </div>
                                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Basic Details</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                                    <input
                                                        type="text" required value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-bold text-slate-900"
                                                        placeholder="Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Email Address</label>
                                                <div className="relative opacity-60">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                                    <input
                                                        type="email" disabled value={formData.email}
                                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900 cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                                    <input
                                                        type="tel" value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-bold text-slate-900"
                                                        placeholder="Phone"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Section */}
                                    <div className="space-y-6 pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                                                <MapPin size={18} />
                                            </div>
                                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Shipping Address</h2>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Detailed Address</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                                                <textarea
                                                    rows="3" value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-bold text-slate-900"
                                                    placeholder="Street name, House no, Apartement..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">City</label>
                                                <div className="relative">
                                                    <City className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                                    <input
                                                        type="text" value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-bold text-slate-900"
                                                        placeholder="City"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Country</label>
                                                <div className="relative">
                                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                                    <select
                                                        value={formData.country}
                                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                        className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-bold text-slate-900 accent-indigo-600 appearance-none"
                                                    >
                                                        <option value="Bangladesh">Bangladesh</option>
                                                        <option value="USA">United States</option>
                                                        <option value="UK">United Kingdom</option>
                                                        <option value="Canada">Canada</option>
                                                        <option value="Australia">Australia</option>
                                                        <option value="India">India</option>
                                                        <option value="Germany">Germany</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-[1.5rem] font-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-4 group"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                                        ) : (
                                            <>
                                                <Save size={20} className="group-hover:scale-110 transition-transform" />
                                                Save Profile Changes
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
