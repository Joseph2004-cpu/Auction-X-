'use client';

import React from 'react';
import Link from 'next/link';
import { Gavel, ShieldCheck, Lock, RefreshCw, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 mb-12">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Verified Sellers</h4>
              <p className="text-xs text-slate-400">Identity & moderation checks</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Bank-Grade Encryption</h4>
              <p className="text-xs text-slate-400">Argon2id & 256-bit TLS</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Real-Time Bidding</h4>
              <p className="text-xs text-slate-400">Instant WebSocket updates</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Buyer Guarantee</h4>
              <p className="text-xs text-slate-400">Automated dispute protection</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Gavel className="w-6 h-6 text-sky-400" />
              <span className="text-xl font-bold text-white">AuctionX</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The premier secure, real-time online auction marketplace for competitive bidding, authentic luxury, electronics, and collectibles.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/marketplace" className="hover:text-white transition-colors">All Auctions</Link></li>
              <li><Link href="/marketplace?sortBy=endingSoon" className="hover:text-white transition-colors">Ending Soon</Link></li>
              <li><Link href="/marketplace?category=electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link href="/marketplace?category=fashion" className="hover:text-white transition-colors">Luxury Watches</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Security & Trust</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Buyer Protection Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dispute Resolution Process</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Platform Security Architecture</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Seller Central</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sell" className="hover:text-white transition-colors">Create Listing</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Seller Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fee Structure</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AuctionX Secure Real-Time Platform. Built to production security standards.</p>
        </div>
      </div>
    </footer>
  );
};
