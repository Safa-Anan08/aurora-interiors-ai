"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart, CartItem } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import { CreditCard, ShieldCheck, Mail, MapPin, Phone, User, ShoppingBag } from 'lucide-react';

const checkoutSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Provide a valid email address." }),
  address: z.string().min(5, { message: "Provide a valid shipping address." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  phone: z.string().min(8, { message: "Provide a valid phone number." }),
  cardNumber: z.string().regex(/^\d{16}$/, { message: "Provide a valid 16-digit card number." }),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Provide card expiry as MM/YY." }),
  cvv: z.string().regex(/^\d{3}$/, { message: "Provide a valid 3-digit CVV." })
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      address: '',
      city: '',
      phone: '',
      cardNumber: '4242424242424242', // Standard Stripe test card
      expiry: '12/28',
      cvv: '123'
    }
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (cart.length === 0) return;
    setSubmitting(true);

    try {
      // API call to Express Stripe checkout route
      const response = await axios.post(`${SERVER_URL}/api/marketplace/checkout`, {
        items: cart
      });

      if (response.data.success) {
        toast.loading('Contacting payment node...', { duration: 1000 });
        
        setTimeout(() => {
          toast.success('Secure payment authorized!');
          clearCart(); // Clear cart items upon successful checkouts
          router.push(`/checkout/success?ref=${response.data.paymentReference}`);
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error?.message || 'Payment authentication node error.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full z-10">
        
        {/* Checkout Inputs Column */}
        <div className="md:col-span-8">
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="glass-panel p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-6 shadow-lg"
          >
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/5 pb-3">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold tracking-wide">Secure Stripe Checkout</h2>
            </div>

            {/* Shipping Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">1. Shipping Logistics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Receiver Name</label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  {errors.fullName && <span className="text-[9px] text-rose-500 font-bold">{errors.fullName.message}</span>}
                </div>
                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Email Coordinates</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  {errors.email && <span className="text-[9px] text-rose-500 font-bold">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Address */}
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Street Address</label>
                  <input
                    type="text"
                    {...register('address')}
                    placeholder="123 Main St, Apt 4"
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  {errors.address && <span className="text-[9px] text-rose-500 font-bold">{errors.address.message}</span>}
                </div>
                {/* City */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">City Location</label>
                  <input
                    type="text"
                    {...register('city')}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  {errors.city && <span className="text-[9px] text-rose-500 font-bold">{errors.city.message}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1 max-w-sm">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Contact Phone</label>
                <input
                  type="text"
                  {...register('phone')}
                  placeholder="+1 (555) 0199"
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
                {errors.phone && <span className="text-[9px] text-rose-500 font-bold">{errors.phone.message}</span>}
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/5">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">2. Stripe Card Details</h3>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Card Number</label>
                <input
                  type="text"
                  {...register('cardNumber')}
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                />
                {errors.cardNumber && <span className="text-[9px] text-rose-500 font-bold">{errors.cardNumber.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    {...register('expiry')}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  {errors.expiry && <span className="text-[9px] text-rose-500 font-bold">{errors.expiry.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">CVV Code</label>
                  <input
                    type="password"
                    {...register('cvv')}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  {errors.cvv && <span className="text-[9px] text-rose-500 font-bold">{errors.cvv.message}</span>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="btn-gradient w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Pay ${cartTotal.toLocaleString()} Securly
            </button>
          </form>
        </div>

        {/* Order Items column */}
        <div className="md:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Items Summary</h3>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {cart.map((item: CartItem) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-black flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <p className="text-[9px] text-cyan-400 mt-0.5 font-bold">{item.quantity} x ${item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 dark:border-white/5 pt-3 space-y-2 text-xs font-semibold text-gray-500 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-900 dark:text-white font-bold">${cartTotal.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-white/5 pt-2 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                <span>Due Total</span>
                <span className="text-cyan-400 font-black">${cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
