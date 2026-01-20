import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Loader2, Save, LogOut, ShieldCheck, CreditCard, ShoppingBag, Globe, City, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Profile = () => {
    const { user, updateProfile, logout, syncBalance } = useAuth();
    const navigate = useNavigate();
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
            if (file.size > 2 * 1024 * 1024) { // 2MB Limit
                Swal.fire('Error', 'Image size should be less than 2MB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({ ...prev, profilePic: reader.result }));
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
                title: 'Success!',
                text: 'Profile updated successfully.',
                timer: 2000,
                showConfirmButton: false,
                background: '#fff',
                color: '#1e293b',
                customClass: { popup: 'rounded-[2rem]' }
            });
            // Immediately sync to ensure all parts of app get new data
            syncBalance();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: res.message,
                confirmButtonColor: '#6366f1'
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20 pt-28 font-inter">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">

                {/* Back Button & Title */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl shadow-sm border border-slate-100 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
                        <p className="text-sm font-medium text-slate-500">Update your public profile and personal details.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Avatar & Stats */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-center text-center"
                        >
                            <div className="relative group mb-6">
                                <div className="w-36 h-36 rounded-[2.5rem] overflow-hidden bg-slate-50 border-[6px] border-white shadow-2xl relative">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-4xl font-black">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:bg-indigo-700 hover:scale-110 transition-all border-4 border-white">
                                    <Camera size={20} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>

                            {user?.name && (
                                <>
                                    <h3 className="text-xl font-black text-slate-900 mb-1">{user.name}</h3>
                                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full mb-6 text-center justify-center">
                                        <ShieldCheck size={14} /> Verified Member
                                    </div>
                                </>
                            )}

                            <div className="w-full grid grid-cols-2 gap-3 pt-6 border-t border-slate-50">
                                <div className="p-4 bg-slate-50 rounded-3xl text-center">
                                    <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Balance</span>
                                    <span className="text-lg font-black text-indigo-600">${user?.balance?.toFixed(2)}</span>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-3xl text-center">
                                    <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Orders</span>
                                    <span className="text-lg font-black text-slate-900">0</span>
                                </div>
                            </div>
                        </motion.div>

                        <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 divide-y divide-slate-50">
                            <button className="w-full flex items-center justify-between p-4 text-indigo-600 bg-indigo-50/50 rounded-2xl font-black text-sm transition-all group">
                                <span className="flex items-center gap-3">
                                    <User size={18} /> Public Profile
                                </span>
                            </button>
                            <button onClick={() => navigate('/orders')} className="w-full flex items-center justify-between p-4 text-slate-600 hover:text-indigo-600 rounded-2xl font-bold text-sm transition-all">
                                <span className="flex items-center gap-3">
                                    <ShoppingBag size={18} /> My Orders
                                </span>
                            </button>
                            <button onClick={logout} className="w-full flex items-center justify-between p-4 text-rose-500 hover:bg-rose-50 rounded-2xl font-bold text-sm transition-all mt-1">
                                <span className="flex items-center gap-3">
                                    <LogOut size={18} /> Logout
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Right: Detailed Form */}
                    <div className="lg:col-span-8">
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onSubmit={handleSubmit}
                            className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden"
                        >
                            <div className="p-8 sm:p-12 space-y-10">
                                {/* Section 1 */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                                            <User size={20} />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Personal Information</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Full Name</label>
                                            <input
                                                type="text" required value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-bold text-slate-900"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Email Address</label>
                                            <input
                                                type="email" disabled value={formData.email}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-400 cursor-not-allowed"
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Phone Number</label>
                                            <input
                                                type="tel" value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-bold text-slate-900"
                                                placeholder="Phone number"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2 */}
                                <div className="space-y-6 pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                                            <MapPin size={20} />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Shipping Location</h2>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Street Address</label>
                                        <textarea
                                            rows="2" value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-bold text-slate-900 resize-none"
                                            placeholder="House no, Street name, Apartment..."
                                        ></textarea>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">City</label>
                                            <input
                                                type="text" value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-bold text-slate-900"
                                                placeholder="Enter city"
                                            />
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Country</label>
                                            <select
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-bold text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1.5rem_center] bg-no-repeat"
                                            >
                                                <option value="Bangladesh">Bangladesh</option>
                                                <option value="USA">United States</option>
                                                <option value="UK">United Kingdom</option>
                                                <option value="India">India</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-[1.5rem] font-black transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 group"
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={20} className="group-hover:scale-110 transition-transform" />
                                            Update Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
