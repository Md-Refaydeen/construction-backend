import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Layers, Save, Info, Sparkles } from 'lucide-react';
import api from '../services/api';

const MaterialAdd = () => {
    const [name, setName] = useState('');
    const [totalStock, setTotalStock] = useState<number | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/materials', { name, total_stock: Number(totalStock) });
            navigate('/materials');
        } catch (error) {
            console.error('Failed to save material:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/materials')}
                    className="p-3 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl border border-gray-100 transition-all shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Register <span className="text-primary-600">Material Stock</span></h1>
                    <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-widest">Inventory Manifest</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary-50 rounded-bl-[100px] -translate-y-10 translate-x-10 -z-0"></div>

                    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                        <div className="grid grid-cols-1 gap-8">
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-widest">Material Nomenclature</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                                        <Package size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Portland Cement Type I"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-[24px] text-base font-bold focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-gray-400 shadow-inner"
                                    />
                                </div>
                                <p className="mt-3 text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                    <Info size={12} /> Specify standard industry name for precise tracking
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-widest">Initial Supply Quantity</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                                        <Layers size={20} />
                                    </div>
                                    <input
                                        type="number"
                                        min="1"
                                        step="any"
                                        required
                                        placeholder="0.00"
                                        value={totalStock}
                                        onChange={e => setTotalStock(Number(e.target.value))}
                                        className="w-full pl-14 pr-20 py-5 bg-gray-50 border-none rounded-[24px] text-base font-bold focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-gray-400 shadow-inner"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">Units</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || !name || !totalStock}
                                className="flex-1 flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 text-white py-5 rounded-[24px] font-black shadow-2xl shadow-primary-600/30 transition-all active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Commit to Ledger
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/materials')}
                                className="px-8 py-5 bg-gray-50 text-gray-500 font-bold rounded-[24px] hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                            >
                                Discard
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-gray-900 p-8 rounded-[40px] text-white flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent)] pointer-events-none"></div>
                    <div className="p-5 bg-white/5 rounded-[24px] border border-white/5">
                        <Sparkles size={32} className="text-primary-400" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black mb-1">Smart Stock Monitoring</h4>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">Once registered, this material will automatically trigger alerts when stock levels drop below the defined project safety threshold.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialAdd;
