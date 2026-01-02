
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PizzaSize, CartItem, Product, DeliveryZone, User, Extra, SaleRecord, OrderStatus } from './types';
import { PIZZAS as DEFAULT_PIZZAS, DRINKS as DEFAULT_DRINKS, ZONES as DEFAULT_ZONES } from './constants';
import Header from './components/Header';
import MenuList from './components/MenuList';
import CartSheet from './components/CartSheet';
import ZonePicker from './components/ZonePicker';
import GameModal from './components/GameModal';
import Onboarding from './components/Onboarding';
import ProfileModal from './components/ProfileModal';
import AdminPanel from './components/AdminPanel';
import LiveModal from './components/LiveModal';
import AdBanner from './components/AdBanner';
import { ShoppingBag, Gamepad2, Sparkles, Award, Lock, ShieldAlert, X, Tv, Download } from 'lucide-react';
import { api } from './api';
import { AdMob, AdOptions } from '@capacitor-community/admob';
import { ADMOB_CONFIG } from './constants';
import { Capacitor } from '@capacitor/core';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('kd_user');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.warn('Failed to load user from localStorage:', err);
      return null;
    }
  });

  const [headerBg, setHeaderBg] = useState<string>(() => {
    return localStorage.getItem('kd_header_bg') || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200';
  });

  const [streamUrl, setStreamUrl] = useState<string>(() => {
    return localStorage.getItem('kd_stream_url') || '';
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kd_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orderNotes, setOrderNotes] = useState<string>(() => {
    return localStorage.getItem('kd_notes') || '';
  });

  const [activeTab, setActiveTab] = useState<string>('PIZZAS');
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('FAMILIAR');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState('');

  const [halfMode, setHalfMode] = useState<boolean>(false);
  const [halfSelection, setHalfSelection] = useState<{ left?: Product; right?: Product }>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    });
  };

  // Graphics Overlays States (Synced via DB)
  const [tickerText, setTickerText] = useState('');
  const [showTicker, setShowTicker] = useState(false);
  const [tickerSpeed, setTickerSpeed] = useState(40);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPosition, setLogoPosition] = useState<'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT'>('TOP_RIGHT');
  const [graphicTheme, setGraphicTheme] = useState<'MODERN' | 'GLASS' | 'VIBRANT'>('MODERN');
  const [lowerThirdTitle, setLowerThirdTitle] = useState('DOUBLÉ PIZZA!');
  const [lowerThirdSubtitle, setLowerThirdSubtitle] = useState('Pague uma, leve duas na Mega!');
  const [isLowerThirdVisible, setIsLowerThirdVisible] = useState(false);
  const [showChatOverlay, setShowChatOverlay] = useState(false);
  const [globalActiveScene, setGlobalActiveScene] = useState<'LIVE' | 'STANDBY' | 'PROMO' | 'B1' | 'B2'>('STANDBY');

  useEffect(() => {
    AdMob.initialize().catch(err => console.warn('AdMob init failed:', err));

    // Pre-load interstitial ad
    if (Capacitor.isNativePlatform()) {
      const options: AdOptions = {
        adId: ADMOB_CONFIG.interstitial_id,
        isTesting: false
      };
      AdMob.prepareInterstitial(options).catch(err => console.warn('AdMob prepare failed:', err));
    }
  }, []);

  // Visibility Hook Logic (Optimized Polling)
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibility = () => setIsVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Poll for Graphics Settings Sync (Only when visible)
  useEffect(() => {
    let intervalId: any;

    const pollSettings = async () => {
      if (!isVisible) return;
      try {
        const settings = await api.getSettings();
        if (settings.broadcast_graphics) {
          const g = JSON.parse(settings.broadcast_graphics);
          setTickerText(g.tickerText);
          setShowTicker(g.showTicker);
          setTickerSpeed(g.tickerSpeed);
          setLogoUrl(g.logoUrl);
          setLogoPosition(g.logoPosition);
          setGraphicTheme(g.graphicTheme);
          setLowerThirdTitle(g.lowerThirdTitle);
          setLowerThirdSubtitle(g.lowerThirdSubtitle);
          setIsLowerThirdVisible(g.isLowerThirdVisible);
          setShowChatOverlay(g.showChatOverlay);
          setGlobalActiveScene(g.activeScene || 'STANDBY');
          if (g.streamUrl) setStreamUrl(g.streamUrl);
        }
      } catch (err) {
        console.warn('Poll skip/error:', err);
      }
    };

    if (isVisible) {
      pollSettings();
      intervalId = setInterval(pollSettings, 4000); // Relaxed to 4s for better performance
    }

    return () => { if (intervalId) clearInterval(intervalId); };
  }, [isVisible]);

  // Initial Fetch with Offline Fallback
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodList, catList, zoneList, orderList] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getZones(),
          api.getOrders()
        ]);

        // Seed if empty (First time migration)
        if (prodList.length === 0) {
          const defaultProducts = [
            ...DEFAULT_PIZZAS.map(p => ({ ...p, isActive: true, category: 'PIZZAS' })),
            ...DEFAULT_DRINKS.map(d => ({ ...d, isActive: true, category: 'BEBIDAS' }))
          ];
          for (const p of defaultProducts) await api.addProduct(p);
          setProducts(defaultProducts);
        } else {
          setProducts(prodList);
        }

        if (catList.length === 0) {
          const defaultCats = ['PIZZAS', 'BEBIDAS'];
          for (const name of defaultCats) await api.addCategory({ id: name, name });
          setCategories(defaultCats);
        } else {
          setCategories(catList.map((c: any) => c.name));
        }

        if (zoneList.length === 0) {
          for (const z of DEFAULT_ZONES) await api.addZone(z);
          setZones(DEFAULT_ZONES);
        } else {
          setZones(zoneList);
        }

        setSales(orderList);
      } catch (err) {
        console.warn('API unavailable, using offline defaults:', err);
        // Fallback to default data when API is unavailable (offline mode for Android APK)
        const defaultProducts = [
          ...DEFAULT_PIZZAS.map(p => ({ ...p, isActive: true, category: 'PIZZAS' })),
          ...DEFAULT_DRINKS.map(d => ({ ...d, isActive: true, category: 'BEBIDAS' }))
        ];
        setProducts(defaultProducts);
        setCategories(['PIZZAS', 'BEBIDAS']);
        setZones(DEFAULT_ZONES);
        setSales([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('kd_user', JSON.stringify(user));
      api.saveUser(user);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('kd_header_bg', headerBg);
  }, [headerBg]);

  useEffect(() => {
    localStorage.setItem('kd_stream_url', streamUrl);
  }, [streamUrl]);

  useEffect(() => {
    localStorage.setItem('kd_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleAdminAccess = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const verifyAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '2024') {
      setIsAdminAuthenticated(true);
      setShowAdminLogin(false);
      setIsAdminOpen(true);
      setAdminPin('');
    } else {
      showToast('PIN Incorreto', 'error');
      setAdminPin('');
    }
  };

  const addToCart = useCallback((product: Product, size: string) => {
    if (product.isActive === false) {
      showToast('Sabor temporariamente indisponível', 'error');
      return;
    }

    const price = product.prices[size];
    const uniqueId = `${product.id}-${size}-${Date.now()}`;
    const newItem: CartItem = {
      id: product.id,
      uniqueId,
      name: product.name,
      price,
      size,
      quantity: 1,
      extras: [],
      needsBox: product.category === 'PIZZAS'
    };

    setCart(prev => [...prev, newItem]);
    showToast(`${product.name} no carrinho!`, 'success');
  }, [showToast]);

  const finalizeOrder = useCallback((orderTotal: number) => {
    if (!user) return;

    const itemsDetail = cart.map(i => `${i.quantity}x ${i.name}`).join(', ');

    const newSale: SaleRecord = {
      id: `sale-${Date.now()}`,
      timestamp: Date.now(),
      total: orderTotal,
      itemsCount: cart.length,
      itemsDetail: itemsDetail,
      items: [...cart],
      customerName: user.name,
      customerPhone: user.phone,
      zoneName: selectedZone?.name || 'Retirada',
      status: 'RECEBIDO',
      paymentMethod: 'DINHEIRO'
    };

    api.createOrder(newSale);
    setSales(prev => [newSale, ...prev]);

    const newPoints = user.points + 25;
    const newCount = user.ordersCount + 1;
    let newLevel = user.level;

    if (newPoints >= 500) newLevel = 'DIAMANTE';
    else if (newPoints >= 250) newLevel = 'OURO';
    else if (newPoints >= 100) newLevel = 'PRATA';

    const updatedUser = { ...user, points: newPoints, ordersCount: newCount, level: newLevel };
    setUser(updatedUser);
    api.saveUser(updatedUser);

    setCart([]);
    setOrderNotes('');
    localStorage.removeItem('kd_notes');
    setIsCartOpen(false);

    showToast('Pedido registrado com sucesso!', 'success');
  }, [user, showToast, cart, selectedZone]);

  const halfPrice = useMemo(() => {
    const priceLeft = halfSelection.left?.prices[selectedSize] || 0;
    const priceRight = halfSelection.right?.prices[selectedSize] || 0;
    return Math.max(priceLeft, priceRight);
  }, [halfSelection, selectedSize]);

  const addHalfAndHalf = useCallback(() => {
    if (!halfSelection.left || !halfSelection.right) {
      showToast('Selecione os dois lados primeiro', 'error');
      return;
    }

    const newItem: CartItem = {
      id: `half-${Date.now()}`,
      uniqueId: `half-${Date.now()}`,
      name: `Meio ${halfSelection.left.name} / Meio ${halfSelection.right.name}`,
      price: halfPrice,
      size: selectedSize,
      quantity: 1,
      isHalfAndHalf: true,
      leftHalf: halfSelection.left,
      rightHalf: halfSelection.right,
      extras: [],
      needsBox: true
    };

    setCart(prev => [...prev, newItem]);
    setHalfMode(false);
    setHalfSelection({});
    showToast('Customizada adicionada!', 'success');
  }, [halfSelection, selectedSize, halfPrice, showToast]);

  const updateQuantity = (uniqueId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.uniqueId === uniqueId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (uniqueId: string) => {
    setCart(prev => prev.filter(item => item.uniqueId !== uniqueId));
    showToast('Item removido', 'info');
  };

  const handleUpdateSales = (updatedSales: SaleRecord[]) => {
    // If we are updating just one sale (e.g. status change in AdminPanel)
    if (updatedSales.length === sales.length) {
      const changed = updatedSales.find((s, i) => s.status !== sales[i].status);
      if (changed) api.updateOrderStatus(changed.id, changed.status);
    }
    setSales(updatedSales);
  };

  const handleUpdateProducts = async (updatedProducts: Product[]) => {
    // Basic sync: if added or updated, tell the API
    if (updatedProducts.length > products.length) {
      const added = updatedProducts[updatedProducts.length - 1];
      await api.addProduct(added);
    } else if (updatedProducts.length === products.length) {
      // Find what changed (simplified check)
      updatedProducts.forEach((p, i) => {
        if (JSON.stringify(p) !== JSON.stringify(products[i])) {
          api.updateProduct(p.id, p);
        }
      });
    }
    setProducts(updatedProducts);
  };

  if (!user) {
    return <Onboarding onComplete={setUser} />;
  }

  const sizes: PizzaSize[] = ['FAMILIAR', 'MEDIO', 'PEQ'];

  return (
    <div className="min-h-screen bg-[#020617] bg-gradient-to-b from-slate-950 via-slate-950 to-black pb-32 pt-[env(safe-area-inset-top)]">
      <Header
        user={user}
        onLogout={() => setUser(null)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={handleAdminAccess}
        backgroundUrl={headerBg}
        hasLive={!!streamUrl}
        onOpenLive={async () => {
          if (Capacitor.isNativePlatform()) {
            try {
              await AdMob.showInterstitial();
              // Re-prepare for next time
              const options: AdOptions = {
                adId: ADMOB_CONFIG.interstitial_id,
                isTesting: false
              };
              AdMob.prepareInterstitial(options).catch(err => console.warn('AdMob re-prepare failed:', err));
            } catch (err) {
              console.warn('AdMob show failed or dismissed:', err);
            }
          }
          setIsLiveOpen(true);
        }}
      />

      {deferredPrompt && (
        <div className="max-w-4xl mx-auto px-4 -mt-8 mb-8 relative z-10">
          <button
            onClick={handleInstallClick}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-transform animate-pulse"
          >
            <Download className="w-6 h-6" />
            INSTALAR APLICATIVO
          </button>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800 mb-8 overflow-x-auto scrollbar-hide">
          {([...categories, 'ZONES']).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition-all ${activeTab === tab ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {tab === 'PIZZAS' ? '🍕' : tab === 'BEBIDAS' ? '🥤' : tab === 'ZONES' ? '📍' : '✨'} {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {activeTab === 'PIZZAS' && !halfMode && (
          <div className="flex gap-4 mb-8">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-3 rounded-xl border-2 font-black transition-all ${selectedSize === size ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'PIZZAS' && (
          <div className="mb-8">
            <button
              onClick={() => { setHalfMode(!halfMode); setHalfSelection({}); }}
              className={`w-full py-5 rounded-[24px] border-2 border-dashed font-black uppercase tracking-widest text-xs transition-all ${halfMode ? 'border-red-500/50 text-red-500 bg-red-500/5' : 'border-slate-800 text-slate-400 hover:border-slate-600'}`}
            >
              {halfMode ? 'Cancelar Customização' : 'Criar Pizza Meio a Meio'}
            </button>

            {halfMode && (
              <div className="mt-4 p-6 bg-slate-900/50 border border-slate-800 rounded-[32px] animate-in zoom-in">
                <div className="grid grid-cols-2 gap-4 text-center mb-6">
                  <div className={`p-5 rounded-3xl border-2 ${halfSelection.left ? 'border-green-500/40 bg-green-500/5' : 'border-slate-800'}`}>
                    <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Esquerdo</p>
                    <p className="font-black text-sm truncate">{halfSelection.left?.name || '---'}</p>
                  </div>
                  <div className={`p-5 rounded-3xl border-2 ${halfSelection.right ? 'border-blue-500/40 bg-blue-500/5' : 'border-slate-800'}`}>
                    <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Direito</p>
                    <p className="font-black text-sm truncate">{halfSelection.right?.name || '---'}</p>
                  </div>
                </div>
                {halfSelection.left && halfSelection.right && (
                  <button onClick={addHalfAndHalf} className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl hover:bg-slate-200 transition-all">
                    ADICIONAR {halfPrice}$
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'ZONES' ? (
          <ZonePicker zones={zones} selected={selectedZone} onSelect={setSelectedZone} />
        ) : (
          <MenuList
            products={products.filter(p => p.category === activeTab)}
            selectedSize={selectedSize}
            halfMode={activeTab === 'PIZZAS' && halfMode}
            halfSelection={halfSelection}
            onSelect={(p) => {
              if (halfMode) {
                if (!halfSelection.left) setHalfSelection(prev => ({ ...prev, left: p }));
                else if (!halfSelection.right) setHalfSelection(prev => ({ ...prev, right: p }));
              } else {
                addToCart(p, activeTab === 'PIZZAS' ? selectedSize : Object.keys(p.prices)[0]);
              }
            }}
          />
        )}
        <AdBanner />
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button onClick={() => setIsGameOpen(true)} className="p-3 text-slate-400 hover:text-white transition-colors">
            <Gamepad2 className="w-6 h-6" />
          </button>
          <button onClick={() => setIsCartOpen(true)} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-red-900/30">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-bold uppercase tracking-tight">CARRINHO ({cart.length})</span>
          </button>
          <button onClick={() => setIsProfileOpen(true)} className="p-3 text-slate-400 hover:text-white transition-colors">
            <Award className="w-6 h-6" />
          </button>
        </div>
      </div>

      {showAdminLogin && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowAdminLogin(false)}></div>
          <form onSubmit={verifyAdminPin} className="relative w-full max-sm bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl animate-in zoom-in">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mb-4 border border-red-500/30">
                <Lock className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Acesso Restrito</h3>
              <p className="text-xs text-slate-500 mt-2">Insira o PIN para acessar o painel administrativo</p>
            </div>
            <input
              type="password"
              placeholder="PIN DE ACESSO"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center text-2xl font-black tracking-[1em] text-white outline-none focus:border-red-600 mb-6"
              autoFocus
              maxLength={4}
            />
            <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-slate-200 transition-all">
              VERIFICAR PIN
            </button>
          </form>
        </div>
      )}

      {isCartOpen && (
        <CartSheet
          cart={cart}
          zone={selectedZone}
          notes={orderNotes}
          onNotesChange={setOrderNotes}
          onClose={() => setIsCartOpen(false)}
          onUpdateQty={updateQuantity}
          onRemove={removeItem}
          onToggleExtra={() => { }}
          clearCart={() => setCart([])}
          user={user}
          onOrderComplete={finalizeOrder}
        />
      )}

      {isGameOpen && <GameModal onClose={() => setIsGameOpen(false)} />}
      {isLiveOpen && (
        <LiveModal
          streamUrl={streamUrl}
          onClose={() => setIsLiveOpen(false)}
          ticker={{ text: tickerText, visible: showTicker, speed: tickerSpeed }}
          logo={{ url: logoUrl, position: logoPosition }}
          theme={graphicTheme}
          lowerThird={{ title: lowerThirdTitle, subtitle: lowerThirdSubtitle, visible: isLowerThirdVisible }}
          chatOverlay={showChatOverlay}
          activeScene={globalActiveScene}
        />
      )}
      {isProfileOpen && <ProfileModal user={user} onClose={() => setIsProfileOpen(false)} onOpenAdmin={handleAdminAccess} />}
      {isAdminOpen && (
        <AdminPanel
          products={products}
          categories={categories}
          zones={zones}
          sales={sales}
          headerBg={headerBg}
          streamUrl={streamUrl}
          onUpdateProducts={handleUpdateProducts}
          onUpdateCategories={setCategories}
          onUpdateZones={setZones}
          onUpdateSales={handleUpdateSales}
          onUpdateHeaderBg={setHeaderBg}
          onUpdateStreamUrl={setStreamUrl}
          onClose={() => setIsAdminOpen(false)}
          graphics={{
            tickerText, setTickerText,
            showTicker, setShowTicker,
            tickerSpeed, setTickerSpeed,
            logoUrl, setLogoUrl,
            logoPosition, setLogoPosition,
            graphicTheme, setGraphicTheme,
            lowerThirdTitle, setLowerThirdTitle,
            lowerThirdSubtitle, setLowerThirdSubtitle,
            isLowerThirdVisible, setIsLowerThirdVisible,
            showChatOverlay, setShowChatOverlay,
            activeScene: globalActiveScene, setGlobalActiveScene
          }}
          onSaveGraphics={async (newGraphics: any) => {
            await api.updateSetting('broadcast_graphics', JSON.stringify({
              ...newGraphics,
              streamUrl // Include streamUrl in the global sync
            }));
          }}
        />
      )}

      {toast && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[400] animate-in fade-in slide-in-from-top-8 ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-slate-800'
          } text-white font-bold`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default App;
