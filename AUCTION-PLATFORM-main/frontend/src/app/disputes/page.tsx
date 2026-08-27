'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { AlertTriangle, MessageSquare, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DisputesPage() {
  const { user } = useAuthStore();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [category, setCategory] = useState('ITEM_NOT_RECEIVED');
  const [initialMessage, setInitialMessage] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadDisputes() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetchApi('/api/v1/disputes');
        if (res.success) setDisputes(res.data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    loadDisputes();
  }, [user]);

  const handleCreateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const res = await fetchApi('/api/v1/disputes', {
        method: 'POST',
        body: JSON.stringify({ orderId, category, initialMessage }),
      });

      if (res.success) {
        setSuccessMsg('Dispute ticket submitted successfully. Under admin review.');
        setShowCreateModal(false);
        setDisputes((prev) => [res.data, ...prev]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to open dispute ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Log in to view Disputes</h2>
        <p className="text-sm text-slate-400">Open dispute tickets and track resolution timeline.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
            <span>Dispute Resolution Console</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Platform buyer protection, evidence submission, and claims management.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> Open New Dispute
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 rounded-3xl space-y-6 border-slate-800">
            <h3 className="text-xl font-bold text-white">Open a Dispute Ticket</h3>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateDispute} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Order ID</label>
                <input
                  type="text"
                  required
                  placeholder="Paste Order UUID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Dispute Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                >
                  <option value="ITEM_NOT_RECEIVED">Item Not Received</option>
                  <option value="DAMAGED_ITEM">Item Damaged or Significantly Different</option>
                  <option value="PAYMENT_PROBLEM">Payment Issue</option>
                  <option value="FRAUD_CONCERN">Fraud Suspicion</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Detailed Explanation & Evidence</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain the problem clearly..."
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disputes Timeline List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-2xl h-36 animate-pulse" />
          ))}
        </div>
      ) : disputes.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No active disputes</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You do not have any open claim tickets. If you encounter an order issue, click 'Open New Dispute'.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="glass-card p-6 rounded-2xl space-y-4 border-amber-500/20">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                    {dispute.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 ml-3">Ticket #{dispute.id.slice(0, 8)}</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {dispute.status}
                </span>
              </div>

              {/* Message Timeline */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-300">Message History Timeline</h4>
                {dispute.messages?.map((msg: any) => (
                  <div key={msg.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-slate-300">
                      <span>User ID: {msg.userId}</span>
                      <span className="text-[10px] text-slate-500">{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-200">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
