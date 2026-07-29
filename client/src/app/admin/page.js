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
  ShieldCheck,
  Zap,
  Sliders,
  ArrowRight,
  Shield,
  Layers,
  UserPlus,
  Edit3,
  X,
  Lock,
  Mail,
  User,
  Heart,
  KeyRound,
} from 'lucide-react';

export default function SuperAdminOperationsPortal() {
  const [mounted, setMounted] = useState(false);
  const { user, logout, fetchUser } = useAuthStore();
  const router = useRouter();

  const [metrics, setMetrics] = useState(null);
  const [activeSos, setActiveSos] = useState([]);
  const [recentSos, setRecentSos] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('INCIDENTS');
  const [actionSuccess, setActionSuccess] = useState(null);

  // CREATE USER MODAL STATE
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserRole, setNewUserRole] = useState('USER');
  const [newUserBlood, setNewUserBlood] = useState('O+');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  // EDIT ADMIN PROFILE MODAL STATE
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [editAdminLoading, setEditAdminLoading] = useState(false);
  const [editAdminError, setEditAdminError] = useState(null);

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

    // Populate initial edit admin fields
    setAdminName(user.fullName || '');
    setAdminEmail(user.email || '');
    setAdminPhone(user.phone || '');
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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateError(null);
    setCreateLoading(true);

    try {
      const res = await api.post('/admin/users/create', {
        fullName: newUserName,
        email: newUserEmail,
        phone: newUserPhone,
        password: newUserPass,
        role: newUserRole,
        bloodGroup: newUserBlood,
      });

      setActionSuccess(res.data.message);
      setTimeout(() => setActionSuccess(null), 4000);

      // Reset form & close modal
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      setNewUserPass('');
      setShowCreateUserModal(false);

      // Refresh list
      loadAdminData();
    } catch (err) {
      setCreateError(err.response?.data?.error || 'Failed to create new user.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateAdminProfile = async (e) => {
    e.preventDefault();
    setEditAdminError(null);
    setEditAdminLoading(true);

    try {
      const res = await api.put('/admin/profile', {
        fullName: adminName,
        email: adminEmail,
        phone: adminPhone,
        password: adminPass || undefined,
      });

      setActionSuccess(res.data.message);
      setTimeout(() => setActionSuccess(null), 4000);

      fetchUser();
      setShowEditAdminModal(false);
      setAdminPass('');
    } catch (err) {
      setEditAdminError(err.response?.data?.error || 'Failed to update admin profile.');
    } finally {
      setEditAdminLoading(false);
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
      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery)
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FFF0F3] text-tichi-text flex items-center justify-center text-xs font-black animate-pulse">
        👑 Loading Super Admin HQ Command Center...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden pb-16">
      
      {/* BACKGROUND AMBIENT GLOW MESHES */}
      <div className="absolute w-[800px] h-[800px] rounded-full bg-rose/15 blur-[160px] top-[-100px] left-[-200px] pointer-events-none" />
      <div className="absolute w-[800px] h-[800px] rounded-full bg-gold/15 blur-[160px] bottom-[100px] right-[-200px] pointer-events-none" />

      {/* PORCELAIN BLUSH TOP HEADER */}
      <header className="bg-white/95 border-b-2 border-[#FFCCE1] sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* BRANDING */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose via-rose-light to-gold p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-rose" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-black text-base sm:text-lg tracking-tight text-tichi-text">Super Admin HQ Command</h1>
                <span className="bg-gold text-tichi-text font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-gold/40">
                  HQ LEVEL 5
                </span>
              </div>
              <p className="text-xs text-tichi-muted font-bold">Sakhi Suraksha Emergency Operations Control Center</p>
            </div>
          </div>

          {/* ACTION CONTROLS */}
          <div className="flex items-center space-x-2">
            
            {/* EDIT ADMIN PROFILE BUTTON */}
            <button
              type="button"
              onClick={() => {
                setAdminName(user?.fullName || '');
                setAdminEmail(user?.email || '');
                setAdminPhone(user?.phone || '');
                setShowEditAdminModal(true);
              }}
              className="p-2.5 rounded-2xl bg-white border-2 border-rose text-rose hover:bg-rose hover:text-white transition-all flex items-center space-x-1.5 text-xs font-black shadow-sm cursor-pointer"
              title="Edit Super Admin Profile"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden md:inline">Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={loadAdminData}
              className="p-2.5 rounded-2xl bg-white border-2 border-[#FFCCE1] text-tichi-text hover:border-rose transition-all flex items-center space-x-1.5 text-xs font-black shadow-sm cursor-pointer"
              title="Refresh Real-time Data"
            >
              <RefreshCw className={`w-4 h-4 text-rose ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/dashboard"
              className="btn-baby-pink text-xs font-black px-4 py-2.5 rounded-2xl shadow-coral-glow flex items-center space-x-1.5 uppercase tracking-wider"
            >
              <span>User App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
                router.push('/admin/login');
              }}
              className="p-2.5 rounded-2xl bg-white border-2 border-[#FF2A6D] text-[#FF2A6D] hover:bg-[#FF2A6D] hover:text-white transition-all shadow-sm cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10 animate-fade-up">

        {/* ACTION SUCCESS BANNER */}
        {actionSuccess && (
          <div className="bg-tichi-success/15 border-2 border-tichi-success text-tichi-success font-black text-xs p-4 rounded-2xl flex items-center justify-between shadow-md animate-fade-up">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-tichi-success shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button type="button" onClick={() => setActionSuccess(null)} className="text-tichi-success font-black hover:opacity-75">
              ✕
            </button>
          </div>
        )}

        {/* 4-GRID METRICS STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* CARD 1: ACTIVE SOS CALLS */}
          <div className={`p-6 rounded-3xl border-2 transition-all shadow-md ${
            metrics?.activeSosCount && metrics.activeSosCount > 0
              ? 'bg-gradient-to-r from-[#FF2A6D] to-rose border-white text-white animate-pulse shadow-coral-glow'
              : 'card-antique-pink border-rose text-tichi-text'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-rose">Active SOS Emergencies</span>
              <div className="w-10 h-10 rounded-2xl bg-rose/15 text-rose flex items-center justify-center">
                <AlertOctagon className="w-5 h-5 text-rose" />
              </div>
            </div>
            <p className="text-4xl font-black mt-2 tracking-tight">
              {metrics?.activeSosCount || 0}
            </p>
            <p className="text-xs text-tichi-muted font-bold mt-1">
              {metrics?.activeSosCount ? '🚨 Live emergency monitoring active' : 'No active emergency calls currently'}
            </p>
          </div>

          {/* CARD 2: TOTAL USERS */}
          <div className="card-antique-pink border-2 border-rose p-6 rounded-3xl shadow-md text-tichi-text">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-tichi-text">Total System Users</span>
              <div className="w-10 h-10 rounded-2xl bg-rose/15 text-rose flex items-center justify-center">
                <Users className="w-5 h-5 text-rose" />
              </div>
            </div>
            <p className="text-4xl font-black mt-2 tracking-tight">{metrics?.totalUsers || 0}</p>
            <p className="text-xs text-tichi-muted font-bold mt-1">
              👑 {metrics?.superAdminsCount || 1} Super Admin(s) Active
            </p>
          </div>

          {/* CARD 3: ACTIVE JOURNEYS */}
          <div className="card-antique-pink border-2 border-rose p-6 rounded-3xl shadow-md text-tichi-text">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-tichi-text">Active Journeys</span>
              <div className="w-10 h-10 rounded-2xl bg-rose/15 text-rose flex items-center justify-center">
                <Radio className="w-5 h-5 text-rose animate-pulse" />
              </div>
            </div>
            <p className="text-4xl font-black mt-2 tracking-tight">{metrics?.activeJourneysCount || 0}</p>
            <p className="text-xs text-tichi-muted font-bold mt-1">Real-Time Protected Trips Monitored</p>
          </div>

          {/* CARD 4: DISPATCH SYSTEM */}
          <div className="bg-white border-2 border-[#FFCCE1] p-6 rounded-3xl shadow-md text-tichi-text">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-tichi-text">Dispatch Engine</span>
              <div className="w-10 h-10 rounded-2xl bg-tichi-success/15 text-tichi-success flex items-center justify-center">
                <Activity className="w-5 h-5 text-tichi-success animate-pulse" />
              </div>
            </div>
            <p className="text-base font-black text-tichi-success mt-3 tracking-wide">
              {metrics?.systemStatus || '100% OPERATIONAL'}
            </p>
            <p className="text-xs text-tichi-muted font-bold mt-1">Socket.IO Real-time Engine Connected</p>
          </div>

        </div>

        {/* PORCELAIN SEGMENTED NAVIGATION TABS */}
        <div className="bg-white p-2 rounded-2xl border-2 border-[#FFCCE1] shadow-sm flex gap-2 max-w-xl relative z-20">
          {[
            { key: 'INCIDENTS', label: 'Active Incidents', icon: ShieldAlert, badge: activeSos.length },
            { key: 'USERS', label: 'User Roles & Accounts', icon: UserCheck, badge: usersList.length },
            { key: 'SYSTEM', label: 'Dispatch Settings', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 uppercase tracking-wider cursor-pointer relative z-20 ${
                  isActive
                    ? 'bg-rose text-white border-2 border-rose shadow-md'
                    : 'bg-white text-tichi-text hover:text-rose hover:bg-rose/10 border-2 border-[#FFCCE1]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white text-rose' : 'bg-rose/15 text-rose'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ACTIVE INCIDENTS STREAM */}
        {activeTab === 'INCIDENTS' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-tichi-text flex items-center space-x-2 uppercase tracking-wider">
                <ShieldAlert className="w-5 h-5 text-rose" />
                <span>Real-Time Emergency Incident Command Stream</span>
              </h2>
            </div>

            {activeSos.length === 0 ? (
              <div className="card-antique-pink border-2 border-rose rounded-3xl p-10 text-center space-y-3 shadow-md">
                <CheckCircle className="w-14 h-14 text-tichi-success mx-auto" />
                <h3 className="font-black text-lg text-tichi-text">All Clear — No Active SOS Emergency Calls</h3>
                <p className="text-xs text-tichi-muted font-bold max-w-md mx-auto leading-relaxed">
                  The emergency dispatch system is actively scanning 24/7. When a user triggers an SOS, live GPS location streams will appear here instantly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {activeSos.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white border-2 border-[#FF2A6D] rounded-3xl p-6 shadow-coral-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="bg-[#FF2A6D] text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider animate-pulse border border-white">
                          🚨 CRITICAL SOS ACTIVE
                        </span>
                        <span className="text-xs text-tichi-muted font-bold font-mono">
                          Started: {new Date(session.startedAt).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <h3 className="font-black text-xl text-tichi-text">{session.user?.fullName}</h3>
                        <p className="text-xs text-tichi-muted font-bold">{session.user?.email} • {session.user?.phone}</p>
                      </div>

                      {session.locations && session.locations.length > 0 && (
                        <div className="flex items-center space-x-2 text-xs font-mono text-rose bg-[#FFF0F3] px-3.5 py-2 rounded-xl border border-[#FFCCE1]">
                          <MapPin className="w-4 h-4 text-rose shrink-0" />
                          <span className="font-bold">Lat: {session.locations[0].latitude.toFixed(4)}, Lng: {session.locations[0].longitude.toFixed(4)} (±{session.locations[0].accuracy || 10}m)</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <a
                        href={`tel:${session.user?.phone}`}
                        className="bg-white border-2 border-[#FFCCE1] text-tichi-text font-black text-xs px-5 py-3 rounded-2xl hover:border-rose transition-all flex items-center space-x-1.5 shadow-sm"
                      >
                        <PhoneCall className="w-4 h-4 text-rose" />
                        <span>Call User</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleAdminResolveSos(session.id)}
                        className="bg-tichi-success text-white font-black text-xs px-5 py-3 rounded-2xl shadow hover:brightness-110 transition-all flex items-center space-x-1.5 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Resolve SOS</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* RECENT INCIDENTS LOG HISTORY TABLE */}
            <div className="bg-white border-2 border-[#FFCCE1] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-black text-sm text-tichi-text uppercase tracking-wider">Recent Incident Log History</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-bold text-tichi-text">
                  <thead>
                    <tr className="border-b-2 border-[#FFCCE1] text-tichi-muted uppercase tracking-wider text-[11px]">
                      <th className="pb-3 px-3">User</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3">Started At</th>
                      <th className="pb-3 px-3">Share Token</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FFCCE1]">
                    {recentSos.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FFF0F3] transition-colors">
                        <td className="py-3 px-3 font-black text-tichi-text">{item.user?.fullName}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            item.status === 'ACTIVE'
                              ? 'bg-rose/15 text-rose border border-rose/30 animate-pulse'
                              : 'bg-tichi-success/15 text-tichi-success border border-tichi-success/30'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-tichi-muted font-mono">
                          {new Date(item.startedAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 font-mono text-tichi-muted truncate max-w-[150px]">
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

        {/* TAB 2: USER & SUPER ADMIN ROLE MANAGEMENT WITH CREATE USER BUTTON */}
        {activeTab === 'USERS' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-tichi-text flex items-center space-x-2 uppercase tracking-wider">
                  <UserCheck className="w-5 h-5 text-rose" />
                  <span>User Accounts & Role Privilege Management</span>
                </h2>
                <p className="text-xs text-tichi-muted font-bold mt-0.5">
                  Create new user accounts directly or manage role permissions.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {/* CREATE NEW USER BUTTON */}
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(true)}
                  className="btn-baby-pink px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-coral-glow flex items-center space-x-1.5 cursor-pointer shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Create User</span>
                </button>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-rose absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border-2 border-[#FFCCE1] text-xs font-bold text-tichi-text placeholder-tichi-muted focus:border-rose focus:ring-4 focus:ring-rose/15 focus:outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-[#FFCCE1] rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-bold text-tichi-text">
                  <thead className="bg-[#FFF0F3] border-b-2 border-[#FFCCE1] text-tichi-muted uppercase font-black text-[11px]">
                    <tr>
                      <th className="p-4">User Details</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Safety Status</th>
                      <th className="p-4">Guardians</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 text-right">Role Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FFCCE1]">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#FFF0F3] transition-colors">
                        <td className="p-4">
                          <p className="font-black text-tichi-text text-sm">{u.fullName}</p>
                          <p className="text-[11px] text-tichi-muted font-bold">{u.email} • {u.phone}</p>
                        </td>

                        <td className="p-4">
                          {u.role === 'SUPER_ADMIN' ? (
                            <span className="inline-flex items-center space-x-1 bg-gold text-tichi-text font-black text-[10px] px-3 py-1 rounded-full shadow-sm border border-gold/40">
                              <Crown className="w-3.5 h-3.5" />
                              <span>SUPER ADMIN</span>
                            </span>
                          ) : (
                            <span className="bg-white text-tichi-muted border border-[#FFCCE1] text-[10px] font-black px-3 py-1 rounded-full">
                              USER
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                            u.safetyStatus === 'SAFE'
                              ? 'bg-tichi-success/15 text-tichi-success border border-tichi-success/30'
                              : 'bg-rose/15 text-rose border border-rose/30 animate-pulse'
                          }`}>
                            ● {u.safetyStatus}
                          </span>
                        </td>

                        <td className="p-4 font-black text-tichi-text">
                          {u._count?.trustedContacts || 0} Contacts
                        </td>

                        <td className="p-4 text-tichi-muted font-mono">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleRoleToggle(u.id, u.role)}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 cursor-pointer ${
                              u.role === 'SUPER_ADMIN'
                                ? 'bg-white text-tichi-muted border-[#FFCCE1] hover:border-rose hover:text-rose'
                                : 'bg-gold text-tichi-text border-gold shadow-sm hover:brightness-110'
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

        {/* TAB 3: DISPATCH DIAGNOSTICS & SETTINGS */}
        {activeTab === 'SYSTEM' && (
          <div className="space-y-6 animate-fade-up">
            <h2 className="text-base font-black text-tichi-text flex items-center space-x-2 uppercase tracking-wider">
              <Activity className="w-5 h-5 text-rose" />
              <span>System & Emergency Dispatch Diagnostics</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card-antique-pink border-2 border-rose p-6 rounded-3xl space-y-4 shadow-md">
                <h3 className="font-black text-sm text-tichi-text uppercase tracking-wider">Real-Time Socket Engine</h3>
                <div className="space-y-2.5 text-xs font-bold text-tichi-text">
                  <div className="flex justify-between py-1.5 border-b border-[#FFCCE1]">
                    <span className="text-tichi-muted">Protocol:</span>
                    <span className="font-mono text-tichi-success font-black">WebSocket (Socket.IO v4)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#FFCCE1]">
                    <span className="text-tichi-muted">GPS Broadcast Room:</span>
                    <span className="font-mono text-rose font-black">track:shareToken</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#FFCCE1]">
                    <span className="text-tichi-muted">Admin Command Channel:</span>
                    <span className="font-mono text-rose font-black">admin-ops</span>
                  </div>
                </div>
              </div>

              <div className="card-antique-pink border-2 border-rose p-6 rounded-3xl space-y-4 shadow-md">
                <h3 className="font-black text-sm text-tichi-text uppercase tracking-wider">Emergency Helplines Verified</h3>
                <div className="space-y-2.5 text-xs font-bold text-tichi-text">
                  <div className="flex justify-between py-1.5 border-b border-[#FFCCE1]">
                    <span className="text-tichi-muted">National Emergency Hotline:</span>
                    <span className="font-mono text-rose font-black">112</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#FFCCE1]">
                    <span className="text-tichi-muted">National Women Helpline:</span>
                    <span className="font-mono text-rose font-black">1091</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#FFCCE1]">
                    <span className="text-tichi-muted">Police Control Center:</span>
                    <span className="font-mono text-tichi-text font-black">100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ---------------------------------------------------- */}
      {/* 1. SUPER ADMIN CREATE USER MODAL */}
      {/* ---------------------------------------------------- */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-rose overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-rose to-[#FF2A6D] p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-black text-base">Create New Account (Backend)</h3>
              </div>
              <button type="button" onClick={() => setShowCreateUserModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {createError && (
                <div className="bg-rose/10 border border-rose text-rose text-xs font-black p-3 rounded-xl text-center">
                  {createError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-tichi-text">Full Name</label>
                <input
                  type="text"
                  placeholder="Pooja Sharma"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#FFCCE1] text-xs font-bold text-tichi-text focus:outline-none focus:border-rose bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-tichi-text">Email Address</label>
                <input
                  type="email"
                  placeholder="pooja@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#FFCCE1] text-xs font-bold text-tichi-text focus:outline-none focus:border-rose bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-tichi-text">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#FFCCE1] text-xs font-bold text-tichi-text focus:outline-none focus:border-rose bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-tichi-text">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border-2 border-[#FFCCE1] text-xs font-bold text-tichi-text focus:outline-none focus:border-rose bg-white"
                  >
                    <option value="USER">USER</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-tichi-text">Blood Group</label>
                  <select
                    value={newUserBlood}
                    onChange={(e) => setNewUserBlood(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border-2 border-[#FFCCE1] text-xs font-bold text-tichi-text focus:outline-none focus:border-rose bg-white"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-tichi-text">Initial Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={newUserPass}
                  onChange={(e) => setNewUserPass(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#FFCCE1] text-xs font-bold text-tichi-text focus:outline-none focus:border-rose bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={createLoading}
                className="w-full btn-baby-pink py-3.5 rounded-2xl text-xs uppercase tracking-wider font-black shadow-coral-glow cursor-pointer disabled:opacity-60"
              >
                {createLoading ? 'CREATING ACCOUNT...' : '⚡ CREATE USER VIA BACKEND'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. EDIT SUPER ADMIN PROFILE MODAL */}
      {/* ---------------------------------------------------- */}
      {showEditAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-rose overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-rose to-[#FF2A6D] p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5" />
                <h3 className="font-black text-base">Edit Super Admin Profile</h3>
              </div>
              <button type="button" onClick={() => setShowEditAdminModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAdminProfile} className="p-6 space-y-4">
              {editAdminError && (
                <div className="bg-rose/10 border border-rose text-rose text-xs font-black p-3 rounded-xl text-center">
                  {editAdminError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-tichi-text">Super Admin Full Name</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#FFCCE1] text-xs font-bold text-tichi-text focus:outline-none focus:border-rose bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-tichi-text">Admin Email Address</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#FFCCE1] text-xs font-bold text-tichi-text focus:outline-none focus:border-rose bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-tichi-text">Phone Number</label>
                <input
                  type="text"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#FFCCE1] text-xs font-bold text-tichi-text focus:outline-none focus:border-rose bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-tichi-text">New Secret Access Key (Optional)</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#FFCCE1] text-xs font-bold text-tichi-text focus:outline-none focus:border-rose bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={editAdminLoading}
                className="w-full btn-baby-pink py-3.5 rounded-2xl text-xs uppercase tracking-wider font-black shadow-coral-glow cursor-pointer disabled:opacity-60"
              >
                {editAdminLoading ? 'SAVING CHANGES...' : 'SAVE SUPER ADMIN PROFILE'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
