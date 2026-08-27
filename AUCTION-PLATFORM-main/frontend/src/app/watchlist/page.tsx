'use client';

import React, { useState, useEffect } from 'react';
import { AuctionCard } from '../../components/AuctionCard';
import { fetchApi } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { Heart, Filter } from 'lucide-react';

export default function WatchlistPage() {
  const { user } = useAuthStore();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWatchlist() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetchApi('/api/v1/watchlists');
        if (res.success) setWatchlist(res.data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    loadWatchlist();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Heart className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Log in to view Watchlist</h2>
        <p className="text-sm text-slate-400">Save your favorite auctions and track ending times.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Heart className="w-8 h-8 text-red-400 fill-red-400/20" />
          <span>My Saved Watchlist</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">Auctions you are following for competitive bidding.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : watchlist.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center space-y-3">
          <Heart className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your Watchlist is empty</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Browse the marketplace and click the favorite/watch button on any auction item to track it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((item) => {
            const auction = item.auction;
            const listing = auction?.listing;
            return (
              <AuctionCard
                key={item.id}
                id={auction?.id}
                title={listing?.title || 'Saved Auction'}
                image={listing?.images?.[0]?.url}
                currentPrice={parseFloat(auction?.currentPrice || 0)}
                bidCount={auction?.bidCount || 0}
                endTime={auction?.endTime}
                condition={listing?.condition}
              />
            );
          })}
        </div>
      )}

    </div>
  );
}
