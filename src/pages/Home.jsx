import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, Star, Zap, Laptop, Shirt, Home as HomeIcon, Gamepad, Apple, Heart, Search, Filter } from 'lucide-react';

const Home = () => {
    const { products, addToCart, loading, searchQuery, setSearchQuery } = useShop();
    const { language, t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = [
        { name: language === 'en' ? 'All' : 'সব', id: 'All', icon: <Zap className="w-5 h-5" /> },
        { name: language === 'en' ? 'Electronics' : 'ইলেকট্রনিক্স', id: 'Electronics', icon: <Laptop className="w-5 h-5" /> },
        { name: language === 'en' ? 'Fashion' : 'ফ্যাশন', id: 'Fashion', icon: <Shirt className="w-5 h-5" /> },
        { name: language === 'en' ? 'Home' : 'হোম', id: 'Home & Kitchen', icon: <HomeIcon className="w-5 h-5" /> },
        { name: language === 'en' ? 'Toys' : 'খেলনা', id: 'Toys & Games', icon: <Gamepad className="w-5 h-5" /> },
        { name: language === 'en' ? 'Groceries' : 'মুদি', id: 'Groceries', icon: <Apple className="w-5 h-5" /> },
        { name: language === 'en' ? 'Health' : 'স্বাস্থ্য', id: 'Health & Beauty', icon: <Heart className="w-5 h-5" /> },
    ];

    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className="min-h-screen bg-white">
            {/* Ultra Premium Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
                {/* Dynamic Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                        className="w-full h-full object-cover opacity-40 scale-105"
                        alt="Hero background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/80 to-white" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <span className="inline-block px-6 py-2 bg-indigo-600/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-indigo-500/20 backdrop-blur-md">
                            {language === 'en' ? 'Welcome to the Future of Logistics' : 'লজিস্টিকসের ভবিষ্যতে আপনাকে স্বাগতম'}
                        </span>
                        <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-8 leading-[0.85]">
                            {t('hero.title').split(' ')[0]} <br />
                            <span className="text-indigo-400 italic">{t('hero.title').split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="max-w-xl mx-auto text-lg md:text-xl text-slate-300 mb-12 font-medium leading-relaxed">
                            {t('hero.subtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <a href="#matrix-terminal" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-[1.8rem] font-black uppercase tracking-widest transition-all shadow-2xl shadow-indigo-200 active:scale-95 group flex items-center justify-center gap-3">
                                {t('hero.cta')} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Floating UI Elements */}
                <div className="absolute bottom-10 left-10 hidden xl:block">
                    <div className="p-6 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-black">2k+</div>
                            <div className="text-left">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Assets</p>
                                <p className="text-white font-black">Sync Ready</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Matrix Filter Terminal */}
            <section id="matrix-terminal" className="relative z-20 -mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 p-6 sm:p-10 border border-slate-50">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <div className="relative w-full lg:w-96 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={language === 'en' ? "Identify assets..." : "পণ্য খুজুন..."}
                                className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[1.8rem] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-slate-800"
                            />
                        </div>
                        <div className="flex-1 flex gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] whitespace-nowrap transition-all border-2 font-black uppercase tracking-widest text-[10px] ${activeCategory === cat.id
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200'
                                        : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
                                        }`}
                                >
                                    {cat.icon} {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Matrix */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-6">
                        <div className="w-16 h-16 border-8 border-indigo-600/10 border-t-indigo-600 rounded-full animate-spin shadow-2xl"></div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">{t('common.loading')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={product.id || product._id}
                                    className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                                            <span className="px-4 py-1.5 bg-white shadow-xl rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-slate-50">
                                                {product.category}
                                            </span>
                                        </div>
                                        <button className="absolute bottom-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300">
                                            <Heart className="w-5 h-5 text-rose-500" />
                                        </button>
                                    </div>

                                    <div className="p-8">
                                        <div className="flex items-center gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'fill-indigo-500 text-indigo-500' : 'text-slate-200'}`} />
                                            ))}
                                            <span className="text-[10px] text-slate-400 font-black ml-2 uppercase tracking-tighter">Verified Logic</span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="text-3xl font-black text-slate-900 mb-8 tracking-tighter tabular-nums">
                                            ${product.price ? product.price.toFixed(2) : '0.00'}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-indigo-100"
                                            >
                                                <ShoppingCart className="w-4 h-4" /> {language === 'en' ? 'Add Asset' : 'যোগ কর'}
                                            </button>
                                            <button
                                                onClick={() => { addToCart(product); }}
                                                className="py-4 bg-slate-50 text-slate-900 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-slate-100"
                                            >
                                                {language === 'en' ? 'Sync Buy' : 'কিনুন'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>
        </main>
    );
};

export default Home;
