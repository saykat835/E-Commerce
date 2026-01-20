import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import Swal from 'sweetalert2';
import { Globe, Share2, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, Save, Loader2, Link as LinkIcon, Truck, DollarSign, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSettings = () => {
    const { settings, updateSettings, fetchSettings } = useShop();
    const [formData, setFormData] = useState({
        supportEmail: '',
        supportPhone: '',
        codCharge: 50,
        socialLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
            youtube: ''
        },
        authImages: ['', '', '']
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData({
                supportEmail: settings.supportEmail || '',
                supportPhone: settings.supportPhone || '',
                codCharge: settings.codCharge || 50,
                socialLinks: {
                    facebook: settings.socialLinks?.facebook || '',
                    twitter: settings.socialLinks?.twitter || '',
                    instagram: settings.socialLinks?.instagram || '',
                    linkedin: settings.socialLinks?.linkedin || '',
                    youtube: settings.socialLinks?.youtube || ''
                },
                authImages: settings.authImages || ['', '', '']
            });
        }
    }, [settings]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id.includes('.')) {
            const [parent, child] = id.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else if (id.startsWith('authImages[')) {
            const index = parseInt(id.match(/\[(\d+)\]/)[1]);
            setFormData(prev => {
                const newImages = [...prev.authImages];
                newImages[index] = value;
                return { ...prev, authImages: newImages };
            });
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const result = await updateSettings(formData);
        setIsSaving(false);

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Global Configuration Applied',
                text: 'System preferences and links updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });
            fetchSettings();
        } else {
            Swal.fire('Error', result.message, 'error');
        }
    };

    if (!settings) return (
        <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <div>
                <h1 className="text-3xl font-black text-slate-900">System Preferences</h1>
                <p className="text-slate-500 mt-1">Configure global communication channels and social ecosystems.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Customer Support Section */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">Customer Support</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Support Command Centre (Email)</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="email" id="supportEmail" value={formData.supportEmail} onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Support Terminal (Phone)</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="tel" id="supportPhone" value={formData.supportPhone} onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">Logistics Control</h2>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Cash on Delivery Surcharge ($)</label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="number" id="codCharge" value={formData.codCharge} onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mt-2">Added to total if user selects COD</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">Auth Visuals (3 Images)</h2>
                            </div>
                            <div className="space-y-6">
                                {[0, 1, 2].map((idx) => (
                                    <div key={idx} className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Hero Image {idx + 1} URL</label>
                                        <div className="relative group">
                                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                type="text" id={`authImages[${idx}]`} value={formData.authImages[idx]} onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                    </div>
                                ))}
                                <p className="text-[10px] text-slate-400 font-bold uppercase ml-1">These images rotate on the login and signup pages.</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Social Ecosystem Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Social Ecosystem</h2>
                        </div>

                        <div className="space-y-5">
                            {[
                                { id: 'socialLinks.facebook', icon: Facebook, label: 'Facebook URL' },
                                { id: 'socialLinks.twitter', icon: Twitter, label: 'X / Twitter URL' },
                                { id: 'socialLinks.instagram', icon: Instagram, label: 'Instagram URL' },
                                { id: 'socialLinks.linkedin', icon: Linkedin, label: 'LinkedIn URL' },
                                { id: 'socialLinks.youtube', icon: Youtube, label: 'YouTube URL' },
                            ].map((item) => (
                                <div key={item.id} className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{item.label}</label>
                                    <div className="relative group">
                                        <item.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="text" id={item.id} value={item.id.split('.').reduce((o, i) => o[i], formData)} onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full sm:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-lg transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>Synchronizing... <Loader2 className="w-5 h-5 animate-spin" /></>
                        ) : (
                            <>Apply Global Settings <Save className="w-6 h-6" /></>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
