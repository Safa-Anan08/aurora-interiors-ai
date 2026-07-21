"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useCart } from '../../../context/CartContext';
import { Compass, ShoppingCart, ArrowLeft, CheckCircle2, Star, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function DesignDetailsPage() {
  const { id } = useParams() as { id: string };
  const { addToCart, addBundleToCart } = useCart();
  const router = useRouter();

  // 1. Fetch design details from MongoDB public API
  const { data: design, isLoading: designLoading, error: designError } = useQuery({
    queryKey: ['design', id],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/designs/${id}`);
      return res.data.design;
    },
    enabled: !!id
  });

  // 2. Fetch marketplace products catalog from MongoDB to resolve recommendations
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['marketplaceProducts'],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/marketplace/products`, {
        params: { limit: 100 }
      });
      return res.data.data ?? res.data;
    }
  });

  // Render Skeleton Loading
  if (designLoading || productsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250 animate-pulse">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto px-6 py-12 space-y-10 w-full z-10">
          <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-28" />
          <div className="h-64 bg-slate-250 dark:bg-slate-850 rounded-3xl w-full" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="h-5 bg-slate-200 dark:bg-slate-850 rounded w-1/3" />
                <div className="h-20 bg-slate-200 dark:bg-slate-850 rounded-2xl w-full" />
              </div>
            </div>
            <div className="md:col-span-5 space-y-6">
              <div className="h-32 bg-slate-200 dark:bg-slate-850 rounded-2xl w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render Design Not Found / Error
  if (designError || !design) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-6 py-24 text-center space-y-4">
          <h2 className="text-xl font-black">Design Concept Not Found</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">The design board you are trying to view does not exist or has been archived.</p>
          <button
            onClick={() => router.push('/designs')}
            className="btn-primary py-2 px-6 rounded-xl text-xs font-bold uppercase tracking-wider mx-auto"
          >
            Back to Explore Concepts
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // Filter and map matched products based on design's recommended IDs (which are populated from MongoDB)
  const availableProducts = Array.isArray(products) ? products : [];
  const matchingProducts = Array.isArray(design.recommendedProductIds)
    ? design.recommendedProductIds.map((p: any) => {
        if (typeof p === 'object' && p !== null) {
          return {
            id: p._id || p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            image: p.image,
            description: p.description,
            specs: p.specs instanceof Map ? Object.fromEntries(p.specs) : p.specs || {},
            rating: p.rating,
            reviewsCount: p.reviewsCount
          };
        } else {
          const found = availableProducts.find((item: any) => (item.id || item._id) === p);
          return found || null;
        }
      }).filter(Boolean)
    : [];

  const handleAddProduct = (e: React.MouseEvent, p: any) => {
    e.stopPropagation();
    addToCart({
      id: p.id || p._id,
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category
    });
    toast.success(`${p.name} added to cart!`);
  };

  const handleAddBundle = () => {
    const formatted = matchingProducts.map((p: any) => ({
      id: p.id || p._id,
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category
    }));
    addBundleToCart(formatted);
    toast.success('🛍️ Complete design board bundle added to cart!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 space-y-10 w-full z-10">
        
        {/* Navigation link back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-cyan-400 transition-colors border border-transparent bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Concepts
        </button>

        {/* Hero Section */}
        <section className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative">
          <div className="relative aspect-[16/7] w-full bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={design.img} alt={design.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-end p-6">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-cyan-500/25 border border-cyan-400/25 px-2.5 py-1 rounded text-cyan-300">
                  Concept Board
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white mt-2">{design.title}</h1>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Description */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Layout specifications */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-3">
              <h2 className="text-lg font-bold">Concept Overview</h2>
              <p className="text-xs text-gray-550 dark:text-gray-400 leading-relaxed font-medium">
                {design.desc}
              </p>
            </div>

            {design.layoutSteps && design.layoutSteps.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Layout Execution Guide</h3>
                <div className="bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 p-5 rounded-2xl space-y-3.5">
                  {design.layoutSteps.map((step: string, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start text-xs text-gray-500 dark:text-gray-300 leading-normal">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Swatches & Products checklist */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Swatch color picker */}
            {design.colors && design.colors.length > 0 && (
              <div className="glass-panel p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Selected Color Swatches</h3>
                <div className="flex flex-col gap-3">
                  {design.colors.map((col: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-xl border border-white/10 shadow" 
                        style={{ backgroundColor: col.hex }} 
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{col.name}</p>
                        <p className="text-[10px] text-gray-550 mt-1 font-mono">{col.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Bundle button */}
            {matchingProducts.length > 0 && (
              <button
                onClick={handleAddBundle}
                className="btn-gradient w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-lg border border-transparent cursor-pointer"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                Add Concept Bundle to Cart (${matchingProducts.reduce((acc: number, p: any) => acc + p.price, 0).toLocaleString()})
              </button>
            )}
          </div>
        </section>

        {/* Product Cards Row */}
        {matchingProducts.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-wider">Marketplace Products in this Concept</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {matchingProducts.map((prod: any) => (
                <div 
                  key={prod.id || prod._id} 
                  onClick={() => router.push(`/products/${prod.id || prod._id}`)}
                  className="glass-panel bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col justify-between gap-4 cursor-pointer group"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black border border-slate-100 dark:border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold text-slate-900 dark:text-white truncate group-hover:text-cyan-400 transition-colors">
                      {prod.name}
                    </h4>
                    <p className="text-xs font-black text-cyan-400 mt-0.5">${prod.price}</p>
                  </div>

                  <button
                    onClick={(e) => handleAddProduct(e, prod)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.02] dark:hover:bg-white/5 text-[10px] font-bold text-slate-800 dark:text-gray-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-white/5 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
