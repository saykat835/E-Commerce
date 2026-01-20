import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
    Box, ShoppingCart, DollarSign, Users, ArrowUpRight, ArrowDownRight,
    MoreVertical, Wallet, TrendingUp, Clock, AlertCircle, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { products, orders, fetchAllDepositsAdmin } = useShop();
    const [depositStats, setDepositStats] = useState({
        pending: 0,
        totalApproved: 0,
        count: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getDeposits = async () => {
            setIsLoading(true);
            const data = await fetchAllDepositsAdmin();
            const approved = data.filter(d => d.status === 'approved');
            const pending = data.filter(d => d.status === 'pending');

            setDepositStats({
                pending: pending.length,
                totalApproved: approved.reduce((sum, d) => sum + d.amount, 0),
                count: approved.length
            });
            setIsLoading(false);
        };
        getDeposits();
    }, []);

    // Financial Analysis
    const approvedOrders = orders.filter(o => ['approved', 'shipped', 'delivered'].includes(o.status?.toLowerCase()));
    const totalSales = approvedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    // Virtual Profit Calculation (Conceptual: Revenue from Sales vs Asset Pool)
    const virtualProfit = totalSales; // Replace with actual Margin if cost data is available

    const stats = [
        {
            label: 'Network Revenue',
            value: `$${totalSales.toFixed(2)}`,
            icon: <TrendingUp />,
            color: 'bg-emerald-600',
            trend: 'Direct Sales',
            isUp: true
        },
        {
            label: 'Synchronized Assets',
            value: `$${depositStats.totalApproved.toFixed(2)}`,
            icon: <Wallet />,
            color: 'bg-indigo-600',
            trend: `${depositStats.count} Deposits`,
            isUp: true
        },
        {
            label: 'Order Latency',
            value: pendingOrders,
            icon: <Clock />,
            color: 'bg-amber-500',
            trend: 'Pending Action',
            isUp: false
        },
        {
            label: 'Deposit Critical',
            value: depositStats.pending,
            icon: <AlertCircle />,
            color: 'bg-rose-500',
            trend: 'Awaiting Sync',
            isUp: false
        },
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Decrypting Core Intelligence...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
                    <p className="text-slate-500 mt-1 font-medium">Global operational metrics and asset flow overview.</p>
                </div>
                <div className="flex items-center gap-3 p-1.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="px-4 py-2 bg-slate-900 rounded-xl">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">System Status</span>
                        <p className="text-white text-xs font-bold mt-0.5">Operational</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 hover:border-indigo-100 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-[1.25rem] text-white ${stat.color} shadow-2xl shadow-${stat.color.split('-')[1]}-200 group-hover:scale-110 transition-transform`}>
                                {React.cloneElement(stat.icon, { className: "w-6 h-6" })}
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {stat.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Insights Layer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Orders Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-8 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden"
                >
                    <div className="p-8 sm:p-10 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Recent Transactions</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium italic">Latest operational pulse from the field</p>
                        </div>
                        <button className="p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                            <MoreVertical className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    <div className="overflow-x-auto text-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-10 py-5 font-black text-slate-400 uppercase tracking-widest text-[10px]">Reference</th>
                                    <th className="px-10 py-5 font-black text-slate-400 uppercase tracking-widest text-[10px]">Agent</th>
                                    <th className="px-10 py-5 font-black text-slate-400 uppercase tracking-widest text-[10px]">Value</th>
                                    <th className="px-10 py-5 font-black text-slate-400 uppercase tracking-widest text-[10px]">Matrix Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.slice(0, 5).map((order) => (
                                    <tr key={order._id || order.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-10 py-6 font-mono text-[11px] font-black text-slate-400">
                                            <span className="bg-white border border-slate-100 px-2 py-1 rounded-lg">#{(order._id || order.id).slice(-8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">
                                                    {(order.customer?.fullName || 'U').charAt(0)}
                                                </div>
                                                <span className="font-black text-slate-900">{order.customer?.fullName || 'Anonymous'}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 font-black text-indigo-600 text-lg">
                                            ${order.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit ${order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'approved'
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                                {order.status || 'Syncing'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Profit/Loss Visualization Placeholder */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-4 space-y-6"
                >
                    <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-8">Asset Liquidity Index</h4>

                        <div className="space-y-8 relative z-10">
                            <div>
                                <p className="text-slate-400 text-xs font-bold mb-2">Total Net Intake (Approved Deposits)</p>
                                <p className="text-4xl font-black text-white">${depositStats.totalApproved.toFixed(2)}</p>
                            </div>

                            <div>
                                <p className="text-slate-400 text-xs font-bold mb-2">Inventory Outflow (Approved Sales)</p>
                                <p className="text-4xl font-black text-indigo-400">${totalSales.toFixed(2)}</p>
                            </div>

                            <div className="pt-8 border-t border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Operational Surplus</span>
                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest">Growth 100%</span>
                                </div>
                                <p className="text-5xl font-black text-emerald-400 tracking-tighter">${totalSales.toFixed(2)}</p>
                                <p className="text-[10px] text-slate-500 mt-2 italic">* Virtual tracking based on verified order execution.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/10 rounded-2xl">
                                <Box className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Inventory State</p>
                                <p className="text-xl font-black">{products.length} Items Live</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
