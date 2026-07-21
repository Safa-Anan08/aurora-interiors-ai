"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MessageSquare, Eye, Trash2, Search, X, Bot, User as UserIcon } from 'lucide-react';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminChatHistoryManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [activeChat, setActiveChat] = useState<any | null>(null);

  // 1. Fetch conversations
  const { data, isLoading } = useQuery({
    queryKey: ['adminChats'],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/admin/chat`);
      return res.data;
    }
  });

  // 2. Delete conversation mutation
  const deleteChatMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${SERVER_URL}/api/admin/chat/${id}`);
    },
    onSuccess: () => {
      toast.success('Conversation record cleared.');
      queryClient.invalidateQueries({ queryKey: ['adminChats'] });
    },
    onError: () => toast.error('Failed to delete conversation.')
  });

  const rawChats = data?.chats || [];
  
  // Client-side filtering
  const chats = rawChats.filter((chat: any) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      chat.title.toLowerCase().includes(term) ||
      chat.user?.name?.toLowerCase().includes(term) ||
      chat.user?.email?.toLowerCase().includes(term)
    );
  });

  // Mock dialogue logs for active view
  const mockDialogues: Record<string, any[]> = {
    c1: [
      { role: 'assistant', content: "Welcome to your virtual interior design studio. Let's begin planning your space!\n\n**House or Apartment?**" },
      { role: 'user', content: 'Apartment' },
      { role: 'assistant', content: 'Great! What is the **total square feet** of the space we are designing?' },
      { role: 'user', content: '900 sq ft' },
      { role: 'assistant', content: 'Understood. How many **bedrooms** are in the layout?' },
      { role: 'user', content: '2 Bedrooms' }
    ],
    c2: [
      { role: 'assistant', content: "Welcome to your virtual interior design studio. Let's begin planning your space!\n\n**House or Apartment?**" },
      { role: 'user', content: 'House' },
      { role: 'assistant', content: 'Great! What is the **total square feet** of the space we are designing?' },
      { role: 'user', content: '2,500 sq ft' }
    ]
  };

  const getActiveDialogue = () => {
    if (!activeChat) return [];
    return mockDialogues[activeChat.id] || [
      { role: 'assistant', content: "Welcome to your virtual interior design studio. Let's begin planning your space!\n\n**House or Apartment?**" },
      { role: 'user', content: 'House' }
    ];
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-lavender-grey/30 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chat histories by title or user credentials..."
            className="w-full pl-10 pr-4 py-2 border border-lavender-grey/35 rounded-xl text-xs bg-white text-charcoal focus:outline-none focus:border-dusty-rose transition-all"
          />
        </div>
      </div>

      {/* Conversations Table */}
      <div className="glass-panel rounded-3xl bg-white border border-lavender-grey/30 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-slate-100/50 h-12 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-500 font-bold">No chat histories recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-lavender-grey/25 text-gray-400 font-bold uppercase tracking-wider bg-slate-50/50">
                  <th className="p-4">User</th>
                  <th className="p-4">Conversation Title</th>
                  <th className="p-4">Started At</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chats.map((chat: any) => (
                  <tr key={chat.id} className="border-b border-lavender-grey/20 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 min-w-[120px]">
                      <div className="font-bold text-charcoal">{chat.user.name}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{chat.user.email}</div>
                    </td>
                    <td className="p-4 font-bold text-charcoal">
                      {chat.title}
                    </td>
                    <td className="p-4 text-gray-405 font-medium">
                      {new Date(chat.startedAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-405 font-medium">
                      {new Date(chat.lastUpdated).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setActiveChat(chat)}
                          className="p-1.5 hover:text-dusty-rose hover:bg-lavender-grey/10 rounded-lg text-gray-400 transition-colors"
                          title="View Conversation"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteChatMutation.mutate(chat.id)}
                          className="p-1.5 hover:text-rose-500 hover:bg-rose-50 rounded-lg text-gray-400 transition-colors"
                          title="Delete Dialogue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Conversation viewer dialog modal */}
      {activeChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-sm p-4">
          <div className="bg-ivory border border-lavender-grey/30 w-full max-w-lg rounded-3xl p-6 shadow-xl relative overflow-y-auto max-h-[85vh] space-y-4">
            <div className="flex justify-between items-start border-b border-lavender-grey/20 pb-3">
              <div>
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">{activeChat.title}</h3>
                <p className="text-[9px] text-gray-400 font-medium">Customer: {activeChat.user.name} ({activeChat.user.email})</p>
              </div>
              <button
                onClick={() => setActiveChat(null)}
                className="p-1 hover:bg-lavender-grey/15 rounded-lg text-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation turns list */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              {getActiveDialogue().map((turn, i) => (
                <div key={i} className={`flex gap-2.5 max-w-[85%] ${turn.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                  <div className={`w-7.5 h-7.5 rounded-full flex-shrink-0 flex items-center justify-center border ${
                    turn.role === 'user' 
                      ? 'bg-lavender-grey/20 border-lavender-grey/30 text-charcoal' 
                      : 'bg-dusty-rose/10 border-dusty-rose/25 text-dusty-rose'
                  }`}>
                    {turn.role === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  
                  <div className={`rounded-2xl px-4 py-2.5 border text-xs leading-relaxed ${
                    turn.role === 'user'
                      ? 'bg-lavender-grey/15 border-lavender-grey/30 text-charcoal'
                      : 'bg-white border-lavender-grey/25 text-charcoal-light shadow-sm'
                  }`}>
                    <p className="whitespace-pre-line">{turn.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveChat(null)}
              className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow"
            >
              Close Conversation Log
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
