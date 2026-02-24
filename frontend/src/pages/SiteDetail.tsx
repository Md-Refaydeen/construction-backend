import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import {
    AlertCircle,
    CheckCircle2,
    Image as ImageIcon,
    X,
    Upload,
    ClipboardList,
    ArrowLeft,
    BarChart3,
    Calendar,
    MapPin,
    Clock,
    Camera,
    Activity,
    AlertTriangle,
    Hexagon,
    Save
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const SiteDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [site, setSite] = useState<any>(null);
    const [progress, setProgress] = useState<any[]>([]);
    const [formData, setFormData] = useState({ description: '', progress_percentage: 0, delay_flag: false });
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            const [siteRes, progRes] = await Promise.all([
                api.get(`/sites/${id}`),
                api.get(`/progress/${id}`)
            ]);
            setSite(siteRes.data);
            setProgress(progRes.data);
            if (progRes.data.length > 0) {
                setFormData(prev => ({ ...prev, progress_percentage: progRes.data[0].progress_percentage }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImage(null);
        setPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('description', formData.description);
        data.append('progress_percentage', String(formData.progress_percentage));
        data.append('delay_flag', String(formData.delay_flag));
        data.append('site_id', id || '');
        if (image) {
            data.append('image', image);
        }

        try {
            await api.post('/progress', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ description: '', progress_percentage: formData.progress_percentage, delay_flag: false });
            clearImage();
            fetchData();
        } catch (err) {
            console.error('Error saving progress:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!site) return (
        <div className="flex flex-col items-center justify-center p-24 space-y-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                <Hexagon className="absolute inset-0 m-auto text-primary-600/20" size={24} />
            </div>
            <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing Project Data...</p>
        </div>
    );

    const currentProgress = progress.length > 0 ? progress[0].progress_percentage : 0;
    const isDelayed = progress.length > 0 && progress[0].delay_flag;
    const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header / Breadcrumb Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/sites')}
                        className="p-4 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl border border-gray-100 transition-all shadow-sm group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{site.name}</h1>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDelayed ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {isDelayed ? 'Stalled' : 'Operational'}
                            </div>
                        </div>
                        <p className="text-gray-400 font-bold flex items-center gap-2 text-sm">
                            <MapPin size={14} className="text-primary-500" />
                            {site.latitude.toFixed(4)}, {site.longitude.toFixed(4)} • Established {new Date(site.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white p-4 pr-8 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Status</p>
                            <p className="text-xl font-black text-gray-900">{currentProgress}% <span className="text-xs text-gray-400 font-bold">Complete</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Info & Map Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Visual Insights Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-900 p-6 rounded-[32px] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary-600/20 rounded-bl-full"></div>
                            <Clock className="mb-4 text-primary-400" size={24} />
                            <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Last Sync</p>
                            <p className="text-lg font-bold">{progress.length > 0 ? new Date(progress[0].created_at).toLocaleDateString() : 'No Data'}</p>
                        </div>
                        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
                            <Activity className="mb-4 text-primary-600" size={24} />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Logs</p>
                            <p className="text-lg font-black text-gray-900">{progress.length} Entries</p>
                        </div>
                        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group">
                            <Camera className="mb-4 text-primary-600" size={24} />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Visual Evidence</p>
                            <p className="text-lg font-black text-gray-900">{progress.filter(p => p.image_url).length} Photos</p>
                        </div>
                    </div>

                    {/* Enhanced Map Section */}
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <MapPin size={22} className="text-primary-600" />
                                Geospatial Projection
                            </h3>
                            <button className="text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest bg-primary-50 px-4 py-2 rounded-xl transition-colors">
                                Expand View
                            </button>
                        </div>
                        <div className="h-96 rounded-[32px] overflow-hidden border-4 border-gray-50 shadow-inner relative group">
                            <MapContainer center={[site.latitude, site.longitude]} zoom={14} style={{ height: '100%', width: '100%' }} className="z-10">
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[site.latitude, site.longitude]} />
                            </MapContainer>
                            <div className="absolute inset-0 bg-gray-900/5 pointer-events-none group-hover:opacity-0 transition-opacity z-20"></div>
                        </div>
                    </div>

                    {/* Progress Submission Form */}
                    {user?.role === 'ADMIN' && (
                        <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-bl-[200px] -z-0 -translate-y-20 translate-x-20"></div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <ClipboardList size={24} className="text-primary-600" />
                                    Daily Intelligence Update
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Field Observations</label>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                    className="block w-full border-none bg-gray-50 rounded-[24px] py-4 px-6 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm font-bold placeholder:text-gray-400 resize-none shadow-inner"
                                                    placeholder="Describe major milestones and resource utilization..."
                                                ></textarea>
                                            </div>

                                            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[24px] border border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-xl transition-colors ${formData.delay_flag ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-400'}`}>
                                                        <AlertTriangle size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Incident Flag</p>
                                                        <p className="text-[10px] font-bold text-gray-400">Mark as delayed project</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={formData.delay_flag}
                                                        onChange={e => setFormData({ ...formData, delay_flag: e.target.checked })}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Milestone Completion</label>
                                                    <span className="text-sm font-black text-primary-600">{formData.progress_percentage}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={formData.progress_percentage}
                                                    onChange={e => setFormData({ ...formData, progress_percentage: Number(e.target.value) })}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                                />
                                                <div className="flex justify-between mt-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                    <span>Start</span>
                                                    <span>Finalization</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Photographic Evidence</label>
                                                {!preview ? (
                                                    <div className="relative group">
                                                        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-[32px] hover:border-primary-400 hover:bg-primary-50/50 transition-all cursor-pointer">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <div className="p-4 bg-gray-50 rounded-2xl mb-4 group-hover:bg-white transition-colors">
                                                                    <Upload className="text-gray-400 group-hover:text-primary-600" size={24} />
                                                                </div>
                                                                <p className="text-sm font-black text-gray-900">Upload Component</p>
                                                                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">JPG, PNG up to 5MB</p>
                                                            </div>
                                                            <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="relative group rounded-[32px] overflow-hidden h-48 border border-gray-100 shadow-inner">
                                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                            <button
                                                                type="button"
                                                                onClick={clearImage}
                                                                className="p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-2xl text-white transition-all"
                                                            >
                                                                <X size={20} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !formData.description}
                                        className="w-full py-5 bg-primary-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-primary-600/30 hover:bg-primary-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? (
                                            <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : (
                                            <>
                                                <Save size={22} />
                                                Publish Progress Report
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Timeline Column */}
                <div className="lg:col-span-4 h-full">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 h-full flex flex-col min-h-[600px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <Clock size={22} className="text-primary-600" />
                                Action Log
                            </h3>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">Historical</span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-8 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[11px] top-2 bottom-8 w-px bg-gradient-to-b from-primary-200 via-gray-100 to-transparent"></div>

                            {progress.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                                    <ClipboardList size={48} className="text-gray-300 mb-4" />
                                    <p className="text-gray-400 font-bold italic text-sm">No operational data recorded.</p>
                                </div>
                            ) : (
                                progress.map((p, idx) => (
                                    <div key={p.id} className="relative pl-10 group animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                        {/* Timeline Indicator */}
                                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-lg border-4 border-white shadow-md z-10 flex items-center justify-center ${p.delay_flag ? 'bg-red-500' : 'bg-primary-600'}`}>
                                            <CheckCircle2 size={10} className="text-white" />
                                        </div>

                                        <div className={`p-6 rounded-[28px] border ${p.delay_flag ? 'border-red-50 bg-red-50/20' : 'border-gray-50 bg-gray-50/30'} group-hover:bg-white group-hover:shadow-xl group-hover:border-transparent transition-all duration-500`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{new Date(p.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                    <p className="text-xs font-black text-gray-900">{new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <div className={`px-2 py-1 rounded-lg text-[11px] font-black ${p.delay_flag ? 'bg-red-100 text-red-600' : 'bg-primary-50 text-primary-600'}`}>
                                                    {p.progress_percentage}%
                                                </div>
                                            </div>

                                            <p className="text-sm font-bold text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">{p.description}</p>

                                            {p.image_url && (
                                                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-4 aspect-video relative group/img">
                                                    <img
                                                        src={`${apiBase}${p.image_url}`}
                                                        alt="Evidence"
                                                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                                                        onError={(e: any) => e.target.src = 'https://placehold.co/600x400?text=Evidence+Redacted'}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2">
                                                <Hexagon size={12} className={p.delay_flag ? 'text-red-400' : 'text-primary-400'} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${p.delay_flag ? 'text-red-400' : 'text-primary-400'}`}>
                                                    {p.delay_flag ? 'Anomaly Detected' : 'Verified Operation'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteDetail;
