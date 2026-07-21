"use client";

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'user' | 'admin';
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error("Access denied. Please log in to access this page.");
        const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
        const target = currentPath && currentPath !== '/' ? `/login?redirect=${encodeURIComponent(currentPath)}` : '/login';
        router.replace(target);
      } else if (role === 'admin' && user.role !== 'admin') {
        toast.error("Access denied. Administrator privileges required.");
        router.replace('/dashboard');
      }
    }
  }, [user, loading, role, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#030712]">
        <div className="w-10 h-10 rounded-full border-2 border-t-cyan-400 border-r-violet-400 border-b-transparent border-l-transparent animate-spin" />
      </div>
    );
  }

  // Prevent rendering if not authenticated or role mismatch
  if (!user || (role === 'admin' && user.role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
}
