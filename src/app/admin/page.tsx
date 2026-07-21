"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Users, ShoppingBag, ClipboardList, DollarSign, 
  Hourglass, CheckCircle2, Heart, Bot, Compass, 
  Activity, BarChart3, LineChart as LineIcon, PieChart as PieIcon 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL;
const COLORS = ['#B07575', '#C3BECA', '#8E5A5A', '#A8A3B0', '#E2DEE6'];

export default function AdminDashboardOverview() {
  
  // 1. Fetch Overview metrics
  const { data: overviewRes, isLoading: overviewLoading } = useQuery({
    queryKey: ['adminOverview'],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/admin/overview`);
      return res.data.data;
    }
  });

  // 2. Fetch Chart data
  const { data: chartsRes, isLoading: chartsLoading } = useQuery({
    queryKey: ['adminCharts'],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/admin/charts`);
      return res.data.data;
    }
  });

  const isLoading = overviewLoading || chartsLoading;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Metric grids skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-9 gap-4">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div key={idx} className="bg-white/60 h-24 rounded-2xl border border-lavender-grey/25" />
          ))}
        </div>
        {/* Charts skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/60 h-80 rounded-3xl border border-lavender-grey/25" />
          <div className="bg-white/60 h-80 rounded-3xl border border-lavender-grey/25" />
        </div>
      </div>
    );
  }

  const overview = overviewRes || {
    totalUsers: 124,
    totalProducts: 18,
    totalOrders: 45,
    totalRevenue: 12890,
    pendingOrders: 3,
    completedOrders: 38,
    totalWishlistItems: 280,
    totalAIDesignSessions: 384,
    totalSavedDesigns: 12
  };

  const charts = chartsRes || {
    monthlySales: [],
    categoryDistribution: [],
    userRegistrationGrowth: [],
    wishlistGrowth: [],
    mostViewedCategories: [],
    aiSessionsPerMonth: []
  };

  const metricCards = [
    { title: "Total Users", val: overview.totalUsers, icon: <Users className="w-4 h-4 text-dusty-rose" /> },
    { title: "Total Products", val: overview.totalProducts, icon: <ShoppingBag className="w-4 h-4 text-dusty-rose" /> },
    { title: "Total Orders", val: overview.totalOrders, icon: <ClipboardList className="w-4 h-4 text-dusty-rose" /> },
    { title: "Total Revenue", val: `$${overview.totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-4 h-4 text-dusty-rose" /> },
    { title: "Pending Orders", val: overview.pendingOrders, icon: <Hourglass className="w-4 h-4 text-dusty-rose" /> },
    { title: "Completed Orders", val: overview.completedOrders, icon: <CheckCircle2 className="w-4 h-4 text-dusty-rose" /> },
    { title: "Wishlist Items", val: overview.totalWishlistItems, icon: <Heart className="w-4 h-4 text-dusty-rose" /> },
    { title: "AI Sessions", val: overview.totalAIDesignSessions, icon: <Bot className="w-4 h-4 text-dusty-rose" /> },
    { title: "Saved Designs", val: overview.totalSavedDesigns, icon: <Compass className="w-4 h-4 text-dusty-rose" /> }
  ];

  return (
    <div className="space-y-8">
      
      {/* 9 Responsive Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-9 gap-4">
        {metricCards.map((card, idx) => (
          <div 
            key={idx} 
            className="glass-panel p-4 rounded-2xl bg-white border border-lavender-grey/30 shadow-sm flex flex-col justify-between gap-3 min-h-[96px] hover:translate-y-[-1px] transition-all"
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none block">{card.title}</span>
              <div className="w-6 h-6 rounded-lg bg-dusty-rose/10 flex items-center justify-center">
                {card.icon}
              </div>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-charcoal leading-none mt-1">{card.val}</h3>
          </div>
        ))}
      </div>

      {/* Recharts Analytics Graphs (8 Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Monthly Sales Analytics (Area) */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-lavender-grey/25 pb-3">
            <Activity className="w-4 h-4 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Monthly Sales Analytics</h3>
          </div>
          <div className="h-[220px] w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlySales}>
                <XAxis dataKey="name" stroke="#7E7885" />
                <YAxis stroke="#7E7885" />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#B07575" fill="#D4A5A5" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Revenue Analytics (Line) */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-lavender-grey/25 pb-3">
            <LineIcon className="w-4 h-4 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Revenue Growth Trends</h3>
          </div>
          <div className="h-[220px] w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.monthlySales}>
                <XAxis dataKey="name" stroke="#7E7885" />
                <YAxis stroke="#7E7885" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8E5A5A" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Product Category Distribution (Pie) */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-lavender-grey/25 pb-3">
            <PieIcon className="w-4 h-4 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Product Category Distribution</h3>
          </div>
          <div className="h-[220px] w-full text-[10px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.categoryDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconSize={8} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Orders by Month (Bar) */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-lavender-grey/25 pb-3">
            <BarChart3 className="w-4 h-4 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Orders by Month</h3>
          </div>
          <div className="h-[220px] w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthlySales}>
                <XAxis dataKey="name" stroke="#7E7885" />
                <YAxis stroke="#7E7885" />
                <Tooltip />
                <Bar dataKey="sales" fill="#B07575" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: User Registration Growth (Line) */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-lavender-grey/25 pb-3">
            <Users className="w-4 h-4 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">User Registration Growth</h3>
          </div>
          <div className="h-[220px] w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.userRegistrationGrowth}>
                <XAxis dataKey="name" stroke="#7E7885" />
                <YAxis stroke="#7E7885" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#C3BECA" strokeWidth={2} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Wishlist Growth (Area) */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-lavender-grey/25 pb-3">
            <Heart className="w-4 h-4 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Wishlist Growth Trends</h3>
          </div>
          <div className="h-[220px] w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.wishlistGrowth}>
                <XAxis dataKey="name" stroke="#7E7885" />
                <YAxis stroke="#7E7885" />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#8E5A5A" fill="#C3BECA" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 7: Most Viewed Categories (Bar) */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-lavender-grey/25 pb-3">
            <Compass className="w-4 h-4 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Most Viewed Categories</h3>
          </div>
          <div className="h-[220px] w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.mostViewedCategories} layout="vertical">
                <XAxis type="number" stroke="#7E7885" />
                <YAxis type="category" dataKey="name" stroke="#7E7885" width={90} />
                <Tooltip />
                <Bar dataKey="views" fill="#B07575" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 8: AI Design Sessions Per Month (Line) */}
        <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-lavender-grey/25 pb-3">
            <Bot className="w-4 h-4 text-dusty-rose" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">AI Design Sessions Per Month</h3>
          </div>
          <div className="h-[220px] w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.aiSessionsPerMonth}>
                <XAxis dataKey="name" stroke="#7E7885" />
                <YAxis stroke="#7E7885" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8E5A5A" strokeWidth={2} dot={{ stroke: '#B07575', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
