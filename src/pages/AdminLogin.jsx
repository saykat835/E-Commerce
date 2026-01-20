import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Lock, Mail, LogIn, ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isAdmin, user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && isAdmin()) {
            navigate('/admin');
        }
    }, [user, isAdmin, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            if (isAdmin()) {
                Swal.fire({
                    icon: 'success',
                    title: 'Admin Access Granted',
                    text: 'Welcome to the control center.',
                    timer: 1500,
                    showConfirmButton: false
                });
                navigate('/admin');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Access Denied',
                    text: 'You do not have administrative privileges.',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: result.message,
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
                            <ShieldAlert className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white">Admin Vault</h1>
                        <p className="text-slate-400 mt-2">Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 ml-1">Admin Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:border-indigo-500/50 text-white transition-all"
                                    placeholder="admin@bytrox.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 ml-1">Security Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 focus:border-indigo-500/50 text-white transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                        >
                            Acknowledge & Enter <LogIn className="w-5 h-5 font-bold" />
                        </button>
                    </form>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full mt-8 flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Main Store
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
