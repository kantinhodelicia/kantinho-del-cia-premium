
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Extra } from '../types';
import { EXTRAS } from '../constants';
import {
  Target, Sparkles, Pizza, Share2, X, Link, MessageCircle,
  CheckCircle2, Search, Heart, PlusCircle, ShoppingCart,
  EyeOff, Utensils, Beer, Flame, Star, Filter, ChefHat
} from 'lucide-react';

interface Props {
  products: Product[];
  selectedSize: string;
  onSelect: (p: Product) => void;
  halfMode?: boolean;
  halfSelection?: { left?: Product; right?: Product };
}

const MenuList: React.FC<Props> = ({ products, selectedSize, onSelect, halfMode, halfSelection }) => {
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);
  const [extrasModalProduct, setExtrasModalProduct] = useState<Product | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('TODOS');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('kd_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [flyParticles, setFlyParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [pressedId, setPressedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('kd_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    // Simulate initial loading for "WOW" effect
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() => {
    const cats = ['TODOS', ...new Set(products.map(p => p.category))];
    return cats.filter(Boolean);
  }, [products]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const isPickingLeft = halfMode && !halfSelection?.left;
  const isPickingRight = halfMode && halfSelection?.left && !halfSelection?.right;

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'TODOS' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

  const handleShare = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    setSharingProduct(p);
  };

  const handleProductSelect = (e: React.MouseEvent, p: Product) => {
    if (p.isActive === false) return;

    if (halfMode) {
      setPressedId(p.id);
      setTimeout(() => setPressedId(null), 300);
      onSelect(p);
    } else {
      triggerFlyAnimation(e.clientX, e.clientY);
      onSelect(p);
    }
  };

  const triggerFlyAnimation = (x: number, y: number) => {
    const newParticle = { id: Date.now(), x, y };
    setFlyParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setFlyParticles(prev => prev.filter(pt => pt.id !== newParticle.id));
    }, 800);
  };

  const handleQuickExtra = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    setExtrasModalProduct(p);
    setSelectedExtras([]);
  };

  const addWithExtras = () => {
    if (!extrasModalProduct) return;
    onSelect(extrasModalProduct);
    setExtrasModalProduct(null);
  };

  const copyToClipboard = () => {
    const text = `Confere esta pizza incrível do Kantinho Delícia: ${sharingProduct?.name}! 🍕\nPeça aqui: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Confere esta pizza incrível do Kantinho Delícia: *${sharingProduct?.name}*! 🍕\nPeça aqui: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 relative">
      {/* Search & Category Header */}
      <div className="space-y-6">
        <div className="relative group animate-in slide-in-from-top-4 duration-500">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            placeholder="O que você deseja saborear hoje?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/30 border border-white/5 rounded-[32px] py-6 pl-16 pr-8 text-white text-lg font-bold focus:outline-none focus:border-red-600/30 transition-all placeholder:text-slate-700 backdrop-blur-xl shadow-2xl"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white bg-white/5 p-2 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar animate-in fade-in duration-700 delay-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat
                ? 'bg-red-600 text-white border-red-500 shadow-xl shadow-red-900/30'
                : 'bg-slate-900/50 text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300'
                }`}
            >
              <div className="flex items-center gap-3">
                {cat === 'TODOS' && <Filter className="w-4 h-4" />}
                {cat === 'PIZZAS' && <Utensils className="w-4 h-4" />}
                {cat === 'BEBIDAS' && <Beer className="w-4 h-4" />}
                {cat}
              </div>
            </button>
          ))}
        </div>
      </div>

      {halfMode && (isPickingLeft || isPickingRight) && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 p-6 rounded-[40px] flex items-center justify-between animate-in zoom-in duration-500 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
          <div className={`absolute top-0 left-0 w-2 h-full ${isPickingLeft ? 'bg-green-500' : 'bg-blue-500'}`} />
          <div className="flex items-center gap-6 relative z-10">
            <div className={`p-4 rounded-3xl ${isPickingLeft ? 'bg-green-600/10 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'bg-blue-600/10 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]'}`}>
              <Target className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Modo Meio-a-Meio Ativo</p>
              <p className="text-xl font-black text-slate-100 italic">
                Sabor do <span className={isPickingLeft ? 'text-green-500' : 'text-blue-500'}>
                  Lado {isPickingLeft ? 'Esquerdo' : 'Direito'}
                </span>
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <Sparkles className={`w-8 h-8 opacity-20 ${isPickingLeft ? 'text-green-500' : 'text-blue-500'} animate-spin-slow`} />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-900/40 border border-white/5 rounded-[40px] p-8 h-[220px] animate-pulse">
              <div className="flex justify-between mb-6">
                <div className="space-y-3">
                  <div className="h-6 w-40 bg-slate-800 rounded-full" />
                  <div className="h-4 w-60 bg-slate-800/50 rounded-full" />
                </div>
                <div className="h-10 w-20 bg-slate-800 rounded-2xl" />
              </div>
              <div className="flex gap-2 mt-auto">
                <div className="h-6 w-12 bg-slate-800 rounded-lg" />
                <div className="h-6 w-12 bg-slate-800 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[60px] animate-in fade-in duration-1000">
          <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-2xl">
            <Pizza className="w-8 h-8 text-slate-800 opacity-30" />
          </div>
          <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Sabor não encontrado</h3>
          <p className="text-slate-600 font-medium mt-2">Tente outros ingredientes ou limpe a busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {filteredProducts.map((p, index) => {
            const price = p.prices[selectedSize];
            const isAvailable = !!price && p.isActive !== false;
            const isFav = favorites.includes(p.id);
            const isPressed = pressedId === p.id;

            const isLeft = halfMode && halfSelection?.left?.id === p.id;
            const isRight = halfMode && halfSelection?.right?.id === p.id;

            let cardClasses = "group relative p-8 rounded-[48px] border transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ";

            if (!isAvailable) {
              cardClasses += "bg-slate-900/10 border-white/5 opacity-40 cursor-not-allowed grayscale";
            } else {
              cardClasses += "bg-slate-900/40 border-white/5 cursor-pointer backdrop-blur-md ";

              if (isPressed) {
                cardClasses += "scale-95 brightness-150 border-red-500/50 ";
              }

              if (isLeft) {
                cardClasses += "border-green-500/50 ring-8 ring-green-500/10 bg-green-500/5 z-20 scale-[1.03] shadow-[0_20px_50px_rgba(0,0,0,0.4)]";
              } else if (isRight) {
                cardClasses += "border-blue-500/50 ring-8 ring-blue-500/10 bg-blue-500/5 z-20 scale-[1.03] shadow-[0_20px_50px_rgba(0,0,0,0.4)]";
              } else {
                cardClasses += "hover:bg-slate-900/80 hover:border-white/10 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] ";
                if (isFav) cardClasses += "shadow-[0_0_30px_rgba(234,179,8,0.08)] border-yellow-500/20";
              }
            }

            return (
              <div
                key={p.id}
                onClick={(e) => isAvailable && handleProductSelect(e, p)}
                className={cardClasses}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Labels de Status */}
                {p.isActive === false && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center p-8 bg-black/60 rounded-[48px] backdrop-blur-[4px]">
                    <div className="bg-slate-900 text-slate-400 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 border border-white/10">
                      <EyeOff className="w-4 h-4" /> INDISPONÍVEL AGORA
                    </div>
                  </div>
                )}

                {/* Hot Label for specific categories */}
                {p.category === 'PIZZAS' && index < 2 && (
                  <div className="absolute top-0 left-12 -translate-y-1/2 bg-orange-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 z-20 shadow-orange-900/40 border border-white/20">
                    <Flame className="w-3 h-3 fill-current" /> MAIS PEDIDA
                  </div>
                )}

                {/* Quick Actions Buttons */}
                <div className="absolute top-6 left-6 flex gap-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 z-20">
                  {isAvailable && !halfMode && (
                    <>
                      <button
                        onClick={(e) => toggleFavorite(e, p.id)}
                        className={`p-3.5 bg-slate-950/90 border border-white/10 rounded-2xl transition-all shadow-xl hover:scale-110 ${isFav ? 'text-red-500 border-red-500/50 shadow-red-900/20' : 'text-slate-500 hover:text-red-500 hover:border-red-500/30'
                          }`}
                        title="Favoritar"
                      >
                        <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => handleQuickExtra(e, p)}
                        className="p-3.5 bg-slate-950/90 border border-white/10 text-slate-500 rounded-2xl hover:text-blue-500 hover:border-blue-500/30 transition-all shadow-xl hover:scale-110"
                        title="Adicionar Extras"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => handleShare(e, p)}
                        className="p-3.5 bg-slate-950/90 border border-white/10 text-slate-500 rounded-2xl hover:text-white hover:border-white/30 transition-all shadow-xl hover:scale-110"
                        title="Compartilhar"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {isFav && (
                  <div className="absolute top-6 right-8 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-600 blur-lg opacity-40 animate-pulse" />
                      <Heart className="w-5 h-5 text-red-500 fill-current relative animate-bounce-slow" />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 pr-4">
                    <h3 className={`text-2xl font-black mb-2 transition-colors duration-500 tracking-tighter uppercase italic ${isLeft ? 'text-green-400' : isRight ? 'text-blue-400' : 'text-white group-hover:text-red-500'
                      }`}>
                      {p.name}
                    </h3>
                    <p className="text-[13px] text-slate-500 font-medium leading-[1.6] line-clamp-2 pr-6">{p.description}</p>
                  </div>
                  <div className="relative">
                    <div className={`absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${isLeft ? 'bg-green-600' : isRight ? 'bg-blue-600' : 'bg-red-600'
                      }`} />
                    <span className={`relative inline-block px-6 py-3 text-white font-black text-xl rounded-[24px] shadow-2xl transition-all duration-500 border border-white/10 ${isLeft ? 'bg-green-600' : isRight ? 'bg-blue-600' : 'bg-red-600 group-hover:bg-red-500 group-hover:scale-105'
                      }`}>
                      {isAvailable ? `${price}$` : '--'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex gap-2">
                    {['PEQ', 'MEDIO', 'FAMILIAR', 'UN'].map(s => (
                      p.prices[s] && (
                        <span key={s} className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest transition-colors ${selectedSize === s ? 'bg-white text-black' : 'bg-white/5 text-slate-500 border border-white/5'
                          }`}>
                          {s === 'FAMILIAR' ? 'Big' : s === 'MEDIO' ? 'Med' : s === 'PEQ' ? 'Min' : 'Hz'}
                        </span>
                      )
                    ))}
                  </div>
                  {!halfMode && isAvailable && (
                    <div className="text-[10px] font-black text-slate-600 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                      LEVAR AGORA <ShoppingCart className="w-4 h-4 text-red-600" />
                    </div>
                  )}
                </div>

                {/* Corner Decorative Element */}
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-transparent to-red-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              </div>
            );
          })}
        </div>
      )}

      {/* Fly-to-cart Particles */}
      {flyParticles.map(pt => (
        <div
          key={pt.id}
          className="fixed pointer-events-none z-[200] animate-fly-to-cart"
          style={{ left: pt.x, top: pt.y }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(220,38,38,0.4)] border border-white/20">
            <Pizza className="w-8 h-8 text-white scale-110" />
          </div>
        </div>
      ))}

      {/* Extras Quick Modal */}
      {extrasModalProduct && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setExtrasModalProduct(null)}></div>
          <div className="relative w-full max-w-md bg-slate-950 border border-white/10 rounded-[60px] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Personalização de Luxo</p>
                </div>
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{extrasModalProduct.name}</h3>
              </div>
              <button onClick={() => setExtrasModalProduct(null)} className="p-3 bg-white/5 text-slate-500 hover:text-white rounded-3xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-10 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
              {EXTRAS.map(extra => {
                const isSelected = selectedExtras.some(e => e.name === extra.name);
                return (
                  <button
                    key={extra.name}
                    onClick={() => {
                      setSelectedExtras(prev =>
                        isSelected ? prev.filter(e => e.name !== extra.name) : [...prev, extra]
                      );
                    }}
                    className={`w-full flex justify-between items-center p-5 rounded-[28px] border transition-all duration-300 ${isSelected
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                      : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:bg-white/[0.08]'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full transition-all ${isSelected ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`} />
                      <span className="font-black text-xs uppercase tracking-widest">{extra.name}</span>
                    </div>
                    <span className={`font-black tracking-tighter ${isSelected ? 'text-white' : 'text-slate-600'}`}>+{extra.price}$</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={addWithExtras}
              className="w-full bg-white text-black font-black py-7 rounded-[32px] hover:bg-slate-200 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-[0.97] group uppercase tracking-[0.2em] text-sm"
            >
              FINALIZAR SELEÇÃO <ChefHat className="w-6 h-6 text-red-600 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {sharingProduct && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setSharingProduct(null)}></div>
          <div className="relative w-full max-w-sm bg-slate-900 border border-white/5 rounded-[50px] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-10">
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Convidar</h2>
              <button onClick={() => setSharingProduct(null)} className="p-3 bg-white/5 text-slate-500 rounded-2xl">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <button onClick={shareWhatsApp} className="w-full flex items-center gap-6 p-6 bg-green-600 text-white font-black rounded-[28px] hover:bg-green-500 transition-all shadow-[0_20px_40px_rgba(22,163,74,0.2)] uppercase tracking-widest text-xs">
                <MessageCircle className="w-6 h-6" /> WhatsApp
              </button>
              <button onClick={copyToClipboard} className="w-full flex items-center justify-between p-6 bg-slate-800 text-white font-black rounded-[28px] hover:bg-slate-700 transition-all uppercase tracking-widest text-xs">
                <div className="flex items-center gap-6"><Link className="w-6 h-6" /> Copiar Link</div>
                {copied && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              </button>
            </div>
            <p className="mt-8 text-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Convide um amigo para o Kantinho</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;
