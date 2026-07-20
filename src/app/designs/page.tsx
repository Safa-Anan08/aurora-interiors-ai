"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Search, Compass, Eye, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ExploreDesignsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('all');

  // Debounce search string input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch designs list from MongoDB via public API
  const { data, isLoading, error } = useQuery({
    queryKey: ['designs', debouncedSearch, selectedStyle],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/designs`, {
        params: { search: debouncedSearch, style: selectedStyle }
      });
      return res.data;
    }
  });

  const designs = data?.designs || [];
  const styles = ['all', 'Japandi', 'Scandinavian', 'Industrial', 'Bohemian', 'Minimalist'];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full z-10 space-y-8">
        <div className="space-y-2">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full inline-block">
            Inspiration Showcase
          </span>
          <h1 className="text-3xl font-black tracking-tight leading-tight">Explore AI Design Concepts</h1>
          <p className="text-xs text-gray-550 dark:text-gray-400">Inspect full room styling templates, custom layout blueprints, and purchase matching items.</p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-black/20 p-4 border border-white/5 rounded-2xl">
          <div className="flex flex-wrap gap-1.5">
            {styles.map(st => (
              <button
                key={st}
                onClick={() => setSelectedStyle(st.toLowerCase())}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedStyle === st.toLowerCase()
                  ? 'border-cyan-500 bg-cyan-300/20 text-cyan-900'
                  : 'border-white/5 bg-white/[0.01] text-gray-900 hover:text-white hover:bg-white/[0.02]'
                  }`}
              >
                {st === 'all' ? 'All Styles' : st}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-100 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search concepts, room types..."
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-200 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>
        </div>

        {/* Error handling notification block */}
        {error && (
          <div className="w-full text-center py-6 text-xs text-rose-500 font-bold uppercase tracking-wider">
            Failed to connect to backend server. Please verify MongoDB connection.
          </div>
        )}

        {/* Design Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="glass-panel rounded-2xl overflow-hidden flex flex-col bg-white dark:bg-slate-900/60 shadow-lg animate-pulse border border-white/5">
                <div className="aspect-[4/3] w-full bg-slate-200 dark:bg-slate-800" />
                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                  </div>
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-full pt-3" />
                </div>
              </div>
            ))
          ) : designs.length === 0 ? (
            <div className="col-span-full py-16 text-center text-xs text-gray-550 dark:text-gray-400 font-bold uppercase tracking-wider">
              No design concepts matching filters currently registered.
            </div>
          ) : (
            designs.map((d: any) => (
              <Link
                key={d._id || d.id}
                href={`/designs/${d._id || d.id}`}
                className="glass-panel rounded-2xl overflow-hidden flex flex-col bg-white dark:bg-slate-900/60 shadow-lg group"
              >
                <div className="relative aspect-[4/3] w-full bg-black overflow-hidden border-b border-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.img} alt={d.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center text-white">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 text-[8px] font-bold uppercase tracking-wider bg-black/60 border border-white/10 backdrop-blur px-2.5 py-1 rounded-full text-cyan-300">
                    {d.roomType}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white group-hover:text-cyan-300 transition-colors truncate">
                      {d.title}
                    </h4>
                    <p className="text-[10px] text-gray-550 dark:text-gray-400 leading-normal line-clamp-2">
                      {d.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3 text-[9px] text-gray-550 dark:text-gray-550 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1 capitalize">
                      <Compass className="w-3.5 h-3.5" />
                      {d.style}
                    </span>
                    <span className="flex items-center gap-0.5 text-cyan-400">
                      <Sparkles className="w-3 h-3" />
                      Layout Available
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
