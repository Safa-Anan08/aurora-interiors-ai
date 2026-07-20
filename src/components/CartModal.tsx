"use client";

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, X, Trash2, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverUrl: string;
}

export default function CartModal({ isOpen, onClose, serverUrl }: CartModalProps) {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{ ref: string } | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);

    try {
      const response = await fetch(`${serverUrl}/api/marketplace/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
      });
      const data = await response.json();
      if (data.success) {
        // Simulated Stripe routing redirect
        setTimeout(() => {
          setSuccessDetails({ ref: data.paymentReference });
          setCheckingOut(false);
          clearCart(); // Clear items upon successful purchase
        }, 1500);
      } else {
        alert(data.error?.message || 'Checkout failed.');
        setCheckingOut(false);
      }
    } catch (err) {
      console.error(err);
      alert('Checkout node connection error.');
      setCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Black glass back panel */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => {
          if (!checkingOut) onClose();
        }}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-white/5 shadow-2xl flex flex-col justify-between h-full bg-slate-950/95 relative">
          
          {/* Success Overlay View */}
          {successDetails && (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center z-40">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Order Confirmed!</h3>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed mb-6">
                Thank you for your purchase. Your payment has been processed through Stripe securely.
              </p>
              
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 w-full mb-8 text-left space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500 uppercase font-semibold">Payment Node</span>
                  <span className="text-emerald-400 font-bold">Stripe Live (Simulated)</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500 uppercase font-semibold">Order Reference</span>
                  <span className="text-gray-300 font-bold font-mono">{successDetails.ref}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-500 uppercase font-semibold">Est. Delivery</span>
                  <span className="text-gray-300 font-bold">3 - 5 Business Days</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSuccessDetails(null);
                  onClose();
                }}
                className="btn-gradient w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Return to Workspace
              </button>
            </div>
          )}

          {/* Drawer Header */}
          <div className="px-5 py-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-200">Your Basket</h2>
              <span className="text-[10px] bg-cyan-900/40 text-cyan-400 border border-cyan-500/25 px-2 py-0.5 rounded-full font-bold">
                {cart.length}
              </span>
            </div>
            <button 
              onClick={onClose}
              disabled={checkingOut}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Items List Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-5 h-5 text-gray-600" />
                </div>
                <p className="text-xs font-bold text-gray-400">Shopping Cart is Empty</p>
                <p className="text-[10px] text-gray-500 max-w-[200px] mt-1">Browse the Marketplace tab or consult with our AI Agent to add items.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-white/[0.01] border border-white/5 rounded-xl items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                    <p className="text-[9px] text-violet-400 uppercase tracking-wider font-semibold capitalize mt-0.5">{item.category}</p>
                    <p className="text-xs font-bold text-cyan-400 mt-1">${item.price}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-2 py-1 rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-400 hover:text-white text-xs font-bold w-4"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-gray-200">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-400 hover:text-white text-xs font-bold w-4"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing & Stripe trigger node */}
          <div className="p-5 border-t border-white/5 bg-black/25 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-semibold">Subtotal</span>
                <span className="text-gray-200 font-bold">${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-semibold">Stripe Secure Fee</span>
                <span className="text-emerald-400 font-semibold uppercase text-[10px]">Free / Included</span>
              </div>
              <div className="border-t border-white/5 pt-2 flex justify-between text-sm">
                <span className="text-white font-bold">Total Due</span>
                <span className="text-cyan-400 font-black">${cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || checkingOut}
              className="btn-gradient w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-4 h-4" />
              {checkingOut ? 'Opening Secure Portal...' : 'Pay securely via Stripe'}
            </button>
            
            <div className="flex items-center justify-center gap-1.5 text-[9px] text-gray-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              AES 256-bit Encrypted Transaction
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
