'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { AppLayout } from '../../../../components/layout/AppLayout.js';
import { AdminHeaderNav } from '../../../../components/admin/AdminHeaderNav.js';
import { referralApi } from '../../../../redux/api/referralApi.js';
import { adminApi } from '../../../../redux/api/adminApi.js';
import {
  ArrowLeft,
  Users,
  IndianRupee,
  ShieldCheck,
  ShieldAlert,
  Award,
  TrendingUp,
  Link2,
  Copy,
  Check,
  PowerOff,
  Power,
  Edit3,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Search,
  RefreshCw,
  MessageCircle,
  AlertCircle,
  Save,
  CheckCircle2,
  Wallet,
  ExternalLink,
  Percent,
  Sliders,
} from 'lucide-react';

export default function PartnerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const partnerId = params?.id;

  const [mounted, setMounted] = useState(false);
  const [partner, setPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activePlanPrice, setActivePlanPrice] = useState(24);

  // Tabs: 'users' | 'edit'
  const [activeTab, setActiveTab] = useState('users');

  // Search & Filter for referred users
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'FREE'

  // Clipboard copy state
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    mobile: '',
    partnerReferralCode: '',
    discountType: 'PERCENTAGE',
    discountPercentage: '10',
    isActive: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPartnerDetails = async () => {
    if (!partnerId) return;
    try {
      setIsLoading(true);
      const [res, plansRes] = await Promise.all([
        referralApi.getPartnerById(partnerId),
        adminApi.fetchPlans().catch(() => ({ plans: [] })),
      ]);

      if (res.success && res.partner) {
        setPartner(res.partner);
        setEditForm({
          name: res.partner.name || '',
          email: res.partner.email || '',
          mobile: res.partner.mobile || '',
          partnerReferralCode: res.partner.partnerReferralCode || '',
          discountType: res.partner.discountType || 'PERCENTAGE',
          discountPercentage: String(res.partner.discountValue || res.partner.discountPercentage || '10'),
          isActive: res.partner.isActive !== undefined ? res.partner.isActive : true,
        });
      } else {
        showToast('error', res.message || 'Failed to load partner details');
      }

      const plans = plansRes?.plans || plansRes?.data?.plans || [];
      const active = plans.find((p) => p.isActive) || plans[0];
      if (active && (active.basePrice || active.totalPrice)) {
        setActivePlanPrice(Number(active.basePrice || active.totalPrice));
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Error loading partner details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchPartnerDetails();
  }, [partnerId]);

  const copyToClipboard = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
    showToast('success', `${type === 'link' ? 'Referral Link' : 'Referral Code'} copied to clipboard!`);
  };

  const handleToggleStatus = async () => {
    if (!partner) return;
    const newStatus = !partner.isActive;
    const actionName = newStatus ? 'activate' : 'block / deactivate';
    if (!confirm(`Are you sure you want to ${actionName} ${partner.name}?`)) return;

    try {
      setIsTogglingStatus(true);
      const res = await referralApi.updatePartner(partner.id, { isActive: newStatus });
      if (res.success) {
        showToast('success', `Partner successfully ${newStatus ? 'activated' : 'blocked'}!`);
        setPartner({ ...partner, isActive: newStatus });
        setEditForm((prev) => ({ ...prev, isActive: newStatus }));
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update partner status');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!partner) return;

    const val = Number(editForm.discountPercentage);
    if (editForm.discountType === 'FLAT_AMOUNT') {
      if (val > activePlanPrice) {
        showToast('error', `Flat commission (₹${val}) cannot exceed active plan price of ₹${activePlanPrice}!`);
        return;
      }
      if (val <= 0 || isNaN(val)) {
        showToast('error', 'Commission amount must be greater than ₹0.');
        return;
      }
    } else {
      if (val > 100) {
        showToast('error', 'Commission percentage cannot exceed 100%!');
        return;
      }
      if (val <= 0 || isNaN(val)) {
        showToast('error', 'Commission percentage must be greater than 0%.');
        return;
      }
    }

    try {
      setIsSaving(true);
      const payload = {
        partnerName: editForm.name,
        email: editForm.email,
        mobile: editForm.mobile,
        partnerReferralCode: editForm.partnerReferralCode,
        discountType: editForm.discountType,
        discountValue: editForm.discountPercentage,
        discountPercentage: editForm.discountPercentage,
        isActive: editForm.isActive,
      };

      const res = await referralApi.updatePartner(partner.id, payload);
      if (res.success) {
        showToast('success', 'Partner details and commission updated successfully!');
        fetchPartnerDetails();
        setActiveTab('users');
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update partner');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePartner = async () => {
    if (!partner) return;
    if (!confirm(`Are you sure you want to permanently delete ${partner.name}? This cannot be undone.`)) return;

    try {
      const res = await referralApi.deletePartner(partner.id);
      if (res.success) {
        showToast('success', 'Partner deleted successfully.');
        router.push('/admin/referrals');
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to delete partner. If partner has referred users, deactivate them instead.');
    }
  };

  const getWhatsAppShareUrl = () => {
    if (!partner?.referralLink) return '#';
    const text = encodeURIComponent(
      `Hello! I invite you to join Sakhi Suraksha SOS — Personal Safety & Rapid SOS Community Protection. Register using my official partner referral link to activate 24/7 emergency safety tracking:\n${partner.referralLink}`
    );
    return `https://wa.me/?text=${text}`;
  };

  if (!mounted) return null;

  // Filter referred users
  const referredUsersList = partner?.referredUsers || [];
  const filteredUsers = referredUsersList.filter((u) => {
    const query = searchTerm.toLowerCase();
    const matchSearch =
      (u.fullName || '').toLowerCase().includes(query) ||
      (u.email || '').toLowerCase().includes(query) ||
      (u.phone || '').toLowerCase().includes(query);

    if (!matchSearch) return false;
    if (statusFilter === 'ACTIVE') return u.subscriptionStatus === 'ACTIVE';
    if (statusFilter === 'FREE') return u.subscriptionStatus !== 'ACTIVE';
    return true;
  });

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-fade-in font-sans">
        <AdminHeaderNav toast={toast} onRefresh={fetchPartnerDetails} />

        {/* TOP BREADCRUMB & BACK LINK */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/referrals"
            className="inline-flex items-center gap-2 text-xs font-black text-[#684E67] hover:text-[#FF2A6D] transition-colors bg-white px-4 py-2.5 rounded-2xl border border-[#FFCCE1] shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF2A6D]" />
            <span>Back to All Referral Partners</span>
          </Link>

          <button
            onClick={fetchPartnerDetails}
            disabled={isLoading}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#684E67] hover:text-[#FF2A6D] bg-white px-4 py-2.5 rounded-2xl border border-[#FFCCE1] shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Details</span>
          </button>
        </div>

        {isLoading ? (
          <div className="p-16 bg-white rounded-[36px] border-2 border-[#FFCCE1] shadow-md text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#FF2A6D] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-black text-[#2A0826]">Loading Partner Profile &amp; Commission Metrics...</p>
          </div>
        ) : !partner ? (
          <div className="p-16 bg-white rounded-[36px] border-2 border-[#FFCCE1] shadow-md text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-black text-[#2A0826]">Partner Not Found</h3>
            <p className="text-xs text-[#684E67]">The partner you are looking for does not exist or has been deleted.</p>
            <Link
              href="/admin/referrals"
              className="inline-block px-5 py-2.5 bg-[#FF2A6D] text-white font-bold text-xs rounded-xl shadow-md"
            >
              Return to Referral Directory
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* PARTNER HEADER HERO CARD */}
            <div className="bg-white rounded-[36px] p-6 sm:p-8 border-2 border-[#FFCCE1] shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF2A6D]/10 via-[#FF5E8E]/5 to-transparent rounded-bl-full pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#FF2A6D] to-[#FF5E8E] text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-pink-500/20 shrink-0">
                    {partner.name ? partner.name.charAt(0).toUpperCase() : 'P'}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-black text-[#2A0826] tracking-tight">
                        {partner.name}
                      </h1>
                      {partner.isActive ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active Partner</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-red-50 text-red-700 border border-red-200 uppercase">
                          <PowerOff className="w-3.5 h-3.5" />
                          <span>Blocked / Inactive</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-[#684E67] flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#FF2A6D]" />
                        <span>{partner.email}</span>
                      </span>
                      {partner.mobile && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#FF2A6D]" />
                          <span>{partner.mobile}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#FF2A6D]" />
                        <span>Joined {new Date(partner.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </span>
                    </div>

                    {/* Partner Code & Referral Link Pills */}
                    <div className="pt-2 flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => copyToClipboard(partner.partnerReferralCode, 'code')}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black uppercase font-mono tracking-wider hover:bg-amber-100 transition-colors cursor-pointer"
                        title="Click to copy partner code"
                      >
                        <span>Code: {partner.partnerReferralCode}</span>
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-700" />}
                      </button>

                      <button
                        onClick={() => copyToClipboard(partner.referralLink, 'link')}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF0F3] text-[#FF2A6D] border border-[#FFCCE1] text-xs font-bold hover:bg-pink-100 transition-colors cursor-pointer"
                        title="Click to copy partner referral link"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>{copiedLink ? 'Link Copied!' : 'Copy Referral Link'}</span>
                      </button>

                      <a
                        href={getWhatsAppShareUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#25D366]/10 text-[#20ba59] border border-emerald-200 text-xs font-bold hover:bg-[#25D366]/20 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-[#20ba59]" />
                        <span>Share on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end flex-wrap pt-2 lg:pt-0">
                  <button
                    onClick={() => setActiveTab(activeTab === 'edit' ? 'users' : 'edit')}
                    className="px-4 py-2.5 bg-[#FFF0F3] hover:bg-pink-100 text-[#FF2A6D] font-bold rounded-2xl border border-[#FFCCE1] text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>{activeTab === 'edit' ? 'View Users Network' : 'Edit Commission & Details'}</span>
                  </button>

                  <button
                    onClick={handleToggleStatus}
                    disabled={isTogglingStatus}
                    className={`px-4 py-2.5 font-bold rounded-2xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs border ${
                      partner.isActive
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {partner.isActive ? <PowerOff className="w-4 h-4 text-amber-600" /> : <Power className="w-4 h-4 text-emerald-600" />}
                    <span>{partner.isActive ? 'Block Partner' : 'Unblock Partner'}</span>
                  </button>

                  <button
                    onClick={handleDeletePartner}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl border border-rose-200 transition-all cursor-pointer"
                    title="Delete Partner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 4 CORE METRIC KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Commission Model Card */}
              <div className="bg-white rounded-[32px] p-6 border-2 border-[#FFCCE1] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#FF2A6D] flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFF0F3] text-[#FF2A6D] border border-[#FFCCE1]">
                    {partner.discountType === 'FLAT_AMOUNT' ? 'Flat Amount' : 'Percentage'}
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black text-[#2A0826] tracking-tight">
                    {partner.commissionRate}%
                  </div>
                  <div className="text-xs font-black uppercase tracking-wider text-[#684E67] mt-0.5">
                    Commission Rate
                  </div>
                  <p className="text-[11px] text-[#684E67] font-bold mt-1.5">
                    {partner.discountType === 'FLAT_AMOUNT'
                      ? `₹${partner.commissionPerUser} flat per ₹${partner.stats?.planPrice || activePlanPrice} plan`
                      : `${partner.commissionRate}% of ₹${partner.stats?.planPrice || activePlanPrice} (= ₹${partner.commissionPerUser}/user)`}
                  </p>
                </div>
              </div>

              {/* Total Referred Users Card */}
              <div className="bg-white rounded-[32px] p-6 border-2 border-[#FFCCE1] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Network
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black text-[#2A0826] tracking-tight">
                    {partner.stats?.totalReferred || 0}
                  </div>
                  <div className="text-xs font-black uppercase tracking-wider text-[#684E67] mt-0.5">
                    Total Referred Users
                  </div>
                  <p className="text-[11px] text-[#684E67] font-bold mt-1.5">
                    <span className="text-emerald-600 font-black">{partner.stats?.activeSubscribers || 0} Active</span>
                    {' • '}
                    <span>{partner.stats?.freeMembers || 0} Free Members</span>
                  </p>
                </div>
              </div>

              {/* Gross Revenue Generated Card */}
              <div className="bg-white rounded-[32px] p-6 border-2 border-[#FFCCE1] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Sales Volume
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black text-purple-700 tracking-tight">
                    ₹{partner.stats?.totalGrossRevenue || 0}
                  </div>
                  <div className="text-xs font-black uppercase tracking-wider text-[#684E67] mt-0.5">
                    Gross Revenue Generated
                  </div>
                  <p className="text-[11px] text-[#684E67] font-bold mt-1.5">
                    From {partner.stats?.activeSubscribers || 0} active subscriptions
                  </p>
                </div>
              </div>

              {/* Total Partner Earnings Card */}
              <div className="bg-white rounded-[32px] p-6 border-2 border-[#FFCCE1] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Payout Desk
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black text-emerald-600 tracking-tight">
                    ₹{partner.stats?.totalEarnings || 0}
                  </div>
                  <div className="text-xs font-black uppercase tracking-wider text-[#684E67] mt-0.5">
                    Total Commission Earned
                  </div>
                  <p className="text-[11px] text-[#684E67] font-bold mt-1.5">
                    <span>Paid: ₹{partner.stats?.paidEarnings || 0}</span>
                    {' • '}
                    <span className="text-purple-700 font-black">Pending: ₹{partner.stats?.pendingEarnings || 0}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* TAB TOGGLE: REFERRED USERS vs EDIT SETTINGS */}
            <div className="flex border-b border-[#FFCCE1] gap-4">
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-3 text-sm font-black transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
                  activeTab === 'users'
                    ? 'border-[#FF2A6D] text-[#FF2A6D]'
                    : 'border-transparent text-[#684E67] hover:text-[#2A0826]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Referred Members ({referredUsersList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('edit')}
                className={`pb-3 text-sm font-black transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
                  activeTab === 'edit'
                    ? 'border-[#FF2A6D] text-[#FF2A6D]'
                    : 'border-transparent text-[#684E67] hover:text-[#2A0826]'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Edit Partner Details &amp; Commission Model</span>
              </button>
            </div>

            {/* TAB 1: REFERRED USERS DIRECTORY */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-[36px] border-2 border-[#FFCCE1] shadow-md p-6 sm:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-[#2A0826]">Referred Members Network</h3>
                    <p className="text-xs font-bold text-[#684E67]">
                      Live users who registered using referral code <strong>{partner.partnerReferralCode}</strong>.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, email, phone..."
                        className="pl-9 pr-4 py-2.5 bg-[#FFF0F3]/40 border border-[#FFCCE1] rounded-2xl text-xs font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] w-full sm:w-64"
                      />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 bg-[#FFF0F3]/50 p-1 rounded-2xl border border-[#FFCCE1]">
                      <button
                        onClick={() => setStatusFilter('ALL')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          statusFilter === 'ALL'
                            ? 'bg-gradient-to-r from-[#FF2A6D] to-[#FF5E8E] text-white shadow-xs'
                            : 'text-[#684E67] hover:text-[#2A0826]'
                        }`}
                      >
                        All ({referredUsersList.length})
                      </button>
                      <button
                        onClick={() => setStatusFilter('ACTIVE')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          statusFilter === 'ACTIVE'
                            ? 'bg-gradient-to-r from-[#FF2A6D] to-[#FF5E8E] text-white shadow-xs'
                            : 'text-[#684E67] hover:text-[#2A0826]'
                        }`}
                      >
                        Active ({partner.stats?.activeSubscribers || 0})
                      </button>
                      <button
                        onClick={() => setStatusFilter('FREE')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          statusFilter === 'FREE'
                            ? 'bg-gradient-to-r from-[#FF2A6D] to-[#FF5E8E] text-white shadow-xs'
                            : 'text-[#684E67] hover:text-[#2A0826]'
                        }`}
                      >
                        Free ({partner.stats?.freeMembers || 0})
                      </button>
                    </div>
                  </div>
                </div>

                {filteredUsers.length === 0 ? (
                  <div className="p-12 text-center bg-[#FFF0F3]/20 rounded-3xl border border-[#FFCCE1] space-y-2">
                    <Users className="w-10 h-10 text-[#FF2A6D] mx-auto opacity-40" />
                    <p className="text-sm font-black text-[#2A0826]">No matching referred members found</p>
                    <p className="text-xs text-[#684E67]">
                      {searchTerm ? 'Try adjusting your search keywords.' : 'This partner has not referred any users in this category yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[750px]">
                      <thead>
                        <tr className="bg-[#FFF0F3]/60 border-b-2 border-[#FFCCE1]">
                          <th className="p-4 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                            Member
                          </th>
                          <th className="p-4 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                            Contact
                          </th>
                          <th className="p-4 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                            Registered
                          </th>
                          <th className="p-4 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                            Subscription
                          </th>
                          <th className="p-4 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                            Safety Radar
                          </th>
                          <th className="p-4 text-[11px] font-black text-[#2A0826] uppercase tracking-widest text-right">
                            Revenue
                          </th>
                          <th className="p-4 text-[11px] font-black text-[#2A0826] uppercase tracking-widest text-right">
                            Commission
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#FFCCE1]/50 text-xs font-bold text-[#684E67]">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-[#FFF0F3]/30 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#FF2A6D] font-black flex items-center justify-center text-xs shrink-0">
                                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="font-black text-[#2A0826]">{user.fullName || 'Member'}</span>
                              </div>
                            </td>
                            <td className="p-4 space-y-0.5">
                              <div>{user.email || '—'}</div>
                              {user.phone && <div className="text-[10px] text-gray-500">{user.phone}</div>}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              {new Date(user.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              {user.subscriptionStatus === 'ACTIVE' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  Active Protected
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gray-100 text-gray-600">
                                  Free Member
                                </span>
                              )}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              {user.safetyStatus === 'ALERT' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-50 text-red-700 border border-red-200 animate-pulse">
                                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                                  SOS Alert
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                  Safe
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right whitespace-nowrap font-black text-[#2A0826]">
                              ₹{user.totalPaid || 0}
                            </td>
                            <td className="p-4 text-right whitespace-nowrap font-black text-emerald-600">
                              +₹{user.commissionEarned || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: EDIT PARTNER & COMMISSION DESK */}
            {activeTab === 'edit' && (
              <div className="bg-white rounded-[36px] border-2 border-[#FFCCE1] shadow-md p-6 sm:p-8 space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-xl font-black text-[#2A0826] flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#FF2A6D]" />
                    <span>Edit Partner Profile &amp; Commission Model</span>
                  </h3>
                  <p className="text-xs font-bold text-[#684E67] mt-1">
                    SuperAdmin controls to modify partner credentials, referral code, and commission payout terms.
                  </p>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        Partner Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all"
                        placeholder="e.g. Aarav Mehta"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all"
                        placeholder="partner@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        Mobile Number (Used for partner login)
                      </label>
                      <input
                        type="text"
                        value={editForm.mobile}
                        onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all"
                        placeholder="+91..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        Custom Referral Code *
                      </label>
                      <input
                        required
                        type="text"
                        value={editForm.partnerReferralCode}
                        onChange={(e) =>
                          setEditForm({ ...editForm, partnerReferralCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })
                        }
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-black text-[#FF2A6D] uppercase outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all font-mono"
                        placeholder="e.g. SAKHI20"
                      />
                    </div>
                  </div>

                  {/* Commission Model Section */}
                  <div className="p-5 bg-[#FFF0F3]/40 rounded-3xl border border-[#FFCCE1] space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#2A0826] flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#FF2A6D]" />
                        <span>Commission Structure</span>
                      </h4>
                      <span className="text-[10px] font-black text-[#FF2A6D] bg-white px-2.5 py-1 rounded-full border border-[#FFCCE1]">
                        Current Subscription Plan: ₹{activePlanPrice}/year
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                          Commission Model
                        </label>
                        <select
                          value={editForm.discountType}
                          onChange={(e) => setEditForm({ ...editForm, discountType: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-[#FFCCE1] rounded-2xl text-sm font-bold outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all cursor-pointer text-[#2A0826]"
                        >
                          <option value="PERCENTAGE">Percentage (%)</option>
                          <option value="FLAT_AMOUNT">Flat Amount (₹)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                            {editForm.discountType === 'FLAT_AMOUNT' ? 'Flat Amount (₹)' : 'Percentage (%)'}
                          </label>
                          {editForm.discountType === 'FLAT_AMOUNT' && (
                            <span className="text-[10px] font-bold text-[#FF2A6D] bg-white px-2 py-0.5 rounded-full border border-[#FFCCE1]">
                              Max ₹{activePlanPrice}
                            </span>
                          )}
                        </div>
                        <input
                          required
                          type="number"
                          step={editForm.discountType === 'FLAT_AMOUNT' ? '0.5' : '0.1'}
                          min="0.1"
                          max={editForm.discountType === 'FLAT_AMOUNT' ? activePlanPrice : 100}
                          value={editForm.discountPercentage}
                          onChange={(e) => setEditForm({ ...editForm, discountPercentage: e.target.value })}
                          className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm font-bold outline-none transition-all ${
                            editForm.discountType === 'FLAT_AMOUNT' && Number(editForm.discountPercentage) > activePlanPrice
                              ? 'border-red-500 ring-2 ring-red-400/20 text-red-600'
                              : 'border-[#FFCCE1] focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 text-[#2A0826]'
                          }`}
                          placeholder={editForm.discountType === 'FLAT_AMOUNT' ? `e.g. 5 (Max ₹${activePlanPrice})` : 'e.g. 10 (Max 100%)'}
                        />
                      </div>
                    </div>

                    {editForm.discountType === 'FLAT_AMOUNT' && Number(editForm.discountPercentage) > activePlanPrice ? (
                      <p className="text-xs text-red-600 font-black animate-pulse flex items-center gap-1">
                        <span>⚠️ Flat commission (₹{editForm.discountPercentage}) cannot exceed the active plan price of ₹{activePlanPrice}!</span>
                      </p>
                    ) : (
                      <div className="p-3 bg-white rounded-xl border border-[#FFCCE1] text-[11px] font-bold text-[#684E67] flex items-center justify-between">
                        <span>
                          {editForm.discountType === 'FLAT_AMOUNT'
                            ? `Partner earns ₹${editForm.discountPercentage || 0} flat per ₹${activePlanPrice} yearly subscriber.`
                            : `Partner earns ${editForm.discountPercentage || 0}% (= ₹${((activePlanPrice * Number(editForm.discountPercentage || 0)) / 100).toFixed(2)}) per subscriber.`}
                        </span>
                        <span className="text-[#FF2A6D] font-black">
                          Display to partner: {editForm.discountType === 'FLAT_AMOUNT'
                            ? `${((Number(editForm.discountPercentage || 0) / activePlanPrice) * 100).toFixed(1)}%`
                            : `${editForm.discountPercentage || 0}%`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Account Status Switch */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-[#2A0826]">Partner Status</div>
                      <div className="text-[11px] text-[#684E67] font-bold">
                        {editForm.isActive ? 'Partner account is active and can login.' : 'Partner account is blocked and cannot login.'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        editForm.isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {editForm.isActive ? 'Active' : 'Blocked'}
                    </button>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-4 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Saving Changes...' : 'Save & Update Partner'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('users')}
                      className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-2xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
