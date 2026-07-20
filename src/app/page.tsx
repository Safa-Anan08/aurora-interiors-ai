"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, ShieldCheck, Compass, ShoppingCart,
  Paintbrush, ChevronDown, Check, Star, CheckCircle, Users,
  LineChart, Smile, Palette, Layers, Box, AppWindow
} from 'lucide-react';
import { Swiper, SwiperSlide } from "swiper/react";

import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
export default function Home() {
  const { user } = useAuth();
  const destination = user ? '/dashboard' : '/login';
  const router = useRouter();

  const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const { data: designsData, isLoading: designsLoading } = useQuery({
    queryKey: ['homeDesigns'],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/designs`);
      return res.data.designs;
    }
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['homeProducts'],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/marketplace/products`);
      return res.data;
    }
  });

  // State for FAQ accordions
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Statistics data
  const stats = [
    { icon: <Compass className="w-5 h-5 text-dusty-rose" />, val: "15,800+", label: "Rooms Synthesized" },
    { icon: <Smile className="w-5 h-5 text-dusty-rose" />, val: "4.95 / 5", label: "Average Rating" },
    { icon: <LineChart className="w-5 h-5 text-dusty-rose" />, val: "99.2%", label: "Space Clearances Met" },
    { icon: <Users className="w-5 h-5 text-dusty-rose" />, val: "12,400+", label: "Homeowners Onboarded" }
  ];

  // Room categories
  const categories = [
    { name: "Living Rooms", count: "6,240 styled", desc: "Zoned social spaces and cozy family hearths" },
    { name: "Bedrooms", count: "4,120 styled", desc: "Cozy primary suites and children sleep areas" },
    { name: "Workspaces", count: "2,840 styled", desc: "Active desks, libraries, and home study cabins" },
    { name: "Dining Rooms", count: "1,600 styled", desc: "Formal dinner settings and kitchen nooks" }
  ];

  // Popular paints (Dusty Rose, Lavender Grey, Ivory palette + complementary earth tones)
  const popularPaints = React.useMemo(() => {
    if (!productsData || !Array.isArray(productsData)) return [];
    const paintProds = productsData.filter((p: any) => p.category === 'paint');
    return paintProds.map((p: any) => {
      const specsObj = p.specs || {};
      return {
        name: p.name,
        hex: specsObj['Hex Code'] || specsObj['Hex'] || p.color || '#B07575',
        code: specsObj['Shade Code'] || specsObj['code'] || p.subCategory || 'AR-402',
        desc: p.description
      };
    });
  }, [productsData]);

  // Tile designs
  const popularTiles = React.useMemo(() => {
    if (!productsData || !Array.isArray(productsData)) return [];
    const tileProds = productsData.filter((p: any) => p.category === 'flooring');
    return tileProds.slice(0, 3).map((p: any) => ({
      name: p.name,
      style: p.style || p.subCategory || 'Tile',
      desc: p.description,
      img: p.image
    }));
  }, [productsData]);

  // Furniture recommendations
  const featuredFurniture = React.useMemo(() => {
    if (!productsData || !Array.isArray(productsData)) return [];
    const furnitureProds = productsData.filter((p: any) => p.category === 'furniture');
    let featured = furnitureProds.filter((p: any) => p.featured);
    if (featured.length === 0) {
      featured = furnitureProds;
    }
    return featured.slice(0, 3).map((p: any) => ({
      id: p.id || p._id,
      name: p.name,
      price: p.price,
      img: p.image,
      desc: p.description
    }));
  }, [productsData]);

  // Room presets
  const presets = React.useMemo(() => {
    if (!designsData || !Array.isArray(designsData)) return [];
    let featured = designsData.filter((d: any) => d.featured);
    if (featured.length === 0) {
      featured = designsData;
    }
    return featured.slice(0, 3).map((d: any) => ({
      id: d._id || d.id,
      name: d.title,
      style: d.style,
      img: d.img,
      desc: d.desc
    }));
  }, [designsData]);

  // Customer stories
  const customerStory = {
    name: "The Vance Residence",
    location: "Chicago, IL",
    before: "Cluttered, dim 850 sq ft apartment with awkward traffic flows.",
    after: "Zoned Japandi sanctuary featuring sheer linen partitions, light oak planks, and custom recessed coves.",
    quote: "Aurora collected my layout specifications and mapped a complete design plan, down to the exact hex paint and clearance dimensions. Checking out the recommended furniture in one click was incredibly smooth!"
  };

  // FAQS
  const faqs = [
    { q: "How does the AI Designer Agent work?", a: "Aurora is an agentic system that conducts a guided consultation interview. Instead of generating a single prompt response, she gathers 15 spatial parameters (from pets to storage) and reasons about clearance guidelines to synthesize a complete 13-part design board." },
    { q: "Can I customize the generated plan?", a: "Yes. The consultation console provides a 'Tweak' refinement bar. Simply instruct Aurora (e.g., 'Use slate grey flooring tiles' or 'Make it more kid-friendly') and the layout will dynamically adjust." },
    { q: "How do shopping catalog curations work?", a: "Every proposal matches specific physical assets (paints, floor tiles, furniture, lights) from our integrated shop. You can review specifications and add single items or the complete bundle to your cart instantly." },
    { q: "Is there a demo account I can use?", a: "Yes. We offer fast-pass Demo User and Demo Admin login options on the login screen to allow you to test all features instantly without signing up." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal relative selection:bg-dusty-rose-light selection:text-charcoal font-sans antialiased overflow-hidden">

      {/* Background Aurora glow shapes */}
      <div className="aurora-bg" />

      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative max-w-7xl mx-auto w-full px-6 pt-24 pb-16 lg:pt-32 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 space-y-6 text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-dusty-rose/10 border border-dusty-rose/20 text-dusty-rose">
            <Sparkles className="w-3.5 h-3.5" />
            Agentic Interior Consultation Studio
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-charcoal">
            Design Your Space With <span className="text-dusty-rose">Aurora AI</span>
          </h1>

          <p className="text-sm sm:text-base text-charcoal-light max-w-xl leading-relaxed">
            Consult naturally with our virtual interior design architect. Aurora gathers spatial constraints, budgets, and lifestyles to compile interactive 2D layouts and matching shop catalogs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="/designer"
              className="btn-primary px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 group shadow-md">
              Start Designing Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/products"
              className="btn-secondary px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-sm"
            >
              Explore Products
            </Link>
          </div>
        </motion.div>

        {/* Hero Interactive App Window graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-6"
        >
          <div className="glass-panel p-2 rounded-3xl overflow-hidden shadow-xl border border-lavender-grey/30 bg-white/60">
            <div className="bg-ivory-dark rounded-2xl p-4 space-y-4 border border-lavender-grey/20">
              {/* Window controls bar */}
              <div className="flex items-center justify-between border-b border-lavender-grey/25 pb-2 text-[10px] text-lavender-grey-dark font-bold font-mono">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-dusty-rose/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-lavender-grey/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-lavender-grey/30" />
                </div>
                <span>AURORA_AGENT_STUDIO</span>
                <span className="w-4" />
              </div>

              {/* Interview Chat simulator block */}
              <div className="space-y-3">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-6 h-6 rounded-full bg-dusty-rose flex items-center justify-center text-white text-[9px] font-bold">A</div>
                  <div className="bg-white border border-lavender-grey/35 rounded-2xl p-2.5 text-[10px] leading-relaxed shadow-sm text-charcoal-light">
                    Hello! Welcome to your design studio. **What type of property are we designing?**
                  </div>
                </div>

                <div className="flex gap-2 max-w-[85%] ml-auto flex-row-reverse">
                  <div className="w-6 h-6 rounded-full bg-lavender-grey-dark flex items-center justify-center text-white text-[9px] font-bold">U</div>
                  <div className="bg-dusty-rose/10 border border-dusty-rose/20 rounded-2xl p-2.5 text-[10px] leading-normal shadow-sm text-charcoal">
                    Designing a two-bedroom apartment.
                  </div>
                </div>

                <div className="flex gap-2 max-w-[85%] animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-dusty-rose flex items-center justify-center text-white text-[9px] font-bold">A</div>
                  <div className="bg-white border border-lavender-grey/35 rounded-2xl p-2.5 text-[10px] shadow-sm text-charcoal-light flex items-center gap-1">
                    Analyzing apartment layout partitions...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. FEATURED ROOM DESIGNS */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full z-10 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <span className="text-[10px] text-dusty-rose font-bold uppercase tracking-wider block">Portfolio Renders</span>
            <h2 className="text-2xl font-bold text-charcoal mt-1">Featured Room Designs</h2>
          </div>
          <Link href="/designs" className="text-xs font-bold text-dusty-rose hover:text-dusty-rose-dark flex items-center gap-1">
            Browse All Concepts
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {presets.map((pre, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="glass-panel rounded-3xl overflow-hidden flex flex-col group cursor-pointer shadow-sm bg-white"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/10 border-b border-lavender-grey/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pre.img} alt={pre.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-charcoal">{pre.name}</h3>
                  <span className="text-[9px] bg-dusty-rose/10 border border-dusty-rose/20 text-dusty-rose font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {pre.style}
                  </span>
                </div>
                <p className="text-xs text-charcoal-light leading-relaxed">{pre.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. POPULAR PAINT COLLECTIONS */}
      <section className="px-6 py-20 bg-gradient-to-b from-[#FFFFF0] via-white to-[#FDFCF8] border-y border-[#C4C3D0]/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#E6E6FA]/40 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#C28285]/10 blur-3xl rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto relative z-10">

          <div className="text-center mb-14">

            <span className="inline-flex px-4 py-1 rounded-full bg-[#E6E6FA] text-[#C28285] text-xs font-bold tracking-[0.2em] uppercase">
              Palette Harmony
            </span>

            <h2 className="mt-5 text-4xl md:text-5xl font-bold text-charcoal">
              Popular Paint Collections
            </h2>

            <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base leading-7 text-charcoal-light">
              Discover timeless luxury paint palettes carefully curated by Aurora
              Interiors AI to create warm, elegant and sophisticated living spaces.
            </p>

          </div>

          <Swiper
            modules={[Autoplay, Navigation, Pagination, EffectCoverflow]}
            effect="coverflow"
            centeredSlides
            loop
            grabCursor
            navigation={{
              nextEl: ".paint-next",
              prevEl: ".paint-prev",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 180,
              modifier: 2.2,
              scale: 0.92,
              slideShadows: false,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1.15,
              },
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1400: {
                slidesPerView: 3.5,
              },
            }}
            className="!pb-16"
          >
            {popularPaints.map((paint, idx) => (
              <SwiperSlide key={idx}>

                <div
                  className="group  bg-white rounded-[30px] overflow-hidden border border-[#C4C3D0]/30 shadow-md hover:shadow-2xl transition-all duration-500  hover:-translate-y-3 " >

                  <div
                    className="relative aspect-[16/10] overflow-hidden"
                    style={{ backgroundColor: paint.hex }}
                  >

                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20" />

                    <span
                      className="absolute top-5 right-5 px-3 py-1 rounded-full bg-white/90 text-[#7a7388] text-[11px] font-bold shadow "
                    >
                      {paint.code}
                    </span>

                  </div>

                  <div className="p-6 flex flex-col gap-4">

                    <div>

                      <h3 className="text-xl font-bold text-charcoal">
                        {paint.name}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-charcoal-light">
                        {paint.desc}
                      </p>

                    </div>

                    <div className="flex items-center justify-between">

                      <span className="text-xs font-semibold text-[#C28285]">
                        Premium Collection
                      </span>


                    </div>

                  </div>

                </div>

              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex justify-center items-center gap-5 mt-6">

            <button
              className="paint-prev  w-12 h-12  rounded-full  border border-[#C4C3D0] bg-white shadow-md flex items-center justify-center  transition-all duration-300 hover:bg-[#C28285] hover:text-white "
            >
              ←
            </button>

            <button
              className="paint-next  w-12  h-12  rounded-full  border  border-[#C4C3D0]  bg-white  shadow-md flex items-center  justify-center  transition-all  duration-300  hover:bg-[#C28285] hover:text-white "
            >
              →
            </button>

          </div>

        </div>
      </section>

      {/* 4. TILE COLLECTIONS */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full z-10 relative">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] text-dusty-rose font-bold uppercase tracking-wider block">Surfaces</span>
          <h2 className="text-2xl font-bold text-charcoal">Luxury Tile Collections</h2>
          <p className="text-xs text-charcoal-light max-w-md mx-auto">Durable, high-end stone finishes selected for luxury spaces and wet zones.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularTiles.map((tile, idx) => (
            <div key={idx} className="glass-panel rounded-3xl overflow-hidden flex flex-col bg-white border border-lavender-grey/30">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tile.img} alt={tile.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 space-y-1.5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">{tile.name}</h3>
                  <span className="text-[9px] text-lavender-grey-dark font-medium italic">{tile.style}</span>
                </div>
                <p className="text-xs text-charcoal-light leading-relaxed">{tile.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. POPULAR FURNITURE */}
      <section className="px-6 py-16 bg-white/40 border-t border-b border-lavender-grey/25 z-10 relative">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <span className="text-[10px] text-dusty-rose font-bold uppercase tracking-wider block">Shop Catalog</span>
              <h2 className="text-2xl font-bold text-charcoal mt-1">Popular Furniture Catalog</h2>
            </div>
            <Link href="/products" className="text-xs font-bold text-dusty-rose hover:text-dusty-rose-dark flex items-center gap-1">
              Browse Complete Store
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {featuredFurniture.map((item, idx) => (
              <div key={idx} className="glass-panel p-4 rounded-3xl bg-white border border-lavender-grey/30 flex flex-col shadow-sm">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-lavender-grey/25">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="pt-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-charcoal leading-tight">{item.name}</h3>
                    <p className="text-[10px] text-charcoal-light mt-1 leading-normal">{item.desc}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-lavender-grey/20 pt-3 mt-auto">
                    <span className="text-xs font-black text-dusty-rose">${item.price.toLocaleString()}</span>
                    <Link href={`/products/${item.id}`} className="px-3.5 py-1.5 rounded-lg border border-lavender-grey/35 text-[10px] font-bold uppercase tracking-wider text-charcoal hover:bg-lavender-grey/15 transition-all">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ROOM CATEGORIES */}
      <section className="px-6 py-16 max-w-7xl mx-auto w-full z-10 relative">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] text-dusty-rose font-bold uppercase tracking-wider block">Zoning blueprints</span>
          <h2 className="text-2xl font-bold text-charcoal">Design by Room Categories</h2>
          <p className="text-xs text-charcoal-light max-w-md mx-auto">Different zones have distinct spatial safety rules. Specify your rooms to load custom algorithms.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/35 hover:border-dusty-rose/40 hover:shadow-lg transition-all flex flex-col justify-between gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold text-charcoal">{cat.name}</h3>
                  <span className="text-[9px] font-bold text-dusty-rose bg-dusty-rose/10 px-2 py-0.5 rounded-full">{cat.count}</span>
                </div>
                <p className="text-xs text-charcoal-light leading-relaxed">{cat.desc}</p>
              </div>

              <Link href="/designer" className="text-[10px] font-bold uppercase tracking-widest text-dusty-rose hover:text-dusty-rose-dark flex items-center gap-1 mt-auto">
                Begin Setup <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 7. AI INTERIOR DESIGNER EXPLAINER */}
      <section className="px-6 py-16 bg-white/40 border-t border-b border-lavender-grey/25 z-10 relative">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[10px] text-dusty-rose font-bold uppercase tracking-widest block bg-dusty-rose/10 border border-dusty-rose/20 px-3 py-1 rounded-full inline-block">
              Agent Specifications
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight leading-snug">The Guided Spatial Reasoning Agent</h2>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
              Unlike traditional chatbots that simply answer queries, Aurora operates as a **State-Driven Spatial Planner**. She tracks your profile parameters in real-time, matching clearances to architectural standards.
            </p>

            <ul className="space-y-3.5 text-xs text-charcoal-light">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-dusty-rose flex-shrink-0 mt-0.5" />
                <span>**15-Node Spatial Consultation**: Gathers pets, kids, lighting, ceilings, and storage criteria.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-dusty-rose flex-shrink-0 mt-0.5" />
                <span>**Safety Clearanace Calculator**: Recommends spacing (e.g. 36" corridor paths, sofa sizes) based on room square footage.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-dusty-rose flex-shrink-0 mt-0.5" />
                <span>**Interactive Swatches & Catalog**: Delivers colored swatches and direct checkout bundles.</span>
              </li>
            </ul>

            <Link href={destination} className="btn-primary px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center inline-flex items-center gap-1.5 shadow">
              Meet Aurora AI <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 space-y-2 mt-4">
              <Palette className="w-5 h-5 text-dusty-rose" />
              <h3 className="text-xs font-bold text-charcoal uppercase">Material Harmony</h3>
              <p className="text-[10px] text-charcoal-light leading-relaxed">Combines paints, flooring, and curtains into aligned concept boards.</p>
            </div>
            <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 space-y-2">
              <Layers className="w-5 h-5 text-dusty-rose" />
              <h3 className="text-xs font-bold text-charcoal uppercase">Zoning clearance</h3>
              <p className="text-[10px] text-charcoal-light leading-relaxed">Calculates corridor clearpaths automatically according to occupancy count.</p>
            </div>
            <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 space-y-2 mt-4">
              <Box className="w-5 h-5 text-dusty-rose" />
              <h3 className="text-xs font-bold text-charcoal uppercase">Asset Catalog</h3>
              <p className="text-[10px] text-charcoal-light leading-relaxed">Direct synchronization with available physical checkout materials.</p>
            </div>
            <div className="glass-panel p-5 rounded-3xl bg-white border border-lavender-grey/30 space-y-2">
              <AppWindow className="w-5 h-5 text-dusty-rose" />
              <h3 className="text-xs font-bold text-charcoal uppercase">Tweak modifications</h3>
              <p className="text-[10px] text-charcoal-light leading-relaxed">Adjusts layout blueprints instantly through natural chat commands.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section className="px-6 py-16 max-w-6xl mx-auto w-full z-10 relative">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] text-dusty-rose font-bold uppercase tracking-wider block">Workflow</span>
          <h2 className="text-2xl font-bold text-charcoal">How It Works</h2>
          <p className="text-xs text-charcoal-light max-w-sm mx-auto">Three guided phases to synthesize and execute your custom interior designs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

          <div className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/35 text-center space-y-4 relative">
            <div className="w-10 h-10 rounded-2xl bg-dusty-rose/10 text-dusty-rose font-bold flex items-center justify-center text-sm mx-auto">1</div>
            <h3 className="text-sm font-bold text-charcoal">Spatial Questionnaire</h3>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Start a guided session. Answer Aurora's questions one-by-one, specifying structural details, flooring, natural light, and budget thresholds.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/35 text-center space-y-4 relative">
            <div className="w-10 h-10 rounded-2xl bg-dusty-rose/10 text-dusty-rose font-bold flex items-center justify-center text-sm mx-auto">2</div>
            <h3 className="text-sm font-bold text-charcoal">AI Constraint reasoning</h3>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Aurora runs checks on spatial clearance rules, durability indexes (kid/pet status), and color balance to compute layout dimensions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/35 text-center space-y-4 relative">
            <div className="w-10 h-10 rounded-2xl bg-dusty-rose/10 text-dusty-rose font-bold flex items-center justify-center text-sm mx-auto">3</div>
            <h3 className="text-sm font-bold text-charcoal">Synthesis & Print</h3>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Receive a comprehensive 13-part concept board. Refine elements by text, checkout matching assets, and export report PDFs.
            </p>
          </div>

        </div>
      </section>

      {/* 9. CUSTOMER STORIES */}
      <section className="px-6 py-16 bg-white/40 border-t border-b border-lavender-grey/25 z-10 relative">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[10px] text-dusty-rose font-bold uppercase tracking-wider block">Transformation case study</span>
            <h2 className="text-2xl font-bold text-charcoal">Customer Stories</h2>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white border border-lavender-grey/30 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 relative aspect-square rounded-2xl overflow-hidden bg-black/5">
              <img src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=500&q=80" alt="Vance Living Room After" className="w-full h-full object-cover" />
            </div>

            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="text-[10px] text-lavender-grey-dark font-black tracking-wider uppercase">{customerStory.location}</span>
                <h3 className="text-lg font-bold text-charcoal mt-0.5">{customerStory.name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">Before layout</span>
                  <p className="text-charcoal-light mt-0.5">{customerStory.before}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">After layout</span>
                  <p className="text-charcoal-light mt-0.5">{customerStory.after}</p>
                </div>
              </div>

              <div className="border-t border-lavender-grey/20 pt-4">
                <blockquote className="text-xs text-charcoal-light italic leading-relaxed">
                  "{customerStory.quote}"
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. STATISTICS */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full z-10 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-3xl text-center bg-white border border-lavender-grey/30 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-xl bg-dusty-rose/10 flex items-center justify-center mx-auto text-dusty-rose">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-black text-charcoal">{stat.val}</h3>
              <p className="text-[10px] font-bold text-charcoal-light uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. TESTIMONIALS */}
      <section className="px-6 py-16 bg-white/40 border-t border-b border-lavender-grey/25 z-10 relative">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[10px] text-dusty-rose font-bold uppercase tracking-wider block">Endorsements</span>
            <h2 className="text-2xl font-bold text-charcoal">Testimonials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/35 shadow-sm space-y-4">
              <div className="flex gap-1 text-dusty-rose"><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /></div>
              <p className="text-xs text-charcoal-light italic leading-relaxed">
                "The layout directions were spot on. Aurora calculated exactly a 36-inch clearance path around my dining table. It feels so spacious now!"
              </p>
              <div>
                <h4 className="text-[11px] font-bold text-charcoal">Clara Eldridge</h4>
                <span className="text-[9px] text-lavender-grey-dark">Vance Loft Owner</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/35 shadow-sm space-y-4">
              <div className="flex gap-1 text-dusty-rose"><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /></div>
              <p className="text-xs text-charcoal-light italic leading-relaxed">
                "I was skeptical of AI spatial design, but the paint colors match. The Dusty Rose and Ivory wall color palette turned my study into a serene sanctuary."
              </p>
              <div>
                <h4 className="text-[11px] font-bold text-charcoal">Marcus Dupont</h4>
                <span className="text-[9px] text-lavender-grey-dark">Architectural Collector</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/35 shadow-sm space-y-4">
              <div className="flex gap-1 text-dusty-rose"><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /></div>
              <p className="text-xs text-charcoal-light italic leading-relaxed">
                "Adding the entire recommended Japandi furniture bundle to my cart saved me weeks of shopping. Shipping was fast, and the sizes are exact."
              </p>
              <div>
                <h4 className="text-[11px] font-bold text-charcoal">Sarah Sterling</h4>
                <span className="text-[9px] text-lavender-grey-dark">Homeowner, Austin TX</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FAQ ACCORDIONS */}
      <section className="px-6 py-16 max-w-4xl mx-auto w-full z-10 relative">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] text-dusty-rose font-bold uppercase tracking-wider block">Support</span>
          <h2 className="text-2xl font-bold text-charcoal">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-2xl bg-white border border-lavender-grey/30 overflow-hidden transition-all shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left flex justify-between items-center text-xs font-bold text-charcoal hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-lavender-grey-dark transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-xs text-charcoal-light leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 13. NEWSLETTER */}
      <section className="px-6 py-16 bg-white/40 border-t border-b border-lavender-grey/25 z-10 relative">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[10px] text-dusty-rose font-bold uppercase tracking-widest block">Design Letters</span>
          <h2 className="text-2xl font-bold text-charcoal">Subscribe to Aurora Design Journals</h2>
          <p className="text-xs text-charcoal-light max-w-sm mx-auto">Get monthly curated material trends, spatial math tips, and early access to designer catalogs.</p>

          <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed successfully!"); }} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 bg-white border border-lavender-grey/35 rounded-xl px-4 py-3 text-xs text-charcoal placeholder-gray-400 focus:outline-none focus:border-dusty-rose transition-all shadow-inner"
            />
            <button type="submit" className="btn-primary px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Pre-footer CTA */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center space-y-6 z-10 relative">
        <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">Ready to Synthesize Your Space?</h2>
        <p className="text-xs text-charcoal-light max-w-sm mx-auto">Launch a guided design session with Aurora and get customized paint, tile, and layout blueprints.</p>
        <div className="flex justify-center pt-2">
          <Link
            href={destination}
            className="btn-primary px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
