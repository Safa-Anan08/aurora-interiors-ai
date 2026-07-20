"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Star, CheckCircle2, XCircle, Trash2, ShieldAlert } from 'lucide-react';

const SERVER_URL = 'http://localhost:5000';

export default function AdminReviewsManagement() {
  const queryClient = useQueryClient();

  // 1. Fetch reviews
  const { data, isLoading } = useQuery({
    queryKey: ['adminReviews'],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/admin/reviews`);
      return res.data;
    }
  });

  // 2. Mutations
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await axios.put(`${SERVER_URL}/api/admin/reviews/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success('Review status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
    },
    onError: () => toast.error('Failed to update review status.')
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${SERVER_URL}/api/admin/reviews/${id}`);
    },
    onSuccess: () => {
      toast.success('Review deleted permanently.');
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
    },
    onError: () => toast.error('Failed to delete review.')
  });

  const reviews = data?.reviews || [];

  return (
    <div className="space-y-6">
      
      {/* Table list of reviews */}
      <div className="glass-panel rounded-3xl bg-white border border-lavender-grey/30 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-slate-100/50 h-12 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-500 font-bold">No product reviews recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-lavender-grey/25 text-gray-400 font-bold uppercase tracking-wider bg-slate-50/50">
                  <th className="p-4">Product</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r: any) => (
                  <tr key={r._id || r.id} className="border-b border-lavender-grey/20 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 min-w-[120px]">
                      <div className="flex items-center gap-3">
                        {r.product?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.product.image} alt={r.product.name} className="w-9 h-9 rounded-lg object-cover border border-lavender-grey/25 bg-black/5" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-dusty-rose/10 flex items-center justify-center text-dusty-rose font-bold">P</div>
                        )}
                        <div>
                          <div className="font-bold text-charcoal">{r.product?.name || 'Deleted Product'}</div>
                          <div className="text-[9px] text-gray-400 font-medium capitalize">{r.product?.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-charcoal">{r.user?.name || 'Guest Customer'}</div>
                      <div className="text-[9px] text-gray-400 font-medium">{r.user?.email || 'guest@mail.com'}</div>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 font-bold text-charcoal leading-none">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        {r.rating}.0
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 max-w-xs leading-relaxed truncate hover:text-clip hover:whitespace-normal">
                      "{r.comment}"
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                        r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        r.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-1.5">
                        <button
                          disabled={r.status === 'approved'}
                          onClick={() => updateStatusMutation.mutate({ id: r._id || r.id, status: 'approved' })}
                          className="p-1.5 border border-lavender-grey/35 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-30 transition-all"
                          title="Approve Review"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={r.status === 'rejected'}
                          onClick={() => updateStatusMutation.mutate({ id: r._id || r.id, status: 'rejected' })}
                          className="p-1.5 border border-lavender-grey/35 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 transition-all"
                          title="Reject Review"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteReviewMutation.mutate(r._id || r.id)}
                          className="p-1.5 border border-lavender-grey/35 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
