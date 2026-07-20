"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  Sparkles, LayoutDashboard, Users, ShoppingBag, ClipboardList, 
  BarChart3, Heart, Search, Bot, MessageSquare, Star, 
  Bell, LogOut, Menu, X, ChevronRight, User as UserIcon
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const sidebarLinks = [
    { label: 'Overview', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Users', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Products', href: '/admin/products', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Designs', href: '/admin/designs', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Orders', href: '/admin/orders', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Sales Analytics', href: '/admin/sales', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Wishlist Analytics', href: '/admin/wishlists', icon: <Heart className="w-4 h-4" /> },
    { label: 'Search Analytics', href: '/admin/searches', icon: <Search className="w-4 h-4" /> },
    { label: 'AI Analytics', href: '/admin/ai', icon: <Bot className="w-4 h-4" /> },
    { label: 'Chat History', href: '/admin/chat', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Reviews', href: '/admin/reviews', icon: <Star className="w-4 h-4" /> }
  ];

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((path, idx) => {
      const href = '/' + paths.slice(0, idx + 1).join('/');
      const isLast = idx === paths.length - 1;
      return {
        label: path.charAt(0).toUpperCase() + path.slice(1),
        href,
        isLast
      };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen flex bg-ivory text-charcoal relative selection:bg-dusty-rose-light selection:text-charcoal font-sans antialiased overflow-hidden">
        
        {/* Background glow shape */}
        <div className="aurora-bg" />

        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-lavender-grey/30 bg-white/70 backdrop-blur-md z-30 shrink-0">
          <div className="p-6 border-b border-lavender-grey/20 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-dusty-rose flex items-center justify-center shadow">
              <Sparkles className="w-4 h-4 text-ivory" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-charcoal tracking-wide leading-none uppercase">Aurora Console</h2>
              <span className="text-[9px] text-dusty-rose font-bold uppercase tracking-wider block mt-0.5">Admin Workspace</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border ${
                    isActive
                      ? 'border-dusty-rose/30 bg-dusty-rose/10 text-dusty-rose shadow-sm'
                      : 'border-transparent text-gray-500 hover:text-charcoal hover:bg-lavender-grey/10'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-lavender-grey/20">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all border border-transparent"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Sidebar - Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 bg-charcoal/30 backdrop-blur-sm z-40 lg:hidden flex">
            <div className="w-64 bg-ivory border-r border-lavender-grey/30 flex flex-col p-4">
              <div className="flex justify-between items-center pb-4 border-b border-lavender-grey/20 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal">Menu Console</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1 hover:bg-lavender-grey/15 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-grow space-y-1 overflow-y-auto">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border ${
                        isActive
                          ? 'border-dusty-rose/30 bg-dusty-rose/10 text-dusty-rose shadow-sm'
                          : 'border-transparent text-gray-500 hover:text-charcoal hover:bg-lavender-grey/10'
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all mt-auto border border-transparent"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Viewport content node */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
          {/* Top Navbar */}
          <header className="glass-panel sticky top-0 z-20 w-full px-6 py-4 flex items-center justify-between border-b border-lavender-grey/30 bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-1.5 hover:bg-lavender-grey/15 rounded-lg lg:hidden"
              >
                <Menu className="w-5 h-5 text-charcoal" />
              </button>

              {/* Breadcrumb indicator */}
              <nav className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <Link href="/admin" className="hover:text-dusty-rose transition-colors">Admin</Link>
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                    {crumb.isLast ? (
                      <span className="text-charcoal">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-dusty-rose transition-colors">{crumb.label}</Link>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>

            {/* Actions: Notifications & Profile menu */}
            <div className="flex items-center gap-3">
              {/* Notification icon */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(prev => !prev)}
                  className="w-8.5 h-8.5 rounded-xl bg-ivory-dark border border-lavender-grey/35 flex items-center justify-center text-charcoal hover:bg-lavender-grey/15 transition-all relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-dusty-rose" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 glass-panel border border-lavender-grey/35 rounded-xl overflow-hidden shadow-lg z-50 bg-ivory p-3 space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-lavender-grey/25 pb-1">Notifications</h4>
                    <div className="text-[10px] leading-relaxed text-charcoal space-y-1">
                      <div className="p-1.5 rounded bg-white hover:bg-lavender-grey/10 transition-colors">New spatial design synthesized for Vance Residence.</div>
                      <div className="p-1.5 rounded bg-white hover:bg-lavender-grey/10 transition-colors">Order #20349 pending payment verification.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile card summary */}
              <div className="flex items-center gap-2 border-l border-lavender-grey/20 pl-3">
                <div className="w-8 h-8 rounded-full bg-dusty-rose/10 flex items-center justify-center text-dusty-rose font-bold uppercase text-xs border border-dusty-rose/25">
                  {user?.name.charAt(0) || 'A'}
                </div>
                <div className="hidden md:block min-w-0 text-left">
                  <h4 className="text-xs font-bold text-charcoal truncate max-w-[80px] leading-none">{user?.name}</h4>
                  <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wide mt-0.5 block">Admin Node</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main workspace panels */}
          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>

      </div>
    </ProtectedRoute>
  );
}
