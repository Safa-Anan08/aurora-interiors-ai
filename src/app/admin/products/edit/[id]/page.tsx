"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

const SERVER_URL = 'http://localhost:5000';

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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema)
  });

  // 1. Fetch active product details
  const { data: product, isLoading } = useQuery({
    queryKey: ['adminEditProduct', id],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/marketplace/products/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  // 2. Pre-fill form when product loads
  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        category: product.category || 'furniture',
        subCategory: product.subCategory || '',
        brand: product.brand || 'Aurora Custom',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        price: product.price || 0,
        discount: product.discount || 0,
        stock: product.stock || 50,
        roomType: product.roomType || '',
        material: product.material || '',
        color: product.color || '',
        width: product.width || 0,
        height: product.height || 0,
        length: product.length || 0,
        sqFtCoverage: product.sqFtCoverage || 0,
        style: product.style || '',
        finish: product.finish || '',
        image: product.image || '',
        gallery: product.gallery || [],
        featured: !!product.featured,
        trending: !!product.trending
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitting(true);
    try {
      await axios.put(`${SERVER_URL}/api/admin/products/${id}`, data);
      toast.success('Product asset revised successfully!');
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      router.push('/admin/products');
    } catch (err: any) {
      toast.error('Failed to revise product asset.');
    } finally {
      setSubmitting(false);
    }
  };

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
  };

  if (isLoading) {
    return <div className="text-center py-12 text-xs font-bold text-gray-500 animate-pulse">Loading Product Sheet...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/admin/products')}
          className="p-1.5 border border-lavender-grey/35 rounded-xl hover:bg-white text-charcoal"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider">Revise Product Sheet</h2>
          <p className="text-[10px] text-gray-400">Modify properties of catalog asset: {id}</p>
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
                className={`w-full bg-white border ${errors.name ? 'border-rose-500' : 'border-lavender-grey/35'} rounded-xl px-4 py-2.5 text-xs focus:outline-none`}
              />
              {errors.name && <span className="text-[10px] text-rose-500 font-bold">{errors.name.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
                <select
                  {...register('category')}
                  className="bg-white border border-lavender-grey/35 px-4 py-2.5 rounded-xl text-xs text-charcoal focus:outline-none"
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
                className="bg-white border border-lavender-grey/35 px-4 py-2.5 rounded-xl text-xs text-charcoal focus:outline-none"
              />
              {errors.brand && <span className="text-[10px] text-rose-500 font-bold">{errors.brand.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price (USD)</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="bg-white border border-lavender-grey/35 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock Units</label>
              <input
                type="number"
                {...register('stock', { valueAsNumber: true })}
                className="bg-white border border-lavender-grey/35 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Short Summary Description</label>
            <input
              type="text"
              {...register('shortDescription')}
              className="bg-white border border-lavender-grey/35 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Catalog Description</label>
            <textarea
              rows={4}
              {...register('description')}
              className="bg-white border border-lavender-grey/35 rounded-2xl p-4 text-xs text-charcoal focus:outline-none resize-none"
            />
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
                className="flex-1 bg-white border border-lavender-grey/35 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
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
          {submitting ? 'Revising Asset...' : 'Save Product Revisions'}
        </button>

      </form>
      
    </div>
  );
}
