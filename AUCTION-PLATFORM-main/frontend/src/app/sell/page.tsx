'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { PlusCircle, Image as ImageIcon, AlertCircle, CheckCircle2, DollarSign, Calendar, Tag } from 'lucide-react';

export default function CreateAuctionPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [categories, setCategories] = useState<any[]>([]);

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('NEW');
  const [startingPrice, setStartingPrice] = useState('');
  const [minBidIncrement, setMinBidIncrement] = useState('50');
  const [imageUrl, setImageUrl] = useState('');
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [endTime, setEndTime] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetchApi('/api/v1/categories');
        if (res.success && res.data.length > 0) {
          setCategories(res.data);
          setCategoryId(res.data[0].id);
        }
      } catch (err) {}
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Please log in first to create an auction listing.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const res = await fetchApi('/api/v1/listings', {
        method: 'POST',
        body: JSON.stringify({
          title,
          categoryId,
          description,
          condition,
          startingPrice: parseFloat(startingPrice),
          minBidIncrement: parseFloat(minBidIncrement),
          startTime,
          endTime,
          images: [{ url: imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60', isPrimary: true }],
        }),
      });

      if (res.success) {
        setSuccessMsg('Auction listing created successfully! Submitted for moderation review.');
        setTimeout(() => router.push('/marketplace'), 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create auction listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="glass-card p-8 rounded-3xl space-y-8 border-slate-800">
        
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-sky-400" />
            <span>Create New Auction Listing</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fill in details to launch your competitive online auction. All listings undergo server moderation.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Listing Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. MacBook Pro 16 M3 Max"
                className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Item Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              >
                <option value="NEW">Brand New (Sealed)</option>
                <option value="LIKE_NEW">Like New</option>
                <option value="GOOD">Good Condition</option>
                <option value="FAIR">Fair Condition</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Main Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Item Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete item specs, warranty, packaging, and condition details..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl p-4 text-sm text-white focus:outline-none"
            />
          </div>

          {/* Pricing Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Starting Price (GHS)</label>
              <input
                type="number"
                step="0.01"
                required
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="1000.00"
                className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Minimum Bid Increment (GHS)</label>
              <input
                type="number"
                step="0.01"
                required
                value={minBidIncrement}
                onChange={(e) => setMinBidIncrement(e.target.value)}
                placeholder="50.00"
                className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Start & End Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Auction Start Time</label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Auction End Time</label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl font-bold text-base bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting Listing...' : 'Create & Launch Auction'}
          </button>
        </form>

      </div>
    </div>
  );
}
