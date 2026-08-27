'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../store/useAuthStore';
import {
  Gavel,
  ShieldCheck,
  LogOut,
  PlusCircle,
  LayoutDashboard,
  Package,
  Heart,
  User as UserIcon,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isAdmin = user?.roles?.includes('ADMIN');

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Gavel className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent">
                AuctionX
              </span>
              <span className="hidden sm:inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3 mr-0.5" /> SECURE
              </span>
            </div>
          </Link>

          {/* Main Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/marketplace" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Marketplace
            </Link>
            <Link href="/marketplace?sortBy=endingSoon" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Ending Soon
            </Link>

            {user && (
              <>
                <Link href="/orders" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                  <Package className="w-4 h-4 text-sky-400" /> My Orders
                </Link>
                <Link href="/watchlist" className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-400" /> Watchlist
                </Link>
              </>
            )}

            {isAdmin && (
              <Link href="/admin" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" /> Admin Console
              </Link>
            )}
          </nav>

          {/* Action Buttons & User Menu */}
          <div className="flex items-center space-x-4">
            <Link
              href="/sell"
              className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-500/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Auction</span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-white hidden sm:inline">{user.username}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-card rounded-2xl py-2 border border-slate-800 shadow-2xl z-50">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white truncate">{user.username}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-sky-400" />
                      <span>Profile & 2FA</span>
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Package className="w-4 h-4 text-emerald-400" />
                      <span>Orders & Sales</span>
                    </Link>
                    <Link
                      href="/disputes"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Dispute Console</span>
                    </Link>
                    <div className="border-t border-slate-800 my-1" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-xs text-red-400 hover:bg-slate-800 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
