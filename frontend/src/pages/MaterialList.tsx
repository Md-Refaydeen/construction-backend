import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle,
    Plus,
    Box,
    ArrowRight,
    Search,
    TrendingDown,
    Package,
    Layers,
    ClipboardCheck,
    X,
    Filter,
    Building2
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MaterialList = () => {
    const [materials, setMaterials] = useState<any[]>([]);
    const [sites, setSites] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUsageModal, setShowUsageModal] = useState<string | null>(null);
    const [usageData, setUsageData] = useState({ site_id: '', quantity_used: 1 });
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const matRes = await api.get('/materials');
            setMaterials(matRes.data);
            const siteRes = await api.get('/sites');
            setSites(siteRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filteredMaterials = materials.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLogUsage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!showUsageModal || !usageData.site_id) return;
        try {
            await api.post('/materials/usage', {
                material_id: showUsageModal,
                site_id: usageData.site_id,
                quantity_used: Number(usageData.quantity_used)
            });
            setShowUsageModal(null);
            fetchData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error logging usage. Check stock.');
        }
    };

    const selectedMaterial = materials.find(m => m.id === showUsageModal);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Material <span className="text-primary-600">Inventory</span></h1>
                    <p className="text-gray-500 font-medium mt-1">Track consumables, hardware, and raw materials across active projects.</p>
                </div>

                {user?.role === 'ADMIN' && (
                    <button
                        onClick={() => navigate('/materials/new')}
                        className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3.5 rounded-2xl font-black hover:bg-primary-700 shadow-xl shadow-primary-600/20 transition-all active:scale-[0.98]"
                    >
                        <Plus size={20} />
                        Register New Material
                    </button>
                )}
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search materials, batch numbers, or categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-gray-400"
                    />
                </div>
                <button className="inline-flex items-center gap-2 px-6 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-colors text-sm border border-transparent hover:border-gray-200">
                    <Filter size={18} />
                    Apply Filters
                </button>
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMaterials.map(mat => {
                    const stockPercent = (mat.remaining_stock / mat.total_stock) * 100;
                    const isLow = mat.isLowStock || stockPercent < 20;

                    return (
                        <div key={mat.id} className={`group relative bg-white rounded-[32px] p-8 border ${isLow ? 'border-red-100 bg-red-50/10' : 'border-gray-100'} shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col`}>
                            {/* Low Stock Indicator */}
                            {isLow && (
                                <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                                    <AlertTriangle size={14} />
                                    Critical Level
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-4 rounded-2xl ${isLow ? 'bg-red-100 text-red-600' : 'bg-primary-50 text-primary-600'}`}>
                                    <Package size={28} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-gray-900 group-hover:text-primary-600 transition-colors tracking-tight">{mat.name}</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">General Supply</p>
                                </div>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Inventory Status</p>
                                        <p className={`text-sm font-black ${isLow ? 'text-red-600' : 'text-primary-600'}`}>{mat.remaining_stock} <span className="text-[10px] text-gray-400 uppercase">Units</span></p>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden p-0.5">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-red-500 ring-4 ring-red-500/20' : 'bg-primary-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]'}`}
                                            style={{ width: `${Math.max(5, stockPercent)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">Total Cap.</p>
                                        <p className="text-lg font-black text-gray-800">{mat.total_stock}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">Utilized</p>
                                        <p className="text-lg font-black text-gray-800">{(mat.total_stock - mat.remaining_stock).toFixed(1)}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowUsageModal(mat.id)}
                                disabled={mat.remaining_stock <= 0}
                                className={`mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black transition-all active:scale-[0.98] ${mat.remaining_stock > 0
                                    ? 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-900/10'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <ClipboardCheck size={18} />
                                Record Usage
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Usage Modal */}
            {showUsageModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 bg-gray-900 text-white flex justify-between items-start relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-bl-full -translate-y-8 translate-x-8"></div>
                            <div className="relative">
                                <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mb-2">Inventory Ledger</p>
                                <h2 className="text-3xl font-black tracking-tight">Record Usage</h2>
                                <p className="text-gray-400 font-medium mt-1">Allocation for <span className="text-white font-bold">{selectedMaterial?.name}</span></p>
                            </div>
                            <button
                                onClick={() => setShowUsageModal(null)}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors relative z-10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleLogUsage} className="p-10 space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Construction Site Allocation</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <Building2 size={18} />
                                        </div>
                                        <select
                                            required
                                            value={usageData.site_id}
                                            onChange={e => setUsageData({ ...usageData, site_id: e.target.value })}
                                            className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all bg-gray-50/50"
                                        >
                                            <option value="">-- Required: Specify Project --</option>
                                            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-sm font-bold text-gray-700">Quantity to Withdraw</label>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Max: {selectedMaterial?.remaining_stock} units</span>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <Layers size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            min="0.1"
                                            max={selectedMaterial?.remaining_stock}
                                            step="0.1"
                                            required
                                            value={usageData.quantity_used}
                                            onChange={e => setUsageData({ ...usageData, quantity_used: Number(e.target.value) })}
                                            className="block w-full pl-11 pr-16 py-4 border border-gray-200 rounded-2xl text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all bg-gray-50/50"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xs uppercase">Units</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowUsageModal(null)}
                                    className="flex-1 px-6 py-4 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition-colors"
                                >
                                    Revert Changes
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-4 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 shadow-xl shadow-primary-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Submit Allocation
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialList;
