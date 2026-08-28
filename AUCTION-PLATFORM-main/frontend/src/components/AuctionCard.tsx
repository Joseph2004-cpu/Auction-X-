'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CountdownTimer } from './CountdownTimer';
import { Tag, TrendingUp, User, Heart } from 'lucide-react';
import { fetchApi } from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';

export interface AuctionCardProps {
  id: string;
  title: string;
  image: string;
  currentPrice: number;
  currency?: string;
  bidCount: number;
  endTime: string;
  sellerUsername?: string;
  condition?: string;
  categoryName?: string;
  isWatchlisted?: boolean;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({
  id,
  title,
  image,
  currentPrice,
  currency = 'GHS',
  bidCount,
  endTime,
  sellerUsername = 'verified_seller',
  condition = 'NEW',
  categoryName = 'Electronics',
  isWatchlisted = false,
}) => {
  const { user } = useAuthStore();
  const [watchlisted, setWatchlisted] = useState(isWatchlisted);
  const [savingWatchlist, setSavingWatchlist] = useState(false);

  const toggleWatchlist = async () => {
    if (!user || savingWatchlist) return;
    setSavingWatchlist(true);
    try {
      await fetchApi(`/api/v1/watchlists/${id}`, { method: watchlisted ? 'DELETE' : 'POST' });
      setWatchlisted(!watchlisted);
    } finally {
      setSavingWatchlist(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-500/10 transition-all group flex flex-col justify-between">
      <div>
        {/* Card Thumbnail Image & Badges */}
        <div className="relative h-52 w-full bg-slate-900 overflow-hidden">
          <img
            src={image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-white/10 uppercase tracking-wider">
              {condition.replace('_', ' ')}
            </span>
          </div>
          <div className="absolute bottom-3 right-3">
            <CountdownTimer targetDate={endTime} />
          </div>
          {user && (
            <button
              type="button"
              aria-label={watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
              title={watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
              onClick={toggleWatchlist}
              disabled={savingWatchlist}
              className={`absolute top-3 right-3 p-2 rounded-full border backdrop-blur-md transition-colors ${watchlisted ? 'bg-red-500 text-white border-red-400' : 'bg-slate-950/80 text-slate-200 border-white/10 hover:text-red-300'}`}
            >
              <Heart className="w-4 h-4" fill={watchlisted ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="text-xs font-semibold text-sky-400 mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3" /> {categoryName}
          </div>
          <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug group-hover:text-sky-300 transition-colors mb-3">
            {title}
          </h3>

          <div className="flex items-center text-xs text-slate-400 mb-4 gap-1">
            <User className="w-3.5 h-3.5" />
            <span>Seller: <strong className="text-slate-200">{sellerUsername}</strong></span>
          </div>

          {/* Pricing Info */}
          <div className="flex items-baseline justify-between pt-3 border-t border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Current Highest Bid</span>
              <span className="text-xl font-extrabold text-white">
                {currency} {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400 flex items-center justify-end gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> {bidCount} {bidCount === 1 ? 'bid' : 'bids'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Button */}
      <div className="px-5 pb-5 pt-0">
        <Link
          href={`/auctions/${id}`}
          className="w-full py-2.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-sky-600 text-white flex items-center justify-center space-x-2 transition-all border border-slate-700 hover:border-sky-500 shadow-md"
        >
          <span>View & Bid Now</span>
        </Link>
      </div>
    </div>
  );
};
