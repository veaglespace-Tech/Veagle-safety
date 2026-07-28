'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../redux/useAuthStore.js';
import { api } from '../../utils/api.js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Crown,
  AlertOctagon,
  Users,
  CheckCircle,
  MapPin,
  RefreshCw,
  Search,
  UserCheck,
  ShieldAlert,
  Radio,
  LogOut,
  PhoneCall,
  Activity,
} from 'lucide-react';

export default function SuperAdminOperationsPortal() {
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [metrics, setMetrics] = useState(null);
  const [activeSos, setActiveSos] = useState([]);
  const [recentSos, setRecentSos] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('INCIDENTS');
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.push('/admin/login');
      return;
    }
    if (user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard');
      return;
    }
    loadAdminData();
  }, [user, mounted]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, usersRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/users'),
      ]);
      setMetrics(overviewRes.data.metrics);
      setActiveSos(overviewRes.data.activeSos || []);
      setRecentSos(overviewRes.data.recentSos || []);
      setUsersList(usersRes.data.users || []);
    } catch (err) {
      console.error('Failed to fetch admin dashboard data');
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (targetUserId, currentRole) => {
    const newRole = currentRole === 'SUPER_ADMIN' ? 'USER' : 'SUPER_ADMIN';
    if (!confirm(`Change role of user to ${newRole}?`)) return;

    try {
      const res = await api.put('/admin/user/role', { userId: targetUserId, role: newRole });
      setActionSuccess(res.data.message);
      setTimeout(() => setActionSuccess(null), 3000);
      loadAdminData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user role');
    }
  };

  const handleAdminResolveSos = async (sosSessionId) => {
    if (!confirm('Force-resolve this active emergency SOS session?')) return;
    try {
      await api.post('/admin/sos/resolve', { sosSessionId, note: 'Resolved via Super Admin HQ Panel' });
      setActionSuccess('Emergency session resolved successfully');
      setTimeout(() => setActionSuccess(null), 3000);
      loadAdminData();
    } catch (err) {
      alert('Failed to resolve SOS session');
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery)
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-plum-dark text-white flex items-center justify-center text-xs font-bold animate-pulse">
        👑 Loading Super Admin HQ Command Center...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-plum-dark text-white selection:bg-rose selection:text-white">
      <header className="bg-plum/90 border-b border-gold/30 sticky top-0 z-40 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark text-plum flex items-center justify-center font-black shadow-gold-glow">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-black text-lg tracking-tight text-white">Super Admin HQ Command</h1>
                <span className="bg-gold text-plum font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-gold/80 font-medium">Tichi Suraksha Emergency Operational Center</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadAdminData}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center space-x-1.5 text-xs font-bold"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/"
              className="bg-rose text-white text-xs font-extrabold px-3 py-2 rounded-xl shadow-coral-glow hover:brightness-110 transition-all"
            >
              App Dashboard
            </Link>

            <button
              onClick={() => {
                logout();
                router.push('/auth');
              }}
              className="p-2 rounded-xl bg-emergency/20 text-tichi-emergency hover:bg-emergency/30 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {actionSuccess && (
          <div className="bg-success-bg border border-success-border text-tichi-success font-bold text-xs p-4 rounded-2xl flex items-center justify-between animate-fade-up shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-tichi-success" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-tichi-muted hover:text-tichi-text font-bold">
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up">
          <div className={`p-5 rounded-2xl border transition-all ${
            metrics?.activeSosCount && metrics.activeSosCount > 0
              ? 'bg-emergency-dark/90 border-emergency text-white animate-pulse shadow-sos-glow'
              : 'bg-plum/60 border-rose/20 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-muted uppercase tracking-wider">Active SOS Calls</span>
              <AlertOctagon className={`w-5 h-5 ${metrics?.activeSosCount ? 'text-white' : 'text-rose'}`} />
            </div>
            <p className="text-3xl font-black mt-2 tracking-tight">
              {metrics?.activeSosCount || 0}
            </p>
            <p className="text-[11px] text-white/70 mt-1">
              {metrics?.activeSosCount ? '🚨 Live emergency monitoring active' : 'No active emergencies currently'}
            </p>
          </div>

          <div className="bg-plum/60 border border-rose/20 p-5 rounded-2xl text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-tichi-faint uppercase tracking-wider">Total Users</span>
              <Users className="w-5 h-5 text-gold" />
            </div>
            <p className="text-3xl font-black mt-2 tracking-tight">{metrics?.totalUsers || 0}</p>
            <p className="text-[11px] text-tichi-faint mt-1">
              👑 {metrics?.superAdminsCount || 1} Super Admin(s) Active
            </p>
          </div>

          <div className="bg-plum/60 border border-rose/20 p-5 rounded-2xl text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-tichi-faint uppercase tracking-wider">Active Journeys</span>
              <Radio className="w-5 h-5 text-rose animate-pulse" />
            </div>
            <p className="text-3xl font-black mt-2 tracking-tight">{metrics?.activeJourneysCount || 0}</p>
            <p className="text-[11px] text-tichi-faint mt-1">Protected real-time trips monitored</p>
          </div>

          <div className="bg-plum/60 border border-gold/30 p-5 rounded-2xl text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Dispatch System</span>
              <Activity className="w-5 h-5 text-tichi-success animate-pulse" />
            </div>
            <p className="text-sm font-extrabold text-tichi-success mt-3 tracking-wide">
              {metrics?.systemStatus || '100% OPERATIONAL'}
            </p>
            <p className="text-[11px] text-tichi-faint mt-1">Socket.IO Real-time Engine Connected</p>
          </div>
        </div>

        <div className="flex bg-plum/80 p-1.5 rounded-2xl border border-rose/20 w-full max-w-md">
          {[
            { key: 'INCIDENTS', label: '🚨 Active Incidents', badge: activeSos.length },
            { key: 'USERS', label: '👥 User Roles & Management', badge: usersList.length },
            { key: 'SYSTEM', label: '⚙️ Dispatch Settings' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-rose to-plum-light text-white shadow-coral-glow'
                  : 'text-tichi-faint hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'INCIDENTS' && (
          <div className="space-y-4 animate-fade-up">
            <h2 className="text-base font-extrabold text-gold flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-emergency" />
              <span>Real-Time Incident Command Stream</span>
            </h2>

            {activeSos.length === 0 ? (
              <div className="bg-plum/40 border border-rose/20 rounded-2xl p-10 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-tichi-success mx-auto" />
                <h3 className="font-extrabold text-base text-white">All Clear — No Active SOS Emergency Calls</h3>
                <p className="text-xs text-tichi-faint max-w-md mx-auto">
                  The emergency dispatch system is actively scanning. When a user triggers an SOS, live GPS location streams will appear here immediately.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {activeSos.map((session) => (
                  <div
                    key={session.id}
                    className="bg-emergency-dark/30 border-2 border-emergency rounded-2xl p-5 shadow-sos-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="bg-emergency text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                          🚨 CRITICAL SOS ACTIVE
                        </span>
                        <span className="text-xs text-tichi-faint font-mono">
                          Started: {new Date(session.startedAt).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <h3 className="font-extrabold text-lg text-white">{session.user?.fullName}</h3>
                        <p className="text-xs text-rose-muted">{session.user?.email} • {session.user?.phone}</p>
                      </div>

                      {session.locations && session.locations.length > 0 && (
                        <div className="flex items-center space-x-2 text-xs font-mono text-gold bg-plum-dark/80 px-3 py-1.5 rounded-xl border border-gold/30">
                          <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span>Lat: {session.locations[0].latitude.toFixed(4)}, Lng: {session.locations[0].longitude.toFixed(4)} (±{session.locations[0].accuracy || 10}m)</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <a
                        href={`tel:${session.user?.phone}`}
                        className="bg-plum text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-rose/30 hover:bg-rose transition-colors flex items-center space-x-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call User</span>
                      </a>

                      <button
                        onClick={() => handleAdminResolveSos(session.id)}
                        className="bg-tichi-success text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow hover:brightness-110 transition-all flex items-center space-x-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Resolve SOS</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-plum/40 border border-rose/20 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-gold">Recent Emergency Incident Log History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-rose/20 text-tichi-faint">
                      <th className="pb-3 font-bold uppercase">User</th>
                      <th className="pb-3 font-bold uppercase">Status</th>
                      <th className="pb-3 font-bold uppercase">Started At</th>
                      <th className="pb-3 font-bold uppercase">Share Token</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose/10">
                    {recentSos.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 font-bold text-white">{item.user?.fullName}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'ACTIVE'
                              ? 'bg-emergency/20 text-emergency border border-emergency/40'
                              : 'bg-tichi-success/20 text-tichi-success border border-tichi-success/40'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 text-tichi-faint font-mono">
                          {new Date(item.startedAt).toLocaleString()}
                        </td>
                        <td className="py-3 font-mono text-tichi-faint truncate max-w-[150px]">
                          {item.shareToken}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'USERS' && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-gold flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-gold" />
                  <span>User & Super Admin Role Management</span>
                </h2>
                <p className="text-xs text-tichi-faint mt-0.5">
                  View all registered accounts and promote trusted accounts to Super Admin.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-tichi-faint absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user name, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-plum/60 border border-rose/30 text-xs text-white placeholder-tichi-faint focus:ring-2 focus:ring-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-plum/40 border border-rose/20 rounded-2xl overflow-hidden shadow-modal">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-plum/90 border-b border-rose/20 text-tichi-faint uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-4">User Details</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Safety Status</th>
                      <th className="p-4">Contacts</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 text-right">Role Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose/10">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <p className="font-extrabold text-white text-sm">{u.fullName}</p>
                          <p className="text-[11px] text-tichi-faint">{u.email} • {u.phone}</p>
                        </td>

                        <td className="p-4">
                          {u.role === 'SUPER_ADMIN' ? (
                            <span className="inline-flex items-center space-x-1 bg-gradient-to-r from-gold to-gold-dark text-plum font-black text-[10px] px-2.5 py-1 rounded-full shadow-gold-glow">
                              <Crown className="w-3 h-3" />
                              <span>SUPER ADMIN</span>
                            </span>
                          ) : (
                            <span className="bg-plum-light/50 text-rose-muted border border-rose/20 text-[10px] font-bold px-2.5 py-1 rounded-full">
                              USER
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            u.safetyStatus === 'SAFE'
                              ? 'bg-tichi-success/20 text-tichi-success border border-tichi-success/40'
                              : 'bg-emergency/20 text-emergency border border-emergency/40 animate-pulse'
                          }`}>
                            ● {u.safetyStatus}
                          </span>
                        </td>

                        <td className="p-4 font-bold text-white">
                          {u._count?.trustedContacts || 0} Contacts
                        </td>

                        <td className="p-4 text-tichi-faint font-mono">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleRoleToggle(u.id, u.role)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              u.role === 'SUPER_ADMIN'
                                ? 'bg-plum-dark text-tichi-faint border-rose/30 hover:text-white'
                                : 'bg-gradient-to-r from-gold to-gold-dark text-plum border-gold shadow-gold-glow hover:brightness-110 font-black'
                            }`}
                          >
                            {u.role === 'SUPER_ADMIN' ? 'Demote to User' : '👑 Make Super Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SYSTEM' && (
          <div className="space-y-4 animate-fade-up">
            <h2 className="text-base font-extrabold text-gold flex items-center space-x-2">
              <Activity className="w-5 h-5 text-tichi-success" />
              <span>System & Emergency Dispatch Diagnostics</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-plum/40 border border-rose/20 p-5 rounded-2xl space-y-3">
                <h3 className="font-bold text-sm text-white">Real-Time Socket Engine</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-rose/10">
                    <span className="text-tichi-faint">Protocol:</span>
                    <span className="font-mono text-tichi-success">WebSocket (Socket.IO v4)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-rose/10">
                    <span className="text-tichi-faint">GPS Broadcast Room:</span>
                    <span className="font-mono text-gold">track:shareToken</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-rose/10">
                    <span className="text-tichi-faint">Admin Command Channel:</span>
                    <span className="font-mono text-gold">admin-ops</span>
                  </div>
                </div>
              </div>

              <div className="bg-plum/40 border border-rose/20 p-5 rounded-2xl space-y-3">
                <h3 className="font-bold text-sm text-white">Emergency Helplines Verified</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-rose/10">
                    <span className="text-tichi-faint">National Emergency Hotline:</span>
                    <span className="font-mono text-emergency font-bold">112</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-rose/10">
                    <span className="text-tichi-faint">National Women Helpline:</span>
                    <span className="font-mono text-rose font-bold">1091</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-rose/10">
                    <span className="text-tichi-faint">Police Control Center:</span>
                    <span className="font-mono text-gold font-bold">100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
