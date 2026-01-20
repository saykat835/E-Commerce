import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingBag, Search, ShoppingCart, ClipboardList, User, UserCheck, LogOut, Menu, X, Wallet, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { cart, setIsCartOpen, orders, searchQuery, setSearchQuery } = useShop();
    const { user, logout } = useAuth();
    const { language, toggleLanguage, t } = useLanguage();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.about'), path: '/about' },
        { name: t('nav.orders'), path: '/orders' },
    ];

    const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group shrink-0">
                        <div className="p-2 bg-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-2xl font-black tracking-tight hidden sm:block ${location.pathname === '/' && !isScrolled ? 'text-white' : 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600'
                            }`}>
                            ShopEase
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-black uppercase tracking-widest transition-colors hover:text-indigo-600 ${location.pathname === link.path
                                    ? 'text-indigo-600'
                                    : (location.pathname === '/' && !isScrolled ? 'text-white' : 'text-slate-600')
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                        {/* Language Toggler */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-xl transition-all border border-slate-200 group"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{language === 'en' ? 'BN' : 'EN'}</span>
                        </button>

                        {user && (
                            <Link to="/deposit" className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all border border-emerald-100">
                                <div className="p-1 bg-emerald-500 rounded-lg text-white">
                                    <Wallet className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-black text-xs sm:text-sm tabular-nums">${user.balance?.toFixed(2) || '0.00'}</span>
                            </Link>
                        )}
                        <Link to="/orders" className={`relative p-2 transition-colors ${location.pathname === '/' && !isScrolled ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-indigo-600'
                            } hover:bg-slate-100 rounded-full`}>
                            <ClipboardList className="w-6 h-6" />
                            {orders.filter(o => o.status === 'pending').length > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] flex items-center justify-center rounded-full animate-pulse shadow-lg shadow-indigo-200">
                                    {orders.filter(o => o.status === 'pending').length}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className={`relative p-2 transition-colors ${location.pathname === '/' && !isScrolled ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-indigo-600'
                                } hover:bg-slate-100 rounded-full`}
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className={`text-xs font-bold ${location.pathname === '/' && !isScrolled ? 'text-white' : 'text-slate-900'}`}>{user.name}</span>
                                    <span className={`text-[10px] uppercase tracking-wider ${location.pathname === '/' && !isScrolled ? 'text-indigo-300' : 'text-slate-500'}`}>{user.role}</span>
                                </div>
                                <div className="relative group">
                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-xl font-bold border-2 border-transparent group-hover:border-indigo-200 transition-all overflow-hidden shadow-inner">
                                        {user.profilePic ? (
                                            <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-[60]">
                                        <div className="p-2 space-y-1">
                                            <Link to="/profile" className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors">
                                                <User className="w-4 h-4" /> Profile
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link to="/admin" className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors">
                                                    <UserCheck className="w-4 h-4" /> {t('nav.admin')}
                                                </Link>
                                            )}
                                            <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left uppercase tracking-wider">
                                                <LogOut className="w-4 h-4" /> {t('nav.logout')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100">
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">{t('nav.signin')}</span>
                            </Link>
                        )}

                        <button
                            className={`md:hidden p-2 ${location.pathname === '/' && !isScrolled ? 'text-white' : 'text-slate-600'}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block text-lg font-black uppercase tracking-widest ${location.pathname === link.path ? 'text-indigo-600' : 'text-slate-600'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                                    className="flex items-center gap-3 w-full py-2 font-black text-slate-600 uppercase tracking-widest"
                                >
                                    <Globe className="w-5 h-5" />
                                    Switch to {language === 'en' ? 'Bangla' : 'English'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
