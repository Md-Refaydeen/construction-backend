import { Menu, LogOut, Activity, Bell, Search, Hexagon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
    onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 h-20 flex items-center px-8 justify-between sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-6">
                <button
                    onClick={onMenuClick}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl lg:hidden text-gray-500 transition-all active:scale-95"
                >
                    <Menu size={22} />
                </button>

                {/* Search Bar - Desktop Only */}
                <div className="hidden md:flex items-center relative group">
                    <Search className="absolute left-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search sites, materials, reports..."
                        className="bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500/20 w-80 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
                {/* Notifications */}
                <button className="relative p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all group">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                </button>

                <div className="h-8 w-px bg-gray-100 hidden sm:block"></div>

                {/* User Profile */}
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-black text-gray-900 leading-none">{user?.name}</span>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <Hexagon size={10} className="text-primary-500 fill-primary-500/20" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user?.role}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-white p-1 rounded-2xl border-2 border-primary-100 shadow-lg group-hover:border-primary-500 transition-all">
                            <div className="w-full h-full bg-primary-600 rounded-[10px] flex items-center justify-center text-white font-black text-lg">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="hidden md:flex p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95"
                    title="Disconnect Session"
                >
                    <LogOut size={22} />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
