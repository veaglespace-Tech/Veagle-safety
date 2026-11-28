'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '../../../components/layout/AppLayout.js';
import { AdminHeaderNav } from '../../../components/admin/AdminHeaderNav.js';
import { volunteerApi } from '../../../redux/api/volunteerApi.js';
import {
  HandHeart,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  Award,
  Calendar,
  Trash2,
  PowerOff,
  Power,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  User,
  Heart,
} from 'lucide-react';

export default function AdminVolunteersPage() {
  const [mounted, setMounted] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    inactive: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Active Tab: 'PENDING' | 'APPROVED' | 'ALL'
  const [activeTab, setActiveTab] = useState('PENDING');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');

  // Modals
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Reject modal
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingVolunteer, setRejectingVolunteer] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // Action loading states
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchVolunteers = async () => {
    try {
      setIsLoading(true);
      const res = await volunteerApi.getAllVolunteers({
        status: activeTab === 'ALL' ? undefined : activeTab,
        search: searchTerm || undefined,
      });

      if (res.success) {
        setVolunteers(res.volunteers || []);
        if (res.counts) setCounts(res.counts);
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to fetch volunteers.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchVolunteers();
    }
  }, [mounted, activeTab]);

  // Handle Search on Enter or debounce
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchVolunteers();
  };

  // Approve Volunteer
  const handleApprove = async (volunteer) => {
    if (!confirm(`Approve ${volunteer.fullName} as an official Sakhi Suraksha Volunteer?`)) return;

    try {
      setActionLoadingId(volunteer.id);
      const res = await volunteerApi.approveVolunteer(volunteer.id);
      if (res.success) {
        showToast('success', res.message || `${volunteer.fullName} approved successfully!`);
        fetchVolunteers();
        if (selectedVolunteer && selectedVolunteer.id === volunteer.id) {
          setSelectedVolunteer(res.volunteer);
        }
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to approve volunteer.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Reject Modal
  const openRejectModal = (volunteer) => {
    setRejectingVolunteer(volunteer);
    setRejectionReason('Application criteria requirements were not met.');
    setIsRejectModalOpen(true);
  };

  // Submit Rejection
  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingVolunteer) return;

    try {
      setIsRejecting(true);
      const res = await volunteerApi.rejectVolunteer(rejectingVolunteer.id, {
        reason: rejectionReason,
      });
      if (res.success) {
        showToast('success', `Application for ${rejectingVolunteer.fullName} rejected.`);
        setIsRejectModalOpen(false);
        setRejectingVolunteer(null);
        fetchVolunteers();
        if (selectedVolunteer && selectedVolunteer.id === rejectingVolunteer.id) {
          setIsDetailsModalOpen(false);
        }
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to reject volunteer.');
    } finally {
      setIsRejecting(false);
    }
  };

  // Toggle Active/Inactive status
  const handleToggleStatus = async (volunteer) => {
    const newStatus = volunteer.status === 'APPROVED' ? 'INACTIVE' : 'APPROVED';
    const actionText = newStatus === 'APPROVED' ? 'activate' : 'deactivate / pause';

    if (!confirm(`Are you sure you want to ${actionText} ${volunteer.fullName}?`)) return;

    try {
      setActionLoadingId(volunteer.id);
      const res = await volunteerApi.updateVolunteer(volunteer.id, { status: newStatus });
      if (res.success) {
        showToast('success', `Volunteer status updated to ${newStatus}.`);
        fetchVolunteers();
        if (selectedVolunteer && selectedVolunteer.id === volunteer.id) {
          setSelectedVolunteer(res.volunteer);
        }
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to update status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Volunteer
  const handleDeleteVolunteer = async (volunteer) => {
    if (!confirm(`Permanently delete volunteer record for ${volunteer.fullName}? This cannot be undone.`)) return;

    try {
      setActionLoadingId(volunteer.id);
      const res = await volunteerApi.deleteVolunteer(volunteer.id);
      if (res.success) {
        showToast('success', 'Volunteer record deleted successfully.');
        setIsDetailsModalOpen(false);
        fetchVolunteers();
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to delete volunteer.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // View Details Modal
  const openDetailsModal = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsDetailsModalOpen(true);
  };

  if (!mounted) return null;

  // Filter list by state if selected
  const displayVolunteers = stateFilter === 'ALL'
    ? volunteers
    : volunteers.filter((v) => (v.state || '').toLowerCase() === stateFilter.toLowerCase());

  // Distinct states for filter dropdown
  const uniqueStates = Array.from(new Set(volunteers.map((v) => v.state).filter(Boolean)));

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 font-sans animate-fade-in">
        <AdminHeaderNav toast={toast} onRefresh={fetchVolunteers} />

        {/* HEADER SECTION */}
        <div className="bg-white p-6 sm:p-8 rounded-[36px] border-2 border-[#FFCCE1] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF2A6D] to-[#FF5E8E] text-white flex items-center justify-center shadow-lg shadow-pink-500/20 shrink-0">
              <HandHeart className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-2xl text-[#2A0826]">Volunteer Force (स्वयंसेवक दल)</h2>
              </div>
              <p className="text-xs font-bold text-[#684E67]">
                Review applications, approve official volunteer badges, and coordinate community emergency guardians.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <Link
              href="/join-volunteer"
              target="_blank"
              className="px-4 py-3 bg-[#FFF0F3] hover:bg-pink-100 text-[#FF2A6D] font-bold text-xs rounded-2xl border border-[#FFCCE1] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Registration Form</span>
            </Link>

            <button
              onClick={fetchVolunteers}
              disabled={isLoading}
              className="p-3 bg-white text-[#684E67] hover:text-[#FF2A6D] rounded-2xl border border-[#FFCCE1] shadow-xs transition-colors cursor-pointer"
              title="Refresh Volunteers"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4 CORE KPI METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-6 border-2 border-[#FFCCE1] shadow-xs space-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#FF2A6D] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFF0F3] text-[#FF2A6D]">
                Total Enrolled
              </span>
            </div>
            <div className="text-3xl font-black text-[#2A0826] tracking-tight">{counts.total}</div>
            <div className="text-xs font-bold text-[#684E67]">Total Volunteer Applications</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                Needs Review
              </span>
            </div>
            <div className="text-3xl font-black text-amber-700 tracking-tight">{counts.pending}</div>
            <div className="text-xs font-bold text-[#684E67]">Pending Approvals</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Active
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-600 tracking-tight">{counts.approved}</div>
            <div className="text-xs font-bold text-[#684E67]">Approved Community Guardians</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Coverage
              </span>
            </div>
            <div className="text-3xl font-black text-purple-700 tracking-tight">{uniqueStates.length || 1}</div>
            <div className="text-xs font-bold text-[#684E67]">States Represented</div>
          </div>
        </div>

        {/* TABS & SEARCH CONTROLS */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#FFCCE1] shadow-xs overflow-x-auto">
              <button
                onClick={() => setActiveTab('PENDING')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'PENDING'
                    ? 'bg-gradient-to-r from-[#FF2A6D] to-[#FF5E8E] text-white shadow-xs'
                    : 'text-[#684E67] hover:text-[#2A0826]'
                }`}
              >
                <span>Pending Applications</span>
                {counts.pending > 0 && (
                  <span className="bg-white text-[#FF2A6D] text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {counts.pending}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('APPROVED')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'APPROVED'
                    ? 'bg-gradient-to-r from-[#FF2A6D] to-[#FF5E8E] text-white shadow-xs'
                    : 'text-[#684E67] hover:text-[#2A0826]'
                }`}
              >
                <span>Approved Guardians</span>
                <span className="bg-pink-100 text-[#FF2A6D] text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {counts.approved}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'ALL'
                    ? 'bg-gradient-to-r from-[#FF2A6D] to-[#FF5E8E] text-white shadow-xs'
                    : 'text-[#684E67] hover:text-[#2A0826]'
                }`}
              >
                <span>All Enrolments ({counts.total})</span>
              </button>
            </div>

            {/* Search Input & State Filter */}
            <div className="flex items-center gap-2 flex-1 sm:max-w-md justify-end">
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, city, badge ID..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#FFCCE1] rounded-2xl text-xs font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] shadow-xs"
                />
              </form>

              {uniqueStates.length > 1 && (
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="px-3 py-2.5 bg-white border border-[#FFCCE1] rounded-2xl text-xs font-bold text-[#2A0826] outline-none cursor-pointer shadow-xs"
                >
                  <option value="ALL">All States</option>
                  {uniqueStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* VOLUNTEERS DIRECTORY TABLE */}
          <div className="bg-white rounded-[36px] border-2 border-[#FFCCE1] shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-[#FFF0F3]/60 border-b-2 border-[#FFCCE1]">
                    <th className="p-4 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                      Volunteer Details
                    </th>
                    <th className="p-4 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                      Contact &amp; Verification
                    </th>
                    <th className="p-4 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                      Location / Region
                    </th>
                    <th className="p-4 text-[11px] font-black text-[#2A0826] uppercase tracking-widest">
                      Occupation &amp; Skills
                    </th>
                    <th className="p-4 text-[11px] font-black text-[#2A0826] uppercase tracking-widest text-center">
                      Status / Badge ID
                    </th>
                    <th className="p-4 text-[11px] font-black text-[#2A0826] uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFCCE1]/50 text-xs font-bold text-[#684E67]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-sm font-black text-[#2A0826]">
                        <div className="w-8 h-8 border-3 border-[#FF2A6D] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Loading Volunteers Directory...
                      </td>
                    </tr>
                  ) : displayVolunteers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-sm font-bold text-[#684E67]">
                        <HandHeart className="w-10 h-10 text-[#FF2A6D] mx-auto mb-2 opacity-30" />
                        No volunteers found in this category.
                      </td>
                    </tr>
                  ) : (
                    displayVolunteers.map((vol) => (
                      <tr key={vol.id} className="hover:bg-[#FFF0F3]/30 transition-colors">
                        {/* Name & Avatar */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5C8A] to-[#FF2A6D] text-white font-black flex items-center justify-center text-sm shrink-0 shadow-xs">
                              {vol.fullName ? vol.fullName.charAt(0).toUpperCase() : 'V'}
                            </div>
                            <div>
                              <div className="font-black text-sm text-[#2A0826]">{vol.fullName}</div>
                              <div className="text-[10px] text-gray-500 font-bold">
                                {vol.gender || 'Volunteer'} {vol.dateOfBirth ? `• ${vol.dateOfBirth}` : ''}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="p-4 space-y-1">
                          <div className="flex items-center gap-1.5 text-[#2A0826]">
                            <Mail className="w-3.5 h-3.5 text-[#FF2A6D]" />
                            <span>{vol.email}</span>
                            {vol.isEmailVerified && (
                              <span title="Email Verified with OTP" className="text-emerald-600 font-bold text-[10px]">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Phone className="w-3.5 h-3.5 text-[#FF2A6D]" />
                            <span>{vol.phone}</span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="p-4 space-y-0.5">
                          <div className="font-black text-[#2A0826] flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#FF2A6D]" />
                            <span>{vol.city}, {vol.state}</span>
                          </div>
                          <div className="text-[10px] text-gray-500 font-mono">PIN: {vol.pincode}</div>
                        </td>

                        {/* Occupation & Skills */}
                        <td className="p-4 space-y-1">
                          <div className="font-black text-[#2A0826]">{vol.occupation || 'Volunteer'}</div>
                          <div className="text-[10px] text-gray-500 truncate max-w-[200px]" title={vol.skills}>
                            {vol.skills || 'General Safety Assistance'}
                          </div>
                        </td>

                        {/* Status / Badge ID */}
                        <td className="p-4 text-center space-y-1">
                          {vol.status === 'APPROVED' ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Approved</span>
                              </span>
                              {vol.volunteerIdCode && (
                                <div className="text-[11px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 font-mono uppercase">
                                  {vol.volunteerIdCode}
                                </div>
                              )}
                            </div>
                          ) : vol.status === 'PENDING' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                              <span>Pending Review</span>
                            </span>
                          ) : vol.status === 'REJECTED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                              <span>Rejected</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gray-100 text-gray-600">
                              <span>Inactive</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Inspect Details Button */}
                            <button
                              onClick={() => openDetailsModal(vol)}
                              className="p-2 bg-[#FFF0F3] text-[#FF2A6D] hover:bg-[#FF2A6D] hover:text-white rounded-xl transition-all shadow-xs cursor-pointer"
                              title="View Full Volunteer Application Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Approve Button (for Pending/Rejected/Inactive) */}
                            {vol.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleApprove(vol)}
                                disabled={actionLoadingId === vol.id}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                title="Approve Volunteer and Generate Badge"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Approve</span>
                              </button>
                            )}

                            {/* Reject Button (for Pending) */}
                            {vol.status === 'PENDING' && (
                              <button
                                onClick={() => openRejectModal(vol)}
                                className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all shadow-xs cursor-pointer"
                                title="Reject Application"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}

                            {/* Toggle Active/Inactive (for Approved) */}
                            {vol.status === 'APPROVED' && (
                              <button
                                onClick={() => handleToggleStatus(vol)}
                                disabled={actionLoadingId === vol.id}
                                className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-xl transition-all shadow-xs cursor-pointer"
                                title="Deactivate Volunteer"
                              >
                                <PowerOff className="w-4 h-4" />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteVolunteer(vol)}
                              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                              title="Delete Volunteer Record"
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
        </div>

        {/* DETAILS MODAL */}
        {isDetailsModalOpen && selectedVolunteer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A0826]/80 backdrop-blur-sm animate-fade-in font-sans">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[36px] border-2 border-[#FFCCE1] shadow-2xl flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-[#FFCCE1] flex items-center justify-between bg-[#FFF0F3]/40 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF2A6D] to-[#FF5E8E] text-white font-black flex items-center justify-center text-lg shadow-xs">
                    {selectedVolunteer.fullName ? selectedVolunteer.fullName.charAt(0).toUpperCase() : 'V'}
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-[#2A0826]">{selectedVolunteer.fullName}</h3>
                    <p className="text-xs font-bold text-[#FF2A6D]">
                      Enrolled Volunteer Application #{selectedVolunteer.id}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="p-2 hover:bg-[#FFCCE1] rounded-full text-[#684E67] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Status Banner */}
                <div className="p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-2 bg-[#FFF0F3]/60 border-[#FFCCE1]">
                  <div>
                    <div className="text-xs font-black uppercase text-[#684E67]">Application Status</div>
                    <div className="text-sm font-black text-[#2A0826] flex items-center gap-1.5 mt-0.5">
                      <span>{selectedVolunteer.status}</span>
                      {selectedVolunteer.volunteerIdCode && (
                        <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300 font-mono text-xs">
                          Badge ID: {selectedVolunteer.volunteerIdCode}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-xs font-bold text-[#684E67]">
                    <div>Applied: {new Date(selectedVolunteer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    {selectedVolunteer.approvedAt && (
                      <div className="text-emerald-700">Approved: {new Date(selectedVolunteer.approvedAt).toLocaleDateString('en-IN')}</div>
                    )}
                  </div>
                </div>

                {/* 1. Contact Info */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#2A0826] border-b pb-1">
                    Contact &amp; Verification
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-400 block font-bold">Email Address</span>
                      <span className="font-black text-[#2A0826] flex items-center gap-1 mt-0.5">
                        {selectedVolunteer.email}
                        {selectedVolunteer.isEmailVerified && (
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Verified ✓
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-400 block font-bold">Mobile Phone</span>
                      <span className="font-black text-[#2A0826] block mt-0.5">{selectedVolunteer.phone}</span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-400 block font-bold">Gender &amp; DOB</span>
                      <span className="font-bold text-[#2A0826] block mt-0.5">
                        {selectedVolunteer.gender || 'Not specified'} {selectedVolunteer.dateOfBirth ? `(DOB: ${selectedVolunteer.dateOfBirth})` : ''}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-400 block font-bold">Occupation / Profession</span>
                      <span className="font-bold text-[#2A0826] block mt-0.5">
                        {selectedVolunteer.occupation || 'Volunteer'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Full Residential Address */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#2A0826] border-b pb-1">
                    Full Residential Address
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-2xl text-xs space-y-1">
                    <p className="font-black text-[#2A0826]">{selectedVolunteer.address}</p>
                    <p className="text-[#684E67] font-bold">
                      {selectedVolunteer.city}, {selectedVolunteer.state} - {selectedVolunteer.pincode}, {selectedVolunteer.country || 'India'}
                    </p>
                  </div>
                </div>

                {/* 3. Skills & Availability */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#2A0826] border-b pb-1">
                    Skills &amp; Deployment Availability
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-400 block font-bold mb-1">Skills &amp; Contributions:</span>
                      <span className="font-bold text-[#2A0826]">{selectedVolunteer.skills || 'General Emergency Support'}</span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-400 block font-bold mb-1">Availability:</span>
                      <span className="font-bold text-[#2A0826]">{selectedVolunteer.availability || 'Flexible Hours'}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Emergency Contact */}
                {(selectedVolunteer.emergencyContactName || selectedVolunteer.emergencyContactPhone) && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#2A0826] border-b pb-1">
                      Emergency Family Contact
                    </h4>
                    <div className="p-3 bg-gray-50 rounded-xl text-xs flex items-center justify-between">
                      <span className="font-bold text-[#2A0826]">{selectedVolunteer.emergencyContactName || 'Family Guardian'}</span>
                      <span className="font-black text-[#FF2A6D]">{selectedVolunteer.emergencyContactPhone || '—'}</span>
                    </div>
                  </div>
                )}

                {/* 5. Motivation Note */}
                {selectedVolunteer.motivation && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#2A0826] border-b pb-1">
                      Volunteer Motivation
                    </h4>
                    <p className="p-4 bg-[#FFF0F3]/40 rounded-2xl border border-[#FFCCE1] text-xs font-bold text-[#2A0826] italic">
                      &quot;{selectedVolunteer.motivation}&quot;
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-5 border-t border-[#FFCCE1] bg-gray-50 flex items-center justify-between shrink-0">
                <button
                  onClick={() => handleDeleteVolunteer(selectedVolunteer)}
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>

                <div className="flex items-center gap-2">
                  {selectedVolunteer.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => openRejectModal(selectedVolunteer)}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer"
                      >
                        Reject Application
                      </button>
                      <button
                        onClick={() => handleApprove(selectedVolunteer)}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve &amp; Assign Badge</span>
                      </button>
                    </>
                  )}

                  {selectedVolunteer.status === 'APPROVED' && (
                    <button
                      onClick={() => handleToggleStatus(selectedVolunteer)}
                      className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-colors cursor-pointer"
                    >
                      Deactivate Volunteer
                    </button>
                  )}

                  {selectedVolunteer.status === 'INACTIVE' && (
                    <button
                      onClick={() => handleToggleStatus(selectedVolunteer)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Re-activate Volunteer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REJECT MODAL */}
        {isRejectModalOpen && rejectingVolunteer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A0826]/80 backdrop-blur-sm animate-fade-in font-sans">
            <div className="bg-white w-full max-w-md rounded-[32px] border-2 border-[#FFCCE1] shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-[#FFCCE1] flex items-center justify-between bg-rose-50/50">
                <h3 className="font-black text-base text-rose-800 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Reject Volunteer Application</span>
                </h3>
                <button
                  onClick={() => setIsRejectModalOpen(false)}
                  className="p-1.5 hover:bg-rose-100 rounded-full text-gray-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRejectSubmit} className="p-6 space-y-4">
                <p className="text-xs font-bold text-[#684E67]">
                  You are rejecting the application of <strong>{rejectingVolunteer.fullName}</strong>. Please provide a reason to send in the notification email:
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                    Rejection Reason
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-[#2A0826] outline-none focus:border-rose-500 resize-none"
                    placeholder="Explain why the application was rejected..."
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isRejecting}
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider disabled:opacity-50"
                  >
                    {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRejectModalOpen(false)}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
