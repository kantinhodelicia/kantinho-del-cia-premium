
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Pizza, Phone, User as UserIcon, ArrowRight, ShieldCheck, Sparkles, ChefHat, MapPin } from 'lucide-react';

interface Props {
  onComplete: (user: User) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Elegant entrance delay
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      const user: User = {
        name,
        phone,
        points: 10,
        ordersCount: 0,
        level: 'BRONZE',
        isAdmin: isAdmin || name.toLowerCase().includes('admin')
      };
      localStorage.setItem('kd_user', JSON.stringify(user));
      onComplete(user);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-red-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-orange-600/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className={`w-full max-w-lg transition-all duration-1000 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        {/* Branding Header */}
        <div className="text-center mb-12">
          <div className="inline-flex relative mb-8">
            <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-[32px] flex items-center justify-center shadow-[0_20px_50px_rgba(220,38,38,0.3)] rotate-6 border border-white/10 overflow-hidden">
              <img src="logo.png" className="w-full h-full object-cover" alt="Kantinho Delícia Logo" />
            </div>
            <div className="absolute -right-4 -top-4 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-xl animate-bounce">
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
          </div>

          <h1 className="text-5xl font-black text-white tracking-tighter mb-3 uppercase italic">
            Kantinho <span className="text-red-600">Premium</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-wide">
            Bem-vindo ao nosso <span className="text-slate-200">Digital Concierge</span>.
            <br />Identifique-se para acessar o menu exclusivo.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 shadow-2xl relative">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Nome do Convidado</label>
              <div className="relative group">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-red-500 transition-colors" />
                <input
                  required
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-white text-lg font-bold focus:outline-none focus:border-red-600/50 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">WhatsApp para Contato</label>
              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-red-500 transition-colors" />
                <input
                  required
                  type="tel"
                  placeholder="Ex: 599 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-white text-lg font-bold focus:outline-none focus:border-red-600/50 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="pt-4 grid grid-cols-1 gap-4">
              <div
                onClick={() => setIsAdmin(!isAdmin)}
                className={`flex items-center gap-4 p-5 rounded-3xl border transition-all cursor-pointer group ${isAdmin ? 'bg-red-600/10 border-red-500/40 text-red-500' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
              >
                <div className={`p-2 rounded-xl ${isAdmin ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-800 text-slate-600 group-hover:bg-slate-700'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-black uppercase tracking-widest block">Acesso Privilegiado</span>
                  <span className="text-[9px] font-bold opacity-60">Ativar ferramentas administrativas</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-4 transition-all shadow-[0_20px_40px_rgba(220,38,38,0.2)] group active:scale-[0.98] mt-4"
              >
                ENTRAR NO KANTINHO
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </form>
        </div>

        {/* Footer Meta */}
        <div className="mt-12 flex flex-col items-center gap-4 opacity-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-slate-800" />
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Praia, Cabo Verde</span>
            <div className="w-8 h-px bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
