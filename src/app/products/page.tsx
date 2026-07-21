"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import MarketplaceTab from '../../components/MarketplaceTab';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ExploreProductsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full z-10 space-y-8">
        <div className="space-y-2">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full inline-block">
            Marketplace Catalog
          </span>
          <h1 className="text-3xl font-black tracking-tight leading-tight">Explore Furniture & Materials</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Discover premium designer assets: sofas, lights, low-VOC wall paints, and composite porcelain tiles.</p>
        </div>

        {/* Reusing our high-fidelity Marketplace browse component */}
        <MarketplaceTab serverUrl={SERVER_URL} />
      </main>

      <Footer />
    </div>
  );
}
