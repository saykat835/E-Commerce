import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                ShopEase
                            </span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            A premier MIST E-commerce platform where innovation meets convenience. Experience the future of online shopping today.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { icon: <Facebook />, href: "#" },
                                { icon: <Twitter />, href: "#" },
                                { icon: <Instagram />, href: "#" },
                                { icon: <Linkedin />, href: "#" },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1"
                                >
                                    {React.cloneElement(social.icon, { className: "w-5 h-5" })}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-8 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-indigo-600 rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            {['Home', 'Shop', 'Categories', 'About'].map((link) => (
                                <li key={link}>
                                    <Link
                                        to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                                        className="text-slate-400 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 group"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors"></div>
                                        {link}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <a href="https://wa.me/+8801748486872" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors"></div>
                                    Contact Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-8 relative inline-block">
                            Customer Service
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-indigo-600 rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            {['Shipping Policy', 'Return Policy', 'Privacy Policy', 'Terms & Conditions', 'Expert Support'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-slate-400 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors"></div>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-8 relative inline-block">
                            Connect With Us
                            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-indigo-600 rounded-full"></span>
                        </h3>
                        <ul className="space-y-5">
                            {[
                                { icon: <MapPin />, text: "MIST, Mirpur Cantonment, Dhaka" },
                                { icon: <Phone />, text: "+880 1748486872" },
                                { icon: <Mail />, text: "saikat835@gmail.com" },
                                { icon: <Clock />, text: "Mon - Fri: 9AM to 5PM" },
                            ].map((info, i) => (
                                <li key={i} className="flex items-start gap-4 text-slate-400 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500 group-hover:bg-indigo-900/30 group-hover:text-indigo-400 transition-all">
                                        {React.cloneElement(info.icon, { className: "w-5 h-5" })}
                                    </div>
                                    <span className="text-sm font-medium pt-2 group-hover:text-slate-300 transition-colors">{info.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <p className="text-slate-500 text-sm">
                        &copy; {currentYear} <span className="text-indigo-500 font-bold">ShopEase</span>. MIST E-commerce Project.
                    </p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secure Platform</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

