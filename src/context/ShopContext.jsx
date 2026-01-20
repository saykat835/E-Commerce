import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [settings, setSettings] = useState(null);
    const [deposits, setDeposits] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchSettings();
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        try {
            const res = await axios.get(`${API_URL}/payment-methods`);
            setPaymentMethods(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAllPaymentMethodsAdmin = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return [];
        const user = JSON.parse(storedUser);
        try {
            const res = await axios.get(`${API_URL}/payment-methods/admin`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            return res.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const savePaymentMethod = async (methodData) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return { success: false };
        const user = JSON.parse(storedUser);
        try {
            await axios.post(`${API_URL}/payment-methods`, methodData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchPaymentMethods();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Save failed' };
        }
    };

    const deletePaymentMethod = async (id) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return { success: false };
        const user = JSON.parse(storedUser);
        try {
            await axios.delete(`${API_URL}/payment-methods/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchPaymentMethods();
            return { success: true };
        } catch (err) {
            return { success: false };
        }
    };

    const requestDeposit = async (depositData) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return { success: false };
        const user = JSON.parse(storedUser);
        try {
            await axios.post(`${API_URL}/deposits`, depositData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Request failed' };
        }
    };

    const fetchMyDeposits = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        try {
            const res = await axios.get(`${API_URL}/deposits/mydeposits`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setDeposits(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAllDepositsAdmin = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return [];
        const user = JSON.parse(storedUser);
        try {
            const res = await axios.get(`${API_URL}/deposits`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            return res.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const updateDepositStatus = async (id, status) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return { success: false };
        const user = JSON.parse(storedUser);
        try {
            await axios.put(`${API_URL}/deposits/${id}`, { status }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Update failed' };
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await axios.get(`${API_URL}/settings`);
            setSettings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateSettings = async (settingsData) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return { success: false, message: 'Not authorized' };
        const user = JSON.parse(storedUser);

        try {
            const res = await axios.put(`${API_URL}/settings`, settingsData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setSettings(res.data);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Update failed' };
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API_URL}/products`);
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
            // Fallback for demo
            setProducts([
                { id: '1', name: 'Premium Wireless Headphones', price: 129.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
                { id: '2', name: 'Smart Watch Series 7', price: 299.99, category: 'Electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
                { id: '3', name: 'Classic Leather Backpack', price: 79.99, category: 'Fashion', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' }
            ]);
        }
    };

    const fetchOrders = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            setOrders([]);
            return;
        }
        const user = JSON.parse(storedUser);

        try {
            const endpoint = user.role === 'admin' ? '/orders' : '/orders/myorders';
            const res = await axios.get(`${API_URL}${endpoint}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addToCart = (product) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <ShopContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity,
            isCartOpen, setIsCartOpen, clearCart, getCartTotal,
            products, fetchProducts, orders, fetchOrders, loading,
            searchQuery, setSearchQuery, settings, fetchSettings, updateSettings,
            paymentMethods, fetchPaymentMethods, fetchAllPaymentMethodsAdmin, savePaymentMethod, deletePaymentMethod,
            deposits, requestDeposit, fetchMyDeposits, fetchAllDepositsAdmin, updateDepositStatus
        }}>
            {children}
        </ShopContext.Provider>
    );
};
