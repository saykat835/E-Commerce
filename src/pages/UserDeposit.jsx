import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Swal from 'sweetalert2';
import { Wallet, Landmark, Copy, CheckCircle2, AlertCircle, Clock, Send, History, DollarSign, Phone, Image as ImageIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserDeposit = () => {
    const { paymentMethods, requestDeposit, fetchMyDeposits, deposits } = useShop();
    const { user, syncBalance } = useAuth();
    const { t, language } = useLanguage();
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [amount, setAmount] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [senderNumber, setSenderNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        fetchMyDeposits();
        syncBalance();
    }, []);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        Swal.fire({
            title: language === 'en' ? 'Copied!' : 'কপি হয়েছে!',
            text: language === 'en' ? 'Number copied to clipboard' : 'নম্বরটি ক্লিপবোর্ডে কপি করা হয়েছে',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMethod) return Swal.fire('Error', 'Please select a payment method', 'error');
        if (parseFloat(amount) <= 0) return Swal.fire('Error', 'Invalid amount', 'error');
        if (senderNumber.length < 10) return Swal.fire('Error', 'Invalid sender number', 'error');

        setIsSubmitting(true);
        const result = await requestDeposit({
            method: selectedMethod.name,
            amount: parseFloat(amount),
            transactionId,
            senderNumber
        });
        setIsSubmitting(false);

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Sync Initialized',
                text: 'Your deposit protocol is being verified.',
                confirmButtonColor: '#4f46e5',
                background: '#fff',
                color: '#1e293b'
            });
            setAmount('');
            setTransactionId('');
            setSenderNumber('');
            setSelectedMethod(null);
            fetchMyDeposits();
            setShowHistory(true);
        } else {
            Swal.fire('Failed', result.message, 'error');
        }
    };

    return (
        <div className="min-h-screen pt-40 pb-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
            {/* Background nodes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-40" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-50 rounded-full blur-3xl -ml-48 -mb-48 opacity-40" />

            <div className="max-w-6xl mx-auto space-y-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-indigo-100 italic">
                            <Wallet className="w-3 h-3" /> Asset Uplink Terminal
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Financial Center</h1>
                        <p className="text-slate-500 mt-2 font-medium">Refuel your account through our manual synchronization matrix.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-8 py-4 bg-white border border-slate-100 rounded-[1.8rem] shadow-2xl shadow-slate-100 flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Available Credits</span>
                            <span className="text-3xl font-black text-indigo-600 tracking-tighter tabular-nums">${user?.balance?.toFixed(2) || '0.00'}</span>
                        </div>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className={`p-6 rounded-[1.8rem] transition-all shadow-2xl ${showHistory ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-slate-950 text-white shadow-slate-200'}`}
                            title={showHistory ? 'New Deposit' : 'View History'}
                        >
                            {showHistory ? <Send className="w-6 h-6" /> : <History className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!showHistory ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                        >
                            {/* Method Selection */}
                            <div className="lg:col-span-7 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Landmark className="w-4 h-4" /> 01. Gateway Selection
                                    </h2>
                                    <div className="flex gap-1">
                                        {[1, 2].map(i => (
                                            <div key={i} className={`w-8 h-1 rounded-full ${i === 1 ? 'bg-indigo-600' : 'bg-indigo-100'}`} />
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {paymentMethods.map(method => (
                                        <motion.button
                                            whileHover={{ y: -8, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            key={method._id}
                                            onClick={() => setSelectedMethod(method)}
                                            className={`group rounded-[2.5rem] border-2 text-left transition-all p-2 relative overflow-hidden ${selectedMethod?._id === method._id
                                                ? 'border-indigo-600 bg-indigo-50/20'
                                                : 'border-transparent bg-white shadow-xl shadow-slate-200/40 hover:shadow-2xl'
                                                }`}
                                        >
                                            <div className="aspect-[3/2] rounded-[2rem] overflow-hidden relative bg-slate-50 mb-4 border border-slate-100 shadow-inner">
                                                {method.image ? (
                                                    <img src={method.image} alt={method.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                        <ImageIcon className="w-16 h-16" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="px-6 pb-6">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{method.name}</h3>
                                                    {selectedMethod?._id === method._id && (
                                                        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-4 italic">Verified Settlement Node</p>

                                                <div className="flex items-center justify-between p-4 bg-slate-50/80 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                                                    <span className="font-mono font-black text-slate-700 tracking-wider tabular-nums">{method.number}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleCopy(method.number); }}
                                                        className="p-2.5 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Submission Form */}
                            <div className="lg:col-span-5 space-y-8">
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Send className="w-4 h-4" /> 02. Data Synchronization
                                </h2>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-[3.5rem] p-10 sm:p-12 shadow-2xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full -translate-y-24 translate-x-24 blur-3xl opacity-60" />

                                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Allocation ($)</label>
                                            <div className="relative group">
                                                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                                <input
                                                    type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)}
                                                    className="w-full pl-16 pr-6 py-6 bg-slate-50 border-none rounded-[1.8rem] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-2xl text-slate-900 tabular-nums"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal Origin (Sender #)</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                                <input
                                                    type="tel" required value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)}
                                                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[1.5rem] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900"
                                                    placeholder="017XXXXXXXX"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transaction Pulse Code (TXID)</label>
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors font-black flex items-center justify-center">#</div>
                                                <input
                                                    type="text" required value={transactionId} onChange={(e) => setTransactionId(e.target.value)}
                                                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[1.5rem] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-mono font-bold text-slate-900 uppercase"
                                                    placeholder="8XJ2K9LPR..."
                                                />
                                            </div>
                                        </div>

                                        <div className="p-6 bg-indigo-50/50 rounded-[1.8rem] border border-indigo-100 flex items-start gap-4">
                                            <div className="p-2 bg-indigo-100 rounded-xl">
                                                <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                                            </div>
                                            <p className="text-xs text-indigo-900 leading-relaxed font-bold italic">
                                                Please double-check your credentials. High-priority verification cycles typically finish within 120 nanoseconds (or 15 minutes).
                                            </p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !selectedMethod}
                                            className="w-full py-6 bg-slate-900 hover:bg-indigo-600 text-white rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 disabled:grayscale uppercase tracking-widest flex items-center justify-center gap-4"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>Authorize Asset Sync <ArrowRight className="w-6 h-6" /></>
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[3.5rem] border border-slate-50 shadow-2xl shadow-slate-200/50 overflow-hidden"
                        >
                            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Synchronization Logs</h3>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic font-mono">Historical Data Node</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/80">
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 italic">Execution Matrix</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 italic">Gateway Target</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 italic">Network ID</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 italic">Asset Value</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 italic text-right">Integrity Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {deposits.map((deposit, idx) => (
                                            <tr key={deposit._id} className="hover:bg-indigo-50/20 transition-all group">
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col">
                                                        <span className="text-base font-black text-slate-900 tracking-tight">{new Date(deposit.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        <span className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-wider tabular-nums">{new Date(deposit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all">{deposit.method}</span>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">TXID:</span>
                                                        <code className="text-xs font-black text-slate-900 font-mono tracking-widest uppercase">{deposit.transactionId}</code>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">${deposit.amount.toFixed(2)}</div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.1em] border-2 shadow-sm ${deposit.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        deposit.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-50' : 'bg-rose-50 text-rose-700 border-rose-100'
                                                        }`}>
                                                        {deposit.status === 'pending' ? <Clock className="w-4 h-4" /> :
                                                            deposit.status === 'approved' ? <ShieldCheck className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                        {t(`common.${deposit.status}`)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {deposits.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-10 py-32 text-center">
                                                    <div className="flex flex-col items-center gap-6">
                                                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                                                            <History className="w-12 h-12 text-slate-200" />
                                                        </div>
                                                        <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">Clear Log Matrix: No historical data detected.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserDeposit;
