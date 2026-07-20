"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
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
}

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const SERVER_URL = 'http://localhost:5000';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Configure axios configuration to send credentials globally
  axios.defaults.withCredentials = true;

  // Load wishlist on mount / user change
  useEffect(() => {
    const initWishlist = async () => {
      if (user) {
        setLoading(true);
        try {
          const res = await axios.get(`${SERVER_URL}/api/wishlist`);
          if (res.data.success && res.data.wishlist) {
            const mapped = res.data.wishlist.products.map((p: any) => ({
              id: p._id || p.id,
              name: p.name,
              category: p.category,
              price: p.price,
              description: p.description,
              image: p.image,
              specs: p.specs instanceof Map ? Object.fromEntries(p.specs) : p.specs || {},
              rating: p.rating,
              reviewsCount: p.reviewsCount
            }));
            setWishlist(mapped);
          }
        } catch (err) {
          console.error('Failed to fetch wishlist from MongoDB', err);
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback to localStorage if guest
        try {
          const stored = localStorage.getItem('aurora_wishlist');
          if (stored) {
            setWishlist(JSON.parse(stored));
          } else {
            setWishlist([]);
          }
        } catch (err) {
          console.error('Failed to parse localStorage wishlist', err);
        }
      }
      setInitialized(true);
    };

    initWishlist();
  }, [user]);

  // Save guest wishlist to localStorage
  useEffect(() => {
    if (initialized && !user) {
      localStorage.setItem('aurora_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, initialized, user]);

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${SERVER_URL}/api/wishlist`);
      if (res.data.success && res.data.wishlist) {
        const mapped = res.data.wishlist.products.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          description: p.description,
          image: p.image,
          specs: p.specs instanceof Map ? Object.fromEntries(p.specs) : p.specs || {},
          rating: p.rating,
          reviewsCount: p.reviewsCount
        }));
        setWishlist(mapped);
      }
    } catch (err) {
      console.error('Failed to refetch wishlist', err);
    }
  };

  const addToWishlist = async (product: Product) => {
    if (wishlist.some(p => p.id === product.id)) {
      toast.error('Product is already in wishlist.');
      return;
    }

    setLoading(true);
    try {
      if (user) {
        // Sync to Mongo
        const res = await axios.post(`${SERVER_URL}/api/wishlist`, { productId: product.id });
        if (res.data.success) {
          const mapped = res.data.wishlist.products.map((p: any) => ({
            id: p._id || p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            description: p.description,
            image: p.image,
            specs: p.specs instanceof Map ? Object.fromEntries(p.specs) : p.specs || {},
            rating: p.rating,
            reviewsCount: p.reviewsCount
          }));
          setWishlist(mapped);
          toast.success(`${product.name} saved to wishlist!`);
        }
      } else {
        // Local state
        setWishlist(prev => [...prev, product]);
        toast.success(`${product.name} saved to wishlist!`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to save to wishlist.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const product = wishlist.find(p => p.id === productId);
    const prodName = product ? product.name : 'Product';

    setLoading(true);
    try {
      if (user) {
        // Remove from Mongo
        const res = await axios.delete(`${SERVER_URL}/api/wishlist/${productId}`);
        if (res.data.success) {
          const mapped = res.data.wishlist.products.map((p: any) => ({
            id: p._id || p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            description: p.description,
            image: p.image,
            specs: p.specs instanceof Map ? Object.fromEntries(p.specs) : p.specs || {},
            rating: p.rating,
            reviewsCount: p.reviewsCount
          }));
          setWishlist(mapped);
          toast.success(`${prodName} removed from wishlist.`);
        }
      } else {
        // Local state
        setWishlist(prev => prev.filter(p => p.id !== productId));
        toast.success(`${prodName} removed from wishlist.`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to remove from wishlist.');
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      loading,
      fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
