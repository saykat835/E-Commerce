import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import OrderConfirmationModal from './OrderConfirmationModal';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { X, User, Mail, Phone, MapPin, Building, Hash, ArrowRight, ShieldCheck, Wallet, Truck, MessageSquare, Send, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddressModal = ({ isOpen, onClose }) => {
    const { cart, clearCart, getCartTotal, fetchOrders, settings } = useShop();
    const { user, syncBalance } = useAuth();
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('balance');
    const [contactPlatform, setContactPlatform] = useState('WhatsApp');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        contactId: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cartTotal = getCartTotal();
        const codCharge = paymentMethod === 'cod' ? (settings?.codCharge || 50) : 0;
        const totalAmount = cartTotal + codCharge;

        if (paymentMethod === 'balance') {
            if (user.balance < totalAmount) {
                return Swal.fire({
                    title: 'Insufficient Funds',
                    text: `Your balance ($${user.balance.toFixed(2)}) is lower than the order total ($${totalAmount.toFixed(2)}). Please refill your assets.`,
                    icon: 'error',
                    confirmButtonText: 'Refill Now',
                    showCancelButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        onClose();
                        window.location.href = '/deposit';
                    }
                });
            }
        }

        const newOrder = {
            customer: {
                ...formData,
                contactPlatform: contactPlatform
            },
            items: cart,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
            codCharge: codCharge,
            status: 'pending',
            date: new Date().toISOString()
        };

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
            const res = await axios.post(`${API_URL}/orders`, newOrder, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setOrderData(res.data);
            setIsOrderModalOpen(true);
            await syncBalance();
            clearCart();
            fetchOrders();
            onClose();
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Order Failed',
                text: err.response?.data?.message || 'Failed to place order',
                background: '#fff',
                color: '#1e293b',
                confirmButtonColor: '#6366f1'
            });
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 sm:p-12 overflow-y-auto max-h-[90vh] custom-scrollbar">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">Premium Checkout Protocol</span>
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 leading-tight">Order Identification</h2>
                                        <p className="text-slate-500 mt-2">Please provide precise delivery and contact intelligence.</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-slate-100 rounded-2xl transition-colors group"
                                    >
                                        <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Personal Intel Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <input
                                                    type="text" id="fullName" required value={formData.fullName} onChange={handleChange}
                                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900"
                                                    placeholder="e.g. John Alexander"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Matrix</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <input
                                                    type="email" id="email" required value={formData.email} onChange={handleChange}
                                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Selection Section */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Contact Channel (Recommended: WhatsApp)</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { id: 'WhatsApp', icon: <MessageSquare className="w-4 h-4" />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                                { id: 'Telegram', icon: <Send className="w-4 h-4" />, color: 'text-sky-500', bg: 'bg-sky-50' },
                                                { id: 'Messenger', icon: <Globe className="w-4 h-4" />, color: 'text-blue-500', bg: 'bg-blue-50' }
                                            ].map((platform) => (
                                                <button
                                                    key={platform.id}
                                                    type="button"
                                                    onClick={() => setContactPlatform(platform.id)}
                                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${contactPlatform === platform.id
                                                        ? 'border-indigo-600 bg-indigo-50/30'
                                                        : 'border-slate-100 bg-white hover:border-slate-200'
                                                        }`}
                                                >
                                                    <div className={`p-2 rounded-lg ${contactPlatform === platform.id ? platform.bg + ' ' + platform.color : 'bg-slate-100 text-slate-400'}`}>
                                                        {platform.icon}
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-tighter ${contactPlatform === platform.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                                                        {platform.id}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                                    <span className="text-slate-400">
                                                        {contactPlatform === 'WhatsApp' ? <Phone className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                                    </span>
                                                </div>
                                                <input
                                                    type="text" id="contactId" required value={formData.contactId} onChange={handleChange}
                                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-indigo-600"
                                                    placeholder={contactPlatform === 'WhatsApp' ? "Enter WhatsApp Number (e.g. 017...)" : `Enter ${contactPlatform} Username / ID`}
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-400 italic ml-1 font-medium">
                                                * Providing an accurate {contactPlatform === 'WhatsApp' ? 'phone number' : 'ID'} ensures we can synchronize your order details rapidly.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Logistics Section */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Destination (Address)</label>
                                            <div className="relative group">
                                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <input
                                                    type="text" id="address" required value={formData.address} onChange={handleChange}
                                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900"
                                                    placeholder="Street, House, Flat No..."
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City Node</label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                    <input
                                                        type="text" id="city" required value={formData.city} onChange={handleChange}
                                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900"
                                                        placeholder="City name..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zip Mapping</label>
                                                <div className="relative group">
                                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                    <input
                                                        type="text" id="zipCode" required value={formData.zipCode} onChange={handleChange}
                                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900"
                                                        placeholder="Post Code..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Transfer Protocol</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('balance')}
                                                className={`p-5 rounded-[2rem] border-2 text-left transition-all ${paymentMethod === 'balance'
                                                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-100/50'
                                                    : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className={`p-3 rounded-xl ${paymentMethod === 'balance' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400'}`}>
                                                        <Wallet className="w-5 h-5" />
                                                    </div>
                                                    {paymentMethod === 'balance' && <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-lg shadow-indigo-200" />}
                                                </div>
                                                <p className="font-black text-slate-900">Virtual Assets</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Account Balance</p>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('cod')}
                                                className={`p-5 rounded-[2rem] border-2 text-left transition-all ${paymentMethod === 'cod'
                                                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-100/50'
                                                    : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className={`p-3 rounded-xl ${paymentMethod === 'cod' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400'}`}>
                                                        <Truck className="w-5 h-5" />
                                                    </div>
                                                    {paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-lg shadow-indigo-200" />}
                                                </div>
                                                <p className="font-black text-slate-900">Physical COD</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">+{settings?.codCharge || 50} Logistics Fee</p>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                                        <div className="relative z-10 space-y-3">
                                            <div className="flex justify-between items-center text-slate-400 text-sm font-bold">
                                                <span>Subtotal Matrix</span>
                                                <span className="font-black text-white">${getCartTotal().toFixed(2)}</span>
                                            </div>
                                            {paymentMethod === 'cod' && (
                                                <div className="flex justify-between items-center text-emerald-400 text-sm font-bold">
                                                    <span>Logistics Surcharge</span>
                                                    <span className="font-black">+${(settings?.codCharge || 50).toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="pt-5 border-t border-white/10 flex justify-between items-center">
                                                <span className="text-xl font-black tracking-tight text-white">Total Value Pulse</span>
                                                <span className="text-3xl font-black text-indigo-400 shadow-indigo-500/20 drop-shadow-md">
                                                    ${(getCartTotal() + (paymentMethod === 'cod' ? (settings?.codCharge || 50) : 0)).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-8">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                                <ShieldCheck className="w-4 h-4" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Encrypted Transmission <br /> Secure Matrix Execution</span>
                                        </div>
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="flex-1 sm:flex-none px-8 py-5 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-900 transition-colors"
                                            >
                                                Abort
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 sm:flex-none px-12 py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95 group"
                                            >
                                                Execute Sync <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <OrderConfirmationModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                order={orderData}
            />
        </>
    );
};

export default AddressModal;
