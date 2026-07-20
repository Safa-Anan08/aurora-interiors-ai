"use client";

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const faqs: FAQItem[] = [
    {
      question: "How does the AI Interior Designer (Aurora) work?",
      answer: "Instead of requesting a single design prompt, Aurora conducts a guided spatial consultation. Aurora analyzes your inputs (room dimensions, design style, target budget, family/pet constraints, colors) to build a unified design model. Once ready, Aurora synthesizes a custom Design Board with layout plans and matching furniture recommendations from our store."
    },
    {
      question: "Are the recommended products real and purchasable?",
      answer: "Yes! Unlike other design tools that generate fake placeholder furniture, every recommended item on our concept boards is tied to a real, high-quality product available in our Marketplace. You can inspect specs, click to add individual items, or buy the entire recommended design board bundle instantly."
    },
    {
      question: "How are payments handled securely?",
      answer: "All financial transactions are handled securely through Stripe. We support credit/debit cards and mobile payments. Card numbers are processed directly on Stripe's secure PCI-DSS servers, and are never stored on our database."
    },
    {
      question: "What is your delivery and shipping policy?",
      answer: "Products are dispatched directly from our regional distribution hubs. Delivery averages 3-5 business days for paint, lighting, and decor, and 7-14 business days for large furniture pieces. We provide tracking coordinates directly on your Orders dashboard tab."
    },
    {
      question: "What is the return policy for furniture and materials?",
      answer: "We offer a 30-day hassle-free return window for all standard marketplace products. Items must be in original packaging and unassembled. Wall paint canisters are eligible for returns only if they remain sealed."
    }
  ];

  // Accordion active state index mapping
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setActiveIndex(prev => prev === idx ? null : idx);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 space-y-10 w-full z-10">
        <section className="text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Frequently Asked Questions</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Everything you need to know about our AI engine, store orders, and shipping timelines.</p>
        </section>

        {/* Collapsible FAQ list */}
        <section className="space-y-4 pt-6">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx} 
                className="glass-panel rounded-2xl overflow-hidden bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-normal">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-white/[0.02]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
}
