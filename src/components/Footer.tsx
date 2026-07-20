"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel mt-auto w-full px-6 py-12 border-t border-white/5 backdrop-blur-md dark:bg-slate-950/60 bg-white/60 transition-colors duration-250 rounded-t-3xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

        {/* Brand signature */}
        <div className="md:col-span-4 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950 dark:text-white leading-none">
                Aurora Interiors
              </h2>
              <p className="text-[8px] text-cyan-500 dark:text-cyan-400 font-bold uppercase tracking-widest mt-0.5">
                AI Creative Studio
              </p>
            </div>
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
            Synthesizing state-of-the-art Generative AI with a curated furniture and materials marketplace to craft your dream spaces.
          </p>
        </div>

        {/* Explore Links column */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider">Explore</h3>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/designs" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 font-semibold transition-colors">
                Designs Showcase
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 font-semibold transition-colors">
                Materials Marketplace
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 font-semibold transition-colors">
                About Our Studio
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources links column */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider">Resources</h3>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/faq" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 font-semibold transition-colors">
                FAQs Accordion
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 font-semibold transition-colors">
                Design Blog
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 font-semibold transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info column */}
        <div className="md:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider">Studio Node Contact</h3>
          <ul className="space-y-2.5 text-[11px] text-gray-500 dark:text-gray-400 font-semibold">
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                support@aurorainteriors.ai
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span>+1 (888) 555-0199</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span>100 Spatial Plaza, Suite AI, San Francisco, CA</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-200 dark:border-white/5 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
        <span>
          © 2026 Aurora Interiors AI • All Rights Reserved.
        </span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-cyan-400">Terms of Use</Link>
          <Link href="/privacy" className="hover:text-cyan-400">Cookies Policy</Link>
          <span>API Config Version: v1.1.0</span>
        </div>
      </div>
    </footer>
  );
}
