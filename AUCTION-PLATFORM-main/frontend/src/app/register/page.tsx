'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '../../lib/api';
import { Gavel, Lock, Mail, User, AlertCircle, CheckCircle2, ShoppingBag, Store } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetchApi('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, username, password, firstName, lastName, role }),
      });

      if (res.success) {
        setSuccessMsg(`Account created successfully as ${role === 'SELLER' ? 'Seller' : 'Bidder'}! Redirecting...`);
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8 glass-card p-8 rounded-3xl border-slate-800 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
            <Gavel className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create your AuctionX Account</h2>
          <p className="text-xs text-slate-400">Join thousands of verified buyers and sellers today.</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Account Type / Role Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Select Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('BUYER')}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  role === 'BUYER'
                    ? 'bg-sky-500/15 border-sky-500 text-white shadow-lg shadow-sky-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <ShoppingBag className={`w-5 h-5 ${role === 'BUYER' ? 'text-sky-400' : 'text-slate-500'}`} />
                  {role === 'BUYER' && <span className="w-2 h-2 rounded-full bg-sky-400"></span>}
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Bidder / Buyer</span>
                  <span className="text-[10px] text-slate-400 leading-tight">Bid & buy in live auctions</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('SELLER')}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  role === 'SELLER'
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Store className={`w-5 h-5 ${role === 'SELLER' ? 'text-emerald-400' : 'text-slate-500'}`} />
                  {role === 'SELLER' && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Seller</span>
                  <span className="text-[10px] text-slate-400 leading-tight">List items & manage sales</span>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={role === 'SELLER' ? 'super_store_gh' : 'bidder_pro'}
                className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Min 8 chars, uppercase, lowercase, digit & symbol.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : `Register as ${role === 'SELLER' ? 'Seller' : 'Bidder'}`}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-sky-400 hover:underline">
            Log in
          </Link>
        </div>

      </div>
    </div>
  );
}

