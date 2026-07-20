"use client";

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

function SuccessReceipt() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get('ref') || 'aurora_ref_default';

  return (
    <main className="flex-1 max-w-md mx-auto px-6 py-20 flex flex-col items-center text-center justify-center gap-6 w-full z-10">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-2 animate-bounce">
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Order Confirmed!</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
          Your payment has been successfully processed through Stripe securely. A receipt has been dispatched to your email coordinates.
        </p>
      </div>

      {/* Invoice coordinates */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl p-4 w-full text-left space-y-2.5 shadow">
        <div className="flex justify-between text-[10px] font-semibold">
          <span className="text-gray-500 uppercase">Payment Node</span>
          <span className="text-emerald-400 font-bold">Stripe Live Secure</span>
        </div>
        <div className="flex justify-between text-[10px] font-semibold">
          <span className="text-gray-500 uppercase">Order Reference</span>
          <span className="text-gray-600 dark:text-gray-300 font-bold font-mono">{ref}</span>
        </div>
        <div className="flex justify-between text-[10px] font-semibold">
          <span className="text-gray-500 uppercase">Est. Delivery</span>
          <span className="text-gray-600 dark:text-gray-300 font-bold">3 - 5 Business Days</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
        <Link
          href="/dashboard"
          className="btn-gradient flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-1.5 shadow"
        >
          User Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/products"
          className="flex-1 py-3 border border-slate-300 dark:border-white/10 bg-white/40 dark:bg-black/40 hover:bg-slate-100 dark:hover:bg-white/[0.02] rounded-xl text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gray-200 transition-all flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" />
          Marketplace
        </Link>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[9px] text-gray-500 font-semibold uppercase tracking-wider pt-2">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        Encrypted Transaction Receipted
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250">
      <Navbar />
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-t-cyan-400 border-b-transparent animate-spin" />
        </div>
      }>
        <SuccessReceipt />
      </Suspense>
      <Footer />
    </div>
  );
}
