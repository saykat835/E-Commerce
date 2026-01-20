import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import Swal from 'sweetalert2';
import { Search, Clock, CheckCircle2, XCircle, User, Hash, DollarSign, ExternalLink, Filter, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDeposits = () => {
    const { fetchAllDepositsAdmin, updateDepositStatus } = useShop();
    const [allDeposits, setAllDeposits] = useState([]);
    const [filteredDeposits, setFilteredDeposits] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    const loadDeposits = async () => {
        setIsLoading(true);
        const data = await fetchAllDepositsAdmin();
        setAllDeposits(data);
        setFilteredDeposits(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadDeposits();
    }, []);

    useEffect(() => {
        let filtered = allDeposits.filter(d =>
            d.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (d.senderNumber && d.senderNumber.includes(searchQuery))
        );

        if (statusFilter !== 'all') {
            filtered = filtered.filter(d => d.status === statusFilter);
        }

        setFilteredDeposits(filtered);
    }, [searchQuery, statusFilter, allDeposits]);

    const [actionLoading, setActionLoading] = useState(null);

    const handleAction = async (deposit, status) => {
        const result = await Swal.fire({
            title: `Confirm ${status.toUpperCase()}`,
            text: `Are you sure you want to ${status} this deposit of $${deposit.amount.toFixed(2)}?`,
            icon: status === 'approved' ? 'question' : 'warning',
            showCancelButton: true,
            confirmButtonColor: status === 'approved' ? '#10b981' : '#f43f5e',
            confirmButtonText: `Yes, ${status}`
        });

        if (result.isConfirmed) {
            setActionLoading(deposit._id);
            const res = await updateDepositStatus(deposit._id, status);
            setActionLoading(null);
            if (res.success) {
                Swal.fire('Updated', `Deposit ${status} successfully.`, 'success');
                loadDeposits();
            } else {
                Swal.fire('Error', res.message, 'error');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Logistics</h1>
                    <p className="text-slate-500 mt-1 font-medium">Review and synchronize manual asset refill requests.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group max-w-xs w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find TRXT ID, User or Phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all cursor-pointer shadow-sm"
                        >
                            <option value="all">Global Protocols</option>
                            <option value="pending">Pending Sync</option>
                            <option value="approved">Synchronized</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity / Method</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Send From</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Ref Code</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Value</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Execution</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredDeposits.map((deposit, index) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={deposit._id}
                                    className="group hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg border border-indigo-100 shadow-sm">
                                                {deposit.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 leading-none text-sm">{deposit.user?.name || 'Unknown'}</p>
                                                <div className="flex items-center gap-1.5 mt-2">
                                                    <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase tracking-widest">{deposit.method}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                            <Phone className="w-3.5 h-3.5 text-slate-300" />
                                            {deposit.senderNumber || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-2">
                                            <Hash className="w-3.5 h-3.5 text-slate-300" />
                                            <span className="font-mono text-[11px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{deposit.transactionId}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-1 text-slate-900 font-black text-lg">
                                            <DollarSign className="w-4 h-4 text-emerald-500" />
                                            {deposit.amount.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <p className="text-[11px] font-bold text-slate-900">{new Date(deposit.createdAt).toLocaleDateString()}</p>
                                        <p className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-wider">{new Date(deposit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-2">
                                            {deposit.status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(deposit, 'approved')}
                                                        disabled={actionLoading === deposit._id}
                                                        className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-100 hover:scale-110 active:scale-95 disabled:opacity-50"
                                                        title="Approve Logic"
                                                    >
                                                        {actionLoading === deposit._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(deposit, 'rejected')}
                                                        disabled={actionLoading === deposit._id}
                                                        className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm border border-rose-100 hover:scale-110 active:scale-95 disabled:opacity-50"
                                                        title="Reject Request"
                                                    >
                                                        {actionLoading === deposit._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                                                    </button>
                                                </>
                                            ) : (
                                                <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${deposit.status === 'approved'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-rose-50 text-rose-600 border-rose-100'
                                                    }`}>
                                                    {deposit.status}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {filteredDeposits.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-8 bg-slate-50 rounded-[3rem]">
                                                <Clock className="w-16 h-16 text-slate-200" />
                                            </div>
                                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active asset requests found in the grid.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDeposits;
