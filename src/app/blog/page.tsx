"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  img: string;
}

export default function BlogPage() {
  const posts: BlogPost[] = [
    {
      title: "Mastering the Art of Japandi Space Layouts",
      excerpt: "Learn how to blend the cozy warmth of Scandinavian textures with the sleek, grounded minimalism of Japanese wabi-sabi details.",
      category: "Aesthetic Styles",
      date: "Jul 12, 2026",
      author: "Marcus Sterling",
      readTime: "5 min read",
      img: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "How to Choose Wall Paints for Low-Light Rooms",
      excerpt: "Struggling with a dark space? Discover why warm undertone whites (like Alabaster) beat sterile gray palettes for bouncing natural lighting.",
      category: "Color Theory",
      date: "Jun 28, 2026",
      author: "Devon Keats",
      readTime: "4 min read",
      img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Layering Lights: The Hidden Interior Design Rule",
      excerpt: "Ambient, task, and accent. Understand the three layers of light fixtures needed to make any room shift from day task to evening relaxation.",
      category: "Lighting Guides",
      date: "Jun 15, 2026",
      author: "Clara Thorne",
      readTime: "6 min read",
      img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 space-y-10 w-full z-10">
        <section className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            Studio Chronicles
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Design & Styling Blog</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Expert articles from our lead design architects outlining color selections, layout sizing, and material guides.</p>
        </section>

        {/* Blog grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          {posts.map((post, idx) => (
            <div key={idx} className="glass-panel rounded-2xl overflow-hidden flex flex-col bg-white dark:bg-slate-900/60 shadow-lg group">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black border-b border-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 text-[8px] font-bold uppercase tracking-wider bg-black/60 border border-white/10 backdrop-blur px-2.5 py-1 rounded-full text-violet-300">
                  {post.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[10px] text-gray-550 dark:text-gray-450 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-white/5 pt-3 mt-auto flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[9px] text-gray-500 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                  <button 
                    onClick={() => alert(`Opening article: "${post.title}" (Read mode placeholder)`)}
                    className="text-[9px] text-cyan-400 group-hover:text-cyan-300 font-bold uppercase tracking-widest flex items-center gap-1 text-left mt-1"
                  >
                    Read Article
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
