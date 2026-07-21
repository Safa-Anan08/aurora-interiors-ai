"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Search, ChevronLeft, ChevronRight, Plus, Pencil, Trash2, Eye, Sparkles, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDesignsManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [style, setStyle] = useState('');
  const [page, setPage] = useState(1);
  const [viewingDesign, setViewingDesign] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // 1. Fetch designs
  const { data, isLoading } = useQuery({
    queryKey: ['adminDesigns', search, style, page],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/admin/designs`, {
        params: { search, style, page, limit: 6 }
      });
      return res.data;
    }
  });

  // 2. Delete design mutation
  const deleteDesignMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${SERVER_URL}/api/admin/designs/${id}`);
    },
    onSuccess: () => {
      toast.success('Design concept deleted successfully!');
      setConfirmDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['adminDesigns'] });
    },
    onError: () => toast.error('Failed to delete design concept.')
  });

  const designs = data?.designs || [];
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 };

  const styleOptions = ['Japandi', 'Scandinavian', 'Industrial', 'Bohemian', 'Minimalist'];

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
            placeholder="Search design concepts..."
            className="w-full pl-10 pr-4 py-2 border border-lavender-grey/35 rounded-xl text-xs bg-white text-charcoal focus:outline-none focus:border-dusty-rose transition-all"
          />
        </div>

        {/* Action + Style filter */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={style}
            onChange={(e) => { setStyle(e.target.value); setPage(1); }}
            className="bg-white border border-lavender-grey/35 px-4 py-2 rounded-xl text-xs text-charcoal focus:outline-none focus:border-dusty-rose font-semibold"
          >
            <option value="">All Styles</option>
            {styleOptions.map((st) => (
              <option key={st} value={st.toLowerCase()}>{st}</option>
            ))}
          </select>

          <Link
            href="/admin/designs/add"
            className="btn-primary py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Design
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
        ) : designs.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-500 font-bold">No design concepts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-lavender-grey/25 text-gray-400 font-bold uppercase tracking-wider bg-slate-50/50">
                  <th className="p-4">Preview</th>
                  <th className="p-4">Design Title</th>
                  <th className="p-4">Style</th>
                  <th className="p-4">Room Type</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {designs.map((d: any) => (
                  <tr key={d._id || d.id} className="border-b border-lavender-grey/20 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={d.img} alt={d.title} className="w-10 h-10 rounded-xl object-cover border border-lavender-grey/25 bg-black/5" />
                    </td>
                    <td className="p-4 font-bold text-charcoal min-w-[120px]">
                      {d.title}
                    </td>
                    <td className="p-4 capitalize text-gray-500 font-medium">
                      {d.style}
                    </td>
                    <td className="p-4 text-gray-500">
                      {d.roomType}
                    </td>
                    <td className="p-4">
                      {d.featured ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-250">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-medium">Standard</span>
                      )}
                    </td>
                    <td className="p-4">
                      {d.published ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-250">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-550 bg-slate-50 px-2 py-0.5 rounded-full font-medium border border-slate-200">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400 font-medium">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => setViewingDesign(d)}
                          className="p-1.5 hover:text-dusty-rose hover:bg-lavender-grey/10 rounded-lg text-gray-400 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <Link
                          href={`/admin/designs/edit/${d._id || d.id}`}
                          className="p-1.5 hover:text-dusty-rose hover:bg-lavender-grey/10 rounded-lg text-gray-400 transition-colors inline-block"
                          title="Edit Design"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setConfirmDeleteId(d._id || d.id)}
                          className="p-1.5 hover:text-rose-500 hover:bg-rose-50 rounded-lg text-gray-400 transition-colors"
                          title="Delete Design"
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

        {/* Pagination controls */}
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

      {/* Design Detail View Modal */}
      {viewingDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-sm p-4">
          <div className="bg-ivory border border-lavender-grey/30 w-full max-w-2xl rounded-3xl p-6 shadow-xl relative overflow-y-auto max-h-[85vh] space-y-4">
            <div className="flex justify-between items-start border-b border-lavender-grey/20 pb-3">
              <div>
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Design Concept Sheet</h3>
                <p className="text-[9px] text-gray-400 font-mono mt-0.5">Concept ID: {viewingDesign._id || viewingDesign.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-dusty-rose/10 border border-dusty-rose/25 text-dusty-rose font-bold px-2 py-0.5 rounded-full capitalize">
                  {viewingDesign.style}
                </span>
                <span className="text-[10px] bg-charcoal/10 border border-charcoal/20 text-charcoal font-bold px-2 py-0.5 rounded-full capitalize">
                  {viewingDesign.roomType}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black/5 border border-lavender-grey/25">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={viewingDesign.img} alt={viewingDesign.title} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-charcoal-light">
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">Title</span>
                  <p className="font-bold text-charcoal">{viewingDesign.title}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">Budget Tier</span>
                  <p className="font-bold text-charcoal capitalize">{viewingDesign.budget || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">Colors Swatches</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {viewingDesign.colors?.map((col: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-white border border-lavender-grey/25 p-1 pr-2 rounded-xl text-[10px]">
                        <div className="w-3.5 h-3.5 rounded-md border border-black/10 shadow-sm" style={{ backgroundColor: col.hex }} />
                        <span className="font-bold">{col.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs leading-relaxed space-y-3 border-t border-lavender-grey/20 pt-3">
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">Concept Description</span>
                <p className="text-charcoal-light leading-relaxed">{viewingDesign.desc}</p>
              </div>

              {viewingDesign.layoutSteps && viewingDesign.layoutSteps.length > 0 && (
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">Layout execution steps</span>
                  <ul className="list-decimal pl-4 mt-1 space-y-1 text-charcoal-light">
                    {viewingDesign.layoutSteps.map((step: string, idx: number) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border-t border-lavender-grey/20 pt-3">
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">Specifications</span>
                  <p className="text-charcoal-light mt-0.5">{viewingDesign.specifications?.join(', ') || 'None'}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">Tags</span>
                  <p className="text-charcoal-light mt-0.5">{viewingDesign.tags?.join(', ') || 'None'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setViewingDesign(null)}
              className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow"
            >
              Close sheet view
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-sm p-4">
          <div className="bg-white border border-lavender-grey/30 w-full max-w-sm rounded-3xl p-6 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-charcoal uppercase tracking-wider">Confirm Design Deletion</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Are you absolutely sure you want to permanently delete this design concept? This action is irreversible.
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
                onClick={() => deleteDesignMutation.mutate(confirmDeleteId)}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
