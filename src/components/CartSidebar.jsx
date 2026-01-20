import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddressModal from './AddressModal';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CartSidebar = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal } = useShop();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const handleCheckout = () => {
        if (cart.length === 0) return;

        if (!user) {
            setIsCartOpen(false);
            navigate('/login');
            return;
        }

        setIsCartOpen(false);
        setIsAddressModalOpen(true);
    };

    return (
        <>
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
                        />

                        {/* Sidebar */}
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-[101] flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 leading-tight">Your Cart</h2>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{cart.length} Items</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors group"
                                >
                                    <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                            <ShoppingCart className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">Cart is empty</h3>
                                        <p className="text-slate-500 text-sm mb-8">Start adding some items to your collection and watch them appear here.</p>
                                        <button
                                            onClick={() => setIsCartOpen(false)}
                                            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                                        >
                                            Explore Store
                                        </button>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={item.id}
                                            className="flex gap-4 group"
                                        >
                                            <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{item.name}</h4>
                                                    <p className="text-indigo-600 font-black text-sm mt-0.5">${item.price.toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100 shadow-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="p-1 hover:bg-white rounded-md transition-colors text-slate-400 hover:text-indigo-600"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-black text-slate-700">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="p-1 hover:bg-white rounded-md transition-colors text-slate-400 hover:text-indigo-600"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                                    <div className="flex items-center justify-between mb-6 px-2">
                                        <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Grand Total</span>
                                        <span className="text-2xl font-black text-slate-900">${getCartTotal().toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        Place Order <ArrowRight className="w-5 h-5 animate-pulse" />
                                    </button>
                                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-4">
                                        Tax and shipping calculated at checkout
                                    </p>
                                </div>
                            )}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
            />
        </>
    );
};

export default CartSidebar;

