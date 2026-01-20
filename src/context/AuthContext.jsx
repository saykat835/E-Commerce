import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const syncInterval = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    // Initialize Auth State from LocalStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Valid user check: must have ID, Token and not be the phantom "Test User"
                if (parsedUser && parsedUser._id && parsedUser.token && parsedUser.name !== 'Test User') {
                    setUser(parsedUser);
                } else {
                    console.log('Invalid user data found, clearing...');
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

    // Helper to persist user and update state
    const saveUser = (userData) => {
        if (!userData) {
            setUser(null);
            localStorage.removeItem('user');
            return;
        }
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            if (res.data) {
                saveUser(res.data);
                return { success: true, user: res.data };
            }
            return { success: false, message: 'Invalid response from server' };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (name, email, password, phone) => {
        try {
            const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password, phone });
            if (res.data) {
                saveUser(res.data);
                return { success: true, user: res.data };
            }
            return { success: false, message: 'Invalid response from server' };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Signup failed' };
        }
    };

    const logout = () => {
        if (syncInterval.current) clearInterval(syncInterval.current);
        saveUser(null);
    };

    const updateProfile = async (userData) => {
        if (!user?.token) return { success: false, message: 'No auth token found' };
        try {
            const res = await axios.put(`${API_URL}/auth/profile`, userData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Ensure token is preserved if backend doesn't return a new one
            const updatedUser = { ...user, ...res.data };
            if (res.data.token) updatedUser.token = res.data.token;

            saveUser(updatedUser);
            return { success: true, user: updatedUser };
        } catch (err) {
            // Auto-logout if token is rejected
            if (err.response?.status === 401) logout();
            return { success: false, message: err.response?.data?.message || 'Update failed' };
        }
    };

    const syncBalance = async () => {
        // Only sync if user is active and has a token
        if (!user?.token) return;

        try {
            const res = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            // Critical: Only update if we get valid data and preserve the token
            if (res.data && res.data._id) {
                const updatedUser = { ...user, ...res.data };
                // Don't let sync data overwrite the token if not present in /me response
                if (!res.data.token) updatedUser.token = user.token;

                // Only update state if something actually changed to avoid re-renders
                if (JSON.stringify(user) !== JSON.stringify(updatedUser)) {
                    saveUser(updatedUser);
                }
            }
        } catch (err) {
            console.error('Data sync failed', err.message);
            // If the error is 401 (Unauthorized), user session has expired
            if (err.response?.status === 401) {
                console.warn('Session expired, logging out...');
                logout();
            }
        }
    };

    // Global Sync Interval Management
    useEffect(() => {
        if (user && user.token) {
            if (!syncInterval.current) {
                syncInterval.current = setInterval(syncBalance, 30000);
            }
        } else {
            if (syncInterval.current) {
                clearInterval(syncInterval.current);
                syncInterval.current = null;
            }
        }
        return () => {
            if (syncInterval.current) {
                clearInterval(syncInterval.current);
                syncInterval.current = null;
            }
        };
    }, [user]);

    const isAdmin = () => user?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user, login, register: signup, logout, isAdmin, loading,
            updateProfile, syncBalance
        }}>
            {children}
        </AuthContext.Provider>
    );
};
