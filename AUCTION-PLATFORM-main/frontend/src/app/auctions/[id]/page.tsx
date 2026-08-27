'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchApi } from '../../../lib/api';
import { getSocket } from '../../../lib/socket';
import { CountdownTimer } from '../../../components/CountdownTimer';
import { useAuthStore } from '../../../store/useAuthStore';
import {
  Gavel,
  ShieldCheck,
  TrendingUp,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Lock,
  Tag,
  MapPin,
  Truck,
  RotateCcw,
} from 'lucide-react';

export default function AuctionDetailPage() {
  const { id } = useParams() as { id: string };
  const { user } = useAuthStore();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [isProxyBid, setIsProxyBid] = useState<boolean>(false);
  const [maxProxyAmount, setMaxProxyAmount] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bidHistory, setBidHistory] = useState<any[]>([]);

  // 1. Fetch initial auction details
  useEffect(() => {
    async function loadAuction() {
      try {
        const res = await fetchApi(`/api/v1/listings/${id}`);
        if (res.success) {
          setListing(res.data);
          setBidHistory(res.data.auction?.bids || []);
          const minBid = (
            parseFloat(res.data.auction?.currentPrice || '0') +
            parseFloat(res.data.auction?.minBidIncrement || '0')
          ).toFixed(2);
          setBidAmount(minBid);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load auction details.');
      } finally {
        setLoading(false);
      }
    }

    if (id) loadAuction();
  }, [id]);

  // 2. Connect Socket.IO for real-time bid broadcasts (Section 16 of Master Prompt)
  useEffect(() => {
    if (!id || !listing?.auction?.id) return;

    const socket = getSocket();
    const auctionRoomId = listing.auction.id;

    socket.emit('join_auction', auctionRoomId);

    // Listen for real-time bid accepted events
    socket.on('auction.bid.accepted', (data: any) => {
      setListing((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          auction: {
            ...prev.auction,
            currentPrice: data.amount ?? data.currentPrice,
            bidCount: data.bidCount,
            endTime: data.endTime,
          },
        };
      });

      // Update minimum next bid recommendation
      setBidAmount(((data.amount ?? data.currentPrice ?? 0) + parseFloat(listing.auction?.minBidIncrement || 0)).toFixed(2));

      // Append new bid to live history
      setBidHistory((prevHistory) => [
        {
          id: `ws_${Date.now()}`,
          amount: data.amount ?? data.currentPrice,
          currency: 'GHS',
          createdAt: new Date().toISOString(),
          user: { username: data.bidderUsername || 'Anonymous' },
        },
        ...prevHistory,
      ]);

      if (data.timeExtended) {
        setSuccessMsg('⚡ Anti-Sniping Triggered! Auction extended by 2 minutes.');
      }
    });

    socket.on('auction.ended', (data: any) => {
      setListing((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          auction: { ...prev.auction, status: data.status },
        };
      });
    });

    return () => {
      socket.emit('leave_auction', auctionRoomId);
      socket.off('auction.bid.accepted');
      socket.off('auction.ended');
    };
  }, [id, listing?.auction?.id]);

  // 3. Handle Bid Submission
  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Please log in or register to place a bid.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const res = await fetchApi(`/api/v1/auctions/${listing.auction.id}/bids`, {
        method: 'POST',
        body: JSON.stringify({
          amount: parseFloat(bidAmount),
          maxProxyAmount: isProxyBid && maxProxyAmount ? parseFloat(maxProxyAmount) : undefined,
        }),
      });

      if (res.success) {
        setSuccessMsg(`Your bid of GHS ${parseFloat(bidAmount).toLocaleString()} was accepted!`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Bid submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 font-medium">Loading live auction details...</p>
      </div>
    );
  }

  if (!listing || !listing.auction) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white">Auction Not Found</h2>
        <p className="text-slate-400 mt-1">The requested auction listing does not exist or has been removed.</p>
      </div>
    );
  }

  const auction = listing.auction;
  const currentPrice = parseFloat(auction.currentPrice);
  const minIncrement = parseFloat(auction.minBidIncrement);
  const minNextBid = currentPrice + minIncrement;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner / Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <Tag className="w-3.5 h-3.5 text-sky-400" />
          <span>{listing.category?.name || 'Electronics'}</span>
          <span>/</span>
          <span className="text-slate-200 truncate max-w-xs">{listing.title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase">
            {auction.status}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Gallery + Right Bidding Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Gallery & Item Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-2xl p-4 overflow-hidden">
            <div className="relative h-96 w-full rounded-xl overflow-hidden bg-slate-900">
              <img
                src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60'}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Description & Terms */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Item Overview</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>Location: <strong>{listing.itemLocation || 'Accra, Ghana'}</strong></span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Shipping: <strong>{listing.shippingOptions || 'Express Dispatch'}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Bidding Console (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-card rounded-2xl p-6 space-y-6 border-sky-500/20">
            <div>
              <h1 className="text-2xl font-bold text-white leading-snug">{listing.title}</h1>
              <div className="flex items-center space-x-2 mt-2 text-xs text-slate-400">
                <User className="w-3.5 h-3.5" />
                <span>Seller: <strong className="text-slate-200">{listing.seller?.username}</strong></span>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Time Remaining</span>
                <CountdownTimer targetDate={auction.endTime} />
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Total Bids</span>
                <span className="text-sm font-bold text-white">{auction.bidCount} bids</span>
              </div>
            </div>

            {/* Live Pricing */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/40 to-slate-900 border border-sky-500/30">
              <span className="text-xs text-sky-300 font-semibold block uppercase tracking-wider">Current Highest Bid</span>
              <div className="text-3xl font-extrabold text-white mt-1">
                GHS {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                Minimum next bid: <strong>GHS {minNextBid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
              </span>
            </div>

            {/* Feedback Banners */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Bidding Form */}
            {auction.status === 'ACTIVE' ? (
              <form onSubmit={handlePlaceBid} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Your Bid Amount (GHS)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">GHS</span>
                    <input
                      type="number"
                      step="0.01"
                      min={minNextBid}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 rounded-xl pl-14 pr-4 py-3 text-lg font-bold text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Optional Proxy Bidding Option (Section 12 of Master Prompt) */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isProxyBid}
                      onChange={(e) => setIsProxyBid(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0"
                    />
                    <span>Enable Automatic Proxy Bidding</span>
                  </label>

                  {isProxyBid && (
                    <input
                      type="number"
                      placeholder="Enter Maximum Proxy Limit (GHS)"
                      value={maxProxyAmount}
                      onChange={(e) => setMaxProxyAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-bold text-base bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <Gavel className="w-5 h-5" />
                  <span>{submitting ? 'Verifying & Submitting...' : 'Confirm & Place Bid'}</span>
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-sm font-semibold text-slate-400">
                Bidding is currently closed for this auction ({auction.status}).
              </div>
            )}
          </div>

          {/* Live Bid History Feed */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Recent Bids</span>
              <span className="text-xs text-slate-400 font-normal">Real-Time Sync</span>
            </h3>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {bidHistory.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No bids placed yet. Be the first!</p>
              ) : (
                bidHistory.map((bid, idx) => (
                  <div key={bid.id || idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-sky-400">
                        {bid.user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="font-semibold text-slate-200">{bid.user?.username}</span>
                    </div>
                    <span className="font-bold text-white">
                      GHS {parseFloat(bid.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
