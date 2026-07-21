"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, AreaChart, Area 
} from 'recharts';
import { DollarSign, Percent, TrendingUp, ShoppingBag, Award } from 'lucide-react';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminSalesAnalytics() {
  const { data: res, isLoading } = useQuery({
    queryKey: ['adminSalesAnalytics'],
    queryFn: async () => {
      const response = await axios.get(`${SERVER_URL}/api/admin/analytics/sales`);
      return response.data.data;
    }
  });

  if (isLoading) {
    return <div className="text-center py-12 text-xs font-bold text-gray-500 animate-pulse">Computing Sales Sheets...</div>;
  }

  const s = res || {
    dailySales: 450,
    weeklySales: 3120,
    monthlySales: 12890,
    yearlySales: 154800,
    averageOrderValue: 286,
    conversionRate: 3.42,
    bestSellers: [],
    bestSellingCategories: []
  };

  const salesCards = [
    { title: "Daily Sales", val: `$${s.dailySales.toLocaleString()}`, change: "+12.4%", icon: <DollarSign className="w-4 h-4 text-dusty-rose" /> },
    { title: "Weekly Sales", val: `$${s.weeklySales.toLocaleString()}`, change: "+8.2%", icon: <DollarSign className="w-4 h-4 text-dusty-rose" /> },
    { title: "Monthly Sales", val: `$${s.monthlySales.toLocaleString()}`, change: "+15.9%", icon: <DollarSign className="w-4 h-4 text-dusty-rose" /> },
    { title: "Yearly Sales", val: `$${s.yearlySales.toLocaleString()}`, change: "+24.1%", icon: <DollarSign className="w-4 h-4 text-dusty-rose" /> }
  ];

  const trendData = [
    { name: 'Monday', revenue: 2400 },
    { name: 'Tuesday', revenue: 1398 },
    { name: 'Wednesday', revenue: 9800 },
    { name: 'Thursday', revenue: 3908 },
    { name: 'Friday', revenue: 4800 },
    { name: 'Saturday', revenue: 3800 },
    { name: 'Sunday', revenue: 4300 }
  ];

  return (
    <div className="space-y-8">
      
      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesCards.map((card, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{card.title}</span>
              <h3 className="text-xl font-extrabold text-charcoal leading-none">{card.val}</h3>
              <span className="text-[9px] text-emerald-500 font-bold block mt-1">{card.change} from last period</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-dusty-rose/10 flex items-center justify-center">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Charts + tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Trends */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider border-b border-lavender-grey/25 pb-2">Revenue Trends (Weekly)</h3>
          <div className="h-[240px] w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <XAxis dataKey="name" stroke="#7E7885" />
                <YAxis stroke="#7E7885" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#B07575" fill="#D4A5A5" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPIs */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-5">
          <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider border-b border-lavender-grey/25 pb-2">Conversion Metrics</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-lavender-grey/20 rounded-2xl flex items-center gap-3">
              <Percent className="w-5 h-5 text-dusty-rose" />
              <div>
                <span className="text-[9px] text-gray-400 font-bold block">CONVERSION RATE</span>
                <p className="text-sm font-black text-charcoal">{s.conversionRate}%</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-lavender-grey/20 rounded-2xl flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-dusty-rose" />
              <div>
                <span className="text-[9px] text-gray-400 font-bold block">AVERAGE ORDER SIZE</span>
                <p className="text-sm font-black text-charcoal">${s.averageOrderValue}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Row: Best Sellers lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Best Selling Products */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 border-b border-lavender-grey/25 pb-2">
            <Award className="w-4.5 h-4.5 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Best Selling Products</h3>
          </div>
          <div className="divide-y divide-lavender-grey/20">
            {s.bestSellers.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center py-3">
                <div>
                  <span className="text-xs font-bold text-charcoal block">{item.name}</span>
                  <span className="text-[9px] text-gray-400 font-medium">{item.count} items shipped</span>
                </div>
                <span className="text-xs font-black text-dusty-rose">${item.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category distribution */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 border-b border-lavender-grey/25 pb-2">
            <ShoppingBag className="w-4.5 h-4.5 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Sales by Room Categories</h3>
          </div>
          <div className="divide-y divide-lavender-grey/20">
            {s.bestSellingCategories.map((cat: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center py-3">
                <span className="text-xs font-bold text-charcoal">{cat.name}</span>
                <span className="text-xs font-black text-dusty-rose">{cat.value}% shares</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
