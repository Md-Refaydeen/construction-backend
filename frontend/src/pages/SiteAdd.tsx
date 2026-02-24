import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ArrowLeft, MapPin, Building2, Save, Globe, Info } from 'lucide-react';
import api from '../services/api';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ setLocation }: { setLocation: (loc: { lat: number, lng: number }) => void }) => {
    useMapEvents({
        click(e) {
            setLocation(e.latlng);
        },
    });
    return null;
};

const SiteAdd = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/sites', { name, latitude: location.lat, longitude: location.lng });
            navigate('/sites');
        } catch (error) {
            console.error('Failed to save site:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/sites')}
                    className="p-3 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl border border-gray-100 transition-all shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Register New <span className="text-primary-600">Project Site</span></h1>
                    <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-widest">Initialization Module</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest">Site Designation</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                                        <Building2 size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Skyline Heights Tower"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                                <p className="mt-2 text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                    <Info size={12} /> Unique identifier for internal tracking
                                </p>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Geospatial Data</label>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Latitude</p>
                                        <p className="text-sm font-black text-gray-900">{location.lat.toFixed(6)}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Longitude</p>
                                        <p className="text-sm font-black text-gray-900">{location.lng.toFixed(6)}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !name}
                                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 text-white py-4 rounded-2xl font-black shadow-xl shadow-primary-600/20 transition-all active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Initialize Site
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-primary-600 p-8 rounded-[32px] text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform"></div>
                        <Globe className="mb-4 opacity-40" size={32} />
                        <h3 className="text-lg font-black mb-2">Automated Mapping</h3>
                        <p className="text-primary-100/80 text-xs font-bold leading-relaxed">Selecting a location will automatically sync coordinates with our global project database.</p>
                    </div>
                </div>

                {/* Map Column */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-4 rounded-[40px] border border-gray-100 shadow-xl lg:h-full min-h-[500px] overflow-hidden">
                        <div className="h-full w-full rounded-[32px] overflow-hidden border border-gray-50 relative">
                            <MapContainer
                                center={[location.lat, location.lng]}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                                className="z-10"
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationPicker setLocation={setLocation} />
                                <Marker position={[location.lat, location.lng]} />
                            </MapContainer>
                            <div className="absolute top-6 left-6 z-20 pointer-events-none">
                                <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 flex items-center gap-2">
                                    <MapPin size={16} className="text-primary-600" />
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Click map to set location</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteAdd;
