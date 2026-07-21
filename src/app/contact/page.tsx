"use client";

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Provide a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." })
});

type ContactFormValues = z.infer<typeof contactSchema>;
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitting(true);
    try {
      await axios.post(`${SERVER_URL}/api/contact`, data);
      toast.success('Message dispatched successfully! We will follow up shortly.');
      reset();
    } catch (err) {
      toast.error('Failed to dispatch message. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal relative selection:bg-dusty-rose-light selection:text-charcoal font-sans antialiased overflow-hidden">
      
      {/* Background glow shape */}
      <div className="aurora-bg" />
      
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-12 items-start w-full z-10">
        
        {/* Contact Info Panel */}
        <div className="md:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] text-dusty-rose font-bold uppercase tracking-widest bg-dusty-rose/10 border border-dusty-rose/20 px-3 py-1 rounded-full inline-block">
              Support Center
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight">Get in Touch</h1>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Have questions about order tracking, custom paints, or enterprise consults? Send our staff node a message.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-5 bg-white border border-lavender-grey/30 rounded-2xl shadow-sm">
              <Mail className="w-5 h-5 text-dusty-rose mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">Email Studio</h4>
                <p className="text-xs text-charcoal-light mt-0.5">support@aurorainteriors.ai</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-5 bg-white border border-lavender-grey/30 rounded-2xl shadow-sm">
              <Phone className="w-5 h-5 text-dusty-rose mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">Call Channels</h4>
                <p className="text-xs text-charcoal-light mt-0.5">+1 (888) 555-0199</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-5 bg-white border border-lavender-grey/30 rounded-2xl shadow-sm">
              <MapPin className="w-5 h-5 text-dusty-rose mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">Headquarters</h4>
                <p className="text-xs text-charcoal-light mt-0.5">100 Spatial Plaza, Suite AI, San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Input Panel */}
        <div className="md:col-span-7">
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="glass-panel p-6 sm:p-8 rounded-3xl bg-white border border-lavender-grey/30 space-y-5"
          >
            <div className="flex items-center gap-2 border-b border-lavender-grey/20 pb-4">
              <MessageSquare className="w-5 h-5 text-dusty-rose" />
              <h2 className="text-sm font-bold tracking-wider uppercase">Write Message</h2>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-charcoal-light dark:text-gray-400 uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Liam Vance"
                className={`w-full bg-white border ${errors.name ? 'border-rose-500' : 'border-lavender-grey/35'} rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-dusty-rose transition-all`}
              />
              {errors.name && <span className="text-[10px] text-rose-500 font-bold">{errors.name.message}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-charcoal-light dark:text-gray-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                {...register('email')}
                placeholder="liam@gmail.com"
                className={`w-full bg-white border ${errors.email ? 'border-rose-500' : 'border-lavender-grey/35'} rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-dusty-rose transition-all`}
              />
              {errors.email && <span className="text-[10px] text-rose-500 font-bold">{errors.email.message}</span>}
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-charcoal-light dark:text-gray-400 uppercase tracking-wider">Subject</label>
              <input
                type="text"
                {...register('subject')}
                placeholder="Question about furniture specs, custom paints, etc."
                className={`w-full bg-white border ${errors.subject ? 'border-rose-500' : 'border-lavender-grey/35'} rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-dusty-rose transition-all`}
              />
              {errors.subject && <span className="text-[10px] text-rose-500 font-bold">{errors.subject.message}</span>}
            </div>

            {/* Message Body */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-charcoal-light dark:text-gray-400 uppercase tracking-wider">Message Description</label>
              <textarea
                rows={4}
                {...register('message')}
                placeholder="Write your questions or order inquiries here in detail..."
                className={`w-full bg-white border ${errors.message ? 'border-rose-500' : 'border-lavender-grey/35'} rounded-2xl p-4 text-xs text-charcoal focus:outline-none focus:border-dusty-rose transition-all resize-none`}
              />
              {errors.message && <span className="text-[10px] text-rose-500 font-bold">{errors.message.message}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Dispatching Message...' : 'Send Message'}
            </button>
          </form>
        </div>

      </main>

      <Footer />
    </div>
  );
}
