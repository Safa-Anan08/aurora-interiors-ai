"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

import { useCart } from '../context/CartContext';
import { Sparkles, ShoppingCart, Sun, Moon, Menu, X, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import CartModal from './CartModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const SERVER_URL = 'http://localhost:5000';

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const toggleUserDropdown = () => setUserDropdownOpen(prev => !prev);

  // Dynamic Navigation links based on authentication state
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore Designs', href: '/designs' },
    { label: 'Marketplace', href: '/products' },
    { label: 'Contact', href: '/contact' }
  ];
  if (user) {
    if (user.role === "admin") {
      navLinks.push({ label: "Admin Panel", href: "/admin" });
    } else {
      navLinks.push({ label: "Dashboard", href: "/dashboard" });
    }
  } else {
    navLinks.push(
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" }
    );
  }
  return (
    <>
      <nav className="glass-panel sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between border-b border-lavender-grey/30 backdrop-blur-md bg-ivory/95 text-charcoal transition-all">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-dusty-rose flex items-center justify-center shadow-md">
            <Sparkles className="w-4.5 h-4.5 text-ivory animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-charcoal leading-none">
              Aurora Interiors
            </h1>
            <p className="text-[8px] text-dusty-rose font-bold uppercase tracking-widest mt-0.5">
              AI Creative Studio
            </p>
          </div>
        </Link>

        {/* Desktop Links Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="text-xs font-bold text-charcoal-light hover:text-dusty-rose transition-colors uppercase tracking-wider"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action buttons (Theme, Cart, Auth) */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Light/Dark Toggle */}


          {/* Cart Icon */}
          <button
            onClick={() => setCartOpen(true)}
            className="w-9 h-9 rounded-xl bg-ivory-dark border border-lavender-grey/35 flex items-center justify-center text-charcoal relative hover:bg-lavender-grey/15 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-dusty-rose text-[9px] text-ivory flex items-center justify-center font-bold border border-ivory animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth Control */}
          {user ? (
            <div className="relative">
              <button
                onClick={toggleUserDropdown}
                className="flex items-center gap-2 bg-ivory-dark border border-lavender-grey/35 py-1.5 px-3.5 rounded-xl text-xs font-bold text-charcoal hover:bg-lavender-grey/15 transition-all"
              >
                <User className="w-4.5 h-4.5 text-dusty-rose" />
                {user.name.split(' ')[0]}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-panel border border-lavender-grey/35 rounded-xl overflow-hidden shadow-lg z-50 bg-ivory">
                  {user.role !== 'admin' && (
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-charcoal-light hover:bg-lavender-grey/10 border-b border-lavender-grey/20"
                    >
                      <LayoutDashboard className="w-4 h-4 text-dusty-rose" />
                      User Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-charcoal-light hover:bg-lavender-grey/10 border-b border-lavender-grey/20"
                    >
                      <Shield className="w-4 h-4 text-dusty-rose" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-rose-600 hover:bg-lavender-grey/10 text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-primary py-2 px-4.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm text-center"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile controls bar */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            className="w-9 h-9 rounded-xl bg-ivory-dark border border-lavender-grey/35 flex items-center justify-center text-charcoal relative"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-dusty-rose text-[8px] text-ivory flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={toggleMobileMenu}
            className="w-9 h-9 rounded-xl bg-ivory-dark border border-lavender-grey/35 flex items-center justify-center text-charcoal"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel w-full border-b border-lavender-grey/30 px-6 py-5 flex flex-col gap-4 bg-ivory z-40 relative shadow-md">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              onClick={toggleMobileMenu}
              className="text-xs font-bold text-charcoal hover:text-dusty-rose transition-colors uppercase tracking-wider"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-lavender-grey/25 pt-4 flex items-center justify-between gap-4">


            {user ? (
              <div className="flex gap-4">
                {user.role !== 'admin' && (
                  <Link
                    href="/dashboard"
                    onClick={toggleMobileMenu}
                    className="text-xs font-bold text-dusty-rose flex items-center gap-1.5"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={toggleMobileMenu}
                    className="text-xs font-bold text-dusty-rose flex items-center gap-1.5"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className="text-xs font-bold text-rose-600 flex items-center gap-1.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={toggleMobileMenu}
                className="btn-primary py-2 px-4.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Drawer Shopping Cart Overlay */}
      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        serverUrl={SERVER_URL}
      />
    </>
  );
}
