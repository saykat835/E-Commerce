import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Helper to get/set cookies
const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
};

const getCookie = (name) => {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const deleteCookie = (name) => {
    document.cookie = name + '=; Max-Age=-99999999; path=/;';
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const syncInterval = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    // 1. First Load Logic
    useEffect(() => {
        const initializeAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const token = getCookie('auth_token');

            if (token) {
                try {
                    // Start by trying to load cached user
                    let userData = null;
                    if (storedUser) {
                        userData = JSON.parse(storedUser);
                        // Ghost user protection
                        if (userData.name === 'Test User' || userData.email === 'test123456@test.com') {
                            throw new Error('Ghost detected');
                        }
                    }

                    // Always verify with server if token exists to ensure session stability
                    const res = await axios.get(`${API_URL}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (res.data && res.data._id) {
                        const validatedUser = { ...res.data, token };
                        setUser(validatedUser);
                        localStorage.setItem('user', JSON.stringify(validatedUser));
                    } else if (userData) {
                        setUser({ ...userData, token }); // Fallback to cache if server is slow
                    }
                } catch (err) {
                    console.error('Auth check failed:', err.message);
                    if (err.response?.status === 401) {
                        logout(); // Only logout if token is actually invalid
                    } else if (storedUser) {
                        // If it's just a network error, don't logout, use cache
                        const u = JSON.parse(storedUser);
                        setUser({ ...u, token });
                    }
                }
            } else {
                localStorage.removeItem('user');
                setUser(null);
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const saveUser = (userData) => {
        if (!userData) {
            setUser(null);
            localStorage.removeItem('user');
            deleteCookie('auth_token');
        } else {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            if (userData.token) {
                setCookie('auth_token', userData.token, 30); // Save token for 30 days
            }
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            if (res.data && res.data.token) {
                saveUser(res.data);
                return { success: true, user: res.data };
            }
            return { success: false, message: 'Invalid server response' };
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
            return { success: false, message: 'Signup failed' };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Signup failed' };
        }
    };

    const logout = () => {
        if (syncInterval.current) clearInterval(syncInterval.current);
        saveUser(null);
    };

    const updateProfile = async (userData) => {
        const token = getCookie('auth_token') || user?.token;
        if (!token) return { success: false, message: 'No session' };
        try {
            const res = await axios.put(`${API_URL}/auth/profile`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedUser = { ...user, ...res.data, token };
            saveUser(updatedUser);
            return { success: true, user: updatedUser };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Update failed' };
        }
    };

    const syncBalance = async () => {
        const token = getCookie('auth_token') || user?.token;
        if (!token) return;
        try {
            const res = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data._id) {
                const refreshedUser = { ...user, ...res.data, token };
                if (JSON.stringify(user) !== JSON.stringify(refreshedUser)) {
                    setUser(refreshedUser);
                    localStorage.setItem('user', JSON.stringify(refreshedUser));
                }
            }
        } catch (err) {
            console.log('Sync skipped - Network/Server issue');
        }
    };

    const getUsers = async () => {
        const token = getCookie('auth_token') || user?.token;
        if (!token) return [];
        try {
            const res = await axios.get(`${API_URL}/auth/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) { return []; }
    };

    const deleteUser = async (id) => {
        const token = getCookie('auth_token') || user?.token;
        if (!token) return { success: false };
        try {
            await axios.delete(`${API_URL}/auth/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { success: true };
        } catch (err) { return { success: false }; }
    };

    const updateUserBalance = async (id, balance) => {
        const token = getCookie('auth_token') || user?.token;
        if (!token) return { success: false };
        try {
            await axios.put(`${API_URL}/auth/users/${id}/balance`, { balance }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { success: true };
        } catch (err) { return { success: false }; }
    };

    const isAdmin = () => user?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user, login, register: signup, logout, isAdmin, loading,
            updateProfile, syncBalance, getUsers, deleteUser, updateUserBalance
        }}>
            {children}
        </AuthContext.Provider>
    );
};
