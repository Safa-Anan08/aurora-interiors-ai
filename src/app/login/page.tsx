"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, ArrowRight, UserCheck, ShieldAlert, Compass, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email({ message: "Provide a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." })
});

type LoginFormValues = z.infer<typeof loginSchema>;

const getSafeRedirectUrl = (redirectParam: string | null, fallbackUrl: string): string => {
  if (!redirectParam) return fallbackUrl;
  if (redirectParam.startsWith('/') && !redirectParam.startsWith('//')) {
    if (redirectParam.startsWith('/login') || redirectParam.startsWith('/register')) {
      return fallbackUrl;
    }
    return redirectParam;
  }
  return fallbackUrl;
};

function LoginPageForm() {
  const { user, loading, login, googleLogin, demoLogin } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || searchParams.get('returnTo');

  useEffect(() => {
    if (!loading && user) {
      const target = user.role === 'admin' ? '/admin' : getSafeRedirectUrl(redirectParam, '/dashboard');
      router.replace(target);
    }
  }, [user, loading, router, redirectParam]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitting(true);

    try {
      const loggedInUser = await login(data.email, data.password);

      toast.success("Logged in successfully!");

      const target = loggedInUser.role === "admin"
        ? "/admin"
        : getSafeRedirectUrl(redirectParam, "/dashboard");
      router.replace(target);
    } catch (err: any) {
      toast.error(err.message || "Login credentials invalid.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: 'user' | 'admin') => {
    setSubmitting(true);

    try {
      const loggedInUser = await demoLogin(role);

      toast.success(`Welcome to the ${loggedInUser.role} dashboard!`);

      const target = loggedInUser.role === 'admin'
        ? '/admin'
        : getSafeRedirectUrl(redirectParam, '/dashboard');
      router.replace(target);
    } catch (err) {
      toast.error('Demo authentication node error.');
    } finally {
      setSubmitting(false);
    }
  };
  const features = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#C28285]" />,
      title: "Resume AI Consultations",
      desc: "Pick up exactly where you left off with your virtual interior advisor."
    },
    {
      icon: <Compass className="w-5 h-5 text-[#C28285]" />,
      title: "Track Store Orders",
      desc: "Check the status of your bespoke luxury furniture and decor purchases."
    },
    {
      icon: <UserCheck className="w-5 h-5 text-[#C28285]" />,
      title: "Curated Mood Boards",
      desc: "Access and refine your saved interior styling profiles and material lists."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#FFFFF0] grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden selection:bg-[#F4E2E3] selection:text-[#2C2523]">

      {/* Decorative Background Floating Shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-[#C28285]/5 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 25, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 right-1/4 w-[24rem] h-[24rem] rounded-full bg-[#E6E6FA]/30 blur-3xl pointer-events-none"
      />

      {/* LEFT COLUMN: Premium Hero Section */}
      <div className="lg:col-span-5 p-8 lg:p-16  hidden md:block flex flex-col justify-between bg-gradient-to-b from-[#E6E6FA]/15 to-[#FFFFF0] border-b lg:border-b-0 lg:border-r border-[#C4C3D0]/30 min-h-[50vh] lg:min-h-screen relative z-10">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C28285] shadow-md shadow-[#C28285]/10 text-white transition-all duration-300 group-hover:scale-105">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span className="text-xs font-bold tracking-wider text-[#504441] uppercase group-hover:text-[#C28285] transition-colors">
              Back to Studio
            </span>
          </Link>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="my-auto py-8 space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif text-[#2C2523] leading-tight font-light">
              Welcome Back to <span className="font-semibold text-[#C28285]">Elegance</span>
            </h2>
            <p className="text-sm lg:text-base text-[#504441] leading-relaxed max-w-md">
              Continue your design journey. Access your curated collections, manage ongoing spaces, and collaborate with AI designers.
            </p>
          </div>

          {/* Features checklist */}
          <div className="space-y-5">
            {features.map((feature, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#E6E6FA] flex items-center justify-center shadow-sm">
                  {feature.icon}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2523]">{feature.title}</h4>
                  <p className="text-xs text-[#504441] leading-relaxed max-w-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Hero Visual Showcase */}
          <div className="relative rounded-2xl overflow-hidden border border-[#C4C3D0]/40 shadow-xl shadow-[#C4C3D0]/20 aspect-[16/10] w-full max-w-md hidden sm:block">
            <img src="/luxury_interior_hero.png" alt="Luxury Interior" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C2523]/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-md bg-black/20 px-3 py-1 rounded-full border border-white/10">
              Bespoke Living Spaces
            </div>
          </div>
        </motion.div>

        {/* Footer Brand Info */}
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#8F8E9C] mt-auto">
          © Aurora Interiors AI
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Form Panel */}
      <div className="lg:col-span-7 p-6 lg:p-16 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="rounded-[32px] border border-[#C4C3D0]/60 bg-[#E6E6FA]/40 p-8 lg:p-10 shadow-xl shadow-[#C4C3D0]/10 backdrop-blur-md space-y-6">

            <div className="text-center space-y-2">
              <h1 className="text-3xl font-serif font-semibold text-[#2C2523] tracking-tight">Sign In</h1>
              <p className="text-xs text-[#504441] leading-relaxed">
                Resume consultations, view mood boards, and track your bespoke store orders.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#504441]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C28285]" />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="example@email.com"
                    className={`w-full rounded-xl border bg-[#FFFFF0] py-2.5 pl-11 pr-4 text-xs text-[#2C2523] outline-none transition-all duration-300 placeholder:text-[#8F8E9C]
                      ${errors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                        : "border-[#C4C3D0] focus:border-[#C28285] focus:ring-2 focus:ring-[#C28285]/20"
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] font-semibold text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#504441]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C28285]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter account password"
                    className={`w-full rounded-xl border bg-[#FFFFF0] py-2.5 pl-11 pr-10 text-xs text-[#2C2523] outline-none transition-all duration-300 placeholder:text-[#8F8E9C]
                      ${errors.password
                        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                        : "border-[#C4C3D0] focus:border-[#C28285] focus:ring-2 focus:ring-[#C28285]/20"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8F8E9C] hover:text-[#C28285] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] font-semibold text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#C28285] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#C28285]/20 transition-all duration-300 hover:bg-[#A36467] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#C28285]/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#C4C3D0]/50" />
              </div>
              <span className="relative bg-[#FFFFF0] lg:bg-[#f6f6f8] px-3 text-[10px] font-bold uppercase tracking-widest text-[#8F8E9C]">
                <span className="relative bg-[#E6E6FA]/40 px-3 text-[10px] font-bold uppercase tracking-widest text-[#8F8E9C]">
                  or sign in with
                </span>
              </span>
            </div>
            {/* Google Signup */}
            {submitting ? (
              <button
                type="button"
                disabled
                className="w-full py-2.5 rounded-xl border border-[#C4C3D0] bg-[#FFFFF0] hover:bg-[#E6E6FA]/40 text-xs font-bold text-[#2C2523] flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                Connecting to Google…
              </button>
            ) : (
              <div className="w-full flex justify-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-xl overflow-hidden [&>div]:w-full">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    const token = credentialResponse?.credential;
                    if (token) {
                      setSubmitting(true);
                      googleLogin(token)
                        .then(() => {
                          toast.success('Authorized via Google successfully!');
                          const target = getSafeRedirectUrl(redirectParam, '/dashboard');
                          router.replace(target);
                        })
                        .catch(() => {
                          toast.error('Google authorization error.');
                        })
                        .finally(() => setSubmitting(false));
                    }
                  }}
                  onError={() => toast.error('Google authorization error.')}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="400"
                />
              </div>
            )}
            {/* Demo Logins */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                disabled={submitting}
                className="py-2.5 rounded-xl border border-[#C4C3D0] bg-[#FFFFF0] hover:bg-[#E6E6FA]/40 text-xs font-bold text-[#2C2523] flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4 text-[#C28285]" />
                <span>Demo User</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={submitting}
                className="py-2.5 rounded-xl border border-[#C4C3D0] bg-[#FFFFF0] hover:bg-[#E6E6FA]/40 text-xs font-bold text-[#2C2523] flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <ShieldAlert className="w-4 h-4 text-[#C28285]" />
                <span>Demo Admin</span>
              </button>
            </div>

            {/* Navigation Footer */}
            <div className="text-center text-xs pt-2 text-[#504441]">
              New to the Studio?{' '}
              <Link href="/register" className="font-bold text-[#C28285] hover:text-[#A36467] transition-colors underline underline-offset-4 decoration-2">
                Create an account
              </Link>
            </div>

          </div>
        </motion.div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFF0]">
        <div className="w-8 h-8 rounded-full border-2 border-[#C28285] border-t-transparent animate-spin" />
      </div>
    }>
      <LoginPageForm />
    </Suspense>
  );
}
