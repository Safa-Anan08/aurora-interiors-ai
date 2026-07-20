"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { ArrowLeft, ShoppingCart, Star, Heart, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ProductDetailsPage() {

  const { id } = useParams() as { id: string };
  const { cart, addToCart, removeFromCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);

  // 1. Fetch single product details from MongoDB
  const { data: product, isLoading, error, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/products/${id}`);
      return res.data.product;
    },
    enabled: !!id
  });

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          image: product.image,
          specs: product.specs || {},
          rating: product.rating || 5.0,
          reviewsCount: product.reviewsCount || 0
        });
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const isInCart = cart.some(item => item.id === product.id);

    if (isInCart) {
      await removeFromCart(product.id);

      return;
    }

    await addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      },
      quantity
    );


  };

  // Render Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250 animate-pulse">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto px-6 py-12 space-y-10 w-full z-10">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-6 aspect-square w-full rounded-2xl bg-slate-200 dark:bg-slate-800 border border-slate-100 dark:border-white/5" />
            <div className="md:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              </div>
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-24" />
              <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse" />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Render Product Not Found
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-6 py-24 text-center space-y-4">
          <h2 className="text-xl font-black">Product Not Found</h2>
          <p className="text-xs text-gray-550 dark:text-gray-400">The product you are looking for does not exist or has been removed from our catalog.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/products')}
              className="btn-primary py-2 px-6 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Go to Marketplace
            </button>
            <button
              onClick={() => refetch()}
              className="btn-secondary py-2 px-6 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-gray-100 transition-colors duration-250">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 space-y-10 w-full z-10">

        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold text-gray-550 hover:text-cyan-400 transition-colors border border-transparent bg-transparent cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </button>

        {/* Product Workspace */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* High-res Image on the Left */}
          <div className="md:col-span-6 relative aspect-square w-full rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-white/5 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Details on the Right */}
          <div className="md:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] text-violet-400 font-bold uppercase tracking-widest block capitalize">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-905 dark:text-white leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 text-amber-400 mt-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-xs font-semibold">{product.rating?.toFixed(1) || '5.0'}</span>
                <span className="text-[10px] text-gray-550 font-medium">({product.reviewsCount || 0} verified reviews)</span>
              </div>
            </div>

            <div className="text-2xl font-black text-cyan-400">
              ${product.price}
            </div>

            <p className="text-xs text-gray-505 dark:text-gray-400 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Specifications Details */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="border-t border-slate-200 dark:border-white/5 pt-4 space-y-2">
                <span className="text-[9px] text-gray-450 font-bold uppercase tracking-wider block">Product Specifications</span>
                <div className="grid grid-cols-1 gap-1.5 text-[11px] font-semibold text-gray-550 dark:text-gray-300">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-slate-200 dark:border-white/[0.02] py-1">
                      <span className="text-gray-450 dark:text-gray-400 font-medium">{key}</span>
                      <span className="text-slate-955 dark:text-white font-bold">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cart add section */}
            <div className="border-t border-slate-200 dark:border-white/5 pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-xl">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="text-gray-550 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white font-black text-xs w-4 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-black text-slate-800 dark:text-gray-200 w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="text-gray-550 hover:text-slate-955 dark:text-gray-400 dark:hover:text-white font-black text-xs w-4 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition ${cart.some(item => item.id === product.id)
                    ? "bg-red-100 text-red-600 border border-red-300"
                    : "btn-gradient text-gray-500"
                    }`}
                >
                  <ShoppingCart className="w-4.5 h-4.5" />

                  {cart.some(item => item.id === product.id)
                    ? "Remove from Cart"
                    : "Add to Cart"}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${isWishlisted
                    ? 'bg-rose-500/10 border-rose-500/35 text-rose-500 hover:bg-rose-500/20'
                    : 'bg-slate-100 dark:bg-black/40 border-slate-200 dark:border-white/5 hover:text-rose-500 text-gray-550 hover:bg-slate-200'
                    }`}
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-900 text-rose-500' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Free shipping available • 30-day return policies
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
