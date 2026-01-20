import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ShieldCheck, Truck, Headset, Rocket, Target, Users, Globe, ExternalLink } from 'lucide-react';

const About = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <main className="pt-20 bg-slate-50">
            {/* About Hero Section */}
            <section className="relative py-24 overflow-hidden bg-indigo-600">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-300 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6"
                    >
                        Redefining Your <br />
                        <span className="text-indigo-200">Shopping Experience</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg text-indigo-100/90 leading-relaxed"
                    >
                        Welcome to ShopEase, where innovation meets elegance. We're more than just a store — we're a commitment to quality and convenience.
                    </motion.p>
                </div>
            </section>

            {/* Our Story */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div {...fadeIn}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-6">
                            <Rocket className="w-4 h-4" /> Our Mission
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                            Building the Future of E-commerce for MIST
                        </h2>
                        <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                            <p>
                                Welcome to <strong className="text-slate-900">ShopEase</strong>, a sophisticated platform developed as a flagship project for MIST (Military Institute of Science and Technology). Our goal was to create a seamless bridge between cutting-edge technology and everyday shopping needs.
                            </p>
                            <p>
                                What started as a vision for better online interactions has evolved into a complete ecosystem featuring real-time inventory, secure authentication, and a lightning-fast user interface.
                            </p>
                            <p>
                                While this serves as a technical demonstration, it embodies the standards of modern web applications — reliability, scalability, and exceptional user experience.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" alt="Team working" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">Secure & Trusted</div>
                                    <div className="text-xs text-slate-500">Industry standard safety</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Branding */}
            <section className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Shop With Us?</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">We provide the best features to ensure your shopping journey is smooth and delightful.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <ShoppingBag />, title: "Easy Shopping", desc: "Intuitive interface for effortless product discovery and navigation." },
                            { icon: <ShieldCheck />, title: "Secure Checkout", desc: "Your data is protected with state-of-the-art encryption protocols." },
                            { icon: <Truck />, title: "Fast Delivery", desc: "Real-time tracking and optimized logistics for quick arrivals." },
                            { icon: <Headset />, title: "24/7 Support", desc: "Our dedicated team is always here to assist you with any query." }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group"
                            >
                                <div className="w-14 h-14 bg-white border border-slate-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                    {React.cloneElement(feature.icon, { className: "w-6 h-6" })}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team/Institution Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-transparent"></div>
                    <div className="relative p-12 md:p-20 flex flex-col items-center text-center">
                        <motion.div {...fadeIn}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-bold mb-8">
                                <Users className="w-4 h-4" /> The Power Behind
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Our Institution & Team</h2>
                            <p className="text-slate-300 max-w-2xl mx-auto mb-12 text-lg">
                                This project is a testament to the excellence maintained at the <strong>Military Institute of Science and Technology (MIST)</strong>.
                                Developed by driven students under expert supervision.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                                {[
                                    { label: "Institution", value: "MIST", icon: <Globe /> },
                                    { label: "Focus", value: "Innovation", icon: <Target /> },
                                    { label: "Goal", value: "Excellence", icon: <Rocket /> }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                        <div className="text-white mb-2 flex justify-center">{React.cloneElement(stat.icon, { className: "w-6 h-6 opacity-60" })}</div>
                                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-indigo-400 text-sm font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-indigo-50 border border-indigo-100 p-12 md:p-20 rounded-[3rem] text-center">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
                            Ready to transform your lifestyle?
                        </h2>
                        <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">
                            Join thousands of happy shoppers and experience the difference today. Start exploring our premium collections.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                                Start Shopping <ExternalLink className="w-4 h-4" />
                            </Link>
                            <Link to="/admin" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                                Admin Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;

