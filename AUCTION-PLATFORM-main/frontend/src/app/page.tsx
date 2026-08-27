'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuctionCard } from '../components/AuctionCard';
import { fetchApi } from '../lib/api';
import { Shield, Zap, Lock, Gavel, ArrowRight, Sparkles, Flame, Clock } from 'lucide-react';

export default function HomePage() {
  const [featuredAuctions, setFeaturedAuctions] = useState<any[]>([]);
  const [endingSoonAuctions, setEndingSoonAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [activeRes, endingRes] = await Promise.all([
          fetchApi('/api/v1/listings?limit=6&status=ACTIVE'),
          fetchApi('/api/v1/listings?limit=3&status=ACTIVE&sortBy=endingSoon'),
        ]);

        if (activeRes.success) setFeaturedAuctions(activeRes.data.items);
        if (endingRes.success) setEndingSoonAuctions(endingRes.data.items);
      } catch (err) {
        // Fallback mock data if API server is booting
        setFeaturedAuctions([
          {
            id: 'demo-1',
            title: 'Apple MacBook Pro 16" M3 Max (36GB RAM, 1TB SSD) - Space Black',
            auction: { currentPrice: 15250, bidCount: 4, endTime: new Date(Date.now() + 18000000).toISOString() },
            images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60' }],
            seller: { username: 'tech_store_gh' },
            condition: 'NEW',
            category: { name: 'Electronics' },
          },
          {
            id: 'demo-2',
            title: 'Vintage Rolex Submariner Date (1998 Reference 16610)',
            auction: { currentPrice: 45500, bidCount: 12, endTime: new Date(Date.now() + 86400000).toISOString() },
            images: [{ url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=60' }],
            seller: { username: 'luxury_vault' },
            condition: 'LIKE_NEW',
            category: { name: 'Fashion & Watches' },
          },
          {
            id: 'demo-3',
            title: 'Sony Alpha A7 IV Full-Frame Camera + 24-70mm GM Lens',
            auction: { currentPrice: 12200, bidCount: 7, endTime: new Date(Date.now() + 3600000).toISOString() },
            images: [{ url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60' }],
            seller: { username: 'kwame_tech' },
            condition: 'GOOD',
            category: { name: 'Electronics' },
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Bank-Grade Bidding Engine</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Bid in Real Time. <br />
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Win Exclusive Deals Securely.
              </span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed">
              Experience the next generation of online auctions with instantaneous WebSocket bid broadcasts, anti-sniping protection, and server-side verification.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/marketplace"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-105"
              >
                <Gavel className="w-5 h-5" />
                <span>Explore Live Auctions</span>
              </Link>

              <Link
                href="/sell"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center space-x-2 transition-all"
              >
                <span>Start Selling</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ending Soon Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Ending Soon</h2>
              <p className="text-sm text-slate-400">Final minutes! Don't miss your last chance to bid.</p>
            </div>
          </div>
          <Link href="/marketplace?sortBy=endingSoon" className="text-sm font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(endingSoonAuctions.length > 0 ? endingSoonAuctions : featuredAuctions.slice(0, 3)).map((item) => (
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
      </section>

      {/* Featured Live Auctions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Live Auctions</h2>
            <p className="text-sm text-slate-400">Verified listings currently open for competitive bidding.</p>
          </div>
          <Link href="/marketplace" className="text-sm font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1">
            Browse All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAuctions.map((item) => (
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
      </section>

    </div>
  );
}
