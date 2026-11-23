'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '../../../components/layout/AppLayout.js';
import { AdminHeaderNav } from '../../../components/admin/AdminHeaderNav.js';
import { referralApi } from '../../../redux/api/referralApi.js';
import { adminApi } from '../../../redux/api/adminApi.js';
import {
  Network,
  Plus,
  Users,
  X,
  Link as LinkIcon,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
  PowerOff,
  Power,
  Eye,
  ExternalLink,
} from 'lucide-react';

export default function AdminReferralsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('partners'); // 'partners' | 'applications'
  const [partners, setPartners] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState(null);

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [approvalForm, setApprovalForm] = useState({
    partnerReferralCode: '',
    discountType: 'PERCENTAGE',
    discountPercentage: '10',
  });
  const [isApproving, setIsApproving] = useState(false);
  const [activePlanPrice, setActivePlanPrice] = useState(24);

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    partnerReferralCode: '',
    discountType: 'PERCENTAGE',
    discountPercentage: '10',
    isActive: true,
  });

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPartners = async () => {
    try {
      setIsLoading(true);
      const [partnersRes, appsRes] = await Promise.all([
        referralApi.getAllPartners(),
        referralApi.getPartnerApplications().catch(() => ({ success: false, applications: [] })),
      ]);
      if (partnersRes.success) setPartners(partnersRes.partners || []);
      if (appsRes.success) setApplications(appsRes.applications || []);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to load referral partners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchPartners();

    const loadPlanPrice = async () => {
      try {
        const res = await adminApi.fetchPlans();
        const plans = res?.plans || res?.data?.plans || [];
        const active = plans.find((p) => p.isActive) || plans[0];
        if (active && (active.basePrice || active.totalPrice)) {
          setActivePlanPrice(Number(active.basePrice || active.totalPrice));
        }
      } catch (err) {
        // Fallback to default ₹24 plan price
      }
    };
    loadPlanPrice();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = Number(form.discountPercentage);

    if (form.discountType === 'FLAT_AMOUNT') {
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
      const payload = {
        partnerName: form.name,
        email: form.email,
        mobile: form.mobile,
        partnerReferralCode: form.partnerReferralCode,
        discountType: form.discountType || 'PERCENTAGE',
        discountValue: form.discountPercentage,
        discountPercentage: form.discountPercentage,
        isActive: form.isActive,
      };

      let res;
      if (isEditMode) {
        res = await referralApi.updatePartner(editingPartnerId, payload);
      } else {
        res = await referralApi.createPartner(payload);
      }

      if (res.success) {
        showToast(
          'success',
          isEditMode
            ? 'Referral partner updated successfully!'
            : 'Referral partner created successfully!'
        );
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingPartnerId(null);
        setForm({
          name: '',
          email: '',
          mobile: '',
          partnerReferralCode: '',
          discountType: 'PERCENTAGE',
          discountPercentage: '10',
          isActive: true,
        });
        fetchPartners();
      }
    } catch (err) {
      showToast(
        'error',
        err.response?.data?.message ||
          (isEditMode ? 'Failed to update partner' : 'Failed to create partner')
      );
    }
  };

  const handleEditClick = (partner) => {
    setForm({
      name: partner.name,
      email: partner.email,
      mobile: partner.mobile || '',
      partnerReferralCode: partner.partnerReferralCode || '',
      discountType: partner.discountType || 'PERCENTAGE',
      discountPercentage: partner.discountValue || partner.discountPercentage || '10',
      isActive: partner.isActive,
    });
    setIsEditMode(true);
    setEditingPartnerId(partner.id);
    setIsModalOpen(true);
  };

  const handleDeletePartner = async (id) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;
    try {
      const res = await referralApi.deletePartner(id);
      if (res.success) {
        showToast('success', 'Partner deleted successfully.');
        fetchPartners();
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to delete partner');
    }
  };

  const handleToggleStatus = async (partner) => {
    try {
      const res = await referralApi.updatePartner(partner.id, { isActive: !partner.isActive });
      if (res.success) {
        showToast('success', 'Partner status updated');
        fetchPartners();
      }
    } catch (err) {
      showToast('error', 'Failed to update status');
    }
  };

  const openCreateModal = () => {
    setForm({
      name: '',
      email: '',
      mobile: '',
      partnerReferralCode: '',
      discountType: 'PERCENTAGE',
      discountPercentage: '10',
      isActive: true,
    });
    setIsEditMode(false);
    setEditingPartnerId(null);
    setIsModalOpen(true);
  };

  const openPartnerStats = async (id) => {
    try {
      const res = await referralApi.getPartnerById(id);
      if (res.success) {
        setSelectedPartner(res.partner);
        setIsStatsModalOpen(true);
      }
    } catch (err) {
      showToast('error', 'Failed to fetch partner details');
    }
  };

  const openApproveModal = (app) => {
    setSelectedApp(app);
    // suggest code based on name or blank for auto
    const cleanName = (app.fullName || '').replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
    setApprovalForm({
      partnerReferralCode: cleanName ? `${cleanName}${Math.floor(10 + Math.random() * 90)}` : '',
      discountType: 'PERCENTAGE',
      discountPercentage: '10',
    });
    setIsApproveModalOpen(true);
  };

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    const val = Number(approvalForm.discountPercentage);
    if (approvalForm.discountType === 'FLAT_AMOUNT') {
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
      setIsApproving(true);
      const payload = {
        partnerReferralCode: approvalForm.partnerReferralCode,
        discountType: approvalForm.discountType || 'PERCENTAGE',
        discountValue: approvalForm.discountPercentage,
        discountPercentage: approvalForm.discountPercentage,
      };
      const res = await referralApi.approvePartnerApplication(selectedApp.id, payload);
      if (res.success) {
        showToast('success', res.message || 'Partner application approved and code generated!');
        setIsApproveModalOpen(false);
        setSelectedApp(null);
        fetchPartners();
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to approve application');
    } finally {
      setIsApproving(false);
    }
  };

  if (!mounted) return null;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        <AdminHeaderNav toast={toast} onRefresh={fetchPartners} />

        <div className="space-y-8 animate-fade-up">
          {/* HEADER SECTION */}
          <div className="bg-white p-6 sm:p-8 rounded-[36px] border-2 border-[#FFCCE1] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-black text-2xl text-[#2A0826]">Referral Partners</h2>
                <p className="text-xs font-bold text-[#684E67]">
                  Manage B2B partners, NGO affiliates, and custom referral links.
                </p>
              </div>
            </div>
            <button
              onClick={openCreateModal}
              className="px-5 py-3.5 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white text-xs font-black rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center space-x-2 cursor-pointer uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Add Partner</span>
            </button>
          </div>

          {/* TABS */}
          <div className="flex items-center space-x-3 border-b-2 border-[#FFCCE1] pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('partners')}
              className={`pb-3 px-4 text-xs sm:text-sm font-black uppercase tracking-wider transition-all border-b-2 -mb-1.5 cursor-pointer flex items-center space-x-2 ${
                activeTab === 'partners'
                  ? 'border-[#FF2A6D] text-[#FF2A6D]'
                  : 'border-transparent text-[#684E67] hover:text-[#2A0826]'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Active Partners ({partners.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              className={`pb-3 px-4 text-xs sm:text-sm font-black uppercase tracking-wider transition-all border-b-2 -mb-1.5 cursor-pointer flex items-center space-x-2 ${
                activeTab === 'applications'
                  ? 'border-[#FF2A6D] text-[#FF2A6D]'
                  : 'border-transparent text-[#684E67] hover:text-[#2A0826]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Partner Applications</span>
              {applications.filter((a) => a.status === 'PENDING').length > 0 && (
                <span className="bg-[#FF2A6D] text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                  {applications.filter((a) => a.status === 'PENDING').length} New
                </span>
              )}
            </button>
          </div>

          {/* PARTNERS LIST */}
          {activeTab === 'partners' ? (
          <div className="bg-white rounded-[36px] border-2 border-[#FFCCE1] shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#FFF0F3]/60 border-b-2 border-[#FFCCE1]">
                    <th className="p-5 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                      Partner Name
                    </th>
                    <th className="p-5 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                      Contact Info
                    </th>
                    <th className="p-5 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                      Unique Code
                    </th>
                    <th className="p-5 text-[11px] font-black text-[#2A0826] uppercase tracking-widest text-center">
                      Referred Users
                    </th>
                    <th className="p-5 text-[11px] font-black text-[#2A0826] uppercase tracking-widest text-center">
                      Status
                    </th>
                    <th className="p-5 text-[11px] font-black text-[#2A0826] uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFCCE1]/50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-sm font-bold text-[#684E67]">
                        Loading partners...
                      </td>
                    </tr>
                  ) : partners.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-sm font-bold text-[#684E67]">
                        No referral partners found.
                      </td>
                    </tr>
                  ) : (
                    partners.map((partner) => (
                      <tr key={partner.id} className="hover:bg-[#FFF0F3]/40 transition-colors group">
                        <td className="p-5 font-black text-sm text-[#2A0826]">
                          <Link
                            href={`/admin/referrals/${partner.id}`}
                            className="hover:text-[#FF2A6D] transition-colors inline-flex items-center gap-2 group-hover:translate-x-0.5 transform duration-150"
                            title="Click to view full partner details & commission breakdown"
                          >
                            <span>{partner.name}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#FF2A6D] opacity-40 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </td>
                        <td className="p-5 space-y-1">
                          <p className="text-xs font-bold text-[#684E67] flex items-center space-x-1">
                            <Mail className="w-3 h-3 text-[#FF2A6D]" /> <span>{partner.email}</span>
                          </p>
                          {partner.mobile && (
                            <p className="text-xs font-bold text-[#684E67] flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-[#FF2A6D]" />{' '}
                              <span>{partner.mobile}</span>
                            </p>
                          )}
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1.5 rounded-xl uppercase border border-amber-200 font-mono">
                              {partner.partnerReferralCode}
                            </span>
                            <span className="bg-pink-50 text-[#FF2A6D] text-[10px] font-black px-2 py-0.5 rounded-lg border border-pink-200 whitespace-nowrap">
                              {partner.discountType === 'FLAT_AMOUNT'
                                ? `₹${partner.discountValue || 0} Flat`
                                : `${partner.discountPercentage || partner.discountValue || 10}%`}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <div className="inline-flex items-center space-x-1.5 bg-purple-50 text-purple-700 font-black px-3 py-1 rounded-xl border border-purple-200 text-xs">
                            <Users className="w-3.5 h-3.5" />
                            <span>{partner._count?.referredUsers || 0}</span>
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          {partner.isActive ? (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                              Active
                            </span>
                          ) : (
                            <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/admin/referrals/${partner.id}`}
                              className="text-xs font-black text-[#FF2A6D] hover:text-white transition-all uppercase tracking-wider bg-[#FFF0F3] hover:bg-[#FF2A6D] px-3 py-1.5 rounded-xl border border-[#FFCCE1] whitespace-nowrap inline-flex items-center gap-1.5 shadow-xs mr-1"
                              title="View Complete Partner Details & Commission Breakdown"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </Link>
                            <button
                              onClick={() => handleEditClick(partner)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                              title="Edit Partner"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(partner)}
                              className={`p-2 rounded-xl transition-colors ${partner.isActive ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                              title={partner.isActive ? 'Disable Partner' : 'Enable Partner'}
                            >
                              {partner.isActive ? (
                                <PowerOff className="w-4 h-4" />
                              ) : (
                                <Power className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeletePartner(partner.id)}
                              className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                              title="Delete Partner"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          ) : (
          /* APPLICATIONS LIST */
          <div className="bg-white rounded-[36px] border-2 border-[#FFCCE1] shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-[#FFF0F3]/60 border-b-2 border-[#FFCCE1]">
                    <th className="p-5 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                      Applicant Name &amp; Date
                    </th>
                    <th className="p-5 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                      Contact Info
                    </th>
                    <th className="p-5 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                      Details / Note
                    </th>
                    <th className="p-5 text-[11px] font-black text-[#2A0826] uppercase tracking-widest text-center">
                      Status
                    </th>
                    <th className="p-5 text-[11px] font-black text-[#2A0826] uppercase tracking-widest text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFCCE1]/50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-sm font-bold text-[#684E67]">
                        Loading applications...
                      </td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-sm font-bold text-[#684E67]">
                        No partner applications submitted yet.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id} className="hover:bg-[#FFF0F3]/30 transition-colors">
                        <td className="p-5 space-y-1">
                          <p className="font-black text-sm text-[#2A0826]">{app.fullName}</p>
                          <p className="text-[11px] font-bold text-gray-500 flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-[#FF2A6D]" />
                            <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                          </p>
                        </td>
                        <td className="p-5 space-y-1">
                          <p className="text-xs font-bold text-[#684E67] flex items-center space-x-1">
                            <Mail className="w-3 h-3 text-[#FF2A6D]" /> <span>{app.email}</span>
                          </p>
                          {app.phone && (
                            <p className="text-xs font-bold text-[#684E67] flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-[#FF2A6D]" /> <span>{app.phone}</span>
                            </p>
                          )}
                        </td>
                        <td className="p-5 max-w-sm">
                          <div className="text-xs text-[#684E67] whitespace-pre-line font-medium line-clamp-3">
                            {app.message}
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          {app.status === 'PENDING' ? (
                            <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase">
                              Pending Review
                            </span>
                          ) : (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                              Approved
                            </span>
                          )}
                        </td>
                        <td className="p-5 text-right">
                          {app.status === 'PENDING' ? (
                            <button
                              onClick={() => openApproveModal(app)}
                              className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-xs rounded-xl shadow-sm transition-all uppercase tracking-wider cursor-pointer"
                            >
                              Approve Partner
                            </button>
                          ) : (
                            <span className="text-xs font-black text-emerald-600 flex items-center justify-end space-x-1">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Approved</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A0826]/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[32px] border-2 border-[#FFCCE1] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#FFCCE1] flex items-center justify-between bg-[#FFF0F3]/30">
              <h3 className="font-black text-lg text-[#2A0826] flex items-center space-x-2">
                <Network className="w-5 h-5 text-[#FF2A6D]" />
                <span>{isEditMode ? 'Edit Referral Partner' : 'Add Referral Partner'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-[#FFCCE1] rounded-full text-[#684E67] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                  Partner Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all"
                  placeholder="e.g. Acme NGO"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all"
                  placeholder="partner@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                  Mobile Number (Optional)
                </label>
                <input
                  type="text"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all"
                  placeholder="+91..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider flex justify-between">
                    <span>Custom Referral Code</span>
                  </label>
                  <input
                    type="text"
                    value={form.partnerReferralCode}
                    onChange={(e) => setForm({ ...form, partnerReferralCode: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-black text-amber-700 outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all uppercase"
                    placeholder="e.g. SAKHI100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                    Commission Model
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all cursor-pointer"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT_AMOUNT">Flat Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                    {form.discountType === 'FLAT_AMOUNT' ? 'Commission / Flat Value (₹)' : 'Commission / Discount (%)'}
                  </label>
                  {form.discountType === 'FLAT_AMOUNT' && (
                    <span className="text-[11px] font-bold text-[#FF2A6D] bg-[#FFF0F3] px-2 py-0.5 rounded-full border border-[#FFCCE1]">
                      Max Plan Limit: ₹{activePlanPrice}
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step={form.discountType === 'FLAT_AMOUNT' ? '0.5' : '0.1'}
                  min="0.1"
                  max={form.discountType === 'FLAT_AMOUNT' ? activePlanPrice : 100}
                  value={form.discountPercentage}
                  onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
                  className={`w-full px-4 py-3 bg-[#FFF0F3]/30 border rounded-2xl text-sm font-bold outline-none transition-all ${
                    form.discountType === 'FLAT_AMOUNT' && Number(form.discountPercentage) > activePlanPrice
                      ? 'border-red-500 ring-2 ring-red-400/20 text-red-600'
                      : 'border-[#FFCCE1] focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 text-[#2A0826]'
                  }`}
                  placeholder={form.discountType === 'FLAT_AMOUNT' ? `e.g. 5 (Max ₹${activePlanPrice})` : 'e.g. 10 (Max 100%)'}
                />
                {form.discountType === 'FLAT_AMOUNT' && Number(form.discountPercentage) > activePlanPrice ? (
                  <p className="text-xs text-red-600 font-black animate-pulse flex items-center gap-1">
                    <span>⚠️ Cannot exceed active subscription plan price of ₹{activePlanPrice}!</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-gray-500 font-bold">
                    {form.discountType === 'FLAT_AMOUNT'
                      ? `₹${form.discountPercentage || 0} flat per ₹${activePlanPrice} yearly subscription (shown to partner as ${form.discountPercentage ? ((Number(form.discountPercentage) / activePlanPrice) * 100).toFixed(1) : 0}%)`
                      : `${form.discountPercentage || 0}% per ₹${activePlanPrice} plan (= ₹${form.discountPercentage ? ((activePlanPrice * Number(form.discountPercentage)) / 100).toFixed(2) : 0}/user)`}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer uppercase tracking-wider"
                >
                  {isEditMode ? 'Update Partner' : 'Create Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STATS MODAL */}
      {isStatsModalOpen && selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A0826]/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] border-2 border-[#FFCCE1] shadow-2xl flex flex-col">
            <div className="p-6 border-b border-[#FFCCE1] flex items-center justify-between bg-[#FFF0F3]/30 shrink-0">
              <div>
                <h3 className="font-black text-xl text-[#2A0826]">
                  {selectedPartner.name} - Network Stats
                </h3>
                <p className="text-xs font-bold text-[#FF2A6D]">
                  Referral Code: {selectedPartner.partnerReferralCode}
                </p>
              </div>
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="p-2 hover:bg-[#FFCCE1] rounded-full text-[#684E67] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-gray-50/50">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-center">
                  <p className="text-xs font-black text-[#684E67] uppercase tracking-wider">
                    Total Referrals
                  </p>
                  <p className="text-3xl font-black text-[#2A0826] mt-1">
                    {selectedPartner.referredUsers?.length || 0}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm text-center">
                  <p className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                    Active Subscribers
                  </p>
                  <p className="text-3xl font-black text-emerald-600 mt-1">
                    {selectedPartner.referredUsers?.filter((u) => u.subscriptionStatus === 'ACTIVE')
                      .length || 0}
                  </p>
                </div>
              </div>

              <h4 className="font-black text-sm text-[#2A0826] uppercase tracking-wider mb-3 pl-1">
                Referred Users Directory
              </h4>
              <div className="bg-white rounded-2xl border border-[#FFCCE1] shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FFF0F3]/50 border-b border-[#FFCCE1]">
                      <th className="p-4 text-[10px] font-black text-[#2A0826] uppercase tracking-widest">
                        User Name
                      </th>
                      <th className="p-4 text-[10px] font-black text-[#2A0826] uppercase tracking-widest">
                        Email
                      </th>
                      <th className="p-4 text-[10px] font-black text-[#2A0826] uppercase tracking-widest text-center">
                        Joined At
                      </th>
                      <th className="p-4 text-[10px] font-black text-[#2A0826] uppercase tracking-widest text-right">
                        Sub Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FFCCE1]/30">
                    {selectedPartner.referredUsers?.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-xs font-bold text-gray-500">
                          No users referred yet.
                        </td>
                      </tr>
                    ) : (
                      selectedPartner.referredUsers?.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="p-4 font-black text-sm text-[#2A0826]">{user.fullName}</td>
                          <td className="p-4 text-xs font-bold text-[#684E67]">{user.email}</td>
                          <td className="p-4 text-xs font-bold text-gray-500 text-center flex items-center justify-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                          </td>
                          <td className="p-4 text-right">
                            {user.subscriptionStatus === 'ACTIVE' ? (
                              <span className="bg-emerald-100 text-emerald-700 font-black px-2.5 py-1 rounded-lg text-[10px] uppercase">
                                Active
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-600 font-black px-2.5 py-1 rounded-lg text-[10px] uppercase">
                                {user.subscriptionStatus}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* APPROVE APPLICATION MODAL */}
      {isApproveModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A0826]/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[32px] border-2 border-emerald-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
              <h3 className="font-black text-lg text-[#2A0826] flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Approve Partner Application</span>
              </h3>
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="p-2 hover:bg-emerald-100 rounded-full text-[#684E67] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApproveSubmit} className="p-6 space-y-4">
              <div className="bg-[#FFF0F3]/60 p-4 rounded-2xl border border-[#FFCCE1] space-y-1 text-xs">
                <p className="font-black text-[#2A0826] text-sm">{selectedApp.fullName}</p>
                <p className="text-[#684E67] font-bold">Email: {selectedApp.email}</p>
                {selectedApp.phone && <p className="text-[#684E67] font-bold">Phone: {selectedApp.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                  Partner Referral Code
                </label>
                <input
                  type="text"
                  value={approvalForm.partnerReferralCode}
                  onChange={(e) =>
                    setApprovalForm({
                      ...approvalForm,
                      partnerReferralCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''),
                    })
                  }
                  placeholder="e.g. SAKHI10 (Leave blank to auto-generate)"
                  className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-black text-[#FF2A6D] uppercase outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all font-mono"
                />
                <p className="text-[10px] text-gray-500 font-bold">
                  Leave blank to auto-generate a random 6-character unique code.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                    Commission Model
                  </label>
                  <select
                    value={approvalForm.discountType}
                    onChange={(e) => setApprovalForm({ ...approvalForm, discountType: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all cursor-pointer"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT_AMOUNT">Flat Amount (₹)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                      {approvalForm.discountType === 'FLAT_AMOUNT' ? 'Flat Amount (₹)' : 'Percentage (%)'}
                    </label>
                    {approvalForm.discountType === 'FLAT_AMOUNT' && (
                      <span className="text-[10px] font-bold text-[#FF2A6D] bg-[#FFF0F3] px-2 py-0.5 rounded-full border border-[#FFCCE1]">
                        Max: ₹{activePlanPrice}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    step={approvalForm.discountType === 'FLAT_AMOUNT' ? '0.5' : '0.1'}
                    min="0.1"
                    max={approvalForm.discountType === 'FLAT_AMOUNT' ? activePlanPrice : 100}
                    value={approvalForm.discountPercentage}
                    onChange={(e) =>
                      setApprovalForm({ ...approvalForm, discountPercentage: e.target.value })
                    }
                    placeholder={approvalForm.discountType === 'FLAT_AMOUNT' ? `e.g. 5 (Max ₹${activePlanPrice})` : 'e.g. 10'}
                    className={`w-full px-4 py-3 bg-[#FFF0F3]/30 border rounded-2xl text-sm font-bold outline-none transition-all ${
                      approvalForm.discountType === 'FLAT_AMOUNT' && Number(approvalForm.discountPercentage) > activePlanPrice
                        ? 'border-red-500 ring-2 ring-red-400/20 text-red-600'
                        : 'border-[#FFCCE1] focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 text-[#2A0826]'
                    }`}
                  />
                </div>
              </div>
              {approvalForm.discountType === 'FLAT_AMOUNT' && Number(approvalForm.discountPercentage) > activePlanPrice ? (
                <p className="text-xs text-red-600 font-black animate-pulse flex items-center gap-1">
                  <span>⚠️ Cannot exceed active subscription plan price of ₹{activePlanPrice}!</span>
                </p>
              ) : (
                <p className="text-[10px] text-gray-500 font-bold">
                  {approvalForm.discountType === 'FLAT_AMOUNT'
                    ? `₹${approvalForm.discountPercentage || 0} flat per ₹${activePlanPrice} yearly subscription (shown to partner as ${approvalForm.discountPercentage ? ((Number(approvalForm.discountPercentage) / activePlanPrice) * 100).toFixed(1) : 0}%)`
                    : `${approvalForm.discountPercentage || 0}% per ₹${activePlanPrice} plan (= ₹${approvalForm.discountPercentage ? ((activePlanPrice * Number(approvalForm.discountPercentage)) / 100).toFixed(2) : 0}/user)`}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isApproving}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider disabled:opacity-60"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isApproving ? 'APPROVING & SENDING EMAIL...' : 'APPROVE & ALLOCATE CODE'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
