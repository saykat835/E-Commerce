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
        const loadStoredUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);

                    // GHOST USER KILLER: Explicitly check for suspicious data
                    const isGhostUser =
                        parsedUser.name === 'Test User' ||
                        parsedUser.email === 'test123456@test.com' ||
                        parsedUser._id === '696f49b7e463c5cd1d38c28d';

                    if (isGhostUser) {
                        console.warn('Ghost User detected! Wiping from storage...');
                        localStorage.removeItem('user');
                        setUser(null);
                        return;
                    }

                    if (parsedUser && parsedUser.token && parsedUser._id) {
                        setUser(parsedUser);
                    }
                } catch (err) {
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadStoredUser();
    }, []);

    const saveUser = (userData) => {
        if (!userData) {
            setUser(null);
            localStorage.removeItem('user');
        } else {
            // Merge carefully to not lose token
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            if (res.data && res.data.token) {
                saveUser(res.data);
                return { success: true, user: res.data };
            }
            return { success: false, message: 'Login failed: Invalid data from server' };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (name, email, password, phone) => {
        try {
            const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password, phone });
            if (res.data && res.data.token) {
                saveUser(res.data);
                return { success: true, user: res.data };
            }
            return { success: false, message: 'Signup failed: Invalid data from server' };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Signup failed' };
        }
    };

    const logout = () => {
        if (syncInterval.current) {
            clearInterval(syncInterval.current);
            syncInterval.current = null;
        }
        saveUser(null);
    };

    const updateProfile = async (userData) => {
        if (!user?.token) return { success: false, message: 'Session expired' };
        try {
            const res = await axios.put(`${API_URL}/auth/profile`, userData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Update state while keeping the newest token
            const updatedUser = { ...user, ...res.data };
            if (res.data.token) updatedUser.token = res.data.token;

            saveUser(updatedUser);
            return { success: true, user: updatedUser };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Update failed' };
        }
    };

    const syncBalance = async () => {
        // Quiet background sync - NO LOGOUT on failure
        if (!user?.token) return;

        try {
            const res = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (res.data && res.data._id) {
                // Combine and preserve the current token always
                const refreshedUser = { ...user, ...res.data, token: user.token };

                // Only write to localStorage if there's a real change to avoid loop
                if (user.balance !== refreshedUser.balance || user.name !== refreshedUser.name || user.profilePic !== refreshedUser.profilePic) {
                    setUser(refreshedUser);
                    localStorage.setItem('user', JSON.stringify(refreshedUser));
                }
            }
        } catch (err) {
            // Log error but DO NOT logout
            console.log('Background sync skipped due to network/server.');
        }
    };

    useEffect(() => {
        if (user && user.token) {
            if (!syncInterval.current) {
                syncInterval.current = setInterval(syncBalance, 60000); // 1 minute interval for stability
            }
        }
        return () => {
            if (syncInterval.current) {
                clearInterval(syncInterval.current);
                syncInterval.current = null;
            }
        };
    }, [user?.token]);

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
