import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { Search, Mail, Wallet, ShoppingBag, Trash2, ShieldCheck, DollarSign, Loader2, X, Package, Clock, CheckCircle2, Truck, XCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const AdminUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedUserOrders, setSelectedUserOrders] = useState(null);
    const { getUsers, deleteUser, updateUserBalance } = useAuth();
    const { orders } = useShop();

    const loadUsers = async () => {
        setLoading(true);
        const data = await getUsers();
        setAllUsers(data);
        setFilteredUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        const filtered = allUsers.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchQuery, allUsers]);

    const getUserOrdersCount = (userId) => {
        return orders.filter(order => order.user === userId || order.customer?.email === allUsers.find(u => u._id === userId)?.email).length;
    };

    const handleViewOrders = (user) => {
        const userOrders = orders.filter(order => order.user === user._id || order.customer?.email === user.email);
        setSelectedUserOrders({ user, orders: userOrders });
    };

    const handleDelete = async (user) => {
        const result = await Swal.fire({
            title: 'Delete Archetype?',
            text: `Remove ${user.name} and all associated neural data?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e',
            confirmButtonText: 'Permanently Erase'
        });

        if (result.isConfirmed) {
            const res = await deleteUser(user._id);
            if (res.success) {
                Swal.fire('Erased', 'User data purged from core.', 'success');
                loadUsers();
            } else {
                Swal.fire('Error', res.message, 'error');
            }
        }
    };

    const handleUpdateBalance = async (user) => {
        const { value: balance } = await Swal.fire({
            title: 'Update Balance',
            input: 'number',
            inputLabel: `Update asset balance for ${user.name}`,
            inputValue: user.balance,
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            inputValidator: (value) => {
                if (!value || isNaN(value)) {
                    return 'Please enter a valid asset value';
                }
            }
        });

        if (balance !== undefined) {
            const res = await updateUserBalance(user._id, parseFloat(balance));
            if (res.success) {
                Swal.fire('Updated', 'Financial ledger synchronized.', 'success');
                loadUsers();
            } else {
                Swal.fire('Error', res.message, 'error');
            }
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
            case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
            case 'cancelled': return <XCircle className="w-4 h-4 text-rose-500" />;
            case 'approved': return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
            default: return <Package className="w-4 h-4 text-slate-400" />;
        }
    };

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'approved': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Intelligence</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage and monitor customer demographics and activity.</p>
                </div>
                <div className="relative group max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm font-bold"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer Identity</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Access Role</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset Balance</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Orders</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                                            <p className="text-slate-400 font-bold">Synchronizing user data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={user._id}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 flex items-center gap-1.5 leading-none">
                                                        {user.name}
                                                        {user.role === 'admin' && <ShieldCheck className="w-4 h-4 text-indigo-500" />}
                                                    </p>
                                                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1.5 font-bold uppercase tracking-widest">
                                                        <Mail className="w-3 h-3" /> {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${user.role === 'admin'
                                                ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all">
                                                    <Wallet className="w-4 h-4" />
                                                </div>
                                                <span className="font-black text-slate-700 group-hover:text-emerald-600 transition-colors tabular-nums">
                                                    ${user.balance?.toFixed(2) || '0.00'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button
                                                onClick={() => handleViewOrders(user)}
                                                className="flex items-center gap-2 p-2 rounded-xl hover:bg-indigo-50 group/orders transition-all"
                                            >
                                                <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 group-hover/orders:bg-indigo-500 group-hover/orders:text-white group-hover/orders:border-indigo-500 transition-all">
                                                    <ShoppingBag className="w-4 h-4" />
                                                </div>
                                                <span className="font-black text-slate-700 group-hover/orders:text-indigo-600 transition-colors tabular-nums">
                                                    {getUserOrdersCount(user._id)}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleUpdateBalance(user)}
                                                    className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all border border-slate-100 shadow-sm active:scale-95"
                                                    title="Sync Balance"
                                                >
                                                    <DollarSign className="w-5 h-5" />
                                                </button>
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDelete(user)}
                                                        className="p-3 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-rose-100 shadow-sm active:scale-95"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Orders Modal */}
            <AnimatePresence>
                {selectedUserOrders && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUserOrders(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-white"
                        >
                            <div className="p-8 sm:p-12 h-[80vh] flex flex-col">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-indigo-100">
                                            <Package className="w-3 h-3" /> Acquisition History
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Orders for {selectedUserOrders.user.name}</h2>
                                        <p className="text-slate-500 font-medium">Visualizing transaction matrix for this identity node.</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedUserOrders(null)}
                                        className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-6">
                                    {selectedUserOrders.orders.length === 0 ? (
                                        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-slate-100 border-dashed">
                                            <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">No acquisition logs detected in historical matrix.</p>
                                        </div>
                                    ) : (
                                        selectedUserOrders.orders.map((order, idx) => (
                                            <div key={order._id} className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-8 hover:shadow-xl hover:border-indigo-100 transition-all group">
                                                <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tabular-nums">
                                                            #{order._id.slice(-8).toUpperCase()}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                                                            <Clock className="w-4 h-4 text-indigo-400" />
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest shadow-sm ${getStatusStyles(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-5 p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                                                            <div className="w-14 h-14 bg-white rounded-xl overflow-hidden shadow-inner border border-white">
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-black text-slate-900 text-sm truncate">{item.name}</p>
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{item.quantity} Units x ${item.price.toFixed(2)}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-black text-slate-900 tabular-nums">${(item.quantity * item.price).toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Matrix Settle</span>
                                                        <span className="p-1 px-2 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-tighter italic">{order.paymentMethod}</span>
                                                    </div>
                                                    <div className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums">${order.totalAmount.toFixed(2)}</div>
                                                </div>

                                                {order.status === 'cancelled' && order.cancellationReason && (
                                                    <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                                                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                                        <p className="text-xs font-bold text-rose-900 leading-relaxed italic">Log: "{order.cancellationReason}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;
