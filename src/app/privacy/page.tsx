"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShieldAlert, BookOpen, Clock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 space-y-8 w-full z-10">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <ShieldAlert className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
              Legal Node
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Privacy Policy</h1>
          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Last Updated: July 16, 2026</span>
          </div>
        </section>

        <section className="glass-panel p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-6 text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
          
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              1. Information Collection
            </h3>
            <p>
              We collect user metrics when you create profiles, complete guided AI interior consultations, or checkout items via Stripe. This comprises: name, email, payment references, room layout specifications, and style selections.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              2. Stripe Payment Shield
            </h3>
            <p>
              Credit/debit details are processed exclusively on Stripe nodes utilizing AES 256-bit encryption. Card credentials are never stored on our database schemas.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              3. AI Consultation Retentions
            </h3>
            <p>
              To maintain guided designer capabilities, conversation logs are compiled to establish layout contexts. These logs are stored securely and may be cleared from your profile dashboard at any time.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              4. Cookies Policy
            </h3>
            <p>
              We utilize session cookies to authenticate user states, retain shopping baskets, and store theme selections (light/dark mode).
            </p>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
