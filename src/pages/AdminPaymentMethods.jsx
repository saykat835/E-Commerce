import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import Swal from 'sweetalert2';
import { Plus, Landmark, Phone, Info, Trash2, Edit, Save, X, ToggleLeft, ToggleRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPaymentMethods = () => {
    const { fetchAllPaymentMethodsAdmin, savePaymentMethod, deletePaymentMethod } = useShop();
    const [methods, setMethods] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMethod, setCurrentMethod] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        instructions: '',
        image: '',
        isActive: true
    });

    const loadMethods = async () => {
        setIsLoading(true);
        const data = await fetchAllPaymentMethodsAdmin();
        setMethods(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadMethods();
    }, []);

    const handleEdit = (method) => {
        setCurrentMethod(method);
        setFormData({
            name: method.name,
            number: method.number,
            instructions: method.instructions,
            image: method.image || '',
            isActive: method.isActive
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Terminate Method?',
            text: "This will remove the payment gateway permanently.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Confirm Termination'
        });

        if (result.isConfirmed) {
            const res = await deletePaymentMethod(id);
            if (res.success) {
                Swal.fire('Deleted', 'Payment method removed.', 'success');
                loadMethods();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = currentMethod ? { ...formData, id: currentMethod._id } : formData;
        const res = await savePaymentMethod(data);
        if (res.success) {
            Swal.fire('Success', 'Gateway updated successfully.', 'success');
            setIsModalOpen(false);
            setCurrentMethod(null);
            setFormData({ name: '', number: '', instructions: '', image: '', isActive: true });
            loadMethods();
        } else {
            Swal.fire('Error', res.message, 'error');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Payment Gateways</h1>
                    <p className="text-slate-500 mt-1">Configure manual refill channels for your customer base.</p>
                </div>
                <button
                    onClick={() => { setCurrentMethod(null); setFormData({ name: '', number: '', instructions: '', image: '', isActive: true }); setIsModalOpen(true); }}
                    className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-100 hover:bg-slate-900 active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Initialize New Gateway
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {methods.map((method) => (
                    <motion.div
                        layout
                        key={method._id}
                        className={`bg-white rounded-[2.5rem] border ${method.isActive ? 'border-slate-100' : 'border-slate-200 bg-slate-50/50'} shadow-xl shadow-slate-200/50 relative group overflow-hidden flex flex-col`}
                    >
                        {!method.isActive && (
                            <div className="absolute top-6 right-6 z-10 px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                                Offline
                            </div>
                        )}

                        <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                            {method.image ? (
                                <img src={method.image} alt={method.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/60 to-transparent">
                                <h3 className="text-xl font-black text-white leading-tight">{method.name}</h3>
                                <p className="text-indigo-300 text-xs font-bold mt-1 tracking-wider uppercase">{method.number}</p>
                            </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl mb-8 border border-slate-100 group-hover:bg-white transition-colors">
                                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-500 leading-relaxed italic">
                                    {method.instructions || 'No specific instructions provided.'}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-50">
                                <button
                                    onClick={() => handleEdit(method)}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white hover:bg-indigo-600 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
                                >
                                    <Edit className="w-4 h-4" /> Configure
                                </button>
                                <button
                                    onClick={() => handleDelete(method._id)}
                                    className="p-4 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all shadow-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl relative z-10"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-slate-900">
                                    {currentMethod ? 'Operational Update' : 'Initialize Gateway'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                                        <input
                                            required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold"
                                            placeholder="BKASH, NAGAD..."
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Number</label>
                                        <input
                                            required value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold"
                                            placeholder="+880123... "
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Instructions</label>
                                    <textarea
                                        rows="3" value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold"
                                        placeholder="Specific steps for the user..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Gateway Branding (Image URL)</label>
                                    <div className="relative group">
                                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold"
                                            placeholder="https://...logos/bkash.png"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <span className="text-sm font-bold text-slate-600 uppercase tracking-widest text-[10px]">Operational Status</span>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className={`transition-colors ${formData.isActive ? 'text-indigo-600' : 'text-slate-300'}`}
                                    >
                                        {formData.isActive ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black text-lg transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3"
                                >
                                    <Save className="w-5 h-5" /> {currentMethod ? 'Commit Changes' : 'Activate Gateway'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPaymentMethods;
