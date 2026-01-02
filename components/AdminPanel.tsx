
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product, SaleRecord, DeliveryZone, OrderStatus, CartItem } from '../types';
import {
  X, LayoutDashboard, Utensils, TrendingUp, Plus, Edit3,
  Trash2, Save, ShoppingBag, DollarSign, Package, Filter,
  ArrowUpRight, Users, ChevronRight, Eye, EyeOff, BarChart3, Settings,
  MapPin, Calendar, Search, SlidersHorizontal, Activity, ArrowRight,
  Receipt, Pizza, Coins, Tv, Image as ImageIcon, LogOut, ShieldAlert,
  Clock, CheckCircle2, AlertCircle, Ban, Wallet, Star, Sun, CalendarDays,
  Zap, FileSpreadsheet, FileText, Printer, MessageCircle, ChevronDown,
  Timer, UtensilsCrossed, ChevronUp, Phone, ShoppingCart, PlusCircle,
  Layers, Coffee, AlertTriangle, CreditCard, Upload, Check, SwitchCamera,
  BellRing, Palette, List, QrCode, Play, MoveUp, MoveDown, Tag, GripVertical,
  Volume2, Bell, Globe, MonitorPlay, Radio, Signal, Wifi, Cpu, PlayCircle,
  Camera, Mic, MessageSquareQuote, BrainCircuit, History, ExternalLink
} from 'lucide-react';

interface Props {
  products: Product[];
  categories: string[];
  zones: DeliveryZone[];
  sales: SaleRecord[];
  headerBg?: string;
  streamUrl?: string;
  onUpdateProducts: (p: Product[]) => void;
  onUpdateCategories: (c: string[]) => void;
  onUpdateZones: (z: DeliveryZone[]) => void;
  onUpdateSales: (s: SaleRecord[]) => void;
  onUpdateHeaderBg: (url: string) => void;
  onUpdateStreamUrl: (url: string) => void;
  onClose: () => void;
  graphics: {
    tickerText: string; setTickerText: (v: string) => void;
    showTicker: boolean; setShowTicker: (v: boolean) => void;
    tickerSpeed: number; setTickerSpeed: (v: number) => void;
    logoUrl: string; setLogoUrl: (v: string) => void;
    logoPosition: 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT'; setLogoPosition: (v: any) => void;
    graphicTheme: 'MODERN' | 'GLASS' | 'VIBRANT'; setGraphicTheme: (v: any) => void;
    lowerThirdTitle: string; setLowerThirdTitle: (v: string) => void;
    lowerThirdSubtitle: string; setLowerThirdSubtitle: (v: string) => void;
    isLowerThirdVisible: boolean; setIsLowerThirdVisible: (v: boolean) => void;
    showChatOverlay: boolean; setShowChatOverlay: (v: boolean) => void;
    activeScene: 'LIVE' | 'STANDBY' | 'PROMO' | 'B1' | 'B2'; setGlobalActiveScene: (v: any) => void;
  };
  onSaveGraphics: (g: any) => void;
}

type AdminView = 'DASHBOARD' | 'PEDIDOS' | 'CARDÁPIO' | 'ZONAS' | 'CONFIGS';

const AdminPanel: React.FC<Props> = ({
  products, categories, zones, sales, headerBg, streamUrl,
  onUpdateProducts, onUpdateCategories, onUpdateZones, onUpdateSales,
  onUpdateHeaderBg, onUpdateStreamUrl, onClose,
  graphics, onSaveGraphics
}) => {
  // Local states for graphics, initialized from props
  const [tickerText, setTickerText] = useState(graphics.tickerText);
  const [showTicker, setShowTicker] = useState(graphics.showTicker);
  const [tickerSpeed, setTickerSpeed] = useState(graphics.tickerSpeed);
  const [logoUrl, setLogoUrl] = useState(graphics.logoUrl);
  const [logoPosition, setLogoPosition] = useState(graphics.logoPosition);
  const [graphicTheme, setGraphicTheme] = useState(graphics.graphicTheme);
  const [lowerThirdTitle, setLowerThirdTitle] = useState(graphics.lowerThirdTitle);
  const [lowerThirdSubtitle, setLowerThirdSubtitle] = useState(graphics.lowerThirdSubtitle);
  const [isLowerThirdVisible, setIsLowerThirdVisible] = useState(graphics.isLowerThirdVisible);
  const [showChatOverlay, setShowChatOverlay] = useState(graphics.showChatOverlay);

  // Effect to update local states if graphics prop changes
  useEffect(() => {
    setTickerText(graphics.tickerText);
    setShowTicker(graphics.showTicker);
    setTickerSpeed(graphics.tickerSpeed);
    setLogoUrl(graphics.logoUrl);
    setLogoPosition(graphics.logoPosition);
    setGraphicTheme(graphics.graphicTheme);
    setLowerThirdTitle(graphics.lowerThirdTitle);
    setLowerThirdSubtitle(graphics.lowerThirdSubtitle);
    setIsLowerThirdVisible(graphics.isLowerThirdVisible);
    setShowChatOverlay(graphics.showChatOverlay);
  }, [graphics]);

  const saveG = (updates: any) => {
    // Update global state in App.tsx immediately via passed setters if available
    if (updates.tickerText !== undefined) graphics.setTickerText(updates.tickerText);
    if (updates.showTicker !== undefined) graphics.setShowTicker(updates.showTicker);
    if (updates.tickerSpeed !== undefined) graphics.setTickerSpeed(updates.tickerSpeed);
    if (updates.activeScene !== undefined) graphics.setGlobalActiveScene(updates.activeScene);
    // ... we can add more if needed, but the important thing is syncing to DB

    onSaveGraphics({
      tickerText: updates.tickerText ?? graphics.tickerText,
      showTicker: updates.showTicker ?? graphics.showTicker,
      tickerSpeed: updates.tickerSpeed ?? graphics.tickerSpeed,
      logoUrl: updates.logoUrl ?? graphics.logoUrl,
      logoPosition: updates.logoPosition ?? graphics.logoPosition,
      graphicTheme: updates.graphicTheme ?? graphics.graphicTheme,
      lowerThirdTitle: updates.lowerThirdTitle ?? graphics.lowerThirdTitle,
      lowerThirdSubtitle: updates.lowerThirdSubtitle ?? graphics.lowerThirdSubtitle,
      isLowerThirdVisible: updates.isLowerThirdVisible ?? graphics.isLowerThirdVisible,
      showChatOverlay: updates.showChatOverlay ?? graphics.showChatOverlay,
      activeScene: updates.activeScene ?? graphics.activeScene,
      ...updates
    });
  };

  const syncScene = (scene: any) => {
    saveG({ activeScene: scene });
  };

  const [activeView, setActiveView] = useState<AdminView>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminToast, setAdminToast] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'alert' } | null>(null);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [saleSearch, setSaleSearch] = useState('');
  const [highlightedOrderIds, setHighlightedOrderIds] = useState<Set<string>>(new Set());
  const [pedidosDisplayMode, setPedidosDisplayMode] = useState<'LIST' | 'KANBAN'>('KANBAN');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Live Studio States
  const [tempStreamUrl, setTempStreamUrl] = useState(streamUrl || '');
  const [isLocalCamActive, setIsLocalCamActive] = useState(false);
  const [aiPersona, setAiPersona] = useState<'FRIENDLY' | 'FUNNY' | 'CHEF_HARD'>('FRIENDLY');

  // Broadcast Control Center States
  // No local activeScene state, use graphics.activeScene
  const [previewScene, setPreviewScene] = useState<'LIVE' | 'STANDBY' | 'PROMO' | 'B1' | 'B2'>('STANDBY');
  const [activeOverlays, setActiveOverlays] = useState<Set<string>>(new Set(['LOWER_THIRD']));
  const [telemetry, setTelemetry] = useState({ viewers: 124, bitrate: 4500, fps: 60 });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [vuLevel, setVuLevel] = useState(45);
  const [audioMixer, setAudioMixer] = useState({ mic: 80, studio: 70, sfx: 50, music: 40 });
  const [tBarPosition, setTBarPosition] = useState(0); // 0 to 100
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [telemetryHistory, setTelemetryHistory] = useState<{ time: number, bitrate: number, fps: number }[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [externalSources, setExternalSources] = useState<{ b1: string, b2: string }>({
    b1: streamUrl || '',
    b2: ''
  });
  const [sourceLabels, setSourceLabels] = useState<{ b1: string, b2: string }>({
    b1: 'EXT-SIGNAL-1',
    b2: 'EXT-SIGNAL-2'
  });
  const [selectedExternalSource, setSelectedExternalSource] = useState<'b1' | 'b2'>('b1');
  const [signalHealth, setSignalHealth] = useState({ b1: 100, b2: 0 });
  const [studioSubTab, setStudioSubTab] = useState<'SWITCHER' | 'GRAPHICS' | 'MIXER'>('SWITCHER');
  const [chatMessages, setChatMessages] = useState<{ id: string, user: string, text: string }[]>([
    { id: '1', user: 'Marcos P.', text: 'Essa pizza de calabresa é a melhor da cidade! 🔥' },
    { id: '2', user: 'Ana Julia', text: 'Quando sai a próxima fornada?' }
  ]);

  useEffect(() => {
    const handleNewMessage = () => {
      const users = ['Ricardo', 'Beatriz', 'Carlos', 'Daniella', 'Eduardo'];
      const texts = ['Uau, que recheio!', 'Entregam no Palmarejo?', 'O preço tá ótimo!', 'Fornada ao vivo é outro nível', 'Pedi uma agora!'];
      const newMessage = {
        id: Date.now().toString(),
        user: users[Math.floor(Math.random() * users.length)],
        text: texts[Math.floor(Math.random() * texts.length)]
      };
      setChatMessages(prev => [newMessage, ...prev].slice(0, 10));
    };
    const interval = setInterval(handleNewMessage, 5000 + Math.random() * 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const newBitrate = 4500 + Math.floor(Math.random() * 200) - 100;
        const newFps = 60 + Math.floor(Math.random() * 2) - 1;

        setTelemetryHistory(h => {
          const next = [...h, { time: Date.now(), bitrate: newBitrate, fps: newFps }];
          return next.slice(-20); // Keep last 20 points
        });

        return {
          viewers: Math.max(0, prev.viewers + Math.floor(Math.random() * 5) - 2),
          bitrate: newBitrate,
          fps: newFps
        };
      });
      setVuLevel(Math.floor(Math.random() * 60) + 20);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeView !== 'CONFIGS') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === '1') setPreviewScene('LIVE');
      if (e.key === '2') setPreviewScene('STANDBY');
      if (e.key === '3') setPreviewScene('PROMO');
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleCut();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, previewScene, graphics.activeScene]);

  const handleCut = () => {
    const pgm = graphics.activeScene;
    const pvw = previewScene;
    graphics.setGlobalActiveScene(pvw);
    setPreviewScene(pgm);
    syncScene(pvw); // Sync the new active scene globally
    showAdminToast(`CUT: ${pvw}`, 'success');
  };

  const handleAuto = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setTBarPosition(progress);
      if (progress >= 100) {
        clearInterval(interval);
        const pgm = graphics.activeScene;
        const pvw = previewScene;
        graphics.setGlobalActiveScene(pvw);
        setPreviewScene(pgm);
        syncScene(pvw); // Sync the new active scene globally after auto transition
        showAdminToast(`AUTO: ${pvw}`, 'success');
        setTimeout(() => {
          setTBarPosition(0);
          setIsTransitioning(false);
        }, 500);
      }
    }, 50);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const lastSalesLengthRef = useRef(sales.length);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (isLocalCamActive) {
      const startCam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          localStreamRef.current = stream;
          if (videoPreviewRef.current) videoPreviewRef.current.srcObject = stream;
          const interval = setInterval(() => { setVuLevel(Math.random() * 80 + 10); }, 100);
          return () => clearInterval(interval);
        } catch (err) {
          showAdminToast("Erro ao acessar câmera local", "error");
          setIsLocalCamActive(false);
        }
      };
      startCam();
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
    }
  }, [isLocalCamActive]);

  const playNotificationSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // Triple ping effect
      playTone(523.25, ctx.currentTime, 0.4); // C5
      playTone(659.25, ctx.currentTime + 0.15, 0.4); // E5
      playTone(783.99, ctx.currentTime + 0.3, 0.6); // G5
    } catch (e) { console.warn("Audio Context error:", e); }
  };

  useEffect(() => {
    if (sales.length > lastSalesLengthRef.current) {
      const newOrders = sales.slice(0, sales.length - lastSalesLengthRef.current);
      playNotificationSound();

      const newIds = newOrders.map(o => o.id);
      setHighlightedOrderIds(prev => new Set([...prev, ...newIds]));

      // Auto-remove highlight after 30s
      setTimeout(() => {
        setHighlightedOrderIds(prev => {
          const next = new Set(prev);
          newIds.forEach(id => next.delete(id));
          return next;
        });
      }, 30000);

      showAdminToast(`NOVO PEDIDO: ${sales[0].customerName}`, 'alert');
      if (activeView !== 'PEDIDOS') setNewOrdersCount(prev => prev + newIds.length);
    }
    lastSalesLengthRef.current = sales.length;
  }, [sales, activeView]);

  const showAdminToast = (message: string, type: 'success' | 'error' | 'info' | 'alert' = 'info') => {
    setAdminToast({ message, type });
    setTimeout(() => setAdminToast(null), 8000);
  };

  const handleUpdateStatus = (saleId: string, newStatus: OrderStatus) => {
    onUpdateSales(sales.map(s => s.id === saleId ? { ...s, status: newStatus } : s));
    showAdminToast(`Status: ${newStatus}`, 'success');
    if (highlightedOrderIds.has(saleId)) {
      setHighlightedOrderIds(prev => {
        const next = new Set(prev);
        next.delete(saleId);
        return next;
      });
    }
  };

  const handleApplyStream = () => {
    onUpdateStreamUrl(tempStreamUrl);
    showAdminToast("Broadcast configurado!", "success");
  };

  const handlePrint = (sale: SaleRecord) => {
    const printArea = document.getElementById('print-area');
    if (!printArea) return;

    const date = new Date(sale.timestamp).toLocaleString('pt-CV', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let itemsHtml = '';
    let subtotalComputed = 0;

    if (sale.items && sale.items.length > 0) {
      itemsHtml = sale.items.map(item => {
        const itemExtrasTotal = item.extras.reduce((acc, e) => acc + e.price, 0);
        const itemBaseTotal = (item.price + itemExtrasTotal) * item.quantity;
        subtotalComputed += itemBaseTotal;

        return `
          <div class="item">
            <div class="item-main">
              <span>${item.quantity}x ${item.name}</span>
              <span>${itemBaseTotal.toFixed(2)}$</span>
            </div>
            <div class="item-extras">
              <span>Tamanho: ${item.size}</span>
              ${item.extras.map(e => `<div>+ ${e.name} (${e.price.toFixed(2)}$)</div>`).join('')}
            </div>
          </div>
        `;
      }).join('');
    } else {
      itemsHtml = `<div class="item"><div class="item-main"><span>${sale.itemsDetail}</span><span>${sale.total.toFixed(2)}$</span></div></div>`;
      subtotalComputed = sale.total;
    }

    const deliveryFee = sale.total - subtotalComputed;

    printArea.innerHTML = `
      <div class="thermal-receipt">
        <div class="header">
          <h1>KANTINHO DELÍCIA</h1>
          <p>PREMIUM PIZZARIA</p>
          <p>Praia, Cabo Verde</p>
          <p>WhatsApp: (+238) 993 42 21</p>
        </div>
        
        <div class="divider" style="border-top: 1px dashed #000; margin: 3mm 0;"></div>
        
        <div class="order-info">
          <p><b>Pedido:</b> #${sale.id.slice(-6).toUpperCase()}</p>
          <p><b>Data:</b> ${date}</p>
          <p><b>Cliente:</b> ${sale.customerName}</p>
          ${sale.customerPhone ? `<p><b>Telefone:</b> ${sale.customerPhone}</p>` : ''}
          ${sale.zoneName ? `<p><b>Zona/Entr:</b> ${sale.zoneName}</p>` : ''}
        </div>

        <div class="divider" style="border-top: 1px dashed #000; margin: 3mm 0;"></div>
        
        <div class="items">
          ${itemsHtml}
        </div>

        <div class="divider" style="border-top: 1px dashed #000; margin: 3mm 0;"></div>
        
        <div class="totals">
          <div class="total-row" style="display: flex; justify-content: space-between;">
            <span>SUBTOTAL</span>
            <span>${subtotalComputed.toFixed(2)}$</span>
          </div>
          ${deliveryFee > 0 ? `
            <div class="total-row" style="display: flex; justify-content: space-between;">
              <span>TAXA ENTREGA</span>
              <span>${deliveryFee.toFixed(2)}$</span>
            </div>
          ` : ''}
          <div class="total-row grand-total" style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; margin-top: 3mm; border-top: 1px solid #000; padding-top: 2mm;">
            <span>TOTAL A PAGAR</span>
            <span>${sale.total.toFixed(2)}$</span>
          </div>
        </div>

        <div class="divider" style="border-top: 1px dashed #000; margin: 3mm 0;"></div>
        
        <div class="footer" style="text-align: center; margin-top: 8mm;">
          <p><b>PAGAMENTO:</b> ${sale.paymentMethod || 'DINHEIRO'}</p>
          <p class="thanks" style="font-weight: bold; margin-top: 2mm;">OBRIGADO PELA PREFERÊNCIA!</p>
          <p style="font-size: 8px; margin-top: 5mm; color: #666;">Kantinho Lab v4.2 Switching & Routing</p>
        </div>
      </div>
    `;

    setTimeout(() => {
      window.print();
    }, 150);
  };

  const renderOrderCard = (sale: SaleRecord, isKanban = false) => {
    const isNew = highlightedOrderIds.has(sale.id);
    const ageMinutes = Math.floor((currentTime - sale.timestamp) / 60000);
    const timerColor = ageMinutes > 30 ? 'text-red-500' : ageMinutes > 15 ? 'text-orange-500' : 'text-gray-500';

    return (
      <div
        key={sale.id}
        className={`bg-gray-900 border ${isNew ? 'border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.2)]' : 'border-gray-800'} rounded-[32px] p-6 flex flex-col gap-5 transition-all hover:border-gray-700`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative ${sale.status === 'RECEBIDO' ? 'bg-red-600 shadow-lg shadow-red-900/30' : 'bg-gray-800'}`}>
              {isNew && <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></span>}
              <Package className={`w-5 h-5 ${isNew ? 'animate-bounce' : ''}`} />
            </div>
            <div>
              <h4 className="text-base font-black uppercase tracking-tight truncate max-w-[140px]">{sale.customerName}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock className={`w-3 h-3 ${timerColor}`} />
                <span className={`text-[8px] font-black uppercase tracking-widest ${timerColor}`}>Há {ageMinutes} min</span>
                <span className="text-[8px] text-gray-700">•</span>
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{sale.paymentMethod || 'DINHEIRO'}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[20px] font-black">{sale.total}$</p>
            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{sale.id.slice(-6)}</p>
          </div>
        </div>

        {/* ITEMS DISPLAY */}
        <div className="bg-black/20 rounded-2xl p-4 space-y-2 border border-white/5">
          {sale.items?.map(item => (
            <div key={item.uniqueId} className="flex justify-between text-[10px] font-bold">
              <span className="text-gray-300">
                <span className="text-red-500 mr-1">{item.quantity}x</span>
                {item.name}
                <span className="text-gray-600 ml-1">({item.size})</span>
              </span>
              {item.extras.length > 0 && <span className="text-blue-500">+{item.extras.length}</span>}
            </div>
          ))}
          {!sale.items && <p className="text-[10px] text-gray-500 italic">{sale.itemsDetail}</p>}
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex gap-2">
          {sale.status === 'RECEBIDO' && (
            <button
              onClick={() => handleUpdateStatus(sale.id, 'PREPARO')}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-[9px] font-black py-3 rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              Preparo <ArrowRight className="w-3 h-3" />
            </button>
          )}
          {sale.status === 'PREPARO' && (
            <button
              onClick={() => handleUpdateStatus(sale.id, 'PRONTO')}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-[9px] font-black py-3 rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              Pronto <CheckCircle2 className="w-3 h-3" />
            </button>
          )}
          {sale.status === 'PRONTO' && (
            <button
              onClick={() => handleUpdateStatus(sale.id, 'ENTREGUE')}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-[9px] font-black py-3 rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              Entrega <Zap className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => handlePrint(sale)}
            className="bg-gray-800 hover:bg-gray-700 p-3 rounded-xl text-gray-400 transition-all"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderSceneFeed = (scene: 'LIVE' | 'STANDBY' | 'PROMO' | 'B1' | 'B2', isProgram: boolean) => {
    // Theme configurations
    const themeStyles = {
      MODERN: 'bg-red-600/90 border-white',
      GLASS: 'bg-white/10 backdrop-blur-2xl border-white/20',
      VIBRANT: 'bg-blue-600 border-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
    };

    const logoPositions = {
      TOP_LEFT: 'top-10 left-10',
      TOP_RIGHT: 'top-10 right-10',
      BOTTOM_LEFT: 'bottom-32 left-10',
      BOTTOM_RIGHT: 'bottom-32 right-10'
    };

    return (
      <div className="w-full h-full relative group/feed overflow-hidden">
        {/* Signal Checkers */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
        <div className="absolute inset-0 transition-opacity duration-500">
          {scene === 'LIVE' && (
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-purple-900/20 animate-pulse"></div>
              {tempStreamUrl ? (
                <video src={tempStreamUrl} autoPlay muted loop className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-16 h-16 text-white/10" />
                </div>
              )}
            </div>
          )}
          {(scene === 'B1' || scene === 'B2') && (
            <div className="w-full h-full relative bg-blue-900/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent"></div>
              {externalSources[scene.toLowerCase() as 'b1' | 'b2'] ? (
                <video src={externalSources[scene.toLowerCase() as 'b1' | 'b2']} autoPlay muted loop className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <Signal className="w-12 h-12 text-white/5 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/10 text-center px-10">Waiting for Master Signal {scene}...</span>
                </div>
              )}
            </div>
          )}
          {scene === 'STANDBY' && (
            <div className="w-full h-full bg-gradient-to-br from-indigo-950 to-blue-900 flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
              <LayoutDashboard className="w-16 h-16 text-white/5 mb-4" />
              <h2 className="text-2xl font-black italic tracking-tighter text-white opacity-40">JÁ VOLTAMOS</h2>
              <div className="mt-4 flex gap-1.5">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>)}
              </div>
            </div>
          )}

          {scene === 'PROMO' && (
            <div className="w-full h-full bg-red-700 flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-[50px] animate-pulse"></div>
              <Pizza className="w-20 h-20 text-white/10 absolute -right-4 top-4 rotate-12" />
              <h2 className="text-3xl font-black tracking-tighter text-white leading-none">OFERTAS<br />DA HORA</h2>
              <div className="mt-6 bg-white text-red-700 px-5 py-2 rounded-xl font-black text-sm shadow-xl">
                KANTINHO PREMIUM
              </div>
            </div>
          )}
        </div>

        {isProgram && (
          <div className="absolute inset-0 pointer-events-none z-30">
            {graphics.isLowerThirdVisible && (
              <div className="absolute bottom-12 left-10 right-10 flex animate-in slide-in-from-left duration-700">
                <div className={`${themeStyles[graphics.graphicTheme]} backdrop-blur-xl p-4 px-8 rounded-2xl border-l-[4px] shadow-2xl flex items-center gap-6`}>
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                    <Pizza className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">{graphics.lowerThirdTitle}</h3>
                    <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mt-1">{graphics.lowerThirdSubtitle}</p>
                  </div>
                </div>
              </div>
            )}

            {graphics.showTicker && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-2xl h-10 border-t border-white/10 flex items-center overflow-hidden z-40 transition-all duration-500">
                {/* News Badge */}
                <div className="h-full bg-red-600 px-6 flex items-center gap-2 relative z-10 shadow-[20px_0_40px_rgba(220,38,38,0.3)]">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">BREAKING NEWS</span>
                </div>

                {/* Marquee Content */}
                <div className="flex-1 overflow-hidden relative h-full flex items-center">
                  <div className="flex items-center gap-12 animate-marquee whitespace-nowrap px-8">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/90 flex items-center gap-4">
                      {graphics.tickerText}
                      <span className="text-red-500 text-lg">✦</span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/90 flex items-center gap-4">
                      {graphics.tickerText}
                      <span className="text-red-500 text-lg">✦</span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/90 flex items-center gap-4">
                      {graphics.tickerText}
                      <span className="text-red-500 text-lg">✦</span>
                    </span>
                  </div>
                </div>

                {/* Clock Panel */}
                <div className="h-full bg-white/5 backdrop-blur-md px-6 flex items-center border-l border-white/10 relative z-10">
                  <span className="text-[12px] font-mono font-bold text-white tracking-widest">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <style>{`
                  @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                  }
                  .animate-marquee {
                    animation: marquee ${100 - graphics.tickerSpeed}s linear infinite;
                  }
                `}</style>
              </div>
            )}
            {graphics.showChatOverlay && (
              <div className="absolute top-6 right-6 w-64 bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-white/10 animate-in fade-in slide-in-from-right duration-500">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="size-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Live Reaction</span>
                  </div>
                  {chatMessages.slice(-2).map((msg, i) => (
                    <div key={i} className="flex flex-col gap-1 animate-in slide-in-from-bottom duration-300">
                      <span className="text-[9px] font-black text-blue-400 uppercase">{msg.user}</span>
                      <p className="text-[11px] font-medium leading-tight opacity-90">{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeOverlays.has('LOGO') && (
              <div className="absolute top-10 right-10 animate-in fade-in duration-500">
                <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                  <ShieldAlert className="w-6 h-6 text-white/30" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  const renderTelemetryChart = (type: 'bitrate' | 'fps') => {
    const data = telemetryHistory.map(h => type === 'bitrate' ? h.bitrate : h.fps);
    if (data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 80 - 10;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-full h-8 overflow-visible mt-2" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={type === 'bitrate' ? '#3b82f6' : '#10b981'}
          strokeWidth="4"
          points={points}
          className="transition-all duration-1000"
        />
      </svg>
    );
  };

  const sidebarItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: <TrendingUp className="w-5" /> },
    { id: 'PEDIDOS', label: 'Pedidos', icon: <Receipt className="w-5" />, badge: newOrdersCount },
    { id: 'CARDÁPIO', label: 'Cardápio', icon: <Pizza className="w-5" /> },
    { id: 'ZONAS', label: 'Zonas', icon: <MapPin className="w-5" /> },
    { id: 'CONFIGS', label: 'Configurações', icon: <Settings className="w-5" /> },
  ];

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySales = sales.filter(s => s.timestamp >= today.getTime() && s.status !== 'CANCELADO');
    return {
      revenueToday: todaySales.reduce((acc, s) => acc + s.total, 0),
      ordersToday: todaySales.length,
      revenueTotal: sales.filter(s => s.status !== 'CANCELADO').reduce((acc, s) => acc + s.total, 0),
      pending: sales.filter(s => s.status === 'RECEBIDO' || s.status === 'PREPARO').length,
    };
  }, [sales]);

  return (
    <div className="fixed inset-0 z-[500] flex flex-col md:flex-row bg-gray-950 text-white overflow-hidden font-sans no-print">
      {/* Global New Order Bar */}
      {activeView !== 'PEDIDOS' && newOrdersCount > 0 && (
        <div className="fixed top-0 left-0 right-0 z-[1100] bg-red-600 px-6 py-3 flex items-center justify-between shadow-[0_4px_30px_rgba(220,38,38,0.4)] animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <BellRing className="w-5 h-5 animate-bounce" />
            <span className="text-xs font-black uppercase tracking-widest">Atenção: Você tem {newOrdersCount} novos pedidos aguardando!</span>
          </div>
          <button
            onClick={() => { setActiveView('PEDIDOS'); setNewOrdersCount(0); }}
            className="bg-white text-red-600 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            Ver Pedidos <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {adminToast && (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[1200] px-8 py-5 rounded-[24px] shadow-2xl font-black text-sm uppercase tracking-widest border border-white/10 flex items-center gap-4 animate-in slide-in-from-top-10 duration-500 ${adminToast.type === 'alert' ? 'bg-red-600' : adminToast.type === 'success' ? 'bg-emerald-600' : 'bg-blue-600'
          }`}>
          {adminToast.type === 'alert' && <Bell className="w-5 h-5 animate-pulse" />}
          {adminToast.message}
          {adminToast.type === 'alert' && activeView !== 'PEDIDOS' && (
            <button onClick={() => setActiveView('PEDIDOS')} className="bg-black/20 p-2 rounded-lg ml-2 hover:bg-black/30"><ExternalLink className="w-4 h-4" /></button>
          )}
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-[600] w-64 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg"><ShieldAlert className="w-6 h-6" /></div>
          <h2 className="text-lg font-black tracking-tight">KANTINHO LAB</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => { setActiveView(item.id as AdminView); setIsSidebarOpen(false); if (item.id === 'PEDIDOS') setNewOrdersCount(0); }} className={`w-full text-left px-4 py-4 rounded-2xl flex items-center justify-between transition font-bold text-sm ${activeView === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-gray-500 hover:bg-gray-800'}`}>
              <div className="flex items-center gap-3">{item.icon} {item.label}</div>
              {item.badge && item.badge > 0 && (
                <div className="relative">
                  <span className="absolute inset-0 bg-white rounded-full animate-ping opacity-25"></span>
                  <span className="relative bg-white text-red-600 text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg">{item.badge}</span>
                </div>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={onClose} className="w-full px-4 py-3 bg-red-600/10 text-red-500 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase hover:bg-red-600 hover:text-white transition-all">
            <LogOut className="w-4 h-4" /> Sair do Painel
          </button>
        </div>
      </aside>

      <main className={`flex-1 overflow-y-auto bg-gray-950 p-4 md:p-10 relative scrollbar-hide transition-all ${activeView !== 'PEDIDOS' && newOrdersCount > 0 ? 'pt-24' : ''}`}>
        {activeView === 'DASHBOARD' && (
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter">Visão Geral</h2>
                <p className="text-gray-500 text-xs font-bold mt-1 tracking-widest">CENTRAL DE INTELIGÊNCIA KANTINHO</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full">
                  <Signal className="w-4 h-4 text-blue-500 animate-pulse" />
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Sistema Ativo</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Loja Aberta</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-[40px] shadow-xl hover:border-red-600/30 transition-colors group">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-1 group-hover:text-red-500">Faturamento Hoje</p>
                <h3 className="text-4xl font-black">{stats.revenueToday}$</h3>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-[40px] shadow-xl hover:border-blue-600/30 transition-colors group">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-1 group-hover:text-blue-500">Pedidos Ativos</p>
                <h3 className="text-4xl font-black text-blue-500">{stats.pending}</h3>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-[40px] shadow-xl hover:border-emerald-600/30 transition-colors group">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-1 group-hover:text-emerald-500">Cashflow Total</p>
                <h3 className="text-4xl font-black text-emerald-500">{stats.revenueTotal}$</h3>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-[40px] shadow-xl hover:border-purple-600/30 transition-colors group">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-1 group-hover:text-purple-500">Tickets de Hoje</p>
                <h3 className="text-4xl font-black">{stats.ordersToday}</h3>
              </div>
            </div>
          </div>
        )}

        {activeView === 'CARDÁPIO' && (
          <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in pb-20">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter">Gestão do Cardápio</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Controle de Inventário e Disponibilidade</p>
              </div>
              <button
                onClick={() => {
                  const name = prompt("Nome do Produto:");
                  if (!name) return;
                  const id = `p-${Date.now()}`;
                  const newProduct: Product = {
                    id,
                    name: name.toUpperCase(),
                    description: "Nova descrição...",
                    category: categories[0] || 'PIZZAS',
                    prices: { FAMILIAR: 0, MEDIO: 0, PEQ: 0 },
                    isActive: true
                  };
                  onUpdateProducts([...products, newProduct]);
                }}
                className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-red-500 shadow-xl shadow-red-900/30 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" /> Novo Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className={`bg-gray-900 border ${product.isActive ? 'border-gray-800' : 'border-red-900/50 opacity-60'} rounded-[40px] p-8 space-y-6 transition-all hover:border-gray-600 group relative overflow-hidden`}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="bg-gray-800 text-gray-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">{product.category}</span>
                      <h4 className="text-xl font-black uppercase tracking-tight">{product.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateProducts(products.map(p => p.id === product.id ? { ...p, isActive: !p.isActive } : p))}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${product.isActive ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                      >
                        {product.isActive ? <CheckCircle2 className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Excluir ${product.name}?`)) {
                            onUpdateProducts(products.filter(p => p.id !== product.id));
                          }
                        }}
                        className="w-10 h-10 bg-gray-800 text-gray-500 hover:bg-red-600 hover:text-white rounded-xl flex items-center justify-center transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 min-h-[2.5rem]">{product.description}</p>

                  <div className="pt-6 border-t border-gray-800 grid grid-cols-3 gap-3">
                    {Object.entries(product.prices).map(([size, price]) => (
                      <div key={size} className="text-center group-hover:bg-gray-800 p-2 rounded-xl transition-colors">
                        <p className="text-[7px] font-black text-gray-600 uppercase mb-1">{size}</p>
                        <p className="text-sm font-black transition-all group-hover:text-red-500">{price}$</p>
                      </div>
                    ))}
                  </div>

                  {!product.isActive && (
                    <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                      <span className="bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest -rotate-6 shadow-2xl">ESGOTADO</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'PEDIDOS' && (
          <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Fila de Produção</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monitoramento em Tempo Real Ligado</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex bg-gray-900/50 p-1 rounded-2xl border border-gray-800">
                  <button
                    onClick={() => setPedidosDisplayMode('LIST')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${pedidosDisplayMode === 'LIST' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                  >Lotes</button>
                  <button
                    onClick={() => setPedidosDisplayMode('KANBAN')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${pedidosDisplayMode === 'KANBAN' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                  >Kanban</button>
                </div>
                <div className="relative w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" placeholder="Filtrar por nome ou ID..." className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 pl-12 text-sm outline-none focus:border-red-600 transition-all shadow-inner" value={saleSearch} onChange={e => setSaleSearch(e.target.value)} />
                </div>
              </div>
            </div>

            {pedidosDisplayMode === 'KANBAN' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {[
                  { title: 'Recebidos', status: 'RECEBIDO', color: 'red' },
                  { title: 'Em Preparo', status: 'PREPARO', color: 'orange' },
                  { title: 'Prontos', status: 'PRONTO', color: 'emerald' }
                ].map(column => {
                  const filteredSales = sales.filter(s => s.status === column.status);
                  return (
                    <div key={column.status} className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full bg-${column.color}-500 shadow-[0_0_10px_rgba(var(--${column.color}-500),0.5)]`}></div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">{column.title}</h3>
                        </div>
                        <span className="bg-gray-900 text-[10px] font-black px-2 py-1 rounded-lg border border-gray-800 text-gray-500">{filteredSales.length}</span>
                      </div>
                      <div className="space-y-4">
                        {filteredSales.map(sale => renderOrderCard(sale, true))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {sales.filter(s => s.customerName.toLowerCase().includes(saleSearch.toLowerCase()) || s.id.includes(saleSearch)).map(sale => renderOrderCard(sale))}
              </div>
            )}

            {sales.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center border-4 border-dashed border-gray-900 rounded-[48px] opacity-20">
                <Package className="w-16 h-16 mb-4" />
                <p className="font-black uppercase tracking-[0.3em]">Fila Vazia</p>
              </div>
            )}
          </div>
        )}

        {activeView === 'ZONAS' && (
          <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in pb-20">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter">Zonas de Entrega</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Configuração de Frete e Prazos</p>
              </div>
              <button
                onClick={() => {
                  const name = prompt("Nome da Nova Zona:");
                  if (!name) return;
                  const id = `z-${Date.now()}`;
                  const newZone: DeliveryZone = { id, name, price: 0, time: "20-30 min" };
                  onUpdateZones([...zones, newZone]);
                }}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-500 shadow-xl shadow-blue-900/30 transition-all active:scale-95"
              >
                <MapPin className="w-4 h-4" /> Nova Região
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {zones.map(zone => (
                <div key={zone.id} className="bg-gray-900 border border-gray-800 rounded-[32px] p-6 space-y-5 transition-all hover:border-blue-500 group">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-blue-600/10 text-blue-500 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => onUpdateZones(zones.filter(z => z.id !== zone.id))}
                      className="text-gray-700 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight truncate">{zone.name}</h4>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> Tempo: {zone.time}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div>
                      <p className="text-[8px] font-black text-gray-600 uppercase">Taxa de Entrega</p>
                      <p className="text-2xl font-black text-blue-500">{zone.price}$</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const newPrice = prompt(`Nova taxa para ${zone.name}:`, zone.price.toString());
                          if (newPrice !== null) {
                            onUpdateZones(zones.map(z => z.id === zone.id ? { ...z, price: Number(newPrice) } : z));
                          }
                        }}
                        className="p-3 bg-gray-800 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'CONFIGS' && (
          <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8 mb-8">
              <div className="w-full md:w-auto">
                <div className="flex items-center justify-between md:block">
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                    Studio <span className="text-xs bg-red-600 px-3 py-1 rounded-full tracking-[0.3em]">V5 PRO</span>
                  </h2>
                  <div className="md:hidden flex items-center gap-2 bg-red-600/10 border border-red-600/20 px-3 py-1 rounded-full">
                    <div className={`w-1.5 h-1.5 bg-red-600 rounded-full ${isRecording ? 'animate-pulse' : ''}`}></div>
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">{isRecording ? 'LIVE' : 'IDLE'}</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-3 mt-2">
                  <div className={`flex items-center gap-2 bg-red-600/10 border border-red-600/20 px-3 py-1 rounded-full ${isRecording ? 'opacity-100' : 'opacity-50'}`}>
                    <div className={`w-1.5 h-1.5 bg-red-600 rounded-full ${isRecording ? 'animate-pulse' : ''}`}></div>
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">{isRecording ? 'REC 🔴 ' + formatTime(recordingTime) : 'STANDBY'}</span>
                  </div>
                  <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{new Date().toLocaleTimeString()} • MCR MASTER</span>
                </div>
              </div>

              {/* Mobile Sub-Tabs Navigation */}
              <div className="flex md:hidden w-full bg-gray-950 p-1.5 rounded-2xl border border-white/5">
                {(['SWITCHER', 'GRAPHICS', 'MIXER'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setStudioSubTab(tab)}
                    className={`flex-1 py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${studioSubTab === tab ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="hidden md:flex items-center gap-4 w-full md:w-auto">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`flex-1 md:flex-none px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isRecording ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                >
                  {isRecording ? 'Stop Recording' : 'Start Record'}
                </button>
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-gray-600"><Radio className="w-5 h-5" /></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN: VISUALS (Switcher View) */}
              <div className={`lg:col-span-8 space-y-8 ${studioSubTab !== 'SWITCHER' && 'hidden md:block'}`}>
                {/* DUAL MONITOR WALL */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-4 font-black">
                      <span className="text-[10px] text-emerald-500 uppercase tracking-widest">PREVIEW</span>
                      <span className="text-[10px] text-gray-600">{previewScene}</span>
                    </div>
                    <div className="relative aspect-video bg-black rounded-[32px] overflow-hidden border-4 border-emerald-500/30 shadow-2xl group transition-all cursor-pointer" onClick={handleCut}>
                      {renderSceneFeed(previewScene, false)}
                      <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none group-hover:bg-emerald-500/20 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all bg-emerald-600/90 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/20">CLICK TO TAKE LIVE</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-4 font-black">
                      <span className="text-[10px] text-red-500 uppercase tracking-widest">PROGRAM</span>
                      <span className="text-[10px] text-gray-600">{graphics.activeScene}</span>
                    </div>
                    <div className="relative aspect-video bg-black rounded-[32px] overflow-hidden border-4 border-red-600/30 shadow-2xl group transition-all">
                      {renderSceneFeed(graphics.activeScene, true)}
                      <div className="absolute inset-0 bg-red-600/5 pointer-events-none"></div>
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-white/20">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">ON AIR</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TRANSITION & T-BAR PANEL */}
                <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-8 rounded-[40px] grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="flex flex-col gap-3">
                    <button onClick={handleCut} className="bg-gray-800 hover:bg-white hover:text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">CUT</button>
                    <button onClick={handleAuto} className={`${isTransitioning ? 'bg-blue-900 border-blue-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-500'} text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all`}>
                      {isTransitioning ? 'TRANSITION...' : 'AUTO'}
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Manual T-Bar</p>
                    <div className="h-32 w-16 bg-black rounded-2xl relative p-1 border border-white/5 flex flex-col items-center">
                      <div className="absolute inset-x-2 top-0 bottom-0 flex flex-col justify-between py-2">
                        {Array.from({ length: 11 }).map((_, i) => <div key={i} className={`h-[1px] ${i % 5 === 0 ? 'w-full bg-white/20' : 'w-1/2 bg-white/5'}`}></div>)}
                      </div>
                      <input
                        type="range"
                        min="0" max="100"
                        value={tBarPosition}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTBarPosition(val);
                          if (val === 100) {
                            handleCut();
                            setTimeout(() => setTBarPosition(0), 500);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-10"
                        style={{ appearance: 'slider-vertical' } as any}
                      />
                      <div
                        className="absolute w-12 h-6 bg-red-600 rounded-lg shadow-xl border border-white/20 flex items-center justify-center transition-all duration-75 pointer-events-none"
                        style={{ bottom: `${tBarPosition}%`, transform: `translateY(${50 - tBarPosition / 2}%)` }}
                      >
                        <div className="w-8 h-1 bg-white/30 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Transition Select</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Dissolve', 'Wipe', 'Dip', 'Slide'].map(t => (
                        <button key={t} className={`py-3 rounded-xl text-[9px] font-black uppercase border ${t === 'Dissolve' ? 'bg-white text-black border-white' : 'border-white/5 text-gray-600 hover:border-white/20'}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SOURCE MCR ROUTING V2 */}
                <div className="bg-gray-900 border border-gray-800 p-8 rounded-[48px] space-y-8">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <Signal className="w-4 h-4" /> Source MCR Routing V2
                    </h4>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      GLOBAL SYNC ACTIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* INPUT B1 */}
                    <div className={`p-8 rounded-[40px] border transition-all ${selectedExternalSource === 'b1' ? 'bg-blue-600/10 border-blue-500/50 shadow-2xl' : 'bg-black/20 border-white/5'}`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Master Input B1</p>
                          <input
                            value={sourceLabels.b1}
                            onChange={(e) => setSourceLabels(prev => ({ ...prev, b1: e.target.value.toUpperCase() }))}
                            className="bg-transparent border-none p-0 text-xl font-black uppercase tracking-tight outline-none focus:text-blue-400 w-full"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setSelectedExternalSource('b1');
                            onUpdateStreamUrl(externalSources.b1); // Sync streamUrl on selection
                          }}
                          className={`size-10 rounded-xl flex items-center justify-center transition-all ${selectedExternalSource === 'b1' ? 'bg-blue-600 text-white shadow-glow' : 'bg-white/5 text-gray-600 hover:text-white'}`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={externalSources.b1}
                            onChange={(e) => setExternalSources(prev => ({ ...prev, b1: e.target.value }))}
                            placeholder="URL da Fonte B1..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-xs font-semibold text-white outline-none focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[8px] font-black text-gray-500 uppercase">
                            <span>Signal Strength</span>
                            <span>{signalHealth.b1}%</span>
                          </div>
                          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-white/5">
                            {Array.from({ length: 15 }).map((_, i) => (
                              <div key={i} className={`flex-1 rounded-sm transition-all ${i < (signalHealth.b1 / 6.6) ? 'bg-blue-500' : 'bg-white/5'}`}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* INPUT B2 */}
                    <div className={`p-8 rounded-[40px] border transition-all ${selectedExternalSource === 'b2' ? 'bg-blue-600/10 border-blue-500/50 shadow-2xl' : 'bg-black/20 border-white/5'}`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Master Input B2</p>
                          <input
                            value={sourceLabels.b2}
                            onChange={(e) => setSourceLabels(prev => ({ ...prev, b2: e.target.value.toUpperCase() }))}
                            className="bg-transparent border-none p-0 text-xl font-black uppercase tracking-tight outline-none focus:text-blue-400 w-full"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setSelectedExternalSource('b2');
                            onUpdateStreamUrl(externalSources.b2); // Sync streamUrl on selection
                          }}
                          className={`size-10 rounded-xl flex items-center justify-center transition-all ${selectedExternalSource === 'b2' ? 'bg-blue-600 text-white shadow-glow' : 'bg-white/5 text-gray-600 hover:text-white'}`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={externalSources.b2}
                            onChange={(e) => setExternalSources(prev => ({ ...prev, b2: e.target.value }))}
                            placeholder="URL da Fonte B2..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-3.5 text-xs font-semibold text-white outline-none focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[8px] font-black text-gray-500 uppercase">
                            <span>Signal Strength</span>
                            <span>{signalHealth.b2}%</span>
                          </div>
                          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-white/5">
                            {Array.from({ length: 15 }).map((_, i) => (
                              <div key={i} className={`flex-1 rounded-sm transition-all ${i < (signalHealth.b2 / 6.6) ? 'bg-blue-500' : 'bg-white/5'}`}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onUpdateStreamUrl(externalSources[selectedExternalSource]);
                      showAdminToast(`Global Sync: ${sourceLabels[selectedExternalSource]}`, 'success');
                      setSignalHealth(prev => ({ ...prev, [selectedExternalSource]: 100 }));
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <Globe className="w-5 h-5" /> Update Global Broadcast Signal
                  </button>
                </div>

                {/* MULTIVIEW SOURCE WALL */}
                <div className="bg-gray-900 border border-gray-800 p-8 rounded-[48px] space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <MonitorPlay className="w-4 h-4" /> Multiview MCR
                  </h4>
                  <div className="grid grid-cols-5 gap-4">
                    {['LIVE', 'STANDBY', 'PROMO', 'B1', 'B2'].map(scene => (
                      <div
                        key={scene}
                        onClick={() => {
                          if (previewScene === scene) {
                            handleCut();
                          } else {
                            setPreviewScene(scene as any);
                          }
                        }}
                        className={`relative aspect-video rounded-2xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 ${previewScene === scene ? 'border-emerald-500 ring-4 ring-emerald-500/20' : graphics.activeScene === scene ? 'border-red-500 ring-4 ring-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        {renderSceneFeed(scene as any, false)}
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">
                          {scene === 'B1' ? sourceLabels.b1 : scene === 'B2' ? sourceLabels.b2 : scene}
                        </div>
                        {graphics.activeScene === scene && <div className="absolute top-2 right-2 flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div><span className="text-[8px] font-black text-red-500">PGM</span></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: CONTROLS (Graphics & Mixer) */}
              <div className="lg:col-span-4 space-y-8">
                {/* Audio Mixer Tab */}
                <div className={`${studioSubTab !== 'MIXER' && 'hidden md:block'} space-y-8`}>
                  {/* PRO AUDIO MIXER */}
                  <div className="bg-gray-900 border border-gray-800 p-8 rounded-[48px] space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <Volume2 className="w-4 h-4" /> Audio Mixer
                      </h4>
                      <span className="text-[10px] font-black text-blue-500 uppercase">Master 0.0dB</span>
                    </div>
                    <div className="flex justify-between gap-4 h-56 bg-black/20 rounded-[32px] p-6 border border-white/5">
                      {Object.entries(audioMixer).map(([key, val]) => (
                        <div key={key} className="flex flex-col items-center gap-4 flex-1">
                          <div className="flex-1 w-2 bg-gray-800 rounded-full relative flex flex-col justify-end">
                            <div className={`absolute inset-x-[-4px] w-4 h-1 rounded-full ${key === 'mic' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ bottom: `${val}%` }}></div>
                            <div className={`w-full ${key === 'mic' ? 'bg-red-600' : 'bg-blue-600'} rounded-full transition-all duration-300`} style={{ height: `${val}%` }}></div>
                          </div>
                          <p className="text-[8px] font-black uppercase text-gray-600 rotate-[-45deg]">{key}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1 h-2 bg-gray-900 rounded-full p-0.5 border border-white/5">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className={`flex-1 rounded-sm ${i < (vuLevel / 5) ? (i > 15 ? 'bg-red-500' : i > 12 ? 'bg-yellow-500' : 'bg-emerald-500') : 'bg-white/5'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Graphics Tab Content */}
                <div className={`${studioSubTab !== 'GRAPHICS' && 'hidden md:block'} space-y-8`}>
                  {/* GRAPHICS ENGINE V2 UPDATER */}
                  <div className="bg-gray-900 border border-gray-800 p-8 rounded-[48px] space-y-8">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <Palette className="w-4 h-4" /> Graphics Controller V2
                      </h4>
                    </div>

                    {/* PRESETS SHORTCUTS */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><Zap className="w-3 h-3 text-yellow-500" /> MCR Quick Presets</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'PROMOÇÃO AGORA', color: 'blue', title: '🔥 PROMOÇÃO RELÂMPAGO!', sub: 'Peça agora e ganhe 10% de desconto' },
                          { label: 'FORNADA QUENTE', color: 'orange', title: '🍕 FORNADA SAINDO AGORA!', sub: 'Aromas irresistíveis direto para você' },
                          { label: 'TAXA ZERO', color: 'emerald', title: '🚚 ENTREGA GRÁTIS!', sub: 'Válido para pedidos acima de 20$' },
                          { label: 'DOUBLÉ PIZZA', color: 'purple', title: '🍕🍕 PIZZA EM DOBRO!', sub: 'Na compra de 1 Mega, leve a 2ª grátis' }
                        ].map(p => (
                          <button
                            key={p.label}
                            onClick={() => {
                              onSaveGraphics({ lowerThirdTitle: p.title, lowerThirdSubtitle: p.sub });
                              showAdminToast(`Preset: ${p.label}`, 'info');
                            }}
                            className={`py-3 bg-gray-800/50 hover:bg-${p.color}-600/20 border border-white/5 hover:border-${p.color}-500/50 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* THEME & POSITION */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Theme Style</p>
                          <select
                            value={graphics.graphicTheme}
                            onChange={(e) => onSaveGraphics({ graphicTheme: e.target.value as any })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase outline-none focus:border-blue-500"
                          >
                            <option value="MODERN">Modern Red</option>
                            <option value="GLASS">Crystal Glass</option>
                            <option value="VIBRANT">Vibrant Blue</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Logo Position</p>
                          <select
                            value={graphics.logoPosition}
                            onChange={(e) => onSaveGraphics({ logoPosition: e.target.value as any })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase outline-none focus:border-blue-500"
                          >
                            <option value="TOP_RIGHT">Top Right</option>
                            <option value="TOP_LEFT">Top Left</option>
                            <option value="BOTTOM_RIGHT">Bottom Right</option>
                            <option value="BOTTOM_LEFT">Bottom Left</option>
                          </select>
                        </div>
                      </div>

                      {/* CUSTOM LOGO URL */}
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Custom Logo URL (PNG/SVG)</p>
                        <input
                          type="text"
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          onBlur={() => saveG({ logoUrl })}
                          placeholder="https://sua-logo.png"
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-red-600"
                        />
                      </div>

                      {/* TICKER CONTROLS */}
                      <div className="bg-black/20 p-6 rounded-[32px] border border-white/5 space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><List className="w-3 h-3" /> News Ticker</p>
                          <button onClick={() => onSaveGraphics({ showTicker: !graphics.showTicker })} className={`w-10 h-5 rounded-full relative transition-all ${graphics.showTicker ? 'bg-emerald-500' : 'bg-gray-800'}`}>
                            <div className={`absolute top-1 size-3 rounded-full bg-white transition-all ${graphics.showTicker ? 'left-6' : 'left-1'}`}></div>
                          </button>
                        </div>
                        <textarea
                          value={tickerText}
                          onChange={(e) => setTickerText(e.target.value)}
                          onBlur={() => saveG({ tickerText })}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[11px] font-semibold text-white outline-none focus:border-emerald-500 h-20 resize-none"
                          placeholder="Digite o texto do letreiro aqui..."
                        />
                        <div className="space-y-2">
                          <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase">
                            <span>Velocidade</span>
                            <span>{graphics.tickerSpeed}%</span>
                          </div>
                          <input
                            type="range" min="10" max="90" value={graphics.tickerSpeed}
                            onChange={(e) => onSaveGraphics({ tickerSpeed: Number(e.target.value) })}
                            onMouseUp={(e) => onSaveGraphics({ tickerSpeed: Number(e.currentTarget.value) })}
                            className="w-full accent-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">G.C. Headline</p>
                          <input
                            type="text"
                            value={lowerThirdTitle}
                            onChange={(e) => setLowerThirdTitle(e.target.value)}
                            onBlur={() => saveG({ lowerThirdTitle })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-red-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">G.C. Subtitle</p>
                          <input
                            type="text"
                            value={lowerThirdSubtitle}
                            onChange={(e) => setLowerThirdSubtitle(e.target.value)}
                            onBlur={() => saveG({ lowerThirdSubtitle })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-red-600"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => {
                              setIsLowerThirdVisible(!isLowerThirdVisible);
                              saveG({ isLowerThirdVisible: !isLowerThirdVisible });
                            }}
                            className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isLowerThirdVisible ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'bg-gray-800 text-gray-400'}`}
                          >
                            {isLowerThirdVisible ? 'Hide G.C.' : 'Show G.C.'}
                          </button>
                          <button
                            onClick={() => {
                              setShowChatOverlay(!showChatOverlay);
                              saveG({ showChatOverlay: !showChatOverlay });
                            }}
                            className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${showChatOverlay ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-gray-800 text-gray-400'}`}
                          >
                            Chat Overlay
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TECHNICAL ANALYTICS */}
                  <div className="bg-gray-900 border border-gray-800 p-8 rounded-[48px] space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Telemetry Stream
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Signal Locked</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-gray-600 uppercase">Bitrate</p>
                        <p className="text-lg font-black text-blue-500">{telemetry.bitrate}k</p>
                        {renderTelemetryChart('bitrate')}
                      </div>
                      <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-gray-600 uppercase">Frame Rate</p>
                        <p className="text-lg font-black text-emerald-500">{telemetry.fps}fps</p>
                        {renderTelemetryChart('fps')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <div id="print-area" className="print-section"></div>
    </div>
  );
};

export default AdminPanel;
