import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ClipboardList, Store, Settings, UserCircle, Bell, Search, Users, ShieldCheck, LogOut, Sliders, Wallet } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminProfile from './AdminProfile';
import AdminSettings from './AdminSettings';
import AdminDeposits from './AdminDeposits';
import AdminPaymentMethods from './AdminPaymentMethods';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

const Admin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { orders, fetchAllDepositsAdmin } = useShop();
    const [pendingDepositsCount, setPendingDepositsCount] = useState(0);

    useEffect(() => {
        const getCounts = async () => {
            const data = await fetchAllDepositsAdmin();
            setPendingDepositsCount(data.filter(d => d.status === 'pending').length);
        };
        getCounts();

        // Refresh every 30 seconds for live updates
        const interval = setInterval(getCounts, 30000);
        return () => clearInterval(interval);
    }, []);

    const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Inventory', path: '/admin/products', icon: <ShoppingBag className="w-5 h-5" /> },
        { name: 'Fulfillment', path: '/admin/orders', icon: <ClipboardList className="w-5 h-5" />, badge: pendingOrdersCount, badgeColor: 'bg-amber-500' },
        { name: 'User Ledger', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
        { name: 'Asset Synchro', path: '/admin/deposits', icon: <Wallet className="w-5 h-5" />, badge: pendingDepositsCount, badgeColor: 'bg-rose-500' },
        { name: 'Gateways', path: '/admin/payment-methods', icon: <ShieldCheck className="w-5 h-5" /> },
        { name: 'System Core', path: '/admin/settings', icon: <Sliders className="w-5 h-5" /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div id="admin-panel" className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-400 p-6 hidden lg:flex flex-col z-10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="p-2 bg-indigo-600 rounded-xl text-white">
                        <ShieldCheck className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-black text-white tracking-tight leading-none">BYTROX</h2>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Command Centre</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <div className="text-[10px] uppercase tracking-widest font-black text-slate-600 mb-4 px-2">Main Menu</div>
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group relative ${location.pathname === item.path
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : 'hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {React.cloneElement(item.icon, {
                                className: `w-5 h-5 transition-colors ${location.pathname === item.path ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`
                            })}
                            <span className="font-bold text-sm">{item.name}</span>

                            {item.badge > 0 && (
                                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-black text-white ${item.badgeColor || 'bg-indigo-500'} animate-bounce`}>
                                    {item.badge}
                                </span>
                            )}

                            {location.pathname === item.path && !item.badge && (
                                <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto space-y-4">
                    <Link to="/admin/profile" className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group border border-transparent ${location.pathname === '/admin/profile' ? 'bg-indigo-600/10 text-white border-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                        <UserCircle className={`w-5 h-5 ${location.pathname === '/admin/profile' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                        <span className="font-bold text-sm">Account Settings</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all group border border-transparent hover:border-rose-500/20"
                    >
                        <LogOut className="w-5 h-5 text-rose-500/60 group-hover:text-rose-500" />
                        <span className="font-bold text-sm">Terminate Session</span>
                    </button>
                    <Link to="/" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all group border border-transparent hover:border-slate-700">
                        <Store className="w-5 h-5 text-slate-500 group-hover:text-amber-400" />
                        <span className="font-bold text-sm">Return to Store</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 min-w-0">
                {/* Top Navbar */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 sm:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="lg:hidden p-2 bg-slate-100 rounded-lg text-slate-600">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div className="relative max-w-md w-full hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Universal intelligence search..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Operational</span>
                                <span className="text-[9px] font-bold text-slate-400">v4.0.12 Release</span>
                            </div>
                        </div>

                        <div className="h-8 w-[1px] bg-slate-100"></div>

                        <Link to="/admin/profile" className="flex items-center gap-3 pl-2 group">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{user?.name}</div>
                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Administrator</div>
                            </div>
                            <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-xl font-black border-2 border-white shadow-lg shadow-indigo-200 overflow-hidden">
                                {user?.profilePic ? (
                                    <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 sm:p-10">
                    <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/products" element={<AdminProducts />} />
                        <Route path="/orders" element={<AdminOrders />} />
                        <Route path="/users" element={<AdminUsers />} />
                        <Route path="/deposits" element={<AdminDeposits />} />
                        <Route path="/payment-methods" element={<AdminPaymentMethods />} />
                        <Route path="/profile" element={<AdminProfile />} />
                        <Route path="/settings" element={<AdminSettings />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default Admin;
