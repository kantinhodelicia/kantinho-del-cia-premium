
import React, { useState, useEffect } from 'react';
import { CartItem, DeliveryZone, User, Extra } from '../types';
import { EXTRAS } from '../constants';
import {
  X, Trash2, Plus, Minus, Printer, MessageCircle,
  ShoppingBag, ChevronDown, ChevronUp, Sparkles,
  Receipt, Truck, CreditCard, Info
} from 'lucide-react';

interface Props {
  cart: CartItem[];
  zone: DeliveryZone | null;
  notes: string;
  onNotesChange: (notes: string) => void;
  onClose: () => void;
  onUpdateQty: (uid: string, delta: number) => void;
  onRemove: (uid: string) => void;
  onToggleExtra: (uid: string, extra: Extra) => void;
  clearCart: () => void;
  user: User;
  onOrderComplete?: (total: number) => void;
}

const CartSheet: React.FC<Props> = ({ cart, zone, notes, onNotesChange, onClose, onUpdateQty, onRemove, onToggleExtra, clearCart, user, onOrderComplete }) => {
  const [isCalculationsVisible, setIsCalculationsVisible] = useState(false);

  useEffect(() => {
    if (cart.length > 0) {
      const timer = setTimeout(() => setIsCalculationsVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [cart.length]);

  const subtotal = cart.reduce((acc, item) => {
    const extrasPrice = item.extras.reduce((sum, e) => sum + e.price, 0);
    return acc + ((item.price + extrasPrice) * item.quantity);
  }, 0);

  const boxesPrice = cart.reduce((acc, item) => item.needsBox ? acc + (100 * item.quantity) : acc, 0);
  const deliveryPrice = zone?.price || 0;
  const total = subtotal + boxesPrice + deliveryPrice;

  const handlePrint = () => {
    const printArea = document.getElementById('print-area');
    if (!printArea) return;

    const date = new Date().toLocaleDateString('pt-PT');
    const time = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

    const itemsHtml = cart.map(item => `
      <div style="margin-bottom: 8px; border-bottom: 1px dotted #000; padding-bottom: 4px;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold;">
          <span>${item.quantity}x ${item.name} (${item.size})</span>
          <span>${(item.price + item.extras.reduce((s, e) => s + e.price, 0)) * item.quantity}$</span>
        </div>
        ${item.extras.length > 0 ? `
          <div style="font-size: 11px; margin-left: 10px; opacity: 0.8;">
            ${item.extras.map(e => `+ ${e.name}`).join(', ')}
          </div>
        ` : ''}
      </div>
    `).join('');

    printArea.innerHTML = `
      <div style="font-family: 'Courier New', Courier, monospace; color: black; line-height: 1.3; width: 100%; max-width: 80mm; padding: 10px;">
        <div style="text-align: center; border-bottom: 2px solid black; padding-bottom: 15px; margin-bottom: 15px;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: -1px;">KANTINHO DELÍCIA</h2>
          <p style="font-size: 11px; margin: 4px 0; font-weight: bold;">PREMIUM QUALITY PIZZA</p>
          <p style="font-size: 10px; margin: 0;">${date} | ${time}</p>
        </div>
        
        <div style="font-size: 12px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between;"><b>CLIENTE:</b> <span>${user.name}</span></div>
          <div style="display: flex; justify-content: space-between;"><b>ZONA:</b> <span>${zone?.name || 'RETIRADA'}</span></div>
          <div style="display: flex; justify-content: space-between;"><b>TEL:</b> <span>${user.phone}</span></div>
        </div>

        <div style="border-bottom: 1px dashed black; padding-bottom: 15px; margin-bottom: 15px;">
          <div style="font-weight: bold; font-size: 12px; margin-bottom: 8px; text-decoration: underline;">RESUMO DO PEDIDO:</div>
          ${itemsHtml}
        </div>

        <div style="font-size: 13px; font-weight: bold;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>SUBTOTAL:</span> <span>${subtotal}$</span></div>
          ${boxesPrice > 0 ? `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>EMBALAGENS:</span> <span>${boxesPrice}$</span></div>` : ''}
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>TAXA ENTREGA:</span> <span>${deliveryPrice}$</span></div>
          
          <div style="display: flex; justify-content: space-between; font-size: 22px; font-weight: 900; border-top: 3px double black; padding-top: 10px; margin-top: 12px;">
            <span>TOTAL:</span>
            <span>${total}$</span>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; font-size: 11px; border-top: 1px solid #000; padding-top: 15px;">
          Bom Apetite! Agradecemos o seu pedido.<br>
          <b>@kantinhodelicia</b>
        </div>
      </div>
    `;

    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleWhatsApp = () => {
    let msg = `*🍔 NOVO PEDIDO - KANTINHO DELÍCIA PREMIUM*\n`;
    msg += `--------------------------------\n`;
    msg += `👤 *Cliente:* ${user.name}\n`;
    msg += `📞 *WhatsApp:* ${user.phone}\n`;
    msg += `📍 *Zona:* ${zone ? zone.name : 'Retirada no Balcão'}\n`;
    msg += `--------------------------------\n\n`;

    cart.forEach(item => {
      msg += `✅ *${item.quantity}x ${item.name}* (${item.size})\n`;
      if (item.extras.length > 0) {
        msg += `  └ _Extras: ${item.extras.map(e => e.name).join(', ')}_\n`;
      }
      msg += `  💰 Valor: ${(item.price + item.extras.reduce((s, e) => s + e.price, 0)) * item.quantity}$\n\n`;
    });

    if (notes.trim()) {
      msg += `--------------------------------\n`;
      msg += `📝 *Observações:* ${notes}\n`;
    }

    msg += `--------------------------------\n`;
    if (boxesPrice > 0) msg += `📦 *Caixas:* ${boxesPrice}$\n`;
    if (zone) msg += `🚚 *Entrega:* ${deliveryPrice}$\n`;
    msg += `\n🔥 *TOTAL A PAGAR: ${total}$*\n`;
    msg += `--------------------------------`;

    const url = `https://wa.me/2385999204?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');

    if (onOrderComplete) onOrderComplete(total);
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end no-print">
      <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}></div>

      <div className="relative w-full max-w-lg bg-[#020617] h-full flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-500 ease-out border-l border-white/5">

        {/* Header Section */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-slate-900/20 backdrop-blur-3xl sticky top-0 z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-red-600 rounded-[24px] flex items-center justify-center shadow-[0_15px_35px_rgba(220,38,38,0.3)] rotate-3">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Carrinho</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-yellow-500" /> {cart.length} Seleções Premium
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/5 rounded-[24px] transition-all text-slate-500 hover:text-white group">
            <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-10">
              <div className="w-32 h-32 bg-slate-900/40 rounded-full flex items-center justify-center mb-8 border border-white/5 relative">
                <div className="absolute inset-0 bg-red-600 blur-[50px] opacity-10 animate-pulse" />
                <ShoppingBag className="w-14 h-14 text-slate-800 opacity-40 relative z-10" />
              </div>
              <h3 className="font-black text-2xl text-white mb-3 uppercase italic tracking-tighter">Sua bolsa está vazia</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[240px]">Explore nossos sabores artesanais e monte seu pedido exclusivo.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item, index) => {
                const itemExtrasTotal = item.extras.reduce((sum, e) => sum + e.price, 0);
                const unitPrice = item.price + itemExtrasTotal;

                return (
                  <div
                    key={item.uniqueId}
                    className="group bg-slate-900/30 border border-white/5 rounded-[40px] p-6 hover:bg-slate-900/50 transition-all duration-500 animate-in slide-in-from-right duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-black text-xl text-white italic tracking-tighter uppercase">{item.name}</h3>
                          <span className="bg-red-600/10 text-red-500 text-[9px] font-black px-3 py-1 rounded-full border border-red-500/20 uppercase tracking-widest">{item.size}</span>
                        </div>
                        {item.extras.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.extras.map(e => (
                              <span key={e.name} className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                                + {e.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => onRemove(item.uniqueId)}
                        className="p-3.5 bg-slate-950/50 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-[20px] transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-slate-950 shadow-inner rounded-[24px] p-1.5 border border-white/5">
                        <button
                          onClick={() => onUpdateQty(item.uniqueId, -1)}
                          className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-black text-white text-lg">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.uniqueId, 1)}
                          className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Valor do Item</p>
                        <span className="font-black text-3xl text-white tracking-tighter">{(unitPrice * item.quantity)}<span className="text-red-600 italic">$</span></span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Special Instructions */}
              <div className="space-y-4 pt-6 animate-in fade-in duration-1000 delay-500">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] ml-4 flex items-center gap-3">
                  <Info className="w-4 h-4" /> Instruções Especiais
                </p>
                <div className="relative group">
                  <textarea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Deseja algum ajuste premium em seu pedido?"
                    className="w-full bg-slate-900/40 border border-white/5 rounded-[40px] p-7 text-slate-300 text-sm h-32 resize-none outline-none focus:border-red-600/30 transition-all placeholder:text-slate-700 shadow-inner"
                  />
                  <Sparkles className="absolute right-6 bottom-6 w-5 h-5 text-slate-800 opacity-40" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer: The Receipt Section */}
        {cart.length > 0 && (
          <div className="p-8 bg-slate-900/40 backdrop-blur-4xl border-t border-white/5 space-y-8 rounded-t-[64px] shadow-[0_-40px_100px_rgba(0,0,0,0.6)] relative z-10 transition-all duration-700 overflow-hidden">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />

            <div className={`space-y-4 transition-all duration-1000 transform ${isCalculationsVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 p-5 rounded-[32px] border border-white/5 flex flex-col items-center text-center">
                  <Receipt className="w-5 h-5 text-slate-500 mb-2" />
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Subtotal</span>
                  <span className="text-sm font-black text-white">{subtotal}$</span>
                </div>
                <div className="bg-white/5 p-5 rounded-[32px] border border-white/5 flex flex-col items-center text-center">
                  <Truck className="w-5 h-5 text-slate-500 mb-2" />
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Entrega</span>
                  <span className="text-sm font-black text-white">{zone ? `${deliveryPrice}$` : '--'}</span>
                </div>
                <div className="bg-white/5 p-5 rounded-[32px] border border-white/5 flex flex-col items-center text-center">
                  <Sparkles className="w-5 h-5 text-yellow-600 mb-2" />
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Embalagem</span>
                  <span className="text-sm font-black text-white">{boxesPrice}$</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-4">
                <div className="flex flex-col">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-2 ml-1">Total à Pagar</p>
                  <span className="text-6xl font-black text-white tracking-tighter leading-none">{total}<span className="text-red-600 italic">$</span></span>
                </div>
                <button
                  onClick={handlePrint}
                  className="w-20 h-20 bg-slate-800 hover:bg-slate-700 text-white rounded-[28px] flex items-center justify-center transition-all shadow-xl active:scale-90 border border-white/5 group"
                  title="Imprimir Cupom Premium"
                >
                  <Printer className="w-8 h-8 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            <button
              onClick={handleWhatsApp}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-7 rounded-[32px] flex items-center justify-center gap-5 transition-all shadow-[0_25px_50px_rgba(220,38,38,0.3)] active:scale-[0.98] group uppercase tracking-[0.2em] text-sm"
            >
              <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
              Finalizar Pedido via WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSheet;
