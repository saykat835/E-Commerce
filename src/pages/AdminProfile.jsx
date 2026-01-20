import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Swal from 'sweetalert2';
import { User, Mail, Lock, Phone, Save, ShieldCheck, Camera, Check, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminProfile = () => {
    const { user, updateProfile } = useAuth();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        profilePic: user?.profilePic || '',
        password: '',
        confirmPassword: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            return Swal.fire('Error', 'Passwords do not match', 'error');
        }

        setIsSaving(true);
        const dataToUpdate = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            profilePic: formData.profilePic
        };

        if (formData.password) {
            dataToUpdate.password = formData.password;
        }

        const result = await updateProfile(dataToUpdate);
        setIsSaving(false);

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Intelligence Synchronized',
                text: 'Your administrative profile has been updated.',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } else {
            Swal.fire('Failed', result.message, 'error');
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Guardian Profile</h1>
                    <p className="text-slate-500 mt-2 font-medium">Coordinate your administrative identity and security protocols.</p>
                </div>
                <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Authorization</span>
                    <span className="text-sm font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Root Access
                    </span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Profile Card */}
                <div className="w-full lg:w-96 flex-shrink-0">
                    <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 text-center sticky top-8">
                        <div className="relative inline-block mb-8">
                            <div className="w-40 h-40 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-200 overflow-hidden">
                                {formData.profilePic ? (
                                    <img src={formData.profilePic} alt={user?.name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 p-4 bg-white text-slate-900 rounded-[1.2rem] shadow-2xl border border-slate-100 group cursor-pointer">
                                <Camera className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name}</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Administrative Core</p>

                        <div className="mt-10 pt-10 border-t border-slate-50 space-y-5 text-left">
                            <div className="flex items-center gap-4 text-slate-600">
                                <div className="p-2.5 bg-slate-50 rounded-xl">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-black truncate">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-600">
                                <div className="p-2.5 bg-slate-50 rounded-xl">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-black">{user?.phone || 'No terminal sync'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="flex-1">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 sm:p-14"
                    >
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-8">
                                    <User className="w-3 h-3" /> Core Identity
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alias / Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                type="text" id="name" required value={formData.name} onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-5 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal ID (Email)</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                type="email" id="email" required value={formData.email} onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-5 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sync Terminal (Phone)</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                type="tel" id="phone" value={formData.phone} onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-5 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900"
                                                placeholder="+880 1XXX XXXXXX"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Avatar Protocol (Image URL)</label>
                                        <div className="relative group">
                                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                type="text" id="profilePic" value={formData.profilePic} onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-5 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 space-y-8">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-8">
                                    <Lock className="w-3 h-3" /> Security Hardening
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Command (Password)</label>
                                        <div className="relative group">
                                            <input
                                                type="password" id="password" value={formData.password} onChange={handleChange}
                                                className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold"
                                                placeholder="Leave blank to maintain"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verify Command</label>
                                        <div className="relative group">
                                            <input
                                                type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                                className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold"
                                                placeholder="Verify Password"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full sm:w-auto px-12 py-6 bg-slate-900 hover:bg-indigo-600 text-white rounded-[1.8rem] font-black transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
                                >
                                    {isSaving ? 'Processing Sync...' : (
                                        <>Deploy Profile Changes <Save className="w-6 h-6" /></>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
