import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
    Map,
    Box,
    AlertOctagon,
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle2,
    LayoutDashboard,
    Calendar,
    ArrowUpRight,
    Search,
    Filter,
    MoreHorizontal,
    Activity,
    Hexagon
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [data, setData] = useState<any>(null);
    const [recentProgress, setRecentProgress] = useState<any[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [overviewRes, progressRes] = await Promise.all([
                    api.get('/dashboard/overview'),
                    api.get('/progress')
                ]);
                setData(overviewRes.data);
                setRecentProgress(progressRes.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    if (!data) return (
        <div className="flex flex-col items-center justify-center p-24 space-y-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                <Hexagon className="absolute inset-0 m-auto text-primary-600/20" size={24} />
            </div>
            <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Assembling Intelligence...</p>
        </div>
    );

    const stats = [
        {
            title: 'Active Project Sites',
            value: data.totalSites,
            icon: Map,
            color: 'text-primary-600',
            bg: 'bg-primary-50',
            trend: '+12%',
            trendUp: true,
            desc: 'Global footprint',
            path: '/sites'
        },
        {
            title: 'Critical Stalls',
            value: data.delayedSitesCount,
            icon: AlertOctagon,
            color: 'text-red-600',
            bg: 'bg-red-50',
            trend: '-4%',
            trendUp: false,
            desc: 'Intervention needed',
            path: '/sites'
        },
        {
            title: 'Inventory Units',
            value: data.materialSummary.length,
            icon: Box,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            trend: 'Stable',
            trendUp: true,
            desc: 'Resource liquidity',
            path: '/materials'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Top Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-xl">
                        <Activity size={14} className="text-primary-400" />
                        Live Operations Hub
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-2">
                        Control <span className="text-primary-600">Center</span>
                    </h1>
                    <p className="text-gray-500 font-medium flex items-center gap-2">
                        Command authorization verified for <span className="text-gray-900 font-bold underline decoration-primary-500/30 underline-offset-4">{user?.name}</span>
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-lg transition-all">
                        <div className="p-3 bg-primary-50 rounded-2xl group-hover:rotate-12 transition-transform">
                            <Calendar className="text-primary-600" size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Deployment Date</p>
                            <p className="text-sm font-black text-gray-900">{currentTime.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>

                    {user?.role === 'ADMIN' && (
                        <button
                            onClick={() => navigate('/sites/new')}
                            className="bg-primary-600 text-white p-5 rounded-[28px] shadow-2xl shadow-primary-600/30 hover:bg-primary-700 transition-all active:scale-95 flex items-center gap-3 group"
                        >
                            <span className="font-black text-sm uppercase tracking-widest hidden sm:block">Initialize Site</span>
                            <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>

            {/* Metric Cards - Dynamic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <div key={i}
                        onClick={() => navigate(stat.path)}
                        className="group relative bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-2xl hover:border-transparent transition-all duration-500 cursor-pointer overflow-hidden">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} rounded-bl-full translate-x-12 -translate-y-12 group-hover:scale-125 transition-transform duration-700 opacity-50`}></div>

                        <div className="relative flex items-center justify-between mb-8">
                            <div className={`p-5 ${stat.bg} ${stat.color} rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon size={32} />
                            </div>
                            <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {stat.trend}
                            </div>
                        </div>

                        <div className="relative">
                            <p className="text-5xl font-black text-gray-900 mb-1 tracking-tighter">{stat.value}</p>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">{stat.title}</p>
                            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <span className={`w-2 h-2 rounded-full ${stat.trendUp ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                {stat.desc}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Material Chart */}
                <div className="lg:col-span-8 bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <Hexagon size={24} className="text-primary-600 fill-primary-600/10" />
                                Resource Utilization
                            </h3>
                            <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest">Analytics Layer 01</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-1 px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
                                <Clock size={12} /> Real-time
                            </div>
                            <button className="px-6 py-3 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95">
                                Full Insight
                            </button>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        {data.materialSummary.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.materialSummary} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.4} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#F1F5F9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900, textAnchor: 'middle' }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(37, 99, 235, 0.05)', radius: 12 }}
                                        contentStyle={{
                                            borderRadius: '24px',
                                            border: 'none',
                                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                                            padding: '20px',
                                            background: '#fff'
                                        }}
                                        itemStyle={{ color: '#1E293B', fontWeight: 900, fontSize: '14px' }}
                                    />
                                    <Bar dataKey="used" name="Units" fill="url(#barGrad)" radius={[12, 12, 12, 12]} barSize={24}>
                                        {data.materialSummary.map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'url(#barGrad)' : '#94A3B8'} className="transition-all duration-500 hover:opacity-80" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-300">
                                <Activity size={64} className="mb-4 opacity-20" />
                                <p className="font-black uppercase tracking-[0.2em] text-xs">Awaiting Resource Data...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Quick Actions */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="bg-gray-900 p-10 rounded-[40px] text-white flex flex-col justify-between group overflow-hidden relative shadow-2xl h-1/2 min-h-[300px]">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-600/20 rounded-bl-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform"></div>
                        <div className="relative">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-primary-600 transition-colors">
                                <Clock size={28} />
                            </div>
                            <h3 className="text-3xl font-black mb-2 tracking-tight">Sync <br />Automation</h3>
                            <p className="text-gray-400 font-medium text-sm leading-relaxed mb-8">Broadcast weekly operation manifests to your executive board.</p>
                        </div>
                        <button className="relative w-full bg-white text-gray-900 py-4 rounded-2xl font-black hover:bg-primary-50 transition-all shadow-xl active:scale-95">
                            Set Schedule
                        </button>
                    </div>

                    <div className="bg-primary-600 p-10 rounded-[40px] text-white flex flex-col justify-between group overflow-hidden relative shadow-2xl h-1/2 min-h-[300px]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
                        <div className="relative">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                                <CheckCircle2 size={28} />
                            </div>
                            <h3 className="text-3xl font-black mb-2 tracking-tight">Ledger <br />Optimization</h3>
                            <p className="text-primary-100 font-medium text-sm leading-relaxed mb-8">Analyze resource leakage and optimize site-wide utility.</p>
                        </div>
                        <button className="relative w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95">
                            Run Analysis
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table - Project Pulse */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <LayoutDashboard size={24} className="text-primary-600" />
                            Project Pulse
                        </h3>
                        <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-[0.2em]">Operational Stream</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Filter activity..."
                                className="pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-xs font-black focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-gray-400"
                            />
                        </div>
                        <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Deployment Site</th>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Context</th>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Velocity</th>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sync Time</th>
                                <th className="px-10 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentProgress.length > 0 ? recentProgress.map((update) => (
                                <tr key={update.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 font-black text-xs">
                                                {update.site?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">{update.site?.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Active Sector</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 max-w-md">
                                        <p className="text-sm font-bold text-gray-600 line-clamp-1">{update.description}</p>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[60px]">
                                                <div
                                                    className="h-full bg-primary-500 rounded-full"
                                                    style={{ width: `${update.progress_percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-black text-gray-900">{update.progress_percentage}%</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 text-center">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${update.delay_flag ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${update.delay_flag ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                                            {update.delay_flag ? 'Stalled' : 'Nominal'}
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <p className="text-xs font-bold text-gray-400">{new Date(update.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mt-1">{new Date(update.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        <button
                                            onClick={() => navigate(`/sites/${update.site_id}`)}
                                            className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-lg"
                                        >
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-30">
                                            <Activity size={48} className="mb-4" />
                                            <p className="text-sm font-black uppercase tracking-widest">No Recent activity tracked</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;