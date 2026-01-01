
import React from 'react';
import { Share2 } from 'lucide-react';

const AdBanner: React.FC = () => {
    return (
        <div
            id="admob-banner-container"
            className="w-full max-w-4xl mx-auto mt-8 mb-4 px-4 overflow-hidden"
        >
            <div className="relative group bg-slate-900/40 border border-white/5 rounded-[32px] p-6 backdrop-blur-3xl transition-all duration-500 hover:bg-slate-900/60 overflow-hidden">
                {/* Animated Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-[60px] animate-pulse" />

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-none opacity-40 grayscale group-hover:opacity-60 group-hover:grayscale-0 transition-all duration-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                            <Share2 className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Publicidade Premium</p>
                            <h4 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">Espaço para Patrocínio</h4>
                        </div>
                    </div>
                    <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-white/5 via-white/10 to-transparent mx-8" />
                    <div className="text-center md:text-right">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">Anúncio ID: B-7909218446</span>
                    </div>
                </div>

                {/* Native Injection Hint (for Webview wrappers) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[8px] font-black text-white/5 uppercase tracking-[1em]">ADMOB BANNER ZONE</span>
                </div>
            </div>
        </div>
    );
};

export default AdBanner;
