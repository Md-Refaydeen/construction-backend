import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MapPin, Calendar, ArrowRight, Search, PlusCircle, Building2, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SiteList = () => {
    const [sites, setSites] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/sites').then(res => setSites(res.data));
    }, []);

    const filteredSites = sites.filter((site: any) =>
        site.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Active <span className="text-primary-600">Site Directory</span></h1>
                    <p className="text-gray-500 font-medium mt-1">Manage and monitor progress across all authorized construction locations.</p>
                </div>

                {user?.role === 'ADMIN' && (
                    <button
                        onClick={() => navigate('/sites/new')}
                        className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3.5 rounded-2xl font-black hover:bg-primary-700 shadow-xl shadow-primary-600/20 transition-all active:scale-[0.98]"
                    >
                        <PlusCircle size={20} />
                        Register New Site
                    </button>
                )}
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by site name, location, or status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-gray-400"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-6 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-colors text-sm border border-transparent hover:border-gray-200">
                        Filter Status
                    </button>
                    <button className="p-4 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                        <Globe size={20} />
                    </button>
                </div>
            </div>

            {/* Sites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSites.map((site: any) => (
                    <div
                        key={site.id}
                        onClick={() => navigate(`/sites/${site.id}`)}
                        className="group bg-white rounded-[32px] p-2 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
                    >
                        <div className="relative h-48 rounded-[24px] overflow-hidden">
                            <img
                                src={`https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=2670`}
                                alt={site.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                <span className="px-3 py-1 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Active</span>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">Phase 2</span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-black text-gray-900 group-hover:text-primary-600 transition-colors tracking-tight">{site.name}</h3>
                                <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                    <Building2 size={18} />
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span className="text-xs font-bold tracking-tight">{site.latitude.toFixed(4)}, {site.longitude.toFixed(4)}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500">
                                    <Calendar size={16} className="text-gray-400" />
                                    <span className="text-xs font-bold tracking-tight text-gray-400 italic">Established {new Date(site.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                                            {i === 3 ? '+2' : 'TM'}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 text-primary-600 font-black text-sm group-hover:gap-3 transition-all underline decoration-2 underline-offset-4 decoration-primary-100 group-hover:decoration-primary-300">
                                    Detail View
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredSites.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <MapPin size={40} className="text-gray-200" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">No matching sites found</h3>
                    <p className="text-gray-400 font-medium">Try adjusting your search filters or add a new site registry.</p>
                </div>
            )}
        </div>
    );
};

export default SiteList;
