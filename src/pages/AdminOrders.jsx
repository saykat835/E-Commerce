import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    ClipboardList, Check, Truck, X, User as UserIcon, Phone, Mail,
    MoreHorizontal, MapPin, Package, Calendar, DollarSign,
    MessageSquare, Send, Globe, ShoppingBag, ArrowRight, Loader2, Info, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AdminOrders = () => {
    const { orders, fetchOrders } = useShop();
    const { user } = useAuth();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const updateStatus = async (id, status) => {
        try {
            let cancellationReason = '';
            if (status === 'cancelled') {
                const { value: reason, isConfirmed } = await Swal.fire({
                    title: 'Termination Protocol',
                    input: 'textarea',
                    inputLabel: 'Reason for Cancellation',
                    inputPlaceholder: 'Enter the specific reason for rejecting this acquisition...',
                    inputAttributes: {
                        'aria-label': 'Type your reason here'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Confirm Termination',
                    cancelButtonText: 'Abort',
                    confirmButtonColor: '#e11d48',
                    background: '#fff',
                    color: '#1e293b'
                });

                if (!isConfirmed) return;
                cancellationReason = reason || 'No specific reason provided by administration.';
            }

            setActionLoading(id);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
            await axios.put(`${API_URL}/orders/${id}`, {
                status,
                cancellationReason
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            Swal.fire({
                icon: 'success',
                title: 'Logic Synchronized',
                text: `Order status updated to ${status.toUpperCase()}`,
                background: '#fff',
                color: '#1e293b',
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });

            await fetchOrders();
            setActionLoading(null);
            if (selectedOrder && selectedOrder._id === id) {
                setSelectedOrder(prev => ({ ...prev, status, cancellationReason }));
            }
        } catch (err) {
            console.error(err);
            setActionLoading(null);
            Swal.fire('Protocol Error', 'Failed to update transaction state', 'error');
        }
    };

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'delivered': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    const getContactIcon = (platform) => {
        switch (platform) {
            case 'WhatsApp': return <MessageSquare className="w-4 h-4 text-emerald-500" />;
            case 'Telegram': return <Send className="w-4 h-4 text-sky-500" />;
            case 'Messenger': return <Globe className="w-4 h-4 text-blue-500" />;
            default: return <Phone className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Supply Chain Protocol</h1>
                    <p className="text-slate-500 mt-1 font-medium">Coordinate logistics and finalize customer acquisitions.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Matrix</p>
                        <p className="text-xl font-black text-indigo-600">{orders.filter(o => o.status === 'pending').length} New</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Orders List */}
                <div className={`${selectedOrder ? 'xl:col-span-7' : 'xl:col-span-12'} space-y-4`}>
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden text-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/80">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Order Ref</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Value</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status Pulse</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {orders.map((order, idx) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            key={order._id}
                                            onClick={() => setSelectedOrder(order)}
                                            className={`group cursor-pointer transition-all ${selectedOrder?._id === order._id ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'}`}
                                        >
                                            <td className="px-8 py-6">
                                                <span className="font-mono text-[11px] font-black text-slate-400 bg-white border border-slate-100 px-2 py-1 rounded-lg">
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                                        {order.customer?.fullName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 leading-none">{order.customer?.fullName || 'Guest'}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase">{order.customer?.city || 'Digital'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-black text-slate-900">${(order?.totalAmount || 0).toFixed(2)}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{order.items?.length || 0} Units</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit ${getStatusStyles(order.status)}`}>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                                    {order.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {order.status === 'pending' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateStatus(order._id, 'shipped'); }}
                                                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                                                            title="Ship Order"
                                                        >
                                                            <Truck className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {order.status === 'shipped' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateStatus(order._id, 'delivered'); }}
                                                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all"
                                                            title="Approve Received"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateStatus(order._id, 'cancelled'); }}
                                                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
                                                            title="Quick Cancel"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button className={`p-2 rounded-xl transition-all ${selectedOrder?._id === order._id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg'}`}>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Detail Panel */}
                <AnimatePresence>
                    {selectedOrder && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="xl:col-span-5 space-y-6"
                        >
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden sticky top-8">
                                <div className="p-8 sm:p-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-xl shadow-indigo-200">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900">Protocol Details</h3>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ref: {selectedOrder._id.slice(-12).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedOrder(null)}
                                            className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Intelligence Sections */}
                                    <div className="space-y-8">
                                        {/* Customer Bio */}
                                        <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <UserIcon className="w-3 h-3" /> Biometric Data
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-500 font-bold">Full Name</span>
                                                    <span className="font-black text-slate-900">{selectedOrder.customer?.fullName}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-500 font-bold">Access Protocol</span>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-slate-100">
                                                        {getContactIcon(selectedOrder.customer?.contactPlatform)}
                                                        <span className="font-black text-slate-900 text-xs">{selectedOrder.customer?.contactId}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-start">
                                                    <span className="text-slate-500 font-bold">Logistics Node</span>
                                                    <div className="text-right">
                                                        <p className="font-black text-slate-900">{selectedOrder.customer?.address}</p>
                                                        <p className="text-xs font-bold text-slate-400 uppercase mt-1">{selectedOrder.customer?.city}, {selectedOrder.customer?.zipCode}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items Matrix */}
                                        <div>
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <ShoppingBag className="w-3 h-3" /> Asset Inventory
                                            </h4>
                                            <div className="space-y-3">
                                                {selectedOrder.items?.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-2xl">
                                                        <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden shadow-inner">
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-black text-slate-900 text-sm truncate">{item.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{(item.quantity || 0)} Units x ${(item.price || 0).toFixed(2)}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-black text-indigo-600">${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Financial Summary */}
                                        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                                            <div className="relative z-10 space-y-4">
                                                <div className="flex justify-between items-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                                    <span>Supply Surcharge (COD)</span>
                                                    <span className="text-emerald-400">+${selectedOrder.codCharge?.toFixed(2) || '0.00'}</span>
                                                </div>
                                                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Ledger Pulse</p>
                                                        <p className="text-3xl font-black text-white">${(selectedOrder?.totalAmount || 0).toFixed(2)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Execution Date</p>
                                                        <p className="text-xs font-bold text-slate-300">{selectedOrder?.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedOrder.status === 'cancelled' && selectedOrder.cancellationReason && (
                                            <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-start gap-4">
                                                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Termination Intel</p>
                                                    <p className="text-sm font-bold text-rose-900 leading-relaxed italic">"{selectedOrder.cancellationReason}"</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Protocol Operations */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedOrder.status === 'pending' && (
                                                <button
                                                    onClick={() => updateStatus(selectedOrder._id, 'shipped')}
                                                    disabled={actionLoading === selectedOrder._id}
                                                    className="col-span-2 py-5 bg-blue-600 hover:bg-slate-900 text-white rounded-[1.5rem] font-black transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                                >
                                                    {actionLoading === selectedOrder._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Truck className="w-5 h-5" />}
                                                    Initiate Shipping
                                                </button>
                                            )}

                                            {selectedOrder.status === 'shipped' && (
                                                <button
                                                    onClick={() => updateStatus(selectedOrder._id, 'delivered')}
                                                    disabled={actionLoading === selectedOrder._id}
                                                    className="col-span-2 py-5 bg-emerald-600 hover:bg-slate-900 text-white rounded-[1.5rem] font-black transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                                >
                                                    {actionLoading === selectedOrder._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                                    Approve (Order Received)
                                                </button>
                                            )}

                                            {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                                                <button
                                                    onClick={() => updateStatus(selectedOrder._id, 'cancelled')}
                                                    disabled={actionLoading === selectedOrder._id}
                                                    className={`py-4 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-[1.5rem] font-black transition-all flex items-center justify-center gap-2 active:scale-95 ${selectedOrder.status === 'pending' ? 'col-span-2' : 'col-span-2'}`}
                                                >
                                                    {actionLoading === selectedOrder._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                    Terminate Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminOrders;
