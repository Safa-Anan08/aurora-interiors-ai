"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { Heart, Star, Layout, Bookmark } from 'lucide-react';

const SERVER_URL = 'http://localhost:5000';

export default function AdminWishlistsAnalytics() {
  const { data: res, isLoading } = useQuery({
    queryKey: ['adminWishlistAnalytics'],
    queryFn: async () => {
      const response = await axios.get(`${SERVER_URL}/api/admin/analytics/wishlist`);
      return response.data.data;
    }
  });

  if (isLoading) {
    return <div className="text-center py-12 text-xs font-bold text-gray-500 animate-pulse">Analyzing Wishlists...</div>;
  }

  const w = res || {
    mostWishlisted: [],
    wishlistTrend: [],
    popularCategories: [],
    popularStyles: []
  };

  return (
    <div className="space-y-8">

      {/* Grid: Trend charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Wishlist Trend Line */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-lavender-grey/25 pb-2">
            <Heart className="w-4 h-4 text-red" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Wishlist Growth Trends</h3>
          </div>
          <div className="h-[240px] w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={w.wishlistTrend}>
                <XAxis dataKey="name" stroke="#7E7885" />
                <YAxis stroke="#7E7885" />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#B07575" fill="#C3BECA" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Saved Items List */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 border-b border-lavender-grey/25 pb-2">
            <Bookmark className="w-4.5 h-4.5 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Most Saved Products</h3>
          </div>
          <div className="divide-y divide-lavender-grey/20">
            {w.mostWishlisted.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center py-3">
                <span className="text-xs font-bold text-charcoal">{item.name}</span>
                <span className="text-[10px] bg-dusty-rose/15 text-dusty-rose px-2 py-0.5 rounded font-bold">
                  {item.count} saves
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Categories & Styles splits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Popular Categories */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 border-b border-lavender-grey/25 pb-2">
            <Layout className="w-4.5 h-4.5 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Favorite Categories Percentage</h3>
          </div>
          <div className="divide-y divide-lavender-grey/20">
            {w.popularCategories.map((cat: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center py-3">
                <span className="text-xs font-bold text-charcoal capitalize">{cat.name}</span>
                <span className="text-xs font-black text-dusty-rose">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Styles */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 border-b border-lavender-grey/25 pb-2">
            <Star className="w-4.5 h-4.5 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Popular Interior Styles</h3>
          </div>
          <div className="divide-y divide-lavender-grey/20">
            {w.popularStyles.map((style: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center py-3">
                <span className="text-xs font-bold text-charcoal">{style.name}</span>
                <span className="text-xs font-black text-dusty-rose">{style.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
