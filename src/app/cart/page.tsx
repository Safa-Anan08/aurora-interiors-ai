"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart, CartItem } from '../../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  const handleClearItem = (id: string, name: string) => {
    removeFromCart(id);
    toast.success(`Removed ${name} from cart.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full z-10 space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full inline-block">
            Workspace Cart
          </span>
          <h1 className="text-3xl font-black tracking-tight leading-tight">Your Shopping Cart</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Review selected furniture and interior styling items prior to checkout.</p>
        </div>

        {cart.length === 0 ? (
          <div className="glass-panel p-16 rounded-3xl text-center flex flex-col items-center justify-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-400">Your cart is empty</h3>
            <p className="text-xs text-gray-500 max-w-xs mt-1 leading-relaxed">Browse the Marketplace catalog or consult with Aurora AI to add designer assets.</p>
            <Link 
              href="/products" 
              className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white mt-6 inline-block"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Items list */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item: CartItem) => (
                <div 
                  key={item.id} 
                  className="glass-panel p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center gap-4 shadow"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-slate-200 dark:border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-905 dark:text-white truncate">{item.name}</h3>
                    <p className="text-[10px] text-violet-400 font-bold uppercase tracking-wider capitalize mt-0.5">{item.category}</p>
                    <p className="text-xs font-black text-cyan-400 mt-2">${item.price}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-505 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white font-bold w-4"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-slate-800 dark:text-gray-200">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-550 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white font-bold w-4"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleClearItem(item.id, item.name)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.01] dark:hover:bg-white/5 border border-slate-250 dark:border-white/5 rounded-xl text-gray-500 hover:text-rose-500 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Billing Summary Box */}
            <div className="lg:col-span-4 glass-panel p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Billing Summary</h3>
              
              <div className="space-y-3 font-semibold text-xs text-gray-500 dark:text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-450 dark:text-gray-400">Cart Subtotal</span>
                  <span className="text-slate-900 dark:text-white font-bold">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-450 dark:text-gray-400">Stripe Charges</span>
                  <span className="text-emerald-400 font-bold uppercase text-[10px]">Free / Included</span>
                </div>
                <div className="border-t border-slate-100 dark:border-white/5 pt-3 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Grand Total</span>
                  <span className="text-cyan-400 font-black">${cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="btn-gradient w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-lg"
              >
                <CreditCard className="w-4 h-4" />
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <div className="flex items-center justify-center gap-1.5 text-[9px] text-gray-500 font-semibold uppercase tracking-wider text-center pt-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Stripe Secured PCI-Compliant Checkout
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
