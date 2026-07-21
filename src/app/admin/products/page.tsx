"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Search, ChevronLeft, ChevronRight, Plus, Pencil, Trash2, Eye, Star, AlertTriangle } from 'lucide-react';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminProductsManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [viewingProduct, setViewingProduct] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // 1. Fetch products
  const { data, isLoading } = useQuery({
    queryKey: ['adminProducts', search, category, page],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/admin/products`, {
        params: { search, category, page, limit: 6 }
      });
      return res.data;
    }
  });

  // 2. Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${SERVER_URL}/api/admin/products/${id}`);
    },
    onSuccess: () => {
      toast.success('Product asset deleted successfully!');
      setConfirmDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
    onError: () => toast.error('Failed to delete product asset.')
  });

  const products = data?.products || [];
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 };

  return (
    <div className="space-y-6">
      
      {/* Header controls bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-lavender-grey/30 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products catalog..."
            className="w-full pl-10 pr-4 py-2 border border-lavender-grey/35 rounded-xl text-xs bg-white text-charcoal focus:outline-none focus:border-dusty-rose transition-all"
          />
        </div>

        {/* Action + category filter */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="bg-white border border-lavender-grey/35 px-4 py-2 rounded-xl text-xs text-charcoal focus:outline-none focus:border-dusty-rose"
          >
            <option value="">All Categories</option>
            <option value="furniture">Furniture</option>
            <option value="lighting">Lighting</option>
            <option value="flooring">Flooring</option>
            <option value="paint">Paint</option>
            <option value="decor">Decor</option>
          </select>

          <Link
            href="/admin/products/add"
            className="btn-primary py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

      </div>

      {/* Catalog Table */}
      <div className="glass-panel rounded-3xl bg-white border border-lavender-grey/30 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="bg-slate-100/50 h-12 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-500 font-bold">No product assets found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-lavender-grey/25 text-gray-400 font-bold uppercase tracking-wider bg-slate-50/50">
                  <th className="p-4">Image</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => (
                  <tr key={p._id || p.id} className="border-b border-lavender-grey/20 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-lavender-grey/25 bg-black/5" />
                    </td>
                    <td className="p-4 font-bold text-charcoal min-w-[120px]">
                      {p.name}
                    </td>
                    <td className="p-4 capitalize text-gray-500 font-medium">
                      {p.category}
                    </td>
                    <td className="p-4 text-gray-500">
                      {p.brand || 'Aurora Design'}
                    </td>
                    <td className="p-4 font-bold text-dusty-rose">
                      ${p.price.toLocaleString()}
                    </td>
                    <td className="p-4 font-medium text-charcoal">
                      {p.stock} units
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 font-bold text-charcoal leading-none">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        {p.rating?.toFixed(1) || '5.0'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => setViewingProduct(p)}
                          className="p-1.5 hover:text-dusty-rose hover:bg-lavender-grey/10 rounded-lg text-gray-400 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <Link
                          href={`/admin/products/edit/${p._id || p.id}`}
                          className="p-1.5 hover:text-dusty-rose hover:bg-lavender-grey/10 rounded-lg text-gray-400 transition-colors inline-block"
                          title="Edit Product"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setConfirmDeleteId(p._id || p.id)}
                          className="p-1.5 hover:text-rose-500 hover:bg-rose-50 rounded-lg text-gray-400 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination navigation controls */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-lavender-grey/25 bg-slate-50/50">
            <span className="text-[10px] text-gray-400 font-bold">Showing Page {pagination.page} of {pagination.pages}</span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 border border-lavender-grey/30 rounded-lg hover:bg-white disabled:opacity-50 transition-all text-charcoal"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page === pagination.pages}
                onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
                className="p-1.5 border border-lavender-grey/30 rounded-lg hover:bg-white disabled:opacity-50 transition-all text-charcoal"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product detail view modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-sm p-4">
          <div className="bg-ivory border border-lavender-grey/30 w-full max-w-lg rounded-3xl p-6 shadow-xl relative overflow-y-auto max-h-[85vh] space-y-4">
            <div className="flex justify-between items-start border-b border-lavender-grey/20 pb-3">
              <div>
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Product Asset Sheet</h3>
                <p className="text-[9px] text-gray-400 font-mono mt-0.5">Asset ID: {viewingProduct._id || viewingProduct.id}</p>
              </div>
              <span className="text-[10px] bg-dusty-rose/10 border border-dusty-rose/25 text-dusty-rose font-bold px-2 py-0.5 rounded-full capitalize">
                {viewingProduct.category}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="aspect-video sm:aspect-square w-full rounded-2xl overflow-hidden bg-black/5 border border-lavender-grey/25">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={viewingProduct.image} alt={viewingProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-charcoal-light">
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">Name</span>
                  <p className="font-bold text-charcoal">{viewingProduct.name}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">Brand</span>
                  <p className="font-bold text-charcoal">{viewingProduct.brand || 'Aurora Design'}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Price</span>
                    <p className="font-bold text-dusty-rose">${viewingProduct.price}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Stock</span>
                    <p className="font-bold text-charcoal">{viewingProduct.stock} units</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs leading-relaxed space-y-2 border-t border-lavender-grey/20 pt-3">
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-400 block">Description</span>
                <p className="text-charcoal-light">{viewingProduct.description}</p>
              </div>
              {viewingProduct.roomType && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Room Target</span>
                    <p className="font-bold text-charcoal uppercase tracking-wider">{viewingProduct.roomType}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 block">Material</span>
                    <p className="font-bold text-charcoal capitalize">{viewingProduct.material || 'Organic'}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setViewingProduct(null)}
              className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow"
            >
              Close Asset Sheet
            </button>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-sm p-4">
          <div className="bg-white border border-lavender-grey/30 w-full max-w-sm rounded-3xl p-6 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-charcoal uppercase tracking-wider">Confirm asset destruction</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Are you absolutely sure you want to permanently delete this product from the marketplace database?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 btn-secondary py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProductMutation.mutate(confirmDeleteId)}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow"
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
