"use client";

import React from 'react';
import { Sparkles, MessageSquare, FolderHeart, ShieldCheck, ShoppingCart } from 'lucide-react';

interface HeaderProps {
  activeTab: 'visualizer' | 'chat' | 'marketplace' | 'gallery';
  setActiveTab: (tab: 'visualizer' | 'chat' | 'marketplace' | 'gallery') => void;
  serverStatus: 'connected' | 'disconnected' | 'checking';
}

export default function Header({ activeTab, setActiveTab, serverStatus }: HeaderProps) {
  return (
    <header className="glass-panel sticky top-0 z-50 w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 backdrop-blur-md rounded-b-2xl">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/10">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
            Aurora Interiors
          </h1>
          <p className="text-[10px] text-cyan-400 font-medium uppercase tracking-widest">
            AI Creative Studio
          </p>
        </div>
      </div>

      <nav className="flex flex-wrap items-center justify-center bg-black/40 p-1.5 rounded-full border border-white/5 gap-1">
        <button
          onClick={() => setActiveTab('visualizer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'visualizer'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Visualizer
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          AI Consultation
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'marketplace'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Marketplace
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
            activeTab === 'gallery'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FolderHeart className="w-3.5 h-3.5" />
          Gallery
        </button>
      </nav>

      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium border ${
          serverStatus === 'connected' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : serverStatus === 'checking'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          <ShieldCheck className="w-3 h-3" />
          {serverStatus === 'connected' ? 'Core Node Online' : serverStatus === 'checking' ? 'Syncing Node...' : 'Node Offline'}
        </div>
      </div>
    </header>
  );
}
