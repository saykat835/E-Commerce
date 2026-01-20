import React from 'react';
import { useShop } from '../context/ShopContext';
import { useLanguage } from '../context/LanguageContext';
import { ClipboardList, Package, Calendar, Tag, CheckCircle2, Clock, Truck, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Orders = () => {
    const { orders } = useShop();
    const { t, language } = useLanguage();

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

    const getStatusText = (status) => {
        const s = status?.toLowerCase() || 'pending';
        return t(`common.${s}`);
    };

    return (
        <main className="min-h-screen pt-40 pb-24 bg-white relative overflow-hidden">
            {/* Background logic nodes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl -mr-48 -mt-48 opacity-40" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-50 rounded-full blur-3xl -ml-48 -mb-48 opacity-40" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-indigo-100">
                            <ClipboardList className="w-3 h-3" /> Transaction Matrix
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{t('nav.orders')}</h1>
                        <p className="text-slate-500 mt-2 font-medium italic">Monitoring your asset acquisition logs</p>
                    </div>
                    <div className="px-8 py-4 bg-white border border-slate-100 rounded-[1.8rem] shadow-xl shadow-slate-200/50 flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{orders.length} Active Records</span>
                        <span className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums text-right">
                            ${orders.reduce((sum, order) => sum + (order.status !== 'cancelled' ? order.totalAmount : 0), 0).toFixed(2)}
                            <span className="text-[10px] text-slate-300 ml-2 uppercase">Total Invested</span>
                        </span>
                    </div>
                </div>

                <div className="space-y-10">
                    {orders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-32 px-10 bg-white rounded-[3.5rem] shadow-2xl shadow-slate-100 border border-slate-50"
                        >
                            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <Package className="w-12 h-12 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">No acquisition logs detected</h3>
                            <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">Your portfolio is currently waiting for asset deployment. Initialize your first acquisition protocol now.</p>
                            <a href="/" className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-100 active:scale-95 group">
                                Start Shopping <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </a>
                        </motion.div>
                    ) : (
                        orders.map((order, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={order._id || order.id}
                                className="bg-white rounded-[3rem] shadow-xl shadow-slate-100 border border-slate-50 overflow-hidden group hover:shadow-2xl hover:border-indigo-100 transition-all duration-500"
                            >
                                {/* Order Header */}
                                <div className="p-8 sm:p-10 bg-slate-50/50 flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Record ID</span>
                                            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 shadow-sm tabular-nums">
                                                #{(order._id || order.id).slice(-12).toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="flex flex-col border-l border-slate-200 pl-6">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Timestamp</span>
                                            <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
                                                <Calendar className="w-4 h-4 text-indigo-500" />
                                                <span>{new Date(order.createdAt || Date.now()).toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-[1.2rem] border-2 text-[10px] font-black uppercase tracking-[0.1em] shadow-sm transition-transform duration-500 group-hover:scale-105 ${getStatusStyles(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {getStatusText(order.status)}
                                    </div>
                                </div>

                                {order.status === 'cancelled' && order.cancellationReason && (
                                    <div className="mx-8 mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4">
                                        <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Cancellation Intelligence</p>
                                            <p className="text-sm font-bold text-rose-900 leading-relaxed italic">"{order.cancellationReason}"</p>
                                        </div>
                                    </div>
                                )}

                                {/* Order Items */}
                                <div className="p-8 sm:p-10 space-y-8 bg-white">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex gap-8 items-center border-b border-slate-50 last:border-0 pb-8 last:pb-0">
                                            <div className="w-24 h-24 bg-slate-100 rounded-[2rem] overflow-hidden flex-shrink-0 border border-slate-200 shadow-inner group/img relative">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover/img:scale-110 duration-700" />
                                                <div className="absolute inset-0 bg-indigo-600/0 group-hover/img:bg-indigo-600/5 transition-all"></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate tracking-tight">{item.name}</h4>
                                                <div className="flex items-center gap-6 mt-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Quantity</span>
                                                        <span className="text-sm font-black text-slate-800 tabular-nums">x{item.quantity}</span>
                                                    </div>
                                                    <div className="w-[1px] h-6 bg-slate-100"></div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Asset Value</span>
                                                        <span className="text-sm font-black text-indigo-600 tabular-nums">${item.price.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer */}
                                <div className="px-8 py-10 sm:px-10 bg-slate-950 flex items-center justify-between text-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-[1.2rem] bg-white/10 flex items-center justify-center">
                                            <Tag className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('common.total')} {t('common.items')}</span>
                                            <span className="text-lg font-black">{order.items.length} {language === 'en' ? 'Elements' : 'পণ্য'}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-1">Matrix Settlement</div>
                                        <div className="text-4xl font-black tracking-tighter tabular-nums text-white">${order.totalAmount.toFixed(2)}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
};

export default Orders;
