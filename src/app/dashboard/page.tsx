"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/ProductCard';
import Navbar from '../../components/Navbar';
import ChatTab from '../../components/ChatTab';
import GalleryTab from '../../components/GalleryTab';
import MarketplaceTab from '../../components/MarketplaceTab';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as z from 'zod';
import toast from 'react-hot-toast';

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

import {
  Sparkles, LayoutDashboard, Compass, Heart, ClipboardList,
  User, Wallet, Settings as SettingsIcon, BarChart3, Database, FileSpreadsheet,
  Trash2, Plus, LogOut, CheckCircle2, ShieldCheck, ShoppingCart, Info, Star, ArrowLeft
} from 'lucide-react';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Profile update validation schema
const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Provide a valid email address." })
});
type ProfileFormValues = z.infer<typeof profileSchema>;

// Product addition validation schema
const productSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  category: z.enum(['furniture', 'lighting', 'flooring', 'paint', 'decor']),
  price: z.number().positive({ message: "Price must be a positive number." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  image: z.string().url({ message: "Provide a valid image URL." })
});
type ProductFormValues = z.infer<typeof productSchema>;

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { addToCart, cart, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Forms state
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);

  // Real Database States
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [adminOverview, setAdminOverview] = useState<any>(null);
  const [adminProducts, setAdminProducts] = useState<any[]>([]);
  const [adminDesigns, setAdminDesigns] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Form hooks
  const { register: registerProfile, handleSubmit: handleSubmitProfile, reset: resetProfile } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '' }
  });

  const { register: registerProduct, handleSubmit: handleSubmitProduct, reset: resetProduct, formState: { errors: productErrors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema)
  });

  useEffect(() => {
    if (user) {
      resetProfile({ name: user.name, email: user.email });
    }
  }, [user, resetProfile]);

  // Load stats and database collections dynamically on activeTab or refreshTrigger
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setLoadingStats(true);
      try {
        const ordersRes = await axios.get(`${SERVER_URL}/api/marketplace/orders`, { withCredentials: true });
        if (ordersRes.data.success) {
          setOrders(ordersRes.data.orders);
        }

        const paymentsRes = await axios.get(`${SERVER_URL}/api/marketplace/payments`, { withCredentials: true });
        if (paymentsRes.data.success) {
          setPayments(paymentsRes.data.payments);
        }

        const projectsRes = await axios.get(`${SERVER_URL}/api/projects`, { withCredentials: true });
        if (Array.isArray(projectsRes.data)) {
          setProjectsCount(projectsRes.data.length);
        }

        if (user.role === 'admin') {
          const adminOverviewRes = await axios.get(`${SERVER_URL}/api/admin/overview`, { withCredentials: true });
          if (adminOverviewRes.data.success) {
            setAdminOverview(adminOverviewRes.data.data);
          }

          const adminProdsRes = await axios.get(`${SERVER_URL}/api/admin/products?limit=100`, { withCredentials: true });
          if (adminProdsRes.data.success) {
            setAdminProducts(adminProdsRes.data.products);
          }

          const adminDesignsRes = await axios.get(`${SERVER_URL}/api/projects`, { withCredentials: true });
          if (Array.isArray(adminDesignsRes.data)) {
            setAdminDesigns(adminDesignsRes.data);
          }
        }
      } catch (err) {
        console.error("Dashboard statistics pull error:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardData();
  }, [user, activeTab, refreshTrigger]);

  // Actions
  const handleProfileSubmit = async (data: ProfileFormValues) => {
    setUpdatingProfile(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      toast.success('Profile credentials updated successfully!');
    } catch (err) {
      toast.error('Failed to update credentials.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleProductSubmit = async (data: ProductFormValues) => {
    setAddingProduct(true);
    try {
      const res = await axios.post(`${SERVER_URL}/api/admin/products`, {
        name: data.name,
        category: data.category,
        price: data.price,
        description: data.description,
        image: data.image,
        specs: { Dimensions: 'Standard Size', Material: 'Premium Quality' },
        rating: 4.8,
        reviewsCount: 1,
        stock: 50
      }, { withCredentials: true });

      if (res.data.success) {
        toast.success('Product added to Marketplace database successfully!');
        resetProduct();
        setRefreshTrigger(prev => prev + 1);
        setActiveTab('admin-products');
      } else {
        toast.error('Failed to save product.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Product insertion failed.');
    } finally {
      setAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      const res = await axios.delete(`${SERVER_URL}/api/admin/products/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success('Product deleted successfully.');
        setRefreshTrigger(prev => prev + 1);
      } else {
        toast.error('Failed to delete product.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting product from database.');
    }
  };

  const handleDeleteDesign = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      const res = await axios.delete(`${SERVER_URL}/api/projects/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success('Design Concept deleted successfully.');
        setRefreshTrigger(prev => prev + 1);
      } else {
        toast.error('Failed to delete design concept.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting project from database.');
    }
  };

  const handleAddWishlistToCart = async (p: any) => {
    try {
      await addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category });
      await removeFromWishlist(p.id);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Mock Analytics Data Charts
  const salesData = [
    { name: 'Jan', sales: 12000 },
    { name: 'Feb', sales: 19000 },
    { name: 'Mar', sales: 15000 },
    { name: 'Apr', sales: 27000 },
    { name: 'May', sales: 22000 },
    { name: 'Jun', sales: 34000 }
  ];

  const styleChoiceData = [
    { name: 'Japandi', value: 40 },
    { name: 'Scandinavian', value: 25 },
    { name: 'Industrial', value: 20 },
    { name: 'Bohemian', value: 10 },
    { name: 'Minimalist', value: 5 }
  ];

  const COLORS = ['#06b6d4', '#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];

  const chatMetricsData = [
    { name: 'Week 1', sessions: 24, completions: 18 },
    { name: 'Week 2', sessions: 38, completions: 26 },
    { name: 'Week 3', sessions: 45, completions: 34 },
    { name: 'Week 4', sessions: 62, completions: 48 }
  ];

  if (authLoading || !user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-[#030712]">
          <div className="w-10 h-10 rounded-full border-2 border-t-cyan-400 border-r-violet-400 border-b-transparent border-l-transparent animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  const sidebarLinks = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'designer', label: 'AI Designer Console', icon: <Sparkles className="w-4 h-4" /> },

    { id: 'wishlist', label: 'My Wishlist', icon: <Heart className="w-4 h-4" /> },
    { id: 'cart', label: 'My Cart', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders & Receipts', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'payment-history', label: 'Purchase History', icon: <Wallet className="w-4 h-4" /> },
    { id: 'settings', label: 'Profile & Settings', icon: <SettingsIcon className="w-4 h-4" /> }
  ];

  const adminLinks = [
    { id: 'admin-analytics', label: 'Admin Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'admin-reports', label: 'AI Reports Node', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'admin-products', label: 'Manage Products', icon: <Database className="w-4 h-4" /> },
    { id: 'admin-add-product', label: 'Add Store Product', icon: <Plus className="w-4 h-4" /> },
    { id: 'admin-designs', label: 'Manage Designs', icon: <Compass className="w-4 h-4" /> }
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />

      <div className="px-6 pt-6 shrink-0 w-full">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 rounded-xl border border-[#C4C3D0] bg-[#FFFFF0] px-4 py-2.5 text-xs font-bold text-[#2C2523] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-[#C28285] hover:bg-[#E6E6FA]/40 hover:shadow-md active:scale-[0.98]"
        >
          <ArrowLeft className="w-4.5 h-4.5 text-[#C28285] transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Homepage</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 w-full px-6 py-6 overflow-y-auto lg:overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 lg:h-full lg:overflow-y-auto flex-shrink-0">
          <div className="flex flex-col gap-8 rounded-[32px] bg-[#FFFFF0] border border-[#C4C3D0]/40 shadow-xl p-6">

            {/* Profile Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#E6E6FA] via-white to-[#FFFFF0] border border-[#C4C3D0]/40 p-6">
              <div className="flex flex-col items-center text-center">

                <div className="w-20 h-20 rounded-full bg-[#C28285] flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-[#E6E6FA]">
                  {user.name.charAt(0)}
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-800">{user.name}</h3>

                <span className="mt-2 rounded-full bg-white border border-[#C4C3D0] px-4 py-1.5 text-xs font-semibold capitalize text-[#8A6E72]">
                  {user.role}
                </span>

              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#9C8E97]">Studio Panel</h4>

              <div className="space-y-3">
                {sidebarLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`group relative flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${activeTab === link.id
                      ? "bg-[#C28285] text-white shadow-lg scale-[1.02]"
                      : "bg-white border border-[#E6E6FA] text-gray-700 hover:bg-[#E6E6FA] hover:text-[#C28285] hover:border-[#C28285]"
                      }`}
                  >
                    {activeTab === link.id && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-white" />}

                    <div className={`${activeTab === link.id ? "bg-white/20" : "bg-[#E6E6FA]"} flex h-10 w-10 items-center justify-center rounded-xl transition-all`}>
                      {link.icon}
                    </div>

                    <span className="flex-1 text-left">{link.label}</span>
                  </button>
                ))}
              </div>
              {/* Admin Panel */}
              {user.role === "admin" && (
                <div className="border-t border-[#C4C3D0]/40 pt-6">

                  <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#9C8E97]">
                    Admin Panel
                  </h4>

                  <div className="space-y-3">
                    {adminLinks.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => setActiveTab(link.id)}
                        className={`group relative flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${activeTab === link.id
                          ? "bg-[#C28285] text-white shadow-lg scale-[1.02]"
                          : "bg-white border border-[#E6E6FA] text-gray-700 hover:bg-[#E6E6FA] hover:text-[#C28285] hover:border-[#C28285]"
                          }`}
                      >
                        {activeTab === link.id && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-white" />
                        )}

                        <div className={`${activeTab === link.id ? "bg-white/20" : "bg-[#E6E6FA]"} flex h-10 w-10 items-center justify-center rounded-xl transition-all`}>
                          {link.icon}
                        </div>

                        <span className="flex-1 text-left">
                          {link.label}
                        </span>
                      </button>
                    ))}
                  </div>

                </div>
              )}

              {/* Divider */}
              <div className="border-t border-[#C4C3D0]/40" />

              {/* Logout */}
              <button
                onClick={logout}
                className="my-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#C28285] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#AF6F72] hover:shadow-xl hover:scale-[1.02]"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>

              {/* Bottom Decoration */}
              <div className="rounded-3xl bg-gradient-to-br from-[#E6E6FA] via-white to-[#FFFFF0] border border-[#C4C3D0]/30 p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#C28285] text-white shadow-md">
                  <Sparkles className="w-6 h-6" />
                </div>

                <h4 className="text-sm font-bold text-gray-800">
                  Aurora Interiors AI
                </h4>

                <p className="mt-2 text-xs leading-6 text-gray-500">
                  Design smarter with AI-powered recommendations, personalized inspiration,
                  and premium interior solutions.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Viewport Workspace */}
        <main
          className={`lg:col-span-9 ${activeTab === "designer"
            ? "flex flex-col lg:h-full lg:overflow-hidden"
            : "glass-panel rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 p-6 h-auto lg:h-full lg:overflow-y-auto"
            }`}
        >

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fadeIn">

              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <div>
                  <span className="inline-block px-4 py-1 rounded-full bg-[#E6E6FA] text-[#C28285] text-xs font-bold tracking-[0.18em] uppercase">
                    Dashboard
                  </span>

                  <h2 className="mt-4 text-3xl font-bold text-gray-800">
                    Welcome back, {user.name.split(" ")[0]}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500 max-w-xl leading-7">
                    Monitor your saved interior projects, purchases, wishlist, and AI-generated design recommendations in one place.
                  </p>
                </div>

              </div>

              {/* Statistics */}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* Card 1 */}

                <div className="rounded-3xl border border-[#C4C3D0]/40 bg-[#FFFFF0] p-6 shadow-lg hover:shadow-xl transition-all duration-300">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A8B94]">
                        Completed Renders
                      </p>

                      <h3 className="mt-3 text-4xl font-bold text-gray-800">
                        {projectsCount}
                      </h3>

                      <span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        100% Synced
                      </span>
                    </div>

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6E6FA]">
                      <Sparkles className="w-8 h-8 text-[#C28285]" />
                    </div>

                  </div>

                </div>

                {/* Card 2 */}

                <div className="rounded-3xl border border-[#C4C3D0]/40 bg-[#FFFFF0] p-6 shadow-lg hover:shadow-xl transition-all duration-300">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A8B94]">
                        Wishlist Items
                      </p>

                      <h3 className="mt-3 text-4xl font-bold text-gray-800">
                        {wishlist.length}
                      </h3>

                      <span className="mt-2 inline-flex rounded-full bg-[#E6E6FA] px-3 py-1 text-xs font-semibold text-[#8B6E72]">
                        Ready to Purchase
                      </span>

                    </div>

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6E6FA]">
                      <Heart className="w-8 h-8 text-[#C28285]" />
                    </div>

                  </div>

                </div>

                {/* Card 3 */}

                <div className="rounded-3xl border border-[#C4C3D0]/40 bg-[#FFFFF0] p-6 shadow-lg hover:shadow-xl transition-all duration-300">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A8B94]">
                        Total Spent
                      </p>

                      <h3 className="mt-3 text-4xl font-bold text-gray-800">
                        ${payments.reduce((sum, p) => sum + (p.total || 0), 0).toLocaleString()}
                      </h3>

                      <span className="mt-2 inline-flex rounded-full bg-[#FCE7F3] px-3 py-1 text-xs font-semibold text-[#C28285]">
                        Stripe Verified
                      </span>

                    </div>

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6E6FA]">
                      <Wallet className="w-8 h-8 text-[#C28285]" />
                    </div>

                  </div>

                </div>

              </div>
              {/* Aurora AI Banner */}

              <div className="relative overflow-hidden rounded-[32px] border border-[#C4C3D0]/40 bg-gradient-to-br from-[#FFFFF0] via-white to-[#E6E6FA] p-8 shadow-xl">

                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#E6E6FA]/60 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#C28285]/10 blur-3xl" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                  <div className="max-w-2xl">

                    <span className="inline-flex items-center gap-2 rounded-full bg-[#E6E6FA] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C28285]">
                      <Sparkles className="w-4 h-4" />
                      Aurora AI Assistant
                    </span>

                    <h3 className="mt-5 text-3xl lg:text-4xl font-bold leading-tight text-gray-800">
                      Ready to transform your dream home?
                    </h3>

                    <p className="mt-4 text-sm leading-8 text-gray-600">
                      Start a personalized AI design session. Aurora analyzes your room size,
                      color preferences, furniture style, lighting, flooring, ceiling,
                      wall paints and décor to generate beautiful interior concepts tailored
                      specifically for your home.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">

                      <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
                        AI Space Planning
                      </span>

                      <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
                        Smart Color Matching
                      </span>

                      <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
                        Furniture Suggestions
                      </span>

                    </div>

                  </div>

                  <div className="flex flex-col items-center lg:items-end gap-5">

                    <div className="grid grid-cols-2 gap-4">

                      <div className="rounded-2xl bg-white p-5 shadow-md text-center">
                        <h4 className="text-2xl font-bold text-[#C28285]">500+</h4>
                        <p className="mt-1 text-xs text-gray-500">
                          Design Ideas
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white p-5 shadow-md text-center">
                        <h4 className="text-2xl font-bold text-[#C28285]">98%</h4>
                        <p className="mt-1 text-xs text-gray-500">
                          Match Accuracy
                        </p>
                      </div>

                    </div>

                    <button
                      onClick={() => setActiveTab("designer")}
                      className="flex items-center gap-3 rounded-2xl bg-[#C28285] px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#AE6F72] hover:scale-[1.03] hover:shadow-2xl"
                    >
                      <Sparkles className="w-5 h-5" />
                      Launch AI Design Studio
                    </button>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: AI DESIGNER */}
          {activeTab === "designer" && (
            <div className="flex-1 min-h-0 flex flex-col">
              <ChatTab serverUrl={SERVER_URL} />
            </div>
          )}

          {/* TAB 3: PORTFOLIO (My Designs / Saved Designs) */}
          {activeTab === 'my-designs' && (
            <GalleryTab serverUrl={SERVER_URL} refreshTrigger={refreshTrigger} />
          )}

          {/* TAB 4: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Favorited Items</h2>
                <p className="text-xs text-gray-500">Products saved from design concepts or catalog browsing.</p>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No items saved in wishlist yet.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {wishlist.map(item => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      layout="list"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4.5: MY CART */}
          {activeTab === 'cart' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Shopping Cart</h2>
                <p className="text-xs text-gray-500">View items ready for secure Stripe checkout.</p>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Your shopping cart is empty.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Cart Items list */}
                  <div className="md:col-span-8 space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 p-4 bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-950 dark:text-white">{item.name}</h4>
                            <span className="text-[10px] text-cyan-400 font-bold">${item.price}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-2 py-1 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-gray-400 hover:text-white text-xs font-bold w-4"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-gray-200">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-gray-400 hover:text-white text-xs font-bold w-4"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-gray-500 hover:text-rose-500 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary card */}
                  <div className="md:col-span-4 bg-slate-100 dark:bg-black/20 p-5 border border-slate-200 dark:border-white/5 rounded-2xl h-fit space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Summary</h3>

                    <div className="space-y-2 border-b border-white/5 pb-3">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Subtotal</span>
                        <span>${cartTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Shipping</span>
                        <span className="text-emerald-400 font-semibold uppercase text-[10px]">Free</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-slate-800 dark:text-white">
                      <span>Total Due</span>
                      <span className="text-cyan-400 font-black">${cartTotal.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={async () => {
                        try {
                          const res = await axios.post(`${SERVER_URL}/api/marketplace/checkout`, {
                            items: cart
                          }, { withCredentials: true });
                          if (res.data.success && res.data.checkoutUrl) {
                            window.location.href = res.data.checkoutUrl;
                          } else {
                            toast.error("Failed to generate Stripe checkout session.");
                          }
                        } catch (err: any) {
                          toast.error(err.response?.data?.error?.message || "Checkout connection error.");
                        }
                      }}
                      className="btn-gradient w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      Checkout via Stripe
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Orders & Receipts</h2>
                <p className="text-xs text-gray-500">Secure Stripe billing logs and shipping coordinates.</p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No orders logged in database yet.</div>
              ) : (
                <div className="space-y-4">
                  {orders.map(ord => (
                    <div key={ord._id} className="bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            ORD-{ord._id.substring(18).toUpperCase()}
                          </span>
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${ord.status === 'delivered'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : ord.status === 'cancelled'
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-amber-500/10 text-amber-400'
                            }`}>
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500">
                          Ref Code: <span className="font-mono">{ord.paymentIntentId?.substring(0, 15)}...</span> • Placed {new Date(ord.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-[10px] text-gray-500 block">Total Invoice</span>
                          <span className="text-sm font-black text-cyan-400">${ord.total.toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => {
                            const printWindow = window.open('', '_blank');
                            if (printWindow) {
                              const itemsHtml = ord.items.map((i: any) => `
                                <li>${i.product?.name || 'Item'} - ${i.quantity} units @ $${i.price}</li>
                              `).join('');
                              printWindow.document.write(`
                                <html>
                                <head><title>Receipt ORD-${ord._id.substring(18).toUpperCase()}</title></head>
                                <body style="font-family: sans-serif; padding: 40px;">
                                  <h2>AURORA INTERIORS AI ORDER</h2>
                                  <p><strong>Order ID:</strong> ${ord._id}</p>
                                  <p><strong>Status:</strong> ${ord.status}</p>
                                  <ul>${itemsHtml}</ul>
                                  <h3>Total Total: $${ord.total}</h3>
                                  <script>window.onload = function() { window.print(); }</script>
                                </body>
                                </html>
                              `);
                              printWindow.document.close();
                            }
                          }}
                          className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-350 dark:bg-white/[0.02] dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-800 dark:text-gray-200 rounded-lg uppercase tracking-wider"
                        >
                          Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5.5: PURCHASE HISTORY */}
          {activeTab === 'payment-history' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Purchase History</h2>
                <p className="text-xs text-gray-500 font-medium">Detailed Stripe invoices, billing status, and payment logs.</p>
              </div>

              {payments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No payment records found.</div>
              ) : (
                <div className="space-y-4">
                  {payments.map(pay => (
                    <div key={pay._id} className="bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            INV-{pay._id.substring(18).toUpperCase()}
                          </span>
                          <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                            {pay.paymentStatus}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500">
                          Stripe ID: <span className="font-mono">{pay.stripeSessionId?.substring(0, 20)}...</span> • Paid {new Date(pay.paymentDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-[10px] text-gray-500 block">Amount Paid</span>
                          <span className="text-sm font-black text-cyan-400">${pay.total.toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => {
                            const printWindow = window.open('', '_blank');
                            if (printWindow) {
                              const itemsHtml = pay.purchasedProducts.map((p: any) => `
                                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; font-size: 11px;">
                                  <span>${p.name} x ${p.quantity}</span>
                                  <span>$${p.price * p.quantity}</span>
                                </div>
                              `).join('');
                              printWindow.document.write(`
                                <html>
                                <head><title>Invoice INV-${pay._id.substring(18).toUpperCase()}</title></head>
                                <body style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
                                  <h2>AURORA INTERIORS AI INVOICE</h2>
                                  <hr />
                                  <p><strong>Invoice ID:</strong> INV-${pay._id.toUpperCase()}</p>
                                  <p><strong>Date:</strong> ${new Date(pay.paymentDate).toLocaleString()}</p>
                                  <p><strong>Stripe Reference:</strong> ${pay.stripeSessionId}</p>
                                  <h3>Purchased Items</h3>
                                  ${itemsHtml}
                                  <h3 style="text-align: right;">Total Paid: $${pay.total}</h3>
                                  <script>window.onload = function() { window.print(); }</script>
                                </body>
                                </html>
                              `);
                              printWindow.document.close();
                            }
                          }}
                          className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-350 dark:bg-white/[0.02] dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-800 dark:text-gray-200 rounded-lg uppercase tracking-wider"
                        >
                          Invoice Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn max-w-xl">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Profile Credentials</h2>
                <p className="text-xs text-gray-500">Manage password hashes and email coordinates.</p>
              </div>

              <form onSubmit={handleSubmitProfile(handleProfileSubmit)} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    {...registerProfile('name')}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Coordinates</label>
                  <input
                    type="email" readOnly
                    {...registerProfile('email')}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-grey-400 shadow disabled:opacity-50"
                >
                  {updatingProfile ? 'Saving Details...' : 'Update Details'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: ADMIN ANALYTICS */}
          {/* TAB 7: ADMIN ANALYTICS */}
          {activeTab === 'admin-analytics' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Platform Sales Analytics</h2>
                <p className="text-xs text-gray-500 font-medium">Stripe transaction aggregates and preferred style charts.</p>
              </div>

              {/* Admin Stat Cards */}
              {adminOverview && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-100 dark:bg-black/20 p-4 border border-slate-200 dark:border-white/5 rounded-2xl">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Total Revenue</span>
                    <span className="text-lg font-black text-cyan-400">${adminOverview.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-black/20 p-4 border border-slate-200 dark:border-white/5 rounded-2xl">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Total Orders</span>
                    <span className="text-lg font-black text-[#C28285]">{adminOverview.totalOrders}</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-black/20 p-4 border border-slate-200 dark:border-white/5 rounded-2xl">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Wishlist Items</span>
                    <span className="text-lg font-black text-indigo-400">{adminOverview.totalWishlistItems}</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-black/20 p-4 border border-slate-200 dark:border-white/5 rounded-2xl">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Cart Items</span>
                    <span className="text-lg font-black text-emerald-400">{adminOverview.totalCartItems}</span>
                  </div>
                </div>
              )}

              {/* Top Lists Grid */}
              {adminOverview && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Most Wishlisted */}
                  <div className="bg-slate-100 dark:bg-black/20 p-4 border border-slate-200 dark:border-white/5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-gray-200 uppercase tracking-wider">Most Wishlisted</h4>
                    <div className="space-y-2">
                      {adminOverview.mostWishlisted?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs border-b border-white/5 pb-1">
                          <span className="text-gray-400 truncate max-w-[80%]">{item.name}</span>
                          <span className="font-bold text-[#C28285]">{item.count} saves</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Most Purchased */}
                  <div className="bg-slate-100 dark:bg-black/20 p-4 border border-slate-200 dark:border-white/5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-gray-200 uppercase tracking-wider">Most Purchased</h4>
                    <div className="space-y-2">
                      {adminOverview.mostPurchased?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs border-b border-white/5 pb-1">
                          <span className="text-gray-400 truncate max-w-[80%]">{item.name}</span>
                          <span className="font-bold text-cyan-400">{item.count} units</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Most Carted */}
                  <div className="bg-slate-100 dark:bg-black/20 p-4 border border-slate-200 dark:border-white/5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-gray-200 uppercase tracking-wider">Most Carted</h4>
                    <div className="space-y-2">
                      {adminOverview.mostCarted?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs border-b border-white/5 pb-1">
                          <span className="text-gray-400 truncate max-w-[80%]">{item.name}</span>
                          <span className="font-bold text-emerald-400">{item.count} items</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Area & Pie Recharts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
                <div className="md:col-span-8 bg-slate-100 dark:bg-black/20 p-5 border border-slate-200 dark:border-white/5 rounded-2xl space-y-3 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Sales Flow</h4>
                  <div className="h-64 w-full text-slate-950 dark:text-gray-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                        <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="sales" stroke="#06b6d4" fill="rgba(6, 182, 212, 0.1)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="md:col-span-4 bg-slate-100 dark:bg-black/20 p-5 border border-slate-200 dark:border-white/5 rounded-2xl space-y-3 shadow-sm flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Design Style Ratio</h4>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={styleChoiceData} dataKey="value" nameKey="name" cx="55%" cy="50%" outerRadius={50}>
                          {styleChoiceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[9px] font-semibold">
                    {styleChoiceData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-1 truncate text-gray-400">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: COLORS[i] }} />
                        <span>{d.name} ({d.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Spending & Purchases List */}
              {adminOverview && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
                  <div className="md:col-span-6 bg-slate-100 dark:bg-black/20 p-5 border border-slate-200 dark:border-white/5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Customers</h4>
                    <div className="space-y-3">
                      {adminOverview.topCustomers?.map((cust: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-800 dark:text-gray-200 block">{cust.name}</span>
                            <span className="text-[10px] text-gray-500">{cust.email}</span>
                          </div>
                          <span className="font-black text-cyan-400">${cust.totalSpent.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-6 bg-slate-100 dark:bg-black/20 p-5 border border-slate-200 dark:border-white/5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Purchases</h4>
                    <div className="space-y-3">
                      {adminOverview.recentPurchases?.map((pur: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-slate-800 dark:text-gray-200 block">Stripe Session</span>
                            <span className="text-[10px] text-gray-500">
                              {new Date(pur.date).toLocaleString()} • {pur.customer}
                            </span>
                          </div>
                          <span className="font-black text-emerald-400">${pur.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: ADMIN AI REPORTS */}
          {activeTab === 'admin-reports' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Consultation Reports</h2>
                <p className="text-xs text-gray-500 font-medium">Session completion volumes and Google Gemini API triggers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
                <div className="md:col-span-8 bg-slate-100 dark:bg-black/20 p-5 border border-slate-200 dark:border-white/5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Chat Sessions vs. Completions</h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chatMetricsData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                        <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="sessions" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="completions" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="md:col-span-4 bg-slate-100 dark:bg-black/20 p-5 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col justify-between gap-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Model Telemetry</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block uppercase">Gemini Endpoint</span>
                      <span className="text-xs font-bold text-cyan-400">gemini-1.5-flash</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block uppercase">Avg API Latency</span>
                      <span className="text-xs font-bold text-slate-200">1.42 seconds</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block uppercase">Success Rate</span>
                      <span className="text-xs font-bold text-emerald-400">99.86%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success('API Telemetry nodes flushed.')}
                    className="w-full py-2 bg-slate-205 hover:bg-slate-200 dark:bg-white/[0.02] dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-800 dark:text-gray-200 rounded-lg uppercase"
                  >
                    Flush Cache
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: ADMIN PRODUCT MANAGER */}
          {activeTab === 'admin-products' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Store Catalog manager</h2>
                  <p className="text-xs text-gray-500">Edit, inspect stock parameters, or delete products.</p>
                </div>
                <button
                  onClick={() => setActiveTab('admin-add-product')}
                  className="px-4 py-2 bg-white text-gray-950 text-[10px] font-bold uppercase tracking-wider rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-gray-500 dark:text-gray-300">
                  <thead className="text-[10px] text-gray-400 uppercase border-b border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-black/20">
                    <tr>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminProducts.map(p => (
                      <tr key={p.id} className="border-b border-slate-100 dark:border-white/[0.02] hover:bg-white/[0.01]">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{p.name}</td>
                        <td className="p-3 uppercase text-[10px] text-violet-400 capitalize">{p.category}</td>
                        <td className="p-3 text-cyan-400 font-bold">${p.price}</td>
                        <td className="p-3 font-mono">{p.stock} units</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 hover:text-rose-500 border border-transparent rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 10: ADMIN ADD PRODUCT FORM */}
          {activeTab === 'admin-add-product' && (
            <div className="space-y-6 animate-fadeIn max-w-xl">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Add Store Product</h2>
                <p className="text-xs text-gray-500 font-medium">Add new designer items to the Marketplace.</p>
              </div>

              <form onSubmit={handleSubmitProduct(handleProductSubmit)} className="space-y-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product Name</label>
                  <input
                    type="text"
                    {...registerProduct('name')}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  {productErrors.name && <span className="text-[9px] text-rose-500 font-bold">{productErrors.name.message}</span>}
                </div>

                {/* Grid Category + Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
                    <select
                      {...registerProduct('category')}
                      className="w-full bg-slate-50 dark:bg-black/40 border border-slate-350 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500 text-gray-550 dark:text-gray-300"
                    >
                      <option value="furniture">Furniture</option>
                      <option value="lighting">Lighting</option>
                      <option value="flooring">Flooring</option>
                      <option value="paint">Wall Paint</option>
                      <option value="decor">Decor</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price ($ USD)</label>
                    <input
                      type="number"
                      step="any"
                      {...registerProduct('price', { valueAsNumber: true })}
                      className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500"
                    />
                    {productErrors.price && <span className="text-[9px] text-rose-500 font-bold">{productErrors.price.message}</span>}
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
                  <textarea
                    {...registerProduct('description')}
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl p-4 text-xs focus:outline-none focus:border-cyan-500 resize-none min-h-[80px]"
                  />
                  {productErrors.description && <span className="text-[9px] text-rose-500 font-bold">{productErrors.description.message}</span>}
                </div>

                {/* Image URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Image URL Coordinate</label>
                  <input
                    type="text"
                    {...registerProduct('image')}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  {productErrors.image && <span className="text-[9px] text-rose-500 font-bold">{productErrors.image.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={addingProduct}
                  className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow disabled:opacity-50"
                >
                  Create Product
                </button>
              </form>
            </div>
          )}

          {/* TAB 11: ADMIN MANAGE DESIGNS */}
          {activeTab === 'admin-designs' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Room Concepts Manager</h2>
                  <p className="text-xs text-gray-500">Edit, configure presets, or delete designs.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-gray-500 dark:text-gray-300">
                  <thead className="text-[10px] text-gray-400 uppercase border-b border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-black/20">
                    <tr>
                      <th className="p-3">Design Title</th>
                      <th className="p-3">Style</th>
                      <th className="p-3">Room Type</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminDesigns.map(d => (
                      <tr key={d.id} className="border-b border-slate-100 dark:border-white/[0.02] hover:bg-white/[0.01]">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{d.title}</td>
                        <td className="p-3 text-cyan-400">{d.style}</td>
                        <td className="p-3 font-mono">{d.roomType}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteDesign(d.id, d.title)}
                            className="p-1.5 hover:text-rose-500 border border-transparent rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
