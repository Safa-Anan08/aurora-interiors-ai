"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>;
  addBundleToCart: (items: Omit<CartItem, 'quantity'>[]) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const SERVER_URL = 'http://localhost:5000';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Configure axios configuration to send credentials globally
  axios.defaults.withCredentials = true;

  // Load cart from MongoDB / localStorage
  useEffect(() => {
    const initCart = async () => {
      if (user) {
        setLoading(true);
        try {
          const stored = localStorage.getItem(`aurora_cart_${user.id}`);
          if (stored) {
            setCart(JSON.parse(stored));
          } else {
            setCart([]);
          }
        } catch (err) {
          console.error('Failed to parse namespaced user cart from localStorage:', err);
        }

        try {
          const res = await axios.get(`${SERVER_URL}/api/cart`);
          if (res.data.success && res.data.cart) {
            const mapped = res.data.cart.items.map((item: any) => ({
              id: item.product._id || item.product.id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.image,
              category: item.product.category,
              quantity: item.quantity
            }));
            setCart(mapped);
            localStorage.setItem(`aurora_cart_${user.id}`, JSON.stringify(mapped));
          }
        } catch (err) {
          console.error('Failed to retrieve cart from database:', err);
        } finally {
          setLoading(false);
        }
      } else {
        // Guests/non-logged-in users have no cart. Clear state and remove legacy/guest local storage keys.
        setCart([]);
        localStorage.removeItem('aurora_cart');
      }
      setInitialized(true);
    };

    initCart();
  }, [user]);

  // Save cart to localStorage (authenticated users only)
  useEffect(() => {
    if (initialized && user) {
      localStorage.setItem(`aurora_cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, initialized, user]);

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${SERVER_URL}/api/cart`);
      if (res.data.success && res.data.cart) {
        const mapped = res.data.cart.items.map((item: any) => ({
          id: item.product._id || item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          category: item.product.category,
          quantity: item.quantity
        }));
        setCart(mapped);
        localStorage.setItem(`aurora_cart_${user.id}`, JSON.stringify(mapped));
      }
    } catch (err) {
      console.error('Failed to refetch cart', err);
    }
  };

  const addToCart = async (newItem: Omit<CartItem, 'quantity'>, quantity = 1) => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.post(`${SERVER_URL}/api/cart`, { productId: newItem.id, quantity });
      if (res.data.success) {
        const mapped = res.data.cart.items.map((item: any) => ({
          id: item.product._id || item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          category: item.product.category,
          quantity: item.quantity
        }));
        setCart(mapped);
        localStorage.setItem(`aurora_cart_${user.id}`, JSON.stringify(mapped));
        toast.success(`${newItem.name} added to cart!`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to add to cart.');
    } finally {
      setLoading(false);
    }
  };

  const addBundleToCart = async (items: Omit<CartItem, 'quantity'>[]) => {
    if (!user) return;
    setLoading(true);
    try {
      for (const item of items) {
        await axios.post(`${SERVER_URL}/api/cart`, { productId: item.id, quantity: 1 });
      }
      await fetchCart();
      toast.success('Shopping bundle added to cart!');
    } catch (err: any) {
      toast.error('Failed to add bundle to cart.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id: string) => {
    if (!user) return;
    const item = cart.find(i => i.id === id);
    const itemName = item ? item.name : 'Product';

    setLoading(true);
    try {
      const res = await axios.delete(`${SERVER_URL}/api/cart/${id}`);
      if (res.data.success) {
        const mapped = res.data.cart.items.map((item: any) => ({
          id: item.product._id || item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          category: item.product.category,
          quantity: item.quantity
        }));
        setCart(mapped);
        localStorage.setItem(`aurora_cart_${user.id}`, JSON.stringify(mapped));
        toast.success(`${itemName} removed from cart.`);
      }
    } catch (err: any) {
      toast.error('Failed to remove item from cart.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(`${SERVER_URL}/api/cart`, { productId: id, quantity });
      if (res.data.success) {
        const mapped = res.data.cart.items.map((item: any) => ({
          id: item.product._id || item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          category: item.product.category,
          quantity: item.quantity
        }));
        setCart(mapped);
        localStorage.setItem(`aurora_cart_${user.id}`, JSON.stringify(mapped));
      }
    } catch (err: any) {
      toast.error('Failed to update quantity.');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.delete(`${SERVER_URL}/api/cart`);
      if (res.data.success) {
        setCart([]);
        localStorage.setItem(`aurora_cart_${user.id}`, JSON.stringify([]));
      }
    } catch (err: any) {
      toast.error('Failed to clear cart.');
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      addBundleToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      loading,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
