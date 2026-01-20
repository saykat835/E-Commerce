import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useShop } from '../context/ShopContext';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShoppingCart, Home, Languages, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { login, user, loading: authLoading } = useAuth();
    const { t, language, setLanguage } = useLanguage();
    const { settings } = useShop();
    const navigate = useNavigate();

    // High-quality Fashion/E-commerce images
    const authImages = settings?.authImages || [
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=90',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=90',
        'https://images.unsplash.com/photo-1490481651871-ab68624d5517?w=1000&q=90'
    ];

    const slideContent = [
        { title: "Elevate Your Style", desc: "Discover our curated collection of premium fashion essentials.", accent: "from-indigo-500 to-purple-500" },
        { title: "Timeless Elegance", desc: "Experience the perfect blend of modern design and classic comfort.", accent: "from-blue-500 to-cyan-500" },
        { title: "Modern Minimalism", desc: "Defined by quality, crafted for those who appreciate the finer things.", accent: "from-emerald-500 to-teal-500" }
    ];

    useEffect(() => {
        if (!loading && user) {
            navigate(user.role === 'admin' ? '/admin' : '/');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % authImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [authImages.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await login(email, password);
        setLoading(false);

        if (res.success) {
            Swal.fire({
                icon: 'success',
                title: t('login_success'),
                text: t('welcome_back'),
                timer: 2000,
                showConfirmButton: false,
                background: '#fff',
                color: '#1e293b',
                customClass: { popup: 'rounded-[1.5rem]' }
            });
            navigate(res.user.role === 'admin' ? '/admin' : '/');
        } else {
            Swal.fire({
                icon: 'error',
                title: t('login_failed'),
                text: res.message,
                confirmButtonColor: '#6366f1',
                customClass: { popup: 'rounded-[1.5rem]' }
            });
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-inter selection:bg-indigo-100 selection:text-indigo-900">
            {/* Improved Premium Navbar with Border and Clarity */}
            <nav className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-[100] shadow-sm">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                        <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tight italic">ShopEase</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Link to="/" className="px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all text-sm font-bold uppercase tracking-widest border border-transparent hover:border-slate-100 flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">Home</span>
                    </Link>
                    <div className="h-6 w-[1px] bg-slate-200 mx-1" />
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm border border-slate-800"
                    >
                        <Languages className="w-4 h-4" />
                        <span>{language === 'en' ? 'BN' : 'EN'}</span>
                    </button>
                </div>
            </nav>

            <div className="flex-1 flex items-center justify-center p-4 lg:p-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[1200px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[700px] relative z-10"
                >
                    {/* Left Side - Pure Interaction */}
                    <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                        <div className="mb-10">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 mb-6"
                            >
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-black text-slate-900 tracking-tighter italic">ShopEase</span>
                            </motion.div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                                Login to ShopEase
                            </h1>
                            <p className="text-slate-500 font-medium">{t('please_enter_details')}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <input
                                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-bold text-slate-900"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Password</label>
                                    <button type="button" className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 tracking-widest">{t('forgot_password')}?</button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <input
                                        type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all font-bold text-slate-900"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 group mt-4"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        Join ShopEase <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-10 text-center text-sm font-bold text-slate-500">
                            {t('no_account')} <Link to="/signup" className="text-indigo-600 hover:underline">{t('signup')}</Link>
                        </p>
                    </div>

                    {/* Right Side - Fashion Carousel */}
                    <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden group">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="absolute inset-0"
                            >
                                <img
                                    src={authImages[currentImageIndex]}
                                    alt="Fashion"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />

                                <div className="absolute bottom-12 left-12 right-12 z-20">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="p-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl"
                                    >
                                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                                            {slideContent[currentImageIndex].title}
                                        </h2>
                                        <p className="text-slate-200 font-medium">
                                            {slideContent[currentImageIndex].desc}
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Pagination Scrubber */}
                        <div className="absolute bottom-12 right-12 z-30 flex gap-2">
                            {authImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${currentImageIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
