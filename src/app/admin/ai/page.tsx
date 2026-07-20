"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Bot, MessageSquare, Clipboard, Layers, Sparkles } from 'lucide-react';

const SERVER_URL = 'http://localhost:5000';

export default function AdminAIAnalytics() {
  const { data: res, isLoading } = useQuery({
    queryKey: ['adminAIAnalytics'],
    queryFn: async () => {
      const response = await axios.get(`${SERVER_URL}/api/admin/analytics/ai`);
      return response.data.data;
    }
  });

  if (isLoading) {
    return <div className="text-center py-12 text-xs font-bold text-gray-500 animate-pulse">Processing Agent Reasoning Audits...</div>;
  }

  const ai = res || {
    totalConversations: 384,
    averageConversationLength: '12 turns',
    mostSelectedStyle: 'Japandi',
    mostSelectedBudget: '$15,000',
    mostRecommendedProducts: [],
    mostGeneratedReports: 240
  };

  const aiCards = [
    { title: "AI Conversations", val: ai.totalConversations, desc: "Active dialog pipelines", icon: <MessageSquare className="w-4.5 h-4.5 text-dusty-rose" /> },
    { title: "Average Length", val: ai.averageConversationLength, desc: "Turns per spatial profiling", icon: <Bot className="w-4.5 h-4.5 text-dusty-rose" /> },
    { title: "Style Preferred", val: ai.mostSelectedStyle, desc: "Popular aesthetic choice", icon: <Layers className="w-4.5 h-4.5 text-dusty-rose" /> },
    { title: "PDF Reports", val: ai.mostGeneratedReports, desc: "Client synthesis blueprints", icon: <Clipboard className="w-4.5 h-4.5 text-dusty-rose" /> }
  ];

  return (
    <div className="space-y-8">
      
      {/* Cards list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiCards.map((card, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{card.title}</span>
              <h3 className="text-lg font-black text-charcoal leading-none">{card.val}</h3>
              <span className="text-[9px] text-gray-450 block font-medium mt-1">{card.desc}</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-dusty-rose/10 flex items-center justify-center">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Recommended items by Agent */}
      <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 shadow-sm max-w-2xl space-y-4">
        <div className="flex items-center gap-1.5 border-b border-lavender-grey/25 pb-2">
          <Sparkles className="w-4.5 h-4.5 text-dusty-rose" />
          <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Top Recommended Products (AI Agent)</h3>
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Product assets recommended most frequently by the Aurora interior planner based on client styling constraints and budgets.
        </p>

        <div className="divide-y divide-lavender-grey/20 pt-2">
          {ai.mostRecommendedProducts.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center py-3">
              <span className="text-xs font-bold text-charcoal">{item.name}</span>
              <span className="text-xs font-black text-dusty-rose">{item.recommendations} recommendations</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
