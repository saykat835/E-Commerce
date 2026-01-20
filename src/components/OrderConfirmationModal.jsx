import React from 'react';
import { CheckCircle2, Package, Calendar, Tag, ArrowRight, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderConfirmationModal = ({ isOpen, onClose, order }) => {
    return (
        <AnimatePresence>
            {isOpen && order && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="p-10 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                                className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 relative"
                            >
                                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-emerald-100 rounded-full -z-10 opacity-50"
                                />
                            </motion.div>

                            <h2 className="text-3xl font-black text-slate-900 mb-2">Order Confirmed!</h2>
                            <p className="text-slate-500">Thank you, {order.customer?.fullName?.split(' ')[0]}.<br />Your exclusive collection is on its way.</p>

                            <div className="mt-10 bg-slate-50 rounded-[2rem] p-8 text-left space-y-4 border border-slate-100">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Package className="w-3 h-3" /> Order Intelligence
                                </h3>

                                <div className="flex justify-between items-center group">
                                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">Order Reference</span>
                                    <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">#{(order._id || order.id).slice(-8).toUpperCase()}</span>
                                </div>

                                <div className="flex justify-between items-center group">
                                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">Total Investment</span>
                                    <span className="text-lg font-black text-slate-900">${order.totalAmount.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center group">
                                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">Logistics Status</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">Processing</span>
                                </div>

                                <div className="flex justify-between items-center group">
                                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">Arrival Window</span>
                                    <span className="text-sm font-black text-slate-900 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-500" /> 3-5 Business Days</span>
                                </div>
                            </div>

                            <div className="mt-10 bg-indigo-600/5 rounded-2xl p-4 flex items-center gap-4 text-left border border-indigo-100/50">
                                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shrink-0">
                                    <PartyPopper className="w-5 h-5" />
                                </div>
                                <p className="text-[11px] font-bold text-indigo-700 leading-relaxed">
                                    A confirmation email with tracking details will be dispatched as soon as your items leave our vault.
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full mt-10 py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 group"
                            >
                                Continue Experience <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default OrderConfirmationModal;

