
import React from 'react';
import { User } from '../types';
import { User as UserIcon, LogOut, Award, ShieldAlert, Tv } from 'lucide-react';

interface Props {
  user: User;
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  onOpenLive: () => void;
  backgroundUrl?: string;
  hasLive?: boolean;
}

const Header: React.FC<Props> = ({ user, onLogout, onOpenProfile, onOpenAdmin, onOpenLive, backgroundUrl, hasLive }) => {
  return (
    <header className="relative py-12 md:py-20 px-4 overflow-hidden min-h-[350px] md:min-h-[450px] flex items-center justify-center">
      {/* Dynamic Background Layer */}
      <div
        className="absolute inset-0 z-[-2] transition-all duration-1000 ease-in-out scale-105"
        style={{
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Premium Overlays */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-[-1]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950 z-[-1]"></div>

      {/* Decorative Glow */}
      {!backgroundUrl && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[100px] -z-10 rounded-full animate-pulse"></div>
      )}

      <div className="max-w-4xl mx-auto flex flex-col items-center relative">
        {hasLive && (
          <button
            onClick={onOpenLive}
            className="mb-8 flex items-center gap-3 bg-red-600/10 backdrop-blur-xl border border-red-500/30 px-6 py-3 rounded-[24px] hover:bg-red-600/20 transition-all group relative overflow-hidden shadow-2xl shadow-red-900/40"
          >
            <div className="absolute inset-0 animate-shimmer opacity-20" />
            <div className="relative">
              <Tv className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 flex">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping opacity-75 absolute"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </div>
            </div>
            <div className="flex flex-col items-start leading-none scale-95 group-hover:scale-100 transition-transform">
              <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">On Air Center</span>
              <span className="text-xs font-black text-white uppercase tracking-widest">Kantinho Live On</span>
            </div>
          </button>
        )}

        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold font-crimson tracking-tight text-white mb-2 text-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            KANTINHO <span className="text-red-600">DELÍCIA</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-red-600/50"></div>
            <p className="text-slate-200 font-black tracking-[0.3em] text-[10px] uppercase drop-shadow-md">Artesanal & Premium</p>
            <div className="h-px w-8 bg-red-600/50"></div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-2 border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform relative overflow-hidden">
              <UserIcon className="w-5 h-5 text-white" />
              {user.points > 0 && (
                <div className="absolute -bottom-1 right-0 bg-yellow-500 p-0.5 rounded-full ring-2 ring-slate-900">
                  <Award className="w-2 h-2 text-slate-900" />
                </div>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-black text-slate-100 block leading-tight">{user.name.split(' ')[0]}</span>
              <span className="text-[9px] font-black text-yellow-500 uppercase tracking-tighter">{user.points} Pontos</span>
            </div>
          </button>

          <div className="w-px h-6 bg-white/10"></div>

          {user.isAdmin && (
            <>
              <button
                onClick={onOpenAdmin}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all flex items-center justify-center"
                title="Painel Admin"
              >
                <ShieldAlert className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-white/10"></div>
            </>
          )}

          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
