'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { Package, CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Clock, Truck } from 'lucide-react';

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER');
  const [loading, setLoading] = useState(true);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetchApi(`/api/v1/orders?role=${role}`);
        if (res.success) setOrders(res.data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user, role]);

  const handlePayOrder = async (orderId: string) => {
    setPayingOrderId(orderId);
    setMsg(null);
    try {
      // Initiate payment
      const initRes = await fetchApi(`/api/v1/orders/${orderId}/pay`, { method: 'POST' });
      if (initRes.success) {
        const txRef = initRes.data.transactionRef;

        // Auto-confirm mock payment server-to-server (Section 41 & 42 of Master Prompt)
        const confirmRes = await fetchApi('/api/v1/orders/webhook/mock-confirm', {
          method: 'POST',
          body: JSON.stringify({ transactionRef: txRef }),
        });

        if (confirmRes.success) {
          setMsg('Payment completed successfully! Order status updated to PAID.');
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: 'PAID' } : o))
          );
        }
      }
    } catch (err: any) {
      setMsg(`Payment failed: ${err.message}`);
    } finally {
      setPayingOrderId(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-12 h-12 text-sky-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Log in to view orders</h2>
        <p className="text-sm text-slate-400">Track your won auction items, payments, and sales.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-8 h-8 text-sky-400" />
            <span>Order & Sales History</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage won auctions, payments, and fulfillment status.</p>
        </div>

        {/* Role Toggle */}
        <div className="flex space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setRole('BUYER')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              role === 'BUYER' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Purchases (Buyer)
          </button>
          <button
            onClick={() => setRole('SELLER')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              role === 'SELLER' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Sales (Seller)
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center space-y-3">
          <Package className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No {role.toLowerCase()} orders found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {role === 'BUYER'
              ? 'When you win an auction, your order and payment details will appear here.'
              : 'When buyers win your auction listings, sales orders will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="glass-card p-6 rounded-2xl space-y-4 border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-slate-400 block">Order ID: <code className="text-slate-200">{order.id}</code></span>
                  <h3 className="text-base font-bold text-white mt-1">
                    {order.auction?.listing?.title || 'Auction Item'}
                  </h3>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    order.status === 'PAID'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : order.status === 'AWAITING_PAYMENT'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Total Winning Amount</span>
                  <span className="text-lg font-extrabold text-white">
                    GHS {parseFloat(order.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Created Date</span>
                  <span className="text-slate-200 font-semibold">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-end">
                  {role === 'BUYER' && order.status === 'AWAITING_PAYMENT' && (
                    <button
                      onClick={() => handlePayOrder(order.id)}
                      disabled={payingOrderId === order.id}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition-all flex items-center space-x-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{payingOrderId === order.id ? 'Processing...' : 'Pay Now (Mock Checkout)'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
