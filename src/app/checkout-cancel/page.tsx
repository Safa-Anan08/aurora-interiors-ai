"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShoppingBag, ArrowLeft, AlertCircle } from 'lucide-react';

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8FC] dark:bg-[#030712]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full glass-panel border border-[#C4C3D0]/30 shadow-2xl rounded-3xl p-8 bg-gradient-to-br from-[#FFFFF0] via-white to-[#FAF7FB] dark:from-[#13101B] dark:via-[#191624] dark:to-[#121018] text-center relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-6 mx-auto text-rose-500">
            <AlertCircle className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C28285]">
            Checkout Aborted
          </span>
          
          <h2 className="text-xl font-black text-slate-800 dark:text-white mt-3">
            Transaction Cancelled
          </h2>
          
          <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-xs mx-auto">
            Your payment session was aborted. No funds have been transferred, and your basket items remain intact.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mt-8">
            <button
              onClick={() => router.push('/dashboard?tab=cart')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#C4C3D0]/30 hover:border-[#C28285] bg-white dark:bg-slate-900 text-slate-700 dark:text-gray-200 text-xs font-bold uppercase tracking-wider transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Cart
            </button>

            <button
              onClick={() => router.push('/dashboard?tab=designer')}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#C28285] hover:bg-[#AF6F72] text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-all shadow"
            >
              AI Designer
            </button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
