import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Ensure the user has a real ID and name, not just dummy data
                if (parsedUser && parsedUser._id && parsedUser.name !== 'Test User') {
                    setUser(parsedUser);
                } else {
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } catch (err) {
                localStorage.removeItem('user');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            return { success: true, user: res.data };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (name, email, password, phone) => {
        try {
            const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password, phone });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            return { success: true, user: res.data };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Signup failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const updateProfile = async (userData) => {
        try {
            const res = await axios.put(`${API_URL}/auth/profile`, userData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Merge existing token with updated user data correctly
            const updatedUser = { ...res.data, token: user.token };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return { success: true, user: updatedUser };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Update failed' };
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`${API_URL}/auth/users/${userId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Delete failed' };
        }
    };

    const updateUserBalance = async (userId, balance) => {
        try {
            const res = await axios.put(`${API_URL}/auth/users/${userId}/balance`, { balance }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            return { success: true, data: res.data };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Update failed' };
        }
    };

    const getUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/users`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            return res.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const syncBalance = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Update all user fields dynamically without overwriting token
            const updatedUser = { ...user, ...res.data };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (err) {
            console.error('Data sync failed', err);
        }
    };

    useEffect(() => {
        if (user) {
            const interval = setInterval(syncBalance, 30000); // Sync every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    const isAdmin = () => user?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user, login, register: signup, logout, isAdmin, loading,
            updateProfile, getUsers, deleteUser, updateUserBalance, syncBalance
        }}>
            {children}
        </AuthContext.Provider>
    );
};
