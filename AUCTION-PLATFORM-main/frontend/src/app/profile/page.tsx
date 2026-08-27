'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { User as UserIcon, Lock, KeyRound, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Profile Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // 2FA Setup Form
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [otpUrl, setOtpUrl] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState('');

  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetchApi('/api/v1/users/me');
        if (res.success) {
          setProfile(res.data);
          setFirstName(res.data.firstName || '');
          setLastName(res.data.lastName || '');
          setPhone(res.data.phone || '');
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetchApi('/api/v1/users/me', {
        method: 'PUT',
        body: JSON.stringify({ firstName, lastName, phone }),
      });
      if (res.success) {
        setMsg({ type: 'success', text: 'Profile details updated successfully.' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetchApi('/api/v1/users/me/security/password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.success) {
        setMsg({ type: 'success', text: 'Password changed successfully! All active sessions revoked.' });
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const handleInitTotp = async () => {
    setMsg(null);
    try {
      const res = await fetchApi('/api/v1/auth/mfa/setup', { method: 'POST' });
      if (res.success) {
        setTotpSecret(res.data.secret);
        setOtpUrl(res.data.otpauthUrl);
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  const handleVerifyTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await fetchApi('/api/v1/auth/mfa/enable', {
        method: 'POST',
        body: JSON.stringify({ code: verifyCode }),
      });
      if (res.success) {
        setMsg({ type: 'success', text: '2FA TOTP successfully enabled for your account!' });
        setProfile((prev: any) => ({ ...prev, isMfaEnabled: true }));
        setTotpSecret(null);
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <UserIcon className="w-12 h-12 text-sky-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Log in to view Profile</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <UserIcon className="w-8 h-8 text-sky-400" />
          <span>Profile & Account Security</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">Manage personal details, Argon2id credentials, and 2FA authentication.</p>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Grid: Profile Form + Security Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Info Form */}
        <div className="glass-card p-6 rounded-3xl space-y-6 border-slate-800">
          <h3 className="text-lg font-bold text-white">Personal Profile</h3>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Username</label>
              <input type="text" disabled value={profile?.username || user.username} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-500 font-mono" />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Email Address</label>
              <input type="text" disabled value={profile?.email || user.email} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-500 font-mono" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500" />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+233 20 000 0000" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500" />
            </div>

            <button type="submit" className="w-full py-2.5 rounded-xl font-bold text-xs bg-sky-500 hover:bg-sky-400 text-white transition-colors">
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Security Settings & 2FA */}
        <div className="space-y-6">
          
          {/* Change Password Box */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-sky-400" />
              <span>Change Password</span>
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Current Password</label>
                <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none" />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">New Password</label>
                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none" />
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors">
                Update Password
              </button>
            </form>
          </div>

          {/* 2FA TOTP Box */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border-sky-500/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-400" />
                <span>2FA Authenticator</span>
              </h3>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                profile?.isMfaEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
              }`}>
                {profile?.isMfaEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>

            {!profile?.isMfaEnabled && !totpSecret && (
              <button onClick={handleInitTotp} className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors">
                Setup TOTP Authenticator App
              </button>
            )}

            {totpSecret && (
              <form onSubmit={handleVerifyTotp} className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-300 font-semibold mb-1">Scan or Enter Secret Key:</p>
                  <code className="text-sky-400 font-mono font-bold block text-sm select-all">{totpSecret}</code>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Enter Code from Authenticator App</label>
                  <input type="text" maxLength={6} required value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} placeholder="123456" className="w-full bg-slate-900 border border-emerald-500 rounded-xl px-3.5 py-2 text-center text-lg font-mono text-white focus:outline-none" />
                </div>

                <button type="submit" className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors">
                  Verify & Enable 2FA
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
