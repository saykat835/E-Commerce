import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plus, Trash2, Image as ImageIcon, Tag, DollarSign, Package, X, Search, Filter, Edit3, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AdminProducts = () => {
    const { products, fetchProducts } = useShop();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        image: '',
        stock: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const openAddModal = () => {
        setEditMode(false);
        setFormData({ name: '', category: '', price: '', image: '', stock: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditMode(true);
        setSelectedId(product._id || product.id);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            stock: product.stock || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
            if (editMode) {
                await axios.put(`${API_URL}/products/${selectedId}`, formData, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            } else {
                await axios.post(`${API_URL}/products`, formData, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            }

            Swal.fire({
                icon: 'success',
                title: editMode ? 'Product Updated' : 'Product Added',
                text: 'Inventory has been synchronized.',
                background: '#fff',
                color: '#1e293b',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });

            setIsModalOpen(false);
            fetchProducts();
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to synchronize product data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete product?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Delete Forever',
            background: '#fff',
            color: '#1e293b',
        });

        if (result.isConfirmed) {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                await axios.delete(`${API_URL}/products/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                Swal.fire('Deleted', 'Product removed from catalog.', 'success');
                fetchProducts();
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'Failed to delete product', 'error');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Catalog Management</h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Control the flow of assets and inventory availability.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" /> Add New Asset
                </button>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search inventory matrix..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold"
                        />
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{products.length} Products Live</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-left font-black text-slate-400 uppercase tracking-widest text-[10px]">Preview</th>
                                <th className="px-8 py-5 text-left font-black text-slate-400 uppercase tracking-widest text-[10px]">Product Info</th>
                                <th className="px-8 py-5 text-left font-black text-slate-400 uppercase tracking-widest text-[10px]">Category</th>
                                <th className="px-8 py-5 text-left font-black text-slate-400 uppercase tracking-widest text-[10px]">Price</th>
                                <th className="px-8 py-5 text-right font-black text-slate-400 uppercase tracking-widest text-[10px]">Protocols</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {products.map((product) => (
                                <tr key={product._id || product.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="w-16 h-16 rounded-[1.2rem] bg-slate-100 overflow-hidden border border-slate-200 shadow-inner relative group">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-black text-slate-900 text-base leading-tight">{product.name}</div>
                                        <div className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-tighter tabular-nums">Ref: {(product._id || product.id).slice(-8).toUpperCase()}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
                                            <Tag className="w-3 h-3 text-indigo-500" /> {product.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-black text-indigo-600 text-xl tracking-tighter">${product.price.toFixed(2)}</div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                                                title="Edit Protocol"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id || product.id)}
                                                className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                                                title="Terminate Item"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/20"
                        >
                            <div className="p-10 sm:p-14">
                                <div className="flex justify-between items-center mb-10">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-4 rounded-[1.5rem] shadow-lg ${editMode ? 'bg-amber-50 text-amber-600 shadow-amber-100' : 'bg-indigo-600 text-white shadow-indigo-100'}`}>
                                            {editMode ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                                {editMode ? 'Modify Asset' : 'Register New Asset'}
                                            </h2>
                                            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                {editMode ? 'UPDATING INVENTORY NODE' : 'INITIALIZING PRODUCT LOGIC'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"
                                    >
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Label (Name)</label>
                                        <div className="relative group">
                                            <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                type="text" id="name" required value={formData.name} onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-5 bg-slate-50 border-none rounded-[1.5rem] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900"
                                                placeholder="e.g. Virtual Reality Interface"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logic Node (Category)</label>
                                            <div className="relative group">
                                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <input
                                                    type="text" id="category" required value={formData.category} onChange={handleChange}
                                                    className="w-full pl-12 pr-4 py-5 bg-slate-50 border-none rounded-[1.5rem] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900"
                                                    placeholder="Electronics"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Value (Price)</label>
                                            <div className="relative group">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <input
                                                    type="number" id="price" required step="0.01" value={formData.price} onChange={handleChange}
                                                    className="w-full pl-12 pr-4 py-5 bg-slate-50 border-none rounded-[1.5rem] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900"
                                                    placeholder="99.99"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Asset URL (Image)</label>
                                        <div className="relative group">
                                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                type="text" id="image" required value={formData.image} onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-5 bg-slate-50 border-none rounded-[1.5rem] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`w-full py-6 rounded-[1.8rem] font-black text-lg transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4 ${editMode ? 'bg-slate-900 text-white shadow-slate-200' : 'bg-indigo-600 text-white shadow-indigo-200'}`}
                                        >
                                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (editMode ? <Save className="w-6 h-6" /> : <Plus className="w-6 h-6" />)}
                                            {editMode ? 'Commit Changes' : 'Execute Registration'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProducts;
