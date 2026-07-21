"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Sparkles, Plus, Trash, Loader2 } from 'lucide-react';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ColorSwatch {
  name: string;
  hex: string;
}

export default function EditDesignPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Core Form States
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('Japandi');
  const [roomType, setRoomType] = useState('Living Room');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');
  const [budget, setBudget] = useState('moderate');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  // Array / Multi-line Text States
  const [layoutStepsText, setLayoutStepsText] = useState('');
  const [specificationsText, setSpecificationsText] = useState('');
  const [materialsText, setMaterialsText] = useState('');
  const [furnitureText, setFurnitureText] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [galleryText, setGalleryText] = useState('');

  // Complex States
  const [colors, setColors] = useState<ColorSwatch[]>([]);
  const [recommendedProductIds, setRecommendedProductIds] = useState<string[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // 1. Fetch products catalog and Design data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products
        setLoadingProducts(true);
        const productsRes = await axios.get(`${SERVER_URL}/api/marketplace/products`, {
          params: { limit: 100 }
        });
        const items = productsRes.data.data ?? productsRes.data;
        if (Array.isArray(items)) {
          setAvailableProducts(items);
        }
        setLoadingProducts(false);

        // Fetch design
        const designRes = await axios.get(`${SERVER_URL}/api/admin/designs/${id}`);
        const design = designRes.data.design;
        
        if (design) {
          setTitle(design.title || '');
          setStyle(design.style || 'Japandi');
          setRoomType(design.roomType || 'Living Room');
          setDesc(design.desc || '');
          setImg(design.img || '');
          setBudget(design.budget || 'moderate');
          setFeatured(!!design.featured);
          setPublished(!!design.published);
          
          setLayoutStepsText(design.layoutSteps?.join('\n') || '');
          setSpecificationsText(design.specifications?.join('\n') || '');
          setMaterialsText(design.materials?.join('\n') || '');
          setFurnitureText(design.furniture?.join('\n') || '');
          setGalleryText(design.gallery?.join('\n') || '');
          setTagsText(design.tags?.join(', ') || '');
          
          setColors(design.colors || []);
          setRecommendedProductIds(design.recommendedProductIds?.map((p: any) => typeof p === 'object' && p !== null ? p._id || p.id : p) || []);
        }
      } catch (err: any) {
        toast.error('Failed to load design concept details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleAddColor = () => {
    setColors([...colors, { name: '', hex: '#ffffff' }]);
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, idx) => idx !== index));
  };

  const handleColorChange = (index: number, key: keyof ColorSwatch, val: string) => {
    const updated = [...colors];
    updated[index][key] = val;
    setColors(updated);
  };

  const handleToggleProduct = (prodId: string) => {
    if (recommendedProductIds.includes(prodId)) {
      setRecommendedProductIds(recommendedProductIds.filter(pid => pid !== prodId));
    } else {
      setRecommendedProductIds([...recommendedProductIds, prodId]);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc || !img || !style || !roomType) {
      toast.error('Please fill in all general required fields.');
      return;
    }

    setSubmitting(true);

    // Process lists
    const layoutSteps = layoutStepsText.split('\n').map(s => s.trim()).filter(Boolean);
    const specifications = specificationsText.split('\n').map(s => s.trim()).filter(Boolean);
    const materials = materialsText.split('\n').map(s => s.trim()).filter(Boolean);
    const furniture = furnitureText.split('\n').map(s => s.trim()).filter(Boolean);
    const gallery = galleryText.split('\n').map(s => s.trim()).filter(Boolean);
    const tags = tagsText.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      title,
      style,
      roomType,
      desc,
      img,
      budget,
      featured,
      published,
      layoutSteps,
      specifications,
      materials,
      furniture,
      gallery,
      tags,
      colors: colors.filter(c => c.name && c.hex),
      recommendedProductIds
    };

    try {
      await axios.put(`${SERVER_URL}/api/admin/designs/${id}`, payload);
      toast.success('Design concept updated successfully in MongoDB!');
      router.push('/admin/designs');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to update design concept.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoSuggestImage = () => {
    const images: Record<string, string> = {
      japandi: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
      scandinavian: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
      industrial: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
      bohemian: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      minimalist: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80'
    };
    const styleKey = style.toLowerCase();
    setImg(images[styleKey] || images.japandi);
    toast.success('Injected mock interior photography matching style!');
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center gap-2 text-gray-500 font-bold text-xs uppercase animate-pulse">
        <Loader2 className="w-5 h-5 animate-spin text-dusty-rose" />
        Pulling design properties...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/admin/designs')}
          className="p-1.5 border border-lavender-grey/35 rounded-xl hover:bg-white text-charcoal"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider">Modify Design Board</h2>
          <p className="text-[10px] text-gray-400">Edit design specs, style notes, color swatches, or publishing status.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        
        {/* 1. General Details */}
        <div className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/30 space-y-4">
          <h3 className="text-xs font-bold text-charcoal border-b border-lavender-grey/25 pb-2 uppercase tracking-widest">1. General Concept Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Design Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modernist Cozy Bedroom"
                className="w-full bg-white border border-lavender-grey/35 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-dusty-rose"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="bg-white border border-lavender-grey/35 px-2 py-2.5 rounded-xl text-xs text-charcoal focus:outline-none focus:border-dusty-rose"
                >
                  <option value="Japandi">Japandi</option>
                  <option value="Scandinavian">Scandinavian</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Bohemian">Bohemian</option>
                  <option value="Minimalist">Minimalist</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Room Type</label>
                <input
                  type="text"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  placeholder="e.g. Bedroom"
                  className="w-full bg-white border border-lavender-grey/35 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-dusty-rose"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Budget Tier</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="bg-white border border-lavender-grey/35 px-2 py-2.5 rounded-xl text-xs text-charcoal focus:outline-none focus:border-dusty-rose"
                >
                  <option value="budget">Budget</option>
                  <option value="moderate">Moderate</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Overview Description</label>
            <textarea
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Provide a comprehensive narrative of the space, mood, lighting, and creative direction..."
              className="w-full bg-white border border-lavender-grey/35 rounded-2xl p-4 text-xs focus:outline-none focus:border-dusty-rose resize-none"
              required
            />
          </div>
        </div>

        {/* 2. Lists & Steps */}
        <div className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/30 space-y-4">
          <h3 className="text-xs font-bold text-charcoal border-b border-lavender-grey/25 pb-2 uppercase tracking-widest">2. Layout execution & specifications</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Layout Steps (One step per line)</label>
              <textarea
                rows={5}
                value={layoutStepsText}
                onChange={(e) => setLayoutStepsText(e.target.value)}
                placeholder="e.g. Place the floating oak desk near the window.&#10;Install soft LED track lighting."
                className="w-full bg-white border border-lavender-grey/35 rounded-xl p-3 text-xs focus:outline-none focus:border-dusty-rose font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Technical Specifications (One item per line)</label>
              <textarea
                rows={5}
                value={specificationsText}
                onChange={(e) => setSpecificationsText(e.target.value)}
                placeholder="e.g. Dimensions: 12' x 14'&#10;Flooring: Nordic Oak Planks"
                className="w-full bg-white border border-lavender-grey/35 rounded-xl p-3 text-xs focus:outline-none focus:border-dusty-rose font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Materials Used (One per line)</label>
              <textarea
                rows={3}
                value={materialsText}
                onChange={(e) => setMaterialsText(e.target.value)}
                placeholder="Teak Wood&#10;Bouclé"
                className="w-full bg-white border border-lavender-grey/35 rounded-xl p-3 text-xs focus:outline-none focus:border-dusty-rose"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Furniture Included (One per line)</label>
              <textarea
                rows={3}
                value={furnitureText}
                onChange={(e) => setFurnitureText(e.target.value)}
                placeholder="Kyoto Desk&#10;Astrid Sofa"
                className="w-full bg-white border border-lavender-grey/35 rounded-xl p-3 text-xs focus:outline-none focus:border-dusty-rose"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tags (Comma-separated)</label>
              <textarea
                rows={3}
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="Cozy, Workspace, Minimalist"
                className="w-full bg-white border border-lavender-grey/35 rounded-xl p-3 text-xs focus:outline-none focus:border-dusty-rose"
              />
            </div>
          </div>
        </div>

        {/* 3. Media & Swatches */}
        <div className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/30 space-y-4">
          <h3 className="text-xs font-bold text-charcoal border-b border-lavender-grey/25 pb-2 uppercase tracking-widest">3. Visual Media & Color Palette</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Main Cover Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={img}
                onChange={(e) => setImg(e.target.value)}
                className="flex-1 bg-white border border-lavender-grey/35 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={handleAutoSuggestImage}
                className="btn-secondary px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-dusty-rose" />
                Auto Image
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gallery Images (One URL per line)</label>
            <textarea
              rows={3}
              value={galleryText}
              onChange={(e) => setGalleryText(e.target.value)}
              placeholder="https://example.com/gallery1.jpg&#10;https://example.com/gallery2.jpg"
              className="w-full bg-white border border-lavender-grey/35 rounded-xl p-3 text-xs focus:outline-none focus:border-dusty-rose font-mono"
            />
          </div>

          {/* Color Palette List */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Selected Color Swatches</label>
              <button
                type="button"
                onClick={handleAddColor}
                className="text-[10px] text-dusty-rose hover:text-dusty-rose/80 font-bold uppercase flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Color
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {colors.map((col, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-slate-50/50 p-2.5 rounded-xl border border-lavender-grey/20">
                  <input
                    type="color"
                    value={col.hex}
                    onChange={(e) => handleColorChange(idx, 'hex', e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-lavender-grey/30 bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={col.name}
                    onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                    placeholder="Color Name (e.g. Sage Green)"
                    className="flex-1 bg-white border border-lavender-grey/35 rounded-lg px-2.5 py-1 text-[11px] focus:outline-none"
                    required
                  />
                  {colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(idx)}
                      className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors shrink-0"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Link Marketplace Products */}
        <div className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/30 space-y-4">
          <h3 className="text-xs font-bold text-charcoal border-b border-lavender-grey/25 pb-2 uppercase tracking-widest">4. Link Marketplace Products</h3>
          
          {loadingProducts ? (
            <p className="text-xs text-gray-400 animate-pulse font-medium">Loading products list...</p>
          ) : availableProducts.length === 0 ? (
            <p className="text-xs text-gray-500 font-medium">No products found in marketplace database.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2">
              {availableProducts.map((p) => {
                const isChecked = recommendedProductIds.includes(p.id || p._id);
                return (
                  <label 
                    key={p.id || p._id} 
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                      isChecked 
                        ? 'border-dusty-rose/30 bg-dusty-rose/5' 
                        : 'border-lavender-grey/25 hover:bg-slate-55/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleProduct(p.id || p._id)}
                      className="w-4 h-4 accent-dusty-rose rounded"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover bg-black/5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-charcoal truncate">{p.name}</p>
                      <p className="text-[9px] text-gray-400 capitalize">{p.category} • ${p.price}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Status Settings */}
        <div className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/30 flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-charcoal select-none">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4.5 h-4.5 accent-dusty-rose rounded border-lavender-grey/35"
            />
            Featured Concept Board
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-charcoal select-none">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4.5 h-4.5 accent-dusty-rose rounded border-lavender-grey/35"
            />
            Publish (Visible to public)
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
        >
          <Save className="w-4.5 h-4.5" />
          {submitting ? 'Saving Updates...' : 'Save Updates'}
        </button>

      </form>
      
    </div>
  );
}
