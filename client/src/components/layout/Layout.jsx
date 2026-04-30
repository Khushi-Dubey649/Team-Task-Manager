import { Outlet, Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, CheckSquare, PlusSquare, Users, LogOut, Menu, X, Shield, User as UserIcon } from 'lucide-react';

export default function Layout() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // RBAC Logic for rendering
    const isAdmin = user?.role === 'Admin';

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Tasks', href: '/tasks', icon: CheckSquare },
        // Conditional links based on Role
        ...(isAdmin ? [
            { name: 'Create Project', href: '/projects/new', icon: PlusSquare },
            { name: 'Team Management', href: '/team', icon: Users },
        ] : []),
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 shadow-sm transition-all duration-300 z-20">
                <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
                        <CheckSquare className="w-6 h-6" />
                        <span>TaskMaster Pro</span>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    isActive 
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200/50' 
                                    : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-100' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors`} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-100">
                    <button 
                        onClick={logout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors group"
                    >
                        <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC]">
                {/* Navbar */}
                <header className="h-16 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-10">
                    <button 
                        className="md:hidden text-slate-500 hover:text-slate-700 transition-colors"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex-1 flex justify-end items-center gap-4">
                        <div className="flex items-center gap-3 bg-white py-1.5 px-3 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-105 cursor-pointer">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-inner">
                                {user?.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
                            </div>
                            <div className="flex flex-col pr-3">
                                <span className="text-sm font-semibold text-slate-800 leading-none">{user?.name || 'User'}</span>
                                <div className="flex items-center gap-1 mt-1">
                                    {isAdmin ? (
                                        <Shield className="w-3 h-3 text-amber-500" />
                                    ) : (
                                        <UserIcon className="w-3 h-3 text-indigo-400" />
                                    )}
                                    {/* Role Badge Highlight */}
                                    <span className={`text-[11px] font-bold tracking-wider uppercase ${isAdmin ? 'text-amber-600 bg-amber-50 px-1.5 rounded-sm' : 'text-indigo-600 bg-indigo-50 px-1.5 rounded-sm'}`}>
                                        {isAdmin ? 'Admin' : 'Member'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 relative">
                    <div className="max-w-7xl mx-auto relative z-10 h-full">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute top-0 left-0 w-72 h-full bg-white shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 bg-indigo-50">
                             <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
                                <CheckSquare className="w-6 h-6" />
                                <span>TaskMaster Pro</span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-md p-1 shadow-sm">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                             {navigation.map((item) => {
                                const isActive = location.pathname.startsWith(item.href);
                                return (
                                    <Link 
                                        key={item.name} 
                                        to={item.href} 
                                        onClick={() => setIsMobileMenuOpen(false)} 
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                        <span className="font-semibold">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="p-4 border-t border-slate-100">
                            <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-xl transition-colors">
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
