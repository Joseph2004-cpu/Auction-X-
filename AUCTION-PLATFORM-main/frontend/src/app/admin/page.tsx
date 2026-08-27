'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import {
  LayoutDashboard,
  Users,
  Gavel,
  ShieldAlert,
  FileText,
  AlertTriangle,
  UserCheck,
  UserX,
  Lock,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [userList, setUserList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'audit' | 'security'>('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [statsRes, usersRes, auditRes, secRes] = await Promise.all([
          fetchApi('/api/v1/admin/dashboard'),
          fetchApi('/api/v1/admin/users'),
          fetchApi('/api/v1/admin/audit-logs'),
          fetchApi('/api/v1/admin/security-events'),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        // Backend may return either a wrapped { users: [...] } or a bare array.
        if (usersRes.success) {
          const data = usersRes.data;
          setUserList(Array.isArray(data) ? data : data?.users || []);
        }
        if (auditRes.success) {
          const data = auditRes.data;
          setAuditLogs(Array.isArray(data) ? data : data?.logs || []);
        }
        if (secRes.success) {
          const data = secRes.data;
          setSecurityEvents(Array.isArray(data) ? data : data?.events || []);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    if (user?.roles?.includes('ADMIN')) {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    try {
      const res = await fetchApi(`/api/v1/admin/users/${userId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: newStatus, reason: 'Admin toggle' }),
      });
      if (res.success) {
        setUserList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, accountStatus: newStatus } : u))
        );
      }
    } catch (err) {}
  };

  if (!user || !user.roles?.includes('ADMIN')) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Lock className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-sm text-slate-400">You must be logged in as an Administrator to view this control panel.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-sky-400" />
            <span>Admin Management Console</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Platform overview, governance, RBAC user management, and security audit trail.</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{stats?.users?.total ?? stats?.totalUsers ?? 0}</div>
          <div className="text-[11px] text-emerald-400 mt-1">{stats?.users?.active ?? 0} Active</div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active Live Auctions</span>
            <Gavel className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{stats?.auctions?.active ?? stats?.activeAuctions ?? 0}</div>
          <div className="text-[11px] text-sky-400 mt-1">{stats?.auctions?.completed ?? 0} Completed</div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Bids Placed</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{stats?.bids?.total ?? stats?.totalBids ?? 0}</div>
          <div className="text-[11px] text-slate-400 mt-1">100% Server Verified</div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Open Disputes</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">{stats?.disputes?.open ?? 0}</div>
          <div className="text-[11px] text-red-400 mt-1">Requires Admin Action</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          User Governance
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'audit' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Audit Logs
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'security' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Security Events
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Roles</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Risk Score</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {userList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40">
                  <td className="p-4">
                    <div className="font-bold text-white">{u.username}</div>
                    <div className="text-slate-400 text-[11px]">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {u.roles?.map((r: any) => (
                        <span key={r.role.name} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-sky-400 border border-slate-700">
                          {r.role.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      u.accountStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {u.accountStatus}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-300">{u.riskScore || 0}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleUserStatus(u.id, u.accountStatus)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        u.accountStatus === 'SUSPENDED'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-red-600/80 hover:bg-red-600 text-white'
                      }`}
                    >
                      {u.accountStatus === 'SUSPENDED' ? 'Unsuspend' : 'Suspend User'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-white">Immutable Audit Trail</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-sky-400 mr-2">[{log.action}]</span>
                  <span className="text-slate-300">Resource: {log.resource} ({log.resourceId})</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-white">Security Event Monitoring</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {securityEvents.map((evt) => (
              <div key={evt.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className={`w-4 h-4 ${evt.severity === 'CRITICAL' || evt.severity === 'HIGH' ? 'text-red-400' : 'text-amber-400'}`} />
                  <span className="font-bold text-white">{evt.eventType}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">{evt.severity}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  IP: {evt.ipAddress || 'Internal'} • {new Date(evt.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
