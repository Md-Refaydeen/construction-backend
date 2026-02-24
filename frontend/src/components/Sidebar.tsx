import { NavLink } from 'react-router-dom';
import { Home, Map, Box, LogOut, PlusSquare, ClipboardList, Activity, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: Home, roles: ['ADMIN', 'USER'] },
        { name: 'Site Directory', path: '/sites', icon: Map, roles: ['ADMIN', 'USER'] },
        { name: 'Register Site', path: '/sites/new', icon: PlusSquare, roles: ['ADMIN'] },
        { name: 'Material Inventory', path: '/materials', icon: Box, roles: ['ADMIN', 'USER'] },
        { name: 'Refill Stock', path: '/materials/new', icon: ClipboardList, roles: ['ADMIN'] },
    ];

    const filteredItems = navItems.filter(item => item.roles.includes(user?.role));

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                    onClick={onClose}
                ></div>
            )}

            <aside className={`fixed inset-y-0 left-0 w-72 bg-gray-900 h-screen flex flex-col z-50 transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-white/5 shadow-2xl overflow-hidden`}>
                {/* Logo Section */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Activity size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white tracking-tight leading-none">Construction</h1>
                            <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mt-1">Tracker Pro</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-2 text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-10 px-6 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="mb-6 px-3 text-center lg:text-left">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Management Console</p>
                    </div>

                    {filteredItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                            className={({ isActive }) =>
                                `group flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${isActive
                                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} className="transition-colors" />
                                <span className="text-sm tracking-tight">{item.name}</span>
                            </div>
                            <ChevronRight size={14} className={`opacity-0 group-hover:opacity-40 transition-opacity`} />
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Profile Section */}
                <div className="p-6 border-t border-white/5 bg-black/20">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-400 font-bold border border-primary-500/20 uppercase">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                <p className="text-[10px] font-black text-primary-400/60 uppercase tracking-widest truncate">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-red-100 bg-red-500/10 hover:bg-red-500/20 hover:text-white transition-all duration-300 w-full group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Disconnect</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
