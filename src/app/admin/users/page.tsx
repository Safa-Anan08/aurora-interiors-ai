"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, ChevronLeft, ChevronRight, User as UserIcon, Trash2, Eye, Shield, CheckCircle, AlertTriangle, EyeOff } from 'lucide-react';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminUsersManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // 1. Fetch paginated users
  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', search, role, status, page],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/admin/users`, {
        params: { search, role, status, page, limit: 8 }
      });
      return res.data;
    }
  });

  // 2. Mutations
  const changeRoleMutation = useMutation({
    mutationFn: async ({ id, newRole }: { id: string; newRole: string }) => {
      await axios.put(`${SERVER_URL}/api/admin/users/${id}/role`, { role: newRole });
    },
    onSuccess: () => {
      toast.success('User privileges updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: () => toast.error('Failed to change user role.')
  });

  const changeStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
      await axios.put(`${SERVER_URL}/api/admin/users/${id}/status`, { status: newStatus });
    },
    onSuccess: () => {
      toast.success('User status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: () => toast.error('Failed to update user status.')
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${SERVER_URL}/api/admin/users/${id}`);
    },
    onSuccess: () => {
      toast.success('User account wiped from records.');
      setConfirmDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: () => toast.error('Failed to delete user.')
  });

  const handleRoleToggle = (user: any) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    changeRoleMutation.mutate({ id: user.id, newRole: nextRole });
  };

  const handleStatusToggle = (user: any) => {
    const nextStatus = user.status === 'disabled' ? 'active' : 'disabled';
    changeStatusMutation.mutate({ id: user.id, newStatus: nextStatus });
  };

  const handleDeleteConfirm = (id: string) => {
    deleteUserMutation.mutate(id);
  };

  const users = data?.users || [];
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 };

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-lavender-grey/30 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-lavender-grey/35 rounded-xl text-xs bg-white text-charcoal focus:outline-none focus:border-dusty-rose transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={role}
            onChange={(e) => { setRole(e.target.value); setPage(1); }}
            className="bg-white border border-lavender-grey/35 px-4 py-2 rounded-xl text-xs text-charcoal focus:outline-none focus:border-dusty-rose"
          >
            <option value="">All Roles</option>
            <option value="user">User Node</option>
            <option value="admin">Admin Node</option>
          </select>

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="bg-white border border-lavender-grey/35 px-4 py-2 rounded-xl text-xs text-charcoal focus:outline-none focus:border-dusty-rose"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-3xl bg-white border border-lavender-grey/30 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 space-y-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-slate-100/50 h-10 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-500 font-bold">No users match this filter search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-lavender-grey/25 text-gray-400 font-bold uppercase tracking-wider bg-slate-50/50">
                  <th className="p-4">Profile</th>
                  <th className="p-4">Name & Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Registration</th>
                  <th className="p-4 text-center">Orders</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b border-lavender-grey/20 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      {user.profilePic ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.profilePic} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-lavender-grey/20" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-dusty-rose/10 flex items-center justify-center text-dusty-rose font-bold">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="p-4 min-w-[150px]">
                      <div className="font-bold text-charcoal">{user.name}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{user.email}</div>
                    </td>
                    <td className="p-4 capitalize">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.role === 'admin' 
                          ? 'bg-dusty-rose/15 text-dusty-rose border border-dusty-rose/25' 
                          : 'bg-lavender-grey/15 text-lavender-grey-dark border border-lavender-grey/25'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center font-bold text-charcoal">
                      {user.totalOrders}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                        user.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {user.status === 'active' ? <CheckCircle className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => setViewingUser(user)}
                          className="p-1.5 hover:text-dusty-rose hover:bg-lavender-grey/10 rounded-lg text-gray-400 transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleRoleToggle(user)}
                          className="p-1.5 hover:text-dusty-rose hover:bg-lavender-grey/10 rounded-lg text-gray-400 transition-colors"
                          title="Toggle Role Admin/User"
                        >
                          <Shield className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleStatusToggle(user)}
                          className="p-1.5 hover:text-dusty-rose hover:bg-lavender-grey/10 rounded-lg text-gray-400 transition-colors"
                          title={user.status === 'active' ? 'Disable Account' : 'Enable Account'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setConfirmDeleteId(user.id)}
                          className="p-1.5 hover:text-rose-500 hover:bg-rose-50 rounded-lg text-gray-400 transition-colors"
                          title="Delete User"
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

      {/* User details profile modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-sm p-4">
          <div className="bg-ivory border border-lavender-grey/30 w-full max-w-md rounded-3xl p-6 shadow-xl relative space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-lavender-grey/20">
              <div className="w-10 h-10 rounded-full bg-dusty-rose/10 flex items-center justify-center text-dusty-rose font-bold text-sm uppercase">
                {viewingUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">User Profile Card</h3>
                <p className="text-[10px] text-gray-400 font-medium">Node ID: {viewingUser.id}</p>
              </div>
            </div>
            
            <div className="space-y-3 text-xs text-charcoal-light leading-relaxed">
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-400 block">Name</span>
                <p className="font-bold text-charcoal">{viewingUser.name}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-400 block">Email Address</span>
                <p className="font-bold text-charcoal">{viewingUser.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">Role Node</span>
                  <p className="font-bold text-charcoal capitalize">{viewingUser.role}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">Account Status</span>
                  <p className="font-bold text-charcoal capitalize">{viewingUser.status}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setViewingUser(null)}
              className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow mt-4"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-sm p-4">
          <div className="bg-white border border-lavender-grey/30 w-full max-w-sm rounded-3xl p-6 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-charcoal uppercase tracking-wider">Confirm Destruction</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Are you absolutely sure you want to permanently delete this user account? This action is irreversible.
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
                onClick={() => handleDeleteConfirm(confirmDeleteId)}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
