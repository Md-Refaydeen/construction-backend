import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Mail, Lock, Eye, EyeOff, Loader2, Activity, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.access_token, res.data.user);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex overflow-hidden">
            {/* Left Side: Branding & Illustration */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 group">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/construction_login_bg.png"
                        alt="Construction Site"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-10000 ease-linear"
                        onError={(e: any) => e.target.src = 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=2670'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/90 via-primary-900/50 to-transparent"></div>
                </div>

                <div className="relative z-10 w-full p-16 flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                            <Activity size={28} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Construction<span className="text-primary-400">Tracker</span></h1>
                    </div>

                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 backdrop-blur-md border border-primary-400/30 rounded-full text-primary-300 text-xs font-bold uppercase tracking-widest mb-6">
                            <ShieldCheck size={14} />
                            Secured Enterprise Platform
                        </div>
                        <h2 className="text-5xl font-black text-white leading-tight mb-6">
                            Monitor every <span className="text-primary-400">brick</span> and <span className="text-primary-400">beam</span> in real-time.
                        </h2>
                        <p className="text-xl text-primary-100/80 leading-relaxed max-w-lg mb-8">
                            The all-in-one construction management platform for modern site superintendents and project managers.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-3xl font-black text-white">99.8%</p>
                                <p className="text-sm font-bold text-primary-300/60 uppercase tracking-widest mt-1">Accuracy Rate</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white">2.4k+</p>
                                <p className="text-sm font-bold text-primary-300/60 uppercase tracking-widest mt-1">Active Sites</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-primary-400/60 text-sm font-medium">
                        © 2026 Construction Site Tracker. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 bg-gray-50/50">
                <div className="w-full max-w-md animate-in slide-in-from-right-12 duration-700">
                    <div className="lg:hidden flex items-center gap-3 mb-10 translate-y-[-20px]">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Activity size={20} className="text-white" />
                        </div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight">Construction<span className="text-primary-600">Tracker</span></h1>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Welcome Back</h2>
                        <p className="text-gray-500 font-medium">Please enter your credentials to access the site dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in zoom-in duration-300">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all bg-white shadow-sm"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="block w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all bg-white shadow-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-300 text-primary-600 focus:ring-primary-600" />
                                <span className="ml-3 text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-bold text-primary-600 hover:text-primary-500 transition-colors">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 px-6 border border-transparent text-base font-black rounded-2xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 shadow-xl shadow-primary-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <>
                                    Sign In to Dashboard
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-sm font-bold text-gray-500">
                        Don't have an account?{' '}
                        <a href="#" className="text-primary-600 hover:text-primary-500 transition-colors">
                            Contact your project administrator
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
