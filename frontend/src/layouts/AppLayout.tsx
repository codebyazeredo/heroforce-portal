import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LayoutDashboard, LogOut,  Menu, User as UserIcon } from 'lucide-react';
import { UserRole, UserRoleLabel } from '../../../backend/src/users/enums/user-role.enum';

export const AppLayout: React.FC = () => {
    const { user, signOut } = useContext(AuthContext);
    const location = useLocation();
    
    const isActive = (path: string) => location.pathname === path 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white';

    return (
        <div className="flex h-screen bg-slate-100 overflow-hidden">
            <aside className="w-64 bg-slate-900 flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-black tracking-tighter text-white">
                        HERO<span className="text-blue-500">FORCE</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link to="/dashboard" className={`flex items-center p-3 rounded-lg transition-all duration-200 ${isActive('/dashboard')}`}>
                        <LayoutDashboard size={20} className="mr-3" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={signOut} className="w-full flex items-center p-3 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all group">
                        <LogOut size={20} className="mr-3 group-hover:translate-x-1 transition-transform" />
                        <span className="font-medium">Encerrar Sessão</span>
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <button className="text-slate-500 md:hidden hover:bg-slate-100 p-2 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                            Desafio Técnico - Nv. Pleno
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-bold text-slate-800 leading-tight">
                                {user?.name}
                            </span>
                            <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full self-end uppercase">
                                {user?.role !== undefined ? UserRoleLabel[user?.role as UserRole] : 'Carregando...'}
                            </span>
                        </div>
                        
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-600 overflow-hidden">
                            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={20} />}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};