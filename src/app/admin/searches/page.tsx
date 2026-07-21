"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Search, AlertCircle, Compass, Palette } from 'lucide-react';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminSearchesAnalytics() {
  const { data: res, isLoading } = useQuery({
    queryKey: ['adminSearchAnalytics'],
    queryFn: async () => {
      const response = await axios.get(`${SERVER_URL}/api/admin/analytics/search`);
      return response.data.data;
    }
  });

  if (isLoading) {
    return <div className="text-center py-12 text-xs font-bold text-gray-500 animate-pulse">Running Search Query Audits...</div>;
  }

  const s = res || {
    mostSearchedKeywords: [],
    mostSearchedRooms: [],
    mostSearchedColors: [],
    zeroResultSearches: []
  };

  return (
    <div className="space-y-8">
      
      {/* Grid: keyword stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Most Searched Keywords */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 border-b border-lavender-grey/25 pb-2">
            <Search className="w-4 h-4 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Most Searched Keywords</h3>
          </div>
          <div className="divide-y divide-lavender-grey/20">
            {s.mostSearchedKeywords.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center py-3">
                <span className="text-xs font-mono font-bold text-charcoal">"{item.keyword}"</span>
                <span className="text-[10px] text-gray-400 font-bold">{item.count} queries</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Searched Room Types */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 border-b border-lavender-grey/25 pb-2">
            <Compass className="w-4.5 h-4.5 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Most Searched Rooms</h3>
          </div>
          <div className="divide-y divide-lavender-grey/20">
            {s.mostSearchedRooms.map((room: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center py-3">
                <span className="text-xs font-bold text-charcoal">{room.name}</span>
                <span className="text-[10px] text-gray-400 font-bold">{room.count} searches</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Searched Colors */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 border-b border-lavender-grey/25 pb-2">
            <Palette className="w-4.5 h-4.5 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Most Searched Colors</h3>
          </div>
          <div className="divide-y divide-lavender-grey/20">
            {s.mostSearchedColors.map((col: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center py-3">
                <span className="text-xs font-bold text-charcoal">{col.name}</span>
                <span className="text-[10px] text-gray-400 font-bold">{col.count} searches</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row: Zero result queries */}
      <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-4">
        <div className="flex items-center gap-1.5 border-b border-lavender-grey/25 pb-2">
          <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
          <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Zero Result Search Inquiries</h3>
        </div>
        <p className="text-[11px] text-gray-400 leading-normal max-w-xl">
          Queries input by users that returned zero products or presets. Review these terms to discover catalog stock expansion needs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {s.zeroResultSearches.map((item: any, idx: number) => (
            <div key={idx} className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-700">"{item.keyword}"</span>
              <span className="text-[9px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">{item.count} misses</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
