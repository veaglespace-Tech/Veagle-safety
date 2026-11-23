'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Link2,
  IndianRupee,
  Settings,
  ShieldCheck,
  Award,
  TrendingUp,
  Share2,
  Copy,
  Check,
  LogOut,
  RefreshCw,
  Search,
  MessageCircle,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  Calendar,
  Phone,
  Mail,
  UserCheck,
  Shield,
  FileText,
  Download,
  AlertTriangle,
  PhoneCall,
  Activity,
  Radio,
  Lock,
  ArrowRight,
  ExternalLink,
  Menu,
  X,
  CreditCard,
  Wallet,
  CheckCircle2,
  Save,
  HelpCircle,
} from 'lucide-react';
import { Logo3DFlip } from '../../../components/ui/Logo3DFlip.js';
import { referralApi } from '../../../redux/api/referralApi.js';

export default function ProtectedPartnerDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Navigation tab state: 'overview' | 'users' | 'links' | 'earnings' | 'settings'
  const initialTab = searchParams?.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Authentication & Partner Data State
  const [partnerData, setPartnerData] = useState(null);
  const [stats, setStats] = useState({ totalReferred: 0, activeSubscribers: 0 });
  const [earnings, setEarnings] = useState({
    commissionRate: 0,
    commissionPerUser: 0,
    planPrice: 24,
    totalEarnings: 0,
    paidEarnings: 0,
    pendingEarnings: 0,
  });
  const [referredUsers, setReferredUsers] = useState([]);
  const [referralLink, setReferralLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // UI state
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'FREE'
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    mobile: '',
    upiId: '',
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');

  // Payout request modal state
  const [payoutRequested, setPayoutRequested] = useState(false);

  // Protected Route Check & Load
  useEffect(() => {
    const token = localStorage.getItem('partner_token');
    if (!token) {
      router.replace('/partner');
      return;
    }
    fetchDashboardData(token);
  }, [router]);

  // Sync tab with URL parameter if present
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam && ['overview', 'users', 'links', 'earnings', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const fetchDashboardData = async (token) => {
    setIsRefreshing(true);
    try {
      const res = await referralApi.getPartnerDashboard(token);
      if (res.success && res.partner) {
        setPartnerData(res.partner);
        setStats(res.stats || { totalReferred: 0, activeSubscribers: 0 });
        if (res.earnings) {
          setEarnings(res.earnings);
        } else {
          const discountPct = Number(res.partner?.discountPercentage) || 10;
          const planAmt = 24;
          const commPerUser = Math.round(((planAmt * discountPct) / 100) * 100) / 100;
          const activeSubs = (res.referredUsers || []).filter((u) => u.subscriptionStatus === 'ACTIVE').length;
          setEarnings({
            commissionRate: discountPct,
            commissionPerUser: commPerUser,
            planPrice: planAmt,
            totalEarnings: Math.round((activeSubs * commPerUser) * 100) / 100,
            paidEarnings: 0,
            pendingEarnings: Math.round((activeSubs * commPerUser) * 100) / 100,
          });
        }
        setReferredUsers(res.referredUsers || []);
        setReferralLink(
          res.referralLink || `${window.location.origin}/auth?ref=${res.partner.partnerReferralCode}`
        );

        setSettingsForm({
          name: res.partner.name || '',
          mobile: res.partner.mobile || '',
          upiId: localStorage.getItem(`partner_upi_${res.partner.id}`) || '',
        });

        setLoading(false);
      } else {
        throw new Error(res.message || 'Unauthorized');
      }
    } catch (err) {
      console.error('Partner session verification failed:', err);
      localStorage.removeItem('partner_token');
      localStorage.removeItem('partner_data');
      setAuthError('Partner session expired or unauthorized. Redirecting to login...');
      setTimeout(() => {
        router.replace('/partner');
      }, 1500);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('partner_token');
    localStorage.removeItem('partner_data');
    router.replace('/partner');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    router.push(`/partner/dashboard?tab=${tab}`, { scroll: false });
  };

  const copyToClipboard = (text, type = 'link') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const getWhatsAppShareUrl = () => {
    const text = `नमस्कार! सखी सुरक्षा (Sakhi Suraksha SOS) सोबत सुरक्षित राहा. माझ्या रेफरल लिंकवरून आजच नोंदणी करा आणि महिला सुरक्षेसाठी सदैव तयार राहा:\n${referralLink}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSuccess('');
    setSettingsError('');

    try {
      const res = await referralApi.updatePartnerProfile({
        name: settingsForm.name.trim(),
        mobile: settingsForm.mobile.trim(),
      });

      if (res.success) {
        setPartnerData((prev) => ({
          ...prev,
          name: settingsForm.name.trim(),
          mobile: settingsForm.mobile.trim(),
        }));
        if (settingsForm.upiId) {
          localStorage.setItem(`partner_upi_${partnerData.id}`, settingsForm.upiId.trim());
        }
        setSettingsSuccess('Partner profile updated successfully!');
        setTimeout(() => setSettingsSuccess(''), 3500);
      } else {
        setSettingsError(res.message || 'Failed to update partner settings');
      }
    } catch (err) {
      setSettingsError(err.response?.data?.message || 'Failed to update partner settings');
    } finally {
      setSettingsSaving(false);
    }
  };

  // Check how many referred members are in SOS Alert mode
  const alertMembers = referredUsers.filter((u) => u.safetyStatus === 'ALERT');
  const safeMembersCount = referredUsers.length - alertMembers.length;

  const filteredUsers = referredUsers.filter((u) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      (u.fullName && u.fullName.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.phone && u.phone.includes(query));

    if (!matchesSearch) return false;
    if (userFilter === 'ACTIVE') return u.subscriptionStatus === 'ACTIVE';
    if (userFilter === 'FREE') return u.subscriptionStatus !== 'ACTIVE';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF0F3] flex flex-col items-center justify-center p-4">
        {authError ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-3xl text-center max-w-md shadow-lg">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-800 mb-1">Access Restricted</h3>
            <p className="text-sm text-red-600">{authError}</p>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-4 border-[#FF2A6D] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-black text-gray-800 uppercase tracking-wider">
              Loading Protected Partner Command Portal...
            </p>
            <p className="text-xs text-gray-500">Verifying secure partner credentials</p>
          </div>
        )}
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview & Analytics', icon: LayoutDashboard },
    { id: 'users', label: 'Referred Users', icon: Users, badge: referredUsers.length },
    { id: 'links', label: 'My Referral Link', icon: Link2 },
    { id: 'earnings', label: 'Earnings & Commission', icon: IndianRupee, badge: `₹${earnings.totalEarnings}` },
    { id: 'settings', label: 'Settings & Profile', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FFF0F3]/35 flex font-sans selection:bg-[#FF2A6D] selection:text-white antialiased">
      {/* =========================================================
          DESKTOP SIDEBAR
          ========================================================= */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-pink-100 flex-col fixed inset-y-0 z-30 shadow-xs">
        {/* Sidebar Header Brand */}
        <div className="p-6 border-b border-pink-100 flex items-center gap-3">
          <Logo3DFlip size={36} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-gray-900 tracking-tight text-base">Sakhi Suraksha</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#FF2A6D] to-[#FF5E8E] text-white shadow-xs">
              Partner Portal
            </span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => switchTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF2A6D] to-[#FF5E8E] text-white shadow-md shadow-pink-500/20'
                    : 'text-gray-600 hover:bg-pink-50 hover:text-[#FF2A6D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-pink-100 text-[#FF2A6D]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Partner Profile Footer */}
        <div className="p-4 border-t border-pink-100 space-y-3 bg-pink-50/40">
          <div className="p-3 bg-white rounded-2xl border border-pink-100 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF2A6D] to-[#FF5E8E] text-white font-black flex items-center justify-center text-sm shadow-xs flex-shrink-0">
              {partnerData.name ? partnerData.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-gray-900 truncate">{partnerData.name}</div>
              <div className="text-[10px] text-gray-500 font-mono font-bold truncate">
                {partnerData.partnerReferralCode}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-white hover:bg-red-50 text-red-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-red-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* =========================================================
          MOBILE DRAWER SIDEBAR
          ========================================================= */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 bg-white h-full flex flex-col z-10 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-6 border-b border-pink-100">
              <div className="flex items-center gap-2.5">
                <Logo3DFlip size={30} />
                <span className="font-black text-gray-900">Partner Command</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => switchTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FF2A6D] to-[#FF5E8E] text-white shadow-md'
                        : 'text-gray-600 hover:bg-pink-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="py-3 px-4 bg-red-50 text-red-600 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          MAIN CONTENT AREA (Offset by sidebar on desktop)
          ========================================================= */}
      <div className="lg:ml-72 flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-pink-100 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-pink-50 text-gray-700 hover:bg-pink-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-black text-gray-900 tracking-tight capitalize">
                {activeTab === 'overview' && 'Partner Analytics Overview'}
                {activeTab === 'users' && 'Referred Community Members'}
                {activeTab === 'links' && 'Referral Link & Sharing Kit'}
                {activeTab === 'earnings' && 'Commission & Earnings Analysis'}
                {activeTab === 'settings' && 'Partner Settings & Profile'}
              </h1>
              <p className="text-[11px] text-gray-500 font-bold hidden sm:block">
                Sakhi Suraksha SOS &bull; Institutional Safety Referral Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live SOS Community Radar */}
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                alertMembers.length > 0
                  ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  alertMembers.length > 0 ? 'bg-red-500' : 'bg-emerald-500'
                }`}
              />
              <span>
                {alertMembers.length > 0
                  ? `🚨 ${alertMembers.length} Community Alert Active!`
                  : '🛡️ All Members Safe'}
              </span>
            </div>

            <button
              onClick={() => fetchDashboardData(localStorage.getItem('partner_token'))}
              disabled={isRefreshing}
              className="p-2 sm:px-3 sm:py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-gray-200 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FF2A6D]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        {/* Tab Body Content */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-6xl w-full mx-auto">
          {/* =========================================================
              TAB 1: OVERVIEW & ANALYTICS
              ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Partner Welcome Hero Card - Clean Sakhi Suraksha Theme */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border-2 border-[#FFCCE1] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF2A6D]/10 via-[#FF5E8E]/5 to-transparent rounded-bl-full pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF0F3] border border-[#FFCCE1] text-[#FF2A6D]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Verified Safety Partner</span>
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#2A0826] tracking-tight">
                      Welcome back, {partnerData.name}!
                    </h2>
                    <p className="text-[#684E67] text-xs sm:text-sm max-w-xl font-bold leading-relaxed">
                      Track registrations, active subscriptions, and your {earnings.commissionRate}% safety referral commissions live.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <a
                      href={getWhatsAppShareUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-xs transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Share on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => copyToClipboard(referralLink, 'link')}
                      className="px-5 py-3.5 bg-[#FFF0F3] hover:bg-pink-100 text-[#FF2A6D] font-bold rounded-2xl border border-[#FFCCE1] flex items-center justify-center gap-2 text-xs transition-all cursor-pointer shadow-xs"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Core Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-black text-gray-900 tracking-tight mb-1">
                    {stats.totalReferred}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Total Referred Users
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Registered with code {partnerData.partnerReferralCode}</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-black text-emerald-600 tracking-tight mb-1">
                    {stats.activeSubscribers}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Active Subscribers
                  </div>
                  <p className="text-xs text-gray-400 mt-2">24/7 SOS Protection active</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#FF2A6D] flex items-center justify-center mb-4">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-black text-[#FF2A6D] tracking-tight mb-1">
                    ₹{earnings.totalEarnings}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Total Commission Earned
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{earnings.commissionRate}% (₹{earnings.commissionPerUser}/user)</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-black text-purple-600 tracking-tight mb-1">
                    {stats.totalReferred > 0
                      ? `${Math.round((stats.activeSubscribers / stats.totalReferred) * 100)}%`
                      : '100%'}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Subscription Conversion
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Active subscribers / total</p>
                </div>
              </div>

              {/* Quick Actions & Recent Users Preview */}
              <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-gray-900">
                      Recent Referred Members
                    </h3>
                    <p className="text-xs text-gray-500">Latest users who joined via your link</p>
                  </div>
                  <button
                    onClick={() => switchTab('users')}
                    className="text-xs font-bold text-[#FF2A6D] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All ({referredUsers.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {referredUsers.length === 0 ? (
                  <div className="p-8 text-center bg-pink-50/40 rounded-2xl">
                    <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-600">No members referred yet</p>
                    <p className="text-[11px] text-gray-400 mt-1 mb-4">
                      Share your link on WhatsApp or social media to start onboarding members.
                    </p>
                    <button
                      onClick={() => switchTab('links')}
                      className="px-4 py-2 bg-[#FF2A6D] text-white text-xs font-bold rounded-xl"
                    >
                      Get Referral Link
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {referredUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#FF2A6D] font-bold flex items-center justify-center text-xs">
                            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900">{user.fullName || 'Member'}</div>
                            <div className="text-[10px] text-gray-400">
                              {user.email || user.phone || 'No contact'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              user.subscriptionStatus === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {user.subscriptionStatus === 'ACTIVE' ? 'Active Plan' : 'Free Member'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 2: REFERRED USERS
              ========================================================= */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl border border-pink-100 shadow-xs overflow-hidden space-y-6 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#FF2A6D]" />
                    <span>Referred Members Directory</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-50 text-[#FF2A6D] border border-pink-200">
                      {referredUsers.length} Total
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Basic information of users who joined using your referral code.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Filter Pills */}
                  <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setUserFilter('ALL')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        userFilter === 'ALL' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
                      }`}
                    >
                      All ({referredUsers.length})
                    </button>
                    <button
                      onClick={() => setUserFilter('ACTIVE')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        userFilter === 'ACTIVE' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-500'
                      }`}
                    >
                      Active ({stats.activeSubscribers})
                    </button>
                    <button
                      onClick={() => setUserFilter('FREE')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        userFilter === 'FREE' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
                      }`}
                    >
                      Free ({referredUsers.length - stats.activeSubscribers})
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search member name or contact..."
                      className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FF2A6D]"
                    />
                  </div>
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-700">No members match your criteria</p>
                  <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] font-bold border-b border-gray-100">
                      <tr>
                        <th className="py-3.5 px-4">Member Name</th>
                        <th className="py-3.5 px-4">Contact</th>
                        <th className="py-3.5 px-4">Joined Date</th>
                        <th className="py-3.5 px-4">Subscription Status</th>
                        <th className="py-3.5 px-4">Safety Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-pink-50/20 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#FF2A6D] font-black flex items-center justify-center text-xs">
                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <span className="font-bold text-gray-900">{user.fullName || 'Member'}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-gray-500">
                            {user.email || user.phone || '—'}
                          </td>
                          <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                            {new Date(user.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {user.subscriptionStatus === 'ACTIVE' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Active Protected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">
                                Registered (Free)
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {user.safetyStatus === 'ALERT' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 animate-pulse">
                                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                                SOS Alert
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                Safe
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 3: MY REFERRAL LINK & SHARING
              ========================================================= */}
          {activeTab === 'links' && (
            <div className="space-y-6">
              {/* Main Referral Link Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-[#FF2A6D]" />
                    <span>Your Unique Referral Link</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Anyone who signs up using this link is credited to your partner account.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <span className="font-mono text-xs sm:text-sm text-[#FF2A6D] font-bold select-all break-all">
                    {referralLink}
                  </span>
                  <button
                    onClick={() => copyToClipboard(referralLink, 'link')}
                    className="px-4 py-2.5 bg-[#FF2A6D] hover:bg-[#e0205f] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs flex-shrink-0 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                  </button>
                </div>

                {/* Partner Code Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-pink-50/60 rounded-2xl border border-pink-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-gray-500">Your Referral Code</div>
                      <div className="text-xl font-black font-mono text-[#FF2A6D] tracking-wider">
                        {partnerData.partnerReferralCode}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(partnerData.partnerReferralCode, 'code')}
                      className="px-3 py-1.5 bg-white text-[#FF2A6D] border border-pink-200 hover:bg-pink-100 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase text-gray-500">Member Discount</div>
                      <div className="text-xl font-black text-emerald-600">
                        {partnerData.discountPercentage || 10}% OFF
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Auto-Applied
                    </span>
                  </div>
                </div>

                {/* WhatsApp Direct Share Button */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-gray-600">
                    Share directly with students, employees, or your community network on WhatsApp.
                  </div>
                  <a
                    href={getWhatsAppShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Share on WhatsApp Now</span>
                  </a>
                </div>
              </div>

              {/* Awareness Material Kit */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#FF2A6D]" />
                    <span>Official Sakhi Suraksha SOS User Guide PDF</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Share the official 4-page emergency handbook with your students or staff members.
                  </p>
                </div>
                <a
                  href="mailto:support@veaglespace.com?subject=Partner%20Awareness%20Kit%20Request"
                  className="px-5 py-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-bold rounded-xl text-xs flex items-center gap-2 whitespace-nowrap shadow-xs"
                >
                  <Download className="w-4 h-4 text-[#FF2A6D]" />
                  <span>Request Digital Posters</span>
                </a>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 4: EARNINGS & COMMISSION ANALYSIS
              ========================================================= */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              {/* Earnings KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#FF2A6D] flex items-center justify-center mb-3">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-gray-900 tracking-tight">
                    {earnings.commissionRate}%
                  </div>
                  <div className="text-xs font-bold uppercase text-gray-500">Commission Rate</div>
                  <p className="text-[11px] text-gray-400 mt-1">₹{earnings.commissionPerUser} per ₹{earnings.planPrice} plan</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-emerald-600 tracking-tight">
                    ₹{earnings.totalEarnings}
                  </div>
                  <div className="text-xs font-bold uppercase text-gray-500">Total Earned</div>
                  <p className="text-[11px] text-gray-400 mt-1">From {stats.activeSubscribers} active members</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-blue-600 tracking-tight">
                    ₹{earnings.paidEarnings}
                  </div>
                  <div className="text-xs font-bold uppercase text-gray-500">Paid Out</div>
                  <p className="text-[11px] text-gray-400 mt-1">Settled to your bank/UPI</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black text-purple-600 tracking-tight">
                    ₹{earnings.pendingEarnings}
                  </div>
                  <div className="text-xs font-bold uppercase text-gray-500">Available Payout</div>
                  <p className="text-[11px] text-gray-400 mt-1">Ready for settlement</p>
                </div>
              </div>

              {/* Payout Settlement Card */}
              <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#FF2A6D]" />
                      <span>Payout &amp; Settlement Desk</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Commissions are disbursed directly to your registered UPI ID or Bank account.
                    </p>
                  </div>

                  <button
                    onClick={() => setPayoutRequested(true)}
                    disabled={earnings.pendingEarnings <= 0}
                    className="px-5 py-3 bg-gradient-to-r from-[#FF2A6D] to-[#FF5E8E] text-white font-bold rounded-2xl text-xs shadow-md shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Request Payout Settlement
                  </button>
                </div>

                {payoutRequested && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>
                        Payout request of <strong>₹{earnings.pendingEarnings}</strong> received! Our finance team will process this via your registered UPI ID within 24-48 hours.
                      </span>
                    </div>
                    <button
                      onClick={() => setPayoutRequested(false)}
                      className="text-xs font-bold text-emerald-800 underline ml-2"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Earnings breakdown formula info */}
                <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 text-xs text-gray-700 space-y-1">
                  <div className="font-bold text-gray-900">How is commission calculated?</div>
                  <p className="text-gray-600 leading-relaxed">
                    You receive <strong>{earnings.commissionRate}% commission</strong> on every subscriber who registers using your referral code and activates an annual Sakhi Suraksha protection subscription (₹{earnings.planPrice}/year). You earn <strong>₹{earnings.commissionPerUser}</strong> per active subscriber.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 5: SETTINGS & PROFILE
              ========================================================= */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#FF2A6D]" />
                  <span>Partner Profile &amp; Settings</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Update your contact info and payment details for commissions.
                </p>
              </div>

              {settingsSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{settingsSuccess}</span>
                </div>
              )}

              {settingsError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{settingsError}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-gray-700 font-bold mb-1.5 uppercase text-[11px] tracking-wider">
                    Partner / Representative Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2A6D]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1.5 uppercase text-[11px] tracking-wider">
                    Registered Email Address (Locked)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={partnerData.email}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Email is linked to your login session. Contact admin to change email.
                  </span>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1.5 uppercase text-[11px] tracking-wider">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settingsForm.mobile}
                    onChange={(e) => setSettingsForm({ ...settingsForm, mobile: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2A6D]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1.5 uppercase text-[11px] tracking-wider">
                    Payout UPI ID (For Commission Settlements)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.upiId}
                    onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                    placeholder="e.g. yourname@okaxis or 9876543210@paytm"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#FF2A6D]"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Direct commission deposits will be sent to this UPI address.
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="px-6 py-3 bg-[#FF2A6D] hover:bg-[#e0205f] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-pink-500/25 disabled:opacity-70 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{settingsSaving ? 'Saving Changes...' : 'Save Settings'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
