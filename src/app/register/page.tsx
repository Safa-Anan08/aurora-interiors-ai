"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Sparkles, User, Mail, Lock, ArrowRight, Compass, UserCheck, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Provide a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

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

function RegisterPageForm() {
  const { user, loading, registerFull } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || searchParams.get('returnTo');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const target = user.role === 'admin' ? '/admin' : getSafeRedirectUrl(redirectParam, '/dashboard');
      router.replace(target);
    }
  }, [user, loading, router, redirectParam]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  const passwordValue = watch("password") || "";

  const onSubmit = async (data: RegisterFormValues) => {
    setSubmitting(true);
    try {
      await registerFull(data.name, data.email, data.password);
      toast.success('Registration completed! Welcome.');
      const target = getSafeRedirectUrl(redirectParam, '/dashboard');
      router.replace(target);
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: "", color: "bg-gray-200 text-gray-400" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-400 text-red-500" };
    if (score === 2) return { score: 2, label: "Medium", color: "bg-yellow-500 text-yellow-600" };
    return { score: 3, label: "Strong", color: "bg-[#C28285] text-[#C28285]" };
  };

  const strength = getPasswordStrength(passwordValue);

  const features = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#C28285]" />,
      title: "AI-Powered Spatial Profiling",
      desc: "Generate personalized color schemes, floor plans, and mood boards in seconds."
    },
    {
      icon: <Compass className="w-5 h-5 text-[#C28285]" />,
      title: "Curated Furniture Store",
      desc: "Access a hand-picked collection of premium materials, textiles, and decor."
    },
    {
      icon: <UserCheck className="w-5 h-5 text-[#C28285]" />,
      title: "Designer Collaboration",
      desc: "Share your projects with our professional design consultants for direct feedback."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#FFFFF0] grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden selection:bg-[#F4E2E3] selection:text-[#2C2523]">

      {/* Decorative Background Floating Shapes */}
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#C28285]/5 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-1/3 w-[26rem] h-[26rem] rounded-full bg-[#E6E6FA]/30 blur-3xl pointer-events-none"
      />

      {/* LEFT COLUMN: Premium Hero Section */}
      <div className="lg:col-span-5 p-4 sm:p-6 lg:p-16 flex flex-col justify-between bg-gradient-to-b from-[#E6E6FA]/15 to-[#FFFFF0] border-b lg:border-b-0 lg:border-r border-[#C4C3D0]/30 min-h-fit lg:min-h-screen relative z-10">

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
              Craft Your <span className="font-semibold text-[#C28285]">Dream Space</span>
            </h2>
            <p className="text-sm lg:text-base text-[#504441] leading-relaxed max-w-md ">
              Step into a world of curated aesthetics. Harness the power of advanced AI to design, visualize, and order luxury interiors tailored to your unique taste.
            </p>
          </div>

          {/* Features checklist */}
          <div className="space-y-5 hidden md:block">
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
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#8F8E9C] mt-auto hidden md:block">
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
              <h1 className="text-3xl font-serif font-semibold text-[#2C2523] tracking-tight">Create Account</h1>
              <p className="text-xs text-[#504441] leading-relaxed">
                Join Aurora Interiors to save your collections, manage designs and enjoy premium interior curation.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#504441]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C28285]" />
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="Enter your full name"
                    className={`w-full rounded-xl border bg-[#FFFFF0] py-2.5 pl-11 pr-4 text-xs text-[#2C2523] outline-none transition-all duration-300 placeholder:text-[#8F8E9C]
                      ${errors.name
                        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                        : "border-[#C4C3D0] focus:border-[#C28285] focus:ring-2 focus:ring-[#C28285]/20"
                      }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[10px] font-semibold text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                    placeholder="Minimum 6 characters"
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

                {/* Dynamic Password Strength Indicator */}
                {passwordValue && (
                  <div className="space-y-1 mt-1">
                    <div className="flex justify-between items-center text-[10px] font-medium text-[#504441]">
                      <span>Password Strength</span>
                      <span className={`font-semibold ${strength.color.split(' ')[1]}`}>{strength.label}</span>
                    </div>
                    <div className="h-1 w-full bg-gray-200/60 rounded-full overflow-hidden flex gap-0.5">
                      <div className={`h-full rounded-l-full transition-all duration-300 ${strength.score >= 1 ? strength.color.split(' ')[0] : 'bg-gray-200'} ${strength.score === 1 ? 'w-1/3' : 'w-full'}`} />
                      <div className={`h-full transition-all duration-300 ${strength.score >= 2 ? strength.color.split(' ')[0] : 'bg-gray-200'} ${strength.score === 2 ? 'w-1/3' : 'w-full'}`} />
                      <div className={`h-full rounded-r-full transition-all duration-300 ${strength.score >= 3 ? strength.color.split(' ')[0] : 'bg-gray-200'} ${strength.score === 3 ? 'w-1/3' : 'w-full'}`} />
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-[10px] font-semibold text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#504441]">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C28285]" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="Re-enter password"
                    className={`w-full rounded-xl border bg-[#FFFFF0] py-2.5 pl-11 pr-10 text-xs text-[#2C2523] outline-none transition-all duration-300 placeholder:text-[#8F8E9C]
                      ${errors.confirmPassword
                        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                        : "border-[#C4C3D0] focus:border-[#C28285] focus:ring-2 focus:ring-[#C28285]/20"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8F8E9C] hover:text-[#C28285] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[10px] font-semibold text-red-500 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Security Hint */}
              <div className="rounded-xl border border-[#C4C3D0]/60 bg-[#FFFFF0]/80 p-3 text-[10px] text-[#504441] leading-relaxed shadow-sm">
                <span className="font-semibold text-[#C28285]">Security Note:</span> Make your account extra secure by using at least 6 characters with a combination of uppercase letters, numbers, and symbols.
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
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
                or register with
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
                        .catch(() => toast.error('Google authorization error.'))
                        .finally(() => setSubmitting(false));
                    }
                  }}
                  onError={() => toast.error('Google authorization error.')}
                  theme="outline"
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                  width="400"
                />
              </div>
            )}

            {/* Navigation Footer */}
            <div className="text-center text-xs pt-2 text-[#504441]">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-[#C28285] hover:text-[#A36467] transition-colors underline underline-offset-4 decoration-2">
                Sign In
              </Link>
            </div>

          </div>
        </motion.div>
      </div>

    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFF0]">
        <div className="w-8 h-8 rounded-full border-2 border-[#C28285] border-t-transparent animate-spin" />
      </div>
    }>
      <RegisterPageForm />
    </Suspense>
  );
}

