"use client";

import React from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Heart, ShoppingCart, Star, Eye, Trash2, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

export interface Product {
  id: string;
  name: string;
  category: 'furniture' | 'lighting' | 'flooring' | 'paint' | 'decor';
  price: number;
  description: string;
  image: string;
  specs: Record<string, string>;
  rating: number;
  reviewsCount: number;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  layout?: 'grid' | 'list';
}

export default function ProductCard({ product, onViewDetails, layout = 'grid' }: ProductCardProps) {
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const cartItem = cart.find(c => c.id === product.id);
  const isInCart = !!cartItem;

  // Stock determination
  const stockCount = product.stock !== undefined ? product.stock : 50;
  const isOutOfStock = stockCount <= 0;
  const isLowStock = stockCount > 0 && stockCount <= 10;

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    if (isFavorited) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const handleCartToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    if (isOutOfStock) {
      toast.error('Sorry, this product is currently out of stock.');
      return;
    }

    if (isInCart) {
      await removeFromCart(product.id);
    } else {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      });
    }
  };

  const handleQuantityChange = async (e: React.MouseEvent, change: number) => {
    e.stopPropagation();
    if (!cartItem) return;
    const newQty = cartItem.quantity + change;
    if (newQty > stockCount) {
      toast.error(`Only ${stockCount} units available in stock.`);
      return;
    }
    await updateQuantity(product.id, newQty);
  };

  if (layout === 'list') {
    return (
      <div
        onClick={() => onViewDetails?.(product)}
        className="flex gap-4 p-4 bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <span className="text-[8px] text-violet-400 font-bold uppercase tracking-wider block capitalize">{product.category}</span>
            <h4 className="text-xs font-bold text-slate-950 dark:text-white truncate">{product.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-cyan-400">${product.price}</span>
              {isOutOfStock ? (
                <span className="text-[8px] font-bold text-rose-400 uppercase">Out of Stock</span>
              ) : isLowStock ? (
                <span className="text-[8px] font-bold text-amber-400 uppercase">Only {stockCount} left</span>
              ) : (
                <span className="text-[8px] text-gray-400 font-medium uppercase">In Stock</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isInCart && (
            <div className="flex items-center gap-1 bg-black/10 dark:bg-black/30 border border-slate-200 dark:border-white/5 p-1 rounded-xl">
              <button
                onClick={(e) => handleQuantityChange(e, -1)}
                className="w-5 h-5 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold px-1.5 text-slate-800 dark:text-white">{cartItem.quantity}</span>
              <button
                onClick={(e) => handleQuantityChange(e, 1)}
                className="w-5 h-5 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-xl border transition-all ${isFavorited
                ? 'border-[#C28285]/30 bg-[#C28285]/10 text-[#C28285]'
                : 'border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 text-gray-400 hover:text-white'
                }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleCartToggle}
              disabled={isOutOfStock && !isInCart}
              className={`p-2 rounded-xl border transition-all ${isInCart
                ? 'border-[#C28285]/30 bg-[#C28285]/10 text-grey-400'
                : 'border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 text-gray-400 hover:text-[#C28285] disabled:opacity-50'
                }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onViewDetails?.(product)}
      className="glass-panel rounded-2xl overflow-hidden flex flex-col cursor-pointer group shadow-lg border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/40 relative hover:shadow-xl transition-all"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full bg-black overflow-hidden border-b border-slate-200 dark:border-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Controls */}
        <div
          className="absolute inset-0 md:bg-black/40 flex items-start md:items-center justify-end md:justify-center p-3 md:p-0 gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-black/60 md:bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center text-white">
            <Eye className="w-4 h-4" />
          </div>

          <button
            onClick={handleWishlistToggle}
            className={`w-9 h-9 rounded-full border backdrop-blur flex items-center justify-center transition-colors ${isFavorited
              ? "border-[#C28285]/30 bg-[#C28285]/15 text-[#C28285]"
              : "border-white/20 bg-black/60 md:bg-white/10 text-white hover:text-[#C28285]"
              }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
          </button>
        </div>

        <span className="absolute top-3 left-3 text-[8px] font-bold uppercase tracking-wider bg-black/60 border border-white/10 backdrop-blur px-2.5 py-1 rounded-full text-violet-300">
          {product.category}
        </span>
      </div>

      {/* Product Details Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-white/80 dark:bg-slate-950/20">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors truncate flex-1">
              {product.name}
            </h4>
            <div className="flex items-center gap-1 text-amber-400 flex-shrink-0">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-bold">{product.rating}</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 leading-normal line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="border-t border-slate-200 dark:border-white/5 pt-2 mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-black text-cyan-400">
              ${product.price}
            </span>
            {isOutOfStock ? (
              <span className="text-[8px] font-bold text-rose-400 uppercase mt-0.5">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-[8px] font-bold text-amber-400 uppercase mt-0.5">Only {stockCount} left</span>
            ) : (
              <span className="text-[8px] text-gray-400 font-medium uppercase mt-0.5">In Stock</span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {isInCart && (
              <div className="flex items-center gap-1 bg-black/5 dark:bg-black/30 border border-slate-200 dark:border-white/5 p-0.5 rounded-lg">
                <button
                  onClick={(e) => handleQuantityChange(e, -1)}
                  className="w-4 h-4 rounded flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <span className="text-[10px] font-bold px-1 text-slate-800 dark:text-white">{cartItem.quantity}</span>
                <button
                  onClick={(e) => handleQuantityChange(e, 1)}
                  className="w-4 h-4 rounded flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
            )}

            <button
              onClick={handleCartToggle}
              disabled={isOutOfStock && !isInCart}
              className={`p-2 rounded-lg border transition-all flex items-center justify-center ${isInCart
                ? 'border-[#C28285]/30 bg-[#C28285]/10 text-grey-800'
                : 'border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 text-gray-400 hover:text-slate-950 disabled:opacity-50'
                }`}
              title={isInCart ? "Remove from Cart" : "Add to Cart"}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
