"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2, FileText, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { fetchCart } = useCart();
  const { fetchWishlist } = useWishlist();
  
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast.error("Invalid checkout session.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/marketplace/checkout-success`, {
          sessionId
        }, {
          withCredentials: true
        });

        if (response.data.success) {
          setOrderDetails(response.data.order);
          setPaymentDetails(response.data.payment);
          toast.success("Payment verified successfully!");
          
          // Sync client-side contexts
          await fetchCart();
          await fetchWishlist();
        } else {
          toast.error("Failed to verify transaction.");
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        toast.error(err.response?.data?.error?.message || "Transaction verification node error.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, fetchCart, fetchWishlist]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#C28285]" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
          Verifying Stripe Transaction...
        </h2>
        <p className="text-[10px] text-gray-500 max-w-[280px]">
          Please do not close this browser tab or refresh the page while secure tokens are processed.
        </p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full border border-rose-500/30 bg-rose-500/10 flex items-center justify-center text-rose-500">
          ✕
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-rose-500">
          Payment Verification Failed
        </h2>
        <p className="text-xs text-gray-500 max-w-[320px]">
          We were unable to verify your payment session. Please contact support or go to your order dashboard.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 px-6 py-2.5 bg-[#C28285] text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow hover:bg-[#AF6F72]"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-fadeIn">
      <div className="glass-panel border border-[#C4C3D0]/30 shadow-2xl rounded-3xl p-8 bg-gradient-to-br from-[#FFFFF0] via-white to-[#FAF7FB] dark:from-[#13101B] dark:via-[#191624] dark:to-[#121018] relative overflow-hidden flex flex-col items-center text-center">
        
        {/* Background glow decoration */}
        <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-[#E6E6FA]/40 dark:bg-violet-900/10 filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full bg-[#C28285]/20 dark:bg-rose-900/10 filter blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>

        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C28285]">
          Stripe Secure Payment
        </span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-3">
          Order Confirmed!
        </h2>
        <p className="text-xs text-gray-500 max-w-sm mt-2 leading-relaxed">
          Thank you for your purchase. Your payment of <strong className="text-cyan-400 font-bold">${paymentDetails?.total}</strong> was completed successfully.
        </p>

        {/* Order Details box */}
        <div className="w-full bg-white/40 dark:bg-black/30 border border-[#C4C3D0]/20 rounded-2xl p-5 text-left mt-8 space-y-4">
          <div className="flex justify-between items-center text-[10px] border-b border-[#C4C3D0]/10 pb-3">
            <div>
              <span className="text-gray-400 block font-semibold uppercase">Invoice Date</span>
              <span className="text-slate-800 dark:text-gray-200 font-bold">
                {new Date(paymentDetails?.paymentDate || Date.now()).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-semibold uppercase text-right">Stripe Reference</span>
              <span className="text-slate-800 dark:text-gray-200 font-mono font-bold">
                {paymentDetails?.stripeSessionId?.substring(0, 18)}...
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[9px] text-[#C28285] font-black uppercase tracking-wider block">Purchased Products</span>
            <div className="space-y-2">
              {paymentDetails?.purchasedProducts?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 dark:text-gray-300 font-semibold max-w-[70%] truncate">
                    {item.name} <span className="text-gray-400 text-[10px]">x {item.quantity}</span>
                  </span>
                  <span className="text-slate-900 dark:text-white font-black">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#C4C3D0]/15 pt-3 flex justify-between items-center">
            <span className="text-xs font-black text-slate-800 dark:text-white uppercase">Total Paid</span>
            <span className="text-sm font-black text-cyan-400">${paymentDetails?.total?.toLocaleString()}</span>
          </div>
        </div>

        {/* Buttons flow */}
        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#C4C3D0]/30 hover:border-[#C28285] bg-white dark:bg-slate-900 text-slate-700 dark:text-gray-200 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <ClipboardList className="w-4 h-4" />
            My Orders
          </button>

          <button
            onClick={() => router.push('/dashboard?tab=designer')}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-[#C28285] hover:bg-[#AF6F72] text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-all shadow"
          >
            AI Designer
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8FC] dark:bg-[#030712]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <Suspense fallback={
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#C28285]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">Loading Order Details...</h2>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
