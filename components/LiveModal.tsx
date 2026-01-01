
import React, { useState, useRef, useEffect } from 'react';
import { X, Tv, Maximize, Play, Volume2, VolumeX, Volume1, Info, AlertTriangle, MessageCircle, Send, Heart, Users, Activity, Radio, ChefHat, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  streamUrl: string;
  onClose: () => void;
  ticker: { text: string; visible: boolean; speed: number };
  logo: { url: string; position: 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT' };
  theme: 'MODERN' | 'GLASS' | 'VIBRANT';
  lowerThird: { title: string; subtitle: string; visible: boolean };
  chatOverlay: boolean;
  activeScene: Scene;
}

interface ChatMessage {
  role: 'user' | 'chef';
  text: string;
  timestamp: string;
}

type Scene = 'LIVE' | 'STANDBY' | 'PROMO' | 'B1' | 'B2';

interface FloatingReaction {
  id: number;
  emoji: string;
  left: number;
}

const LiveModal: React.FC<Props> = ({
  streamUrl, onClose,
  ticker, logo, theme, lowerThird, chatOverlay, activeScene
}) => {
  const [loadError, setLoadError] = useState(!streamUrl);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'chef', text: 'Bem-vindo ao Kantinho Live! O que vamos preparar hoje?', timestamp: 'Agora' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 40) + 12);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Audio states
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Ref para o container do player
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sync volume with video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Viewers simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => Math.max(5, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Clock interval
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, {
      role: 'user',
      text: userMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `O usuário disse: "${userMsg}". Responda como o Chef de Cozinha da Kantinho Delícia. Você está ao vivo na cozinha. Seja amigável, apaixonado por pizzas, use gírias de cozinha e mantenha a resposta curta (máximo 2 frases).`,
        config: {
          systemInstruction: "Você é o Chef da Kantinho Delícia, uma pizzaria premium. Você é carismático, orgulhoso de seus ingredientes frescos e ama interagir com os clientes durante a live."
        }
      });

      setMessages(prev => [...prev, {
        role: 'chef',
        text: response.text || "Mamma mia! O forno está chamando, repita por favor!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      console.error("Gemini Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const triggerReaction = (emoji: string) => {
    const id = Date.now();
    setReactions(prev => [...prev, { id, emoji, left: Math.random() * 80 + 10 }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 3000);
  };

  const toggleFullScreen = () => {
    // Para manter o logo visível, fazemos o contêiner inteiro entrar em tela cheia
    if (containerRef.current) {
      const elem = containerRef.current;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0) setIsMuted(false);
    else setIsMuted(true);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl" onClick={onClose}></div>

      <div className="relative w-full max-w-7xl h-[85vh] bg-slate-950 border border-white/5 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col lg:flex-row animate-in zoom-in duration-500">

        {/* Video Side - Este contêiner agora é o alvo da tela cheia */}
        <div ref={containerRef} className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">

          {/* HUD Overlay - Sempre acima do vídeo */}
          <div className="absolute inset-0 z-20 pointer-events-none p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="bg-red-600 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-red-900/40">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">AO VIVO</span>
                </div>
                <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] font-black text-white">{viewers}</span>
                </div>
              </div>

              {/* Watermark Logo Persistente (Visível mesmo em Fullscreen) */}
              <div className="flex flex-col items-end opacity-80 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <h1 className="text-2xl md:text-3xl font-bold font-crimson tracking-tight text-white leading-none">
                  KANTINHO <span className="text-red-600">DELÍCIA</span>
                </h1>
                <div className="bg-black/20 backdrop-blur-md px-2 py-0.5 rounded mt-1 border border-white/10">
                  <p className="text-[7px] md:text-[8px] font-black text-white uppercase tracking-[0.2em]">Broadcast Premium</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end relative h-full">
              {/* Lower Third */}
              {lowerThird.visible && (
                <div className="absolute bottom-4 left-0 flex animate-in slide-in-from-left duration-700">
                  <div className={`${theme === 'MODERN' ? 'bg-red-600/90 border-white' :
                    theme === 'GLASS' ? 'bg-white/20 backdrop-blur-2xl border-white/30' :
                      'bg-blue-600/90 border-white'
                    } p-4 px-8 rounded-2xl border-l-[4px] shadow-2xl flex items-center gap-6`}>
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                      <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">{lowerThird.title}</h3>
                      <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mt-1">{lowerThird.subtitle}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Overlay */}
              {chatOverlay && (
                <div className="absolute top-0 right-0 w-64 bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-white/10 animate-in fade-in slide-in-from-right duration-500">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Interação ao Vivo</p>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-red-500 mb-1">@JOÃO_PIZZA</p>
                        <p className="text-[10px] text-white/90 font-medium leading-relaxed">Essa de massa fina é a melhor do mundo! 🔥</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-blue-500 mb-1">@MARIA_KD</p>
                        <p className="text-[10px] text-white/90 font-medium leading-relaxed">O Chef humilhou nessa receita nova!!! 🍕🤌</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-auto hidden lg:block">
                <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Transmissão Estável
                  </p>
                  <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">Kantinho <span className="text-red-600">Kitchen TV</span></h4>
                </div>
              </div>

              {/* Tech Specs */}
              <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 ml-auto self-end">
                <p className="text-[9px] font-mono text-white/60 uppercase">ISO 800 | 4K | 60FPS</p>
              </div>
            </div>
          </div>

          {/* News Ticker Rendering */}
          {ticker.visible && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-2xl h-10 border-t border-white/10 flex items-center overflow-hidden z-[45] transition-all duration-500">
              {/* News Badge */}
              <div className="h-full bg-red-600 px-6 flex items-center gap-2 relative z-10 shadow-[20px_0_40px_rgba(220,38,38,0.3)]">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">BREAKING NEWS</span>
              </div>

              {/* Marquee Content */}
              <div className="flex-1 overflow-hidden relative h-full flex items-center">
                <div className="flex items-center gap-12 animate-marquee whitespace-nowrap px-8">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className="text-[10px] font-black uppercase tracking-widest text-white/90 flex items-center gap-4">
                      {ticker.text}
                      <span className="text-red-500 text-lg">✦</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Clock Panel */}
              <div className="h-full bg-white/5 backdrop-blur-md px-6 flex items-center border-l border-white/10 relative z-10">
                <span className="text-[12px] font-mono font-bold text-white tracking-widest">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          )}

          {/* Logo Rendering */}
          {logo.url && (
            <div className={`absolute z-50 p-6 pointer-events-none ${logo.position === 'TOP_LEFT' ? 'top-0 left-0' :
              logo.position === 'TOP_RIGHT' ? 'top-0 right-0' :
                logo.position === 'BOTTOM_LEFT' ? 'bottom-8 left-0' : 'bottom-8 right-0'
              }`}>
              <img src={logo.url} alt="Watermark" className="h-12 w-auto opacity-80 filter drop-shadow-lg" />
            </div>
          )}

          {/* Floating Reactions Layer */}
          <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
            {reactions.map(r => (
              <div
                key={r.id}
                className="absolute bottom-0 text-4xl animate-bounce-up opacity-0"
                style={{ left: `${r.left}%`, animation: 'float-up 3s ease-out forwards' }}
              >
                {r.emoji}
              </div>
            ))}
          </div>

          {/* Video / Off-air Display */}
          {(activeScene === 'LIVE' || activeScene === 'B1' || activeScene === 'B2') && (
            !loadError ? (
              <video
                ref={videoRef}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="w-full h-full object-cover"
                onError={() => setLoadError(true)}
                src={streamUrl}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center bg-[radial-gradient(circle_at_center,rgba(30,41,59,1)_0%,rgba(2,6,23,1)_100%)]">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 animate-pulse"></div>
                  <Radio className="w-20 h-20 text-slate-800 relative z-10" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Sinal não detectado</h3>
                <p className="text-slate-500 text-sm max-w-md font-medium">Nossa cozinha está em preparação. A live começa em instantes ou confira nossa agenda de fornadas.</p>
                <div className="mt-8 flex gap-4">
                  <div className="bg-slate-900/50 px-6 py-4 rounded-2xl border border-slate-800">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Próxima Live</p>
                    <p className="text-sm font-black text-white">HOJE, 19:30</p>
                  </div>
                  <div className="bg-slate-900/50 px-6 py-4 rounded-2xl border border-slate-800">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Status do Forno</p>
                    <p className="text-sm font-black text-orange-500">AQUECENDO</p>
                  </div>
                </div>
              </div>
            )
          )}

          {activeScene === 'STANDBY' && (
            <div className="w-full h-full bg-gradient-to-br from-indigo-950 to-blue-900 flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 animate-pulse">
                  <ChefHat className="w-16 h-16 text-white/20" />
                </div>
                <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-4 scale-animation">JÁ VOLTAMOS</h2>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          {activeScene === 'PROMO' && (
            <div className="w-full h-full bg-red-600 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="relative z-10 text-center scale-animation p-12 bg-white text-red-600 rounded-[60px] shadow-2xl skew-x-[-12deg] border-[12px] border-black">
                <h2 className="text-8xl font-black italic tracking-tighter uppercase">MEGALODON</h2>
                <p className="text-2xl font-black uppercase tracking-[0.3em] mt-2">DOUBLÉ PIZZA AGORA!</p>
              </div>
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="absolute text-4xl animate-float" style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: 0.1
                  }}>🍕</div>
                ))}
              </div>
            </div>
          )}

          {/* Video Controls Overlay (Interativo) */}
          <div className="absolute bottom-6 right-6 z-40 flex flex-col gap-3 group pointer-events-auto">

            {/* Volume Control Cluster */}
            <div className="flex flex-col items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full p-2 py-4 transition-all opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
              <div className="h-24 w-10 relative flex items-center justify-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="absolute -rotate-90 w-20 appearance-none bg-slate-800 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                />
              </div>
              <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center text-white hover:text-red-500 transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : volume < 0.5 ? <Volume1 className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => triggerReaction('🍕')} className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all">🍕</button>
              <button onClick={() => triggerReaction('❤️')} className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all">❤️</button>
              <button onClick={() => triggerReaction('🔥')} className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all">🔥</button>
            </div>
          </div>
        </div>

        {/* Chat Side */}
        <div className="w-full lg:w-[400px] border-l border-white/5 bg-slate-900/30 backdrop-blur-3xl flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center border border-red-500/30">
                <ChefHat className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-tight">Chat com o Chef</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] font-black text-emerald-500 uppercase">Online</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={toggleFullScreen} className="p-2.5 text-slate-500 hover:text-white transition-colors" title="Tela Cheia"><Maximize className="w-5 h-5" /></button>
              <button onClick={onClose} className="p-2.5 text-slate-500 hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium ${m.role === 'user'
                  ? 'bg-red-600 text-white rounded-tr-none'
                  : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-white/5'
                  }`}>
                  {m.text}
                </div>
                <span className="text-[9px] font-black text-slate-600 uppercase mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-1.5 p-2 px-4 bg-slate-800/40 rounded-full w-fit animate-pulse border border-white/5">
                <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce delay-200"></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 border-t border-white/5 bg-black/20">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Pergunte algo ao Chef..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-5 pr-14 text-sm text-white focus:outline-none focus:border-red-600 transition-all font-medium"
              />
              <button
                type="submit"
                disabled={isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-red-500 transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-4 text-center flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3 text-yellow-600" /> Powered by Kantinho AI
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee ${100 - ticker.speed}s linear infinite;
        }

        @keyframes float-up {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-300px) rotate(20deg); opacity: 0; }
        }
        /* Garantir que controles apareçam em tela cheia via containerRef */
        :fullscreen .pointer-events-auto {
          pointer-events: auto !important;
        }
      `}</style>
    </div>
  );
};

export default LiveModal;
