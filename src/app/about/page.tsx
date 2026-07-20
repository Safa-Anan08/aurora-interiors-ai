"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Shield, Sparkles, Star, Users } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      title: "Generative Precision",
      desc: "We continuously refine our Generative AI pipelines to map raw spatial specifications to balanced, gorgeous interior concept renders."
    },
    {
      icon: <Users className="w-5 h-5 text-violet-400" />,
      title: "Human Design Curation",
      desc: "Our platform blends AI speed with hand-curated marketplace product catalog lines selected by professional decorators."
    },
    {
      icon: <Shield className="w-5 h-5 text-cyan-400" />,
      title: "Production Fidelity",
      desc: "No fake placeholders. Every product, paint family, and tile shown in recommended boards is an authentic product available for purchase."
    }
  ];

  const team = [
    { name: 'Marcus Sterling', role: 'Chief Architect & Design Lead', bio: 'Former architectural consultant with 15+ years in modern residential development.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    { name: 'Dr. Clara Thorne', role: 'AI Spatial Systems Engineer', bio: 'PhD in generative neural layout models. Pioneered our spatial parsing consultation engines.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    { name: 'Devon Keats', role: 'Marketplace Curation Lead', bio: 'Expert merchandiser focused on sourcing sustainable, premium furniture and fixtures.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 space-y-16 w-full z-10">
        {/* Header summary */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            Our Mission Node
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Bridging AI Imagination with Real Spatial Renders
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Founded in 2026, Aurora Interiors AI is dedicated to eliminating the friction of residential planning. By replacing arbitrary inspiration boards with an active, stateful AI Designer Agent linked to an authentic marketplace, we help homeowners design, budget, and buy their dream spaces effortlessly.
          </p>
        </section>

        {/* Corporate values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {values.map((val, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl space-y-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center justify-center">
                {val.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">{val.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                {val.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Team profiles */}
        <section className="space-y-8 pt-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold tracking-wide">The Creative Minds</h2>
            <p className="text-xs text-gray-500">The architects, developers, and designers constructing our workspace engine.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="glass-panel rounded-2xl overflow-hidden bg-white dark:bg-slate-900/60 p-5 space-y-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-500/20 bg-black mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-xs font-bold text-slate-950 dark:text-white">{member.name}</h3>
                  <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider">{member.role}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium text-center">
                  "{member.bio}"
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
