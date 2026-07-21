"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Sparkles, Upload, FileImage } from 'lucide-react';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const productSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  category: z.enum(['furniture', 'lighting', 'flooring', 'paint', 'decor']),
  subCategory: z.string(),
  brand: z.string().min(1, { message: "Brand name is required." }),
  shortDescription: z.string().min(10, { message: "Short description must be at least 10 characters." }),
  description: z.string().min(20, { message: "Full description must be at least 20 characters." }),
  price: z.number().min(0.01, { message: "Price must be greater than zero." }),
  discount: z.number().min(0).max(100),
  stock: z.number().int().min(0, { message: "Stock cannot be negative." }),
  roomType: z.string(),
  material: z.string(),
  color: z.string(),
  width: z.number(),
  height: z.number(),
  length: z.number(),
  sqFtCoverage: z.number(),
  style: z.string(),
  finish: z.string(),
  image: z.string().url({ message: "Provide a valid image URL." }),
  gallery: z.array(z.string()),
  featured: z.boolean(),
  trending: z.boolean()
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: 'furniture',
      subCategory: '',
      brand: 'Aurora Custom',
      shortDescription: '',
      description: '',
      price: 0,
      discount: 0,
      stock: 50,
      roomType: 'living-room',
      material: 'Oak Wood',
      color: 'Warm Beige',
      width: 0,
      height: 0,
      length: 0,
      sqFtCoverage: 0,
      style: 'Japandi',
      finish: 'Matte Oil',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
      gallery: [],
      featured: false,
      trending: false
    }
  });

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitting(true);
    try {
      await axios.post(`${SERVER_URL}/api/admin/products`, data);
      toast.success('Product asset published successfully!');
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to publish product asset.');
    } finally {
      setSubmitting(false);
    }
  };

  // Mock upload or quick url setter helper
  const handleAutoSuggestImage = () => {
    const images: Record<string, string> = {
      furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
      lighting: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
      flooring: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80',
      paint: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=600&q=80',
      decor: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
    };
    const cat = watch('category');
    setValue('image', images[cat] || images.furniture);
    toast.success('Injected mock interior photography matching category!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/admin/products')}
          className="p-1.5 border border-lavender-grey/35 rounded-xl hover:bg-white text-charcoal"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider">Publish Store Asset</h2>
          <p className="text-[10px] text-gray-400">Inject new physical details directly to our MongoDB catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Core details layout */}
        <div className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/30 space-y-4">
          <h3 className="text-xs font-bold text-charcoal border-b border-lavender-grey/25 pb-2 uppercase tracking-widest">1. General Assets Info</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product Name</label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Astrid Bouclé Accent Sofa"
                className={`w-full bg-white border ${errors.name ? 'border-rose-500' : 'border-lavender-grey/35'} rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-dusty-rose`}
              />
              {errors.name && <span className="text-[10px] text-rose-500 font-bold">{errors.name.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
                <select
                  {...register('category')}
                  className="bg-white border border-lavender-grey/35 px-4 py-2.5 rounded-xl text-xs text-charcoal focus:outline-none focus:border-dusty-rose"
                >
                  <option value="furniture">Furniture</option>
                  <option value="lighting">Lighting</option>
                  <option value="flooring">Flooring</option>
                  <option value="paint">Paint</option>
                  <option value="decor">Decor</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sub Category</label>
                <input
                  type="text"
                  {...register('subCategory')}
                  placeholder="e.g. Sofa Chairs"
                  className="bg-white border border-lavender-grey/35 px-4 py-2.5 rounded-xl text-xs text-charcoal focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Brand Manufacturer</label>
              <input
                type="text"
                {...register('brand')}
                className="bg-white border border-lavender-grey/35 px-4 py-2.5 rounded-xl text-xs text-charcoal focus:outline-none focus:border-dusty-rose"
              />
              {errors.brand && <span className="text-[10px] text-rose-500 font-bold">{errors.brand.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price (USD)</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className={`w-full bg-white border ${errors.price ? 'border-rose-500' : 'border-lavender-grey/35'} rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-dusty-rose`}
              />
              {errors.price && <span className="text-[10px] text-rose-500 font-bold">{errors.price.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock Units</label>
              <input
                type="number"
                {...register('stock', { valueAsNumber: true })}
                className={`w-full bg-white border ${errors.stock ? 'border-rose-500' : 'border-lavender-grey/35'} rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-dusty-rose`}
              />
              {errors.stock && <span className="text-[10px] text-rose-500 font-bold">{errors.stock.message}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Short Summary Description</label>
            <input
              type="text"
              {...register('shortDescription')}
              placeholder="Write a brief one-line description..."
              className={`w-full bg-white border ${errors.shortDescription ? 'border-rose-500' : 'border-lavender-grey/35'} rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-dusty-rose`}
            />
            {errors.shortDescription && <span className="text-[10px] text-rose-500 font-bold">{errors.shortDescription.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Catalog Description</label>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="Write detailed specifications, craftsmanship notes..."
              className={`w-full bg-white border ${errors.description ? 'border-rose-500' : 'border-lavender-grey/35'} rounded-2xl p-4 text-xs focus:outline-none focus:border-dusty-rose resize-none`}
            />
            {errors.description && <span className="text-[10px] text-rose-500 font-bold">{errors.description.message}</span>}
          </div>

        </div>

        {/* Technical Specs Layout */}
        <div className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/30 space-y-4">
          <h3 className="text-xs font-bold text-charcoal border-b border-lavender-grey/25 pb-2 uppercase tracking-widest">2. Dimensional & Material Specs</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Width (in)</label>
              <input
                type="number"
                {...register('width', { valueAsNumber: true })}
                className="bg-white border border-lavender-grey/35 px-4 py-2.5 rounded-xl text-xs text-charcoal"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Height (in)</label>
              <input
                type="number"
                {...register('height', { valueAsNumber: true })}
                className="bg-white border border-lavender-grey/35 px-4 py-2.5 rounded-xl text-xs text-charcoal"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Length (in)</label>
              <input
                type="number"
                {...register('length', { valueAsNumber: true })}
                className="bg-white border border-lavender-grey/35 px-4 py-2.5 rounded-xl text-xs text-charcoal"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Coverage (sq ft)</label>
              <input
                type="number"
                {...register('sqFtCoverage', { valueAsNumber: true })}
                className="bg-white border border-lavender-grey/35 px-4 py-2.5 rounded-xl text-xs text-charcoal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Room Type Zoned</label>
              <input
                type="text"
                {...register('roomType')}
                className="bg-white border border-lavender-grey/35 px-4 py-2.5 rounded-xl text-xs text-charcoal"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Material Construct</label>
              <input
                type="text"
                {...register('material')}
                className="bg-white border border-lavender-grey/35 px-4 py-2.5 rounded-xl text-xs text-charcoal"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accent Color</label>
              <input
                type="text"
                {...register('color')}
                className="bg-white border border-lavender-grey/35 px-4 py-2.5 rounded-xl text-xs text-charcoal"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Finish / Coating</label>
              <input
                type="text"
                {...register('finish')}
                className="bg-white border border-lavender-grey/35 px-4 py-2.5 rounded-xl text-xs text-charcoal"
              />
            </div>
          </div>
        </div>

        {/* Media & Badges */}
        <div className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/30 space-y-4">
          <h3 className="text-xs font-bold text-charcoal border-b border-lavender-grey/25 pb-2 uppercase tracking-widest">3. Media Assets & Promo Tags</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Main Product Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                {...register('image')}
                className={`flex-1 bg-white border ${errors.image ? 'border-rose-500' : 'border-lavender-grey/35'} rounded-xl px-4 py-2.5 text-xs focus:outline-none`}
              />
              <button
                type="button"
                onClick={handleAutoSuggestImage}
                className="btn-secondary px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-dusty-rose" />
                Mock Visual
              </button>
            </div>
            {errors.image && <span className="text-[10px] text-rose-500 font-bold">{errors.image.message}</span>}
          </div>

          <div className="flex gap-6 border-t border-lavender-grey/20 pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-charcoal">
              <input
                type="checkbox"
                {...register('featured')}
                className="w-4.5 h-4.5 accent-dusty-rose rounded border-lavender-grey/35"
              />
              Featured Product Showcase
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-charcoal">
              <input
                type="checkbox"
                {...register('trending')}
                className="w-4.5 h-4.5 accent-dusty-rose rounded border-lavender-grey/35"
              />
              Trending Product Tag
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
        >
          <Save className="w-4.5 h-4.5" />
          {submitting ? 'Publishing Asset...' : 'Publish Product Asset'}
        </button>

      </form>
      
    </div>
  );
}
