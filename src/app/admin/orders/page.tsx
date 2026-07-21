"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ClipboardList, ChevronLeft, ChevronRight, Truck, CheckSquare, XCircle, Search } from 'lucide-react';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminOrdersManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  // 1. Fetch orders
  const { data, isLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/admin/orders`);
      return res.data;
    }
  });

  // 2. Status updater mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
      await axios.put(`${SERVER_URL}/api/admin/orders/${id}/status`, { status: newStatus });
    },
    onSuccess: () => {
      toast.success('Order status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
    onError: () => toast.error('Failed to update order status.')
  });

  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, newStatus });
  };

  const rawOrders = data?.orders || [];

  // Client-side search matching
  const orders = rawOrders.filter((order: any) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      order._id.toLowerCase().includes(term) ||
      order.user?.name?.toLowerCase().includes(term) ||
      order.user?.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">

      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-lavender-grey/30 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders by Order ID or customer credentials..."
            className="w-full pl-10 pr-4 py-2 border border-lavender-grey/35 rounded-xl text-xs bg-white text-charcoal focus:outline-none focus:border-dusty-rose transition-all"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-3xl bg-white border border-lavender-grey/30 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-slate-100/50 h-20 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-500 font-bold">
            No orders found.
          </div>
        ) : (
          <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-lavender-grey/25 text-gray-400 font-bold uppercase tracking-wider bg-slate-50/50">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Products Summary</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions Node</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order: any) => (
                    <tr
                      key={order._id || order.id}
                      className="border-b border-lavender-grey/20 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 font-mono font-bold text-charcoal">
                        #{order._id ? order._id.substring(18) : order.id}
                      </td>

                      <td className="p-4 min-w-[120px]">
                        <div className="font-bold text-charcoal">
                          {order.user?.name || "Guest User"}
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">
                          {order.user?.email || "guest@mail.com"}
                        </div>
                      </td>

                      <td className="p-4 max-w-xs truncate text-gray-500 font-medium">
                        {order.items?.length || 1} Item(s) recommended by Aurora
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          Paid (Stripe)
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${order.status === "delivered"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "processing"
                                  ? "bg-amber-100 text-amber-700"
                                  : order.status === "cancelled"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-dusty-rose">
                        ${order.total?.toLocaleString() || "2,400"}
                      </td>

                      <td className="p-4 text-gray-400">
                        {new Date(
                          order.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex justify-end items-center gap-1.5">
                          <button
                            disabled={
                              order.status === "shipped" ||
                              order.status === "delivered" ||
                              order.status === "cancelled"
                            }
                            onClick={() =>
                              handleUpdateStatus(
                                order._id || order.id,
                                "shipped"
                              )
                            }
                            className="p-1.5 border border-lavender-grey/35 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 transition-all"
                            title="Mark Shipped"
                          >
                            <Truck className="w-3.5 h-3.5" />
                          </button>

                          <button
                            disabled={
                              order.status === "delivered" ||
                              order.status === "cancelled"
                            }
                            onClick={() =>
                              handleUpdateStatus(
                                order._id || order.id,
                                "delivered"
                              )
                            }
                            className="p-1.5 border border-lavender-grey/35 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-30 transition-all"
                            title="Mark Delivered"
                          >
                            <CheckSquare className="w-3.5 h-3.5" />
                          </button>

                          <button
                            disabled={
                              order.status === "delivered" ||
                              order.status === "cancelled"
                            }
                            onClick={() =>
                              handleUpdateStatus(
                                order._id || order.id,
                                "cancelled"
                              )
                            }
                            className="p-1.5 border border-lavender-grey/35 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 transition-all"
                            title="Cancel Order"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="md:hidden p-4 space-y-4">
              {orders.map((order: any) => (
                <div
                  key={order._id || order.id}
                  className="rounded-2xl border border-lavender-grey/25 bg-white p-4 shadow-sm"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        Order ID
                      </p>

                      <p className="font-mono font-bold text-charcoal text-xs mt-1">
                        #{order._id ? order._id.substring(18) : order.id}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold capitalize ${order.status === "delivered"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "processing"
                              ? "bg-amber-100 text-amber-700"
                              : order.status === "cancelled"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Customer */}
                  <div className="mt-4 pt-4 border-t border-lavender-grey/15">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                      Customer
                    </p>

                    <p className="text-sm font-bold text-charcoal mt-1">
                      {order.user?.name || "Guest User"}
                    </p>

                    <p className="text-[10px] text-gray-400 font-medium mt-0.5 break-all">
                      {order.user?.email || "guest@mail.com"}
                    </p>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-lavender-grey/15">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        Products
                      </p>

                      <p className="text-xs text-gray-500 font-medium mt-1">
                        {order.items?.length || 1} Item(s)
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        Payment
                      </p>

                      <span className="inline-flex mt-1 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        Paid (Stripe)
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        Amount
                      </p>

                      <p className="text-sm font-bold text-dusty-rose mt-1">
                        ${order.total?.toLocaleString() || "2,400"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        Date
                      </p>

                      <p className="text-xs text-gray-500 font-medium mt-1">
                        {new Date(
                          order.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-lavender-grey/15">
                    <button
                      disabled={
                        order.status === "shipped" ||
                        order.status === "delivered" ||
                        order.status === "cancelled"
                      }
                      onClick={() =>
                        handleUpdateStatus(
                          order._id || order.id,
                          "shipped"
                        )
                      }
                      className="p-2 border border-lavender-grey/35 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 transition-all"
                      title="Mark Shipped"
                    >
                      <Truck className="w-4 h-4" />
                    </button>

                    <button
                      disabled={
                        order.status === "delivered" ||
                        order.status === "cancelled"
                      }
                      onClick={() =>
                        handleUpdateStatus(
                          order._id || order.id,
                          "delivered"
                        )
                      }
                      className="p-2 border border-lavender-grey/35 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-30 transition-all"
                      title="Mark Delivered"
                    >
                      <CheckSquare className="w-4 h-4" />
                    </button>

                    <button
                      disabled={
                        order.status === "delivered" ||
                        order.status === "cancelled"
                      }
                      onClick={() =>
                        handleUpdateStatus(
                          order._id || order.id,
                          "cancelled"
                        )
                      }
                      className="p-2 border border-lavender-grey/35 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 transition-all"
                      title="Cancel Order"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
