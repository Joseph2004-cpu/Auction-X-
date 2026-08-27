'use client';

import React, { useState, useEffect } from 'react';
import { AuctionCard } from '../../components/AuctionCard';
import { fetchApi } from '../../lib/api';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function MarketplacePage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetchApi('/api/v1/categories');
        if (res.success) setCategories(res.data);
      } catch (err) {}
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadListings() {
      setLoading(true);
      try {
        let query = `/api/v1/listings?status=ACTIVE&sortBy=${sortBy}`;
        if (search) query += `&search=${encodeURIComponent(search)}`;
        if (selectedCategory) query += `&categoryId=${selectedCategory}`;

        const res = await fetchApi(query);
        if (res.success) {
          setAuctions(res.data.items);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadListings, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Auction Marketplace</h1>
        <p className="text-sm text-slate-400 mt-1">Discover, bid, and win verified items in active real-time auctions.</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search auctions by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <ArrowUpDown className="w-4 h-4 text-sky-400" />
            <span>Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-700 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
          >
            <option value="newest">Newly Listed</option>
            <option value="endingSoon">Ending Soon</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === ''
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid of Auctions */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : auctions.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center space-y-3">
          <Filter className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No active auctions found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            We couldn't find any auctions matching your filter criteria. Try searching for something else or clearing your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((item) => (
            <AuctionCard
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.images?.[0]?.url}
              currentPrice={parseFloat(item.auction?.currentPrice || 0)}
              bidCount={item.auction?.bidCount || 0}
              endTime={item.auction?.endTime}
              sellerUsername={item.seller?.username}
              condition={item.condition}
              categoryName={item.category?.name}
            />
          ))}
        </div>
      )}

    </div>
  );
}
