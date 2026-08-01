'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { AppLayout } from '../../components/layout/AppLayout.js';
import { api } from '../../utils/api.js';
import {
  Shield,
  ShieldCheck,
  Users,
  CreditCard,
  Sliders,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Crown,
  Edit3,
  Lock,
  Unlock,
  Plus,
  RefreshCw,
  Eye,
  FileText,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Send,
  Calendar,
  Sparkles,
  Zap,
  MapPin,
  PhoneCall,
  Mail,
  UserCheck,
  UserX,
  Printer,
  X,
  TrendingUp,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

function SuperAdminHQContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'plans', 'payments', 'enquiries'
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // CONTACT ENQUIRIES DATA
  const [enquiries, setEnquiries] = useState([]);
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('ALL');

  const searchTab = searchParams.get('tab');

  useEffect(() => {
    if (searchTab && ['overview', 'users', 'plans', 'payments', 'enquiries'].includes(searchTab)) {
      setActiveTab(searchTab);
    } else if (!searchTab) {
      setActiveTab('overview');
    }
  }, [searchTab]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    router.push(`/admin?tab=${newTab}`, { scroll: false });
  };

  // OVERVIEW DATA
  const [overview, setOverview] = useState(null);

  // USERS DATA & FILTERS
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userSubFilter, setUserSubFilter] = useState('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState('ALL');
  const [userPage, setUserPage] = useState(1);
  const usersPerPage = 8;

  // MODAL STATES FOR USERS
  const [editingUser, setEditingUser] = useState(null);
  const [grantingUser, setGrantingUser] = useState(null);
  const [freePlanDuration, setFreePlanDuration] = useState('365');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customExpiryDate, setCustomExpiryDate] = useState('');

  // USER EDIT FORM STATE
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('USER');
  const [editBloodGroup, setEditBloodGroup] = useState('O+');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editPincode, setEditPincode] = useState('');
  const [editEmergencyName, setEditEmergencyName] = useState('');
  const [editEmergencyPhone, setEditEmergencyPhone] = useState('');
  const [editMedicalNotes, setEditMedicalNotes] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [isSubmittingUserEdit, setIsSubmittingUserEdit] = useState(false);

  // PLANS & GST DATA
  const [plans, setPlans] = useState([]);
  const [gstPercentage, setGstPercentage] = useState(18);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planForm, setPlanForm] = useState({
    id: null,
    name: '',
    description: '',
    basePrice: '',
    gstPercentage: 18,
    durationDays: 365,
    isActive: true,
  });

  // PAYMENTS DATA & FILTERS
  const [payments, setPayments] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [paymentPage, setPaymentPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const paymentsPerPage = 8;

  useEffect(() => {
    setMounted(true);
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchOverview(),
        fetchUsersData(),
        fetchPlansData(),
        fetchGstData(),
        fetchPaymentsData(),
        fetchEnquiriesData(),
      ]);
    } catch (err) {
      showToast('error', 'Failed to load SuperAdmin dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // API FETCHERS
  const fetchOverview = async () => {
    const res = await api.get('/admin/overview');
    setOverview(res.data);
  };

  const fetchUsersData = async () => {
    const res = await api.get('/admin/users');
    setUsers(res.data.users || []);
  };

  const fetchPlansData = async () => {
    const res = await api.get('/admin/plans');
    setPlans(res.data.plans || []);
  };

  const fetchGstData = async () => {
    const res = await api.get('/admin/gst');
    setGstPercentage(res.data.gstPercentage || 18);
  };

  const fetchPaymentsData = async () => {
    const res = await api.get('/admin/payments');
    setPayments(res.data.payments || []);
    setPaymentSummary(res.data.summary || null);
  };

  const fetchEnquiriesData = async () => {
    try {
      const res = await api.get('/admin/enquiries');
      setEnquiries(res.data.enquiries || []);
    } catch (err) {
      console.warn('[Enquiries Notice]:', err.message);
    }
  };

  const handleResolveEnquiry = async (id) => {
    try {
      const res = await api.post(`/admin/enquiries/${id}/resolve`);
      showToast('success', res.data.message || `Contact Enquiry #${id} marked as RESOLVED`);
      fetchEnquiriesData();
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to resolve contact enquiry.');
    }
  };

  // HANDLERS FOR USER MANAGEMENT
  const openEditUserModal = (u) => {
    setEditingUser(u);
    setEditFullName(u.fullName || '');
    setEditEmail(u.email || '');
    setEditPhone(u.phone || '');
    setEditRole(u.role || 'USER');
    setEditBloodGroup(u.bloodGroup || 'O+');
    setEditAddress(u.address || '');
    setEditCity(u.city || '');
    setEditState(u.state || '');
    setEditPincode(u.pincode || '');
    setEditEmergencyName(u.emergencyContactName || '');
    setEditEmergencyPhone(u.emergencyContactPhone || '');
    setEditMedicalNotes(u.medicalNotes || '');
    setEditPassword('');
  };

  const handleSaveUserEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSubmittingUserEdit(true);

    try {
      const payload = {
        fullName: editFullName.trim(),
        email: editEmail.trim(),
        phone: editPhone.replace(/\D/g, ''),
        role: editRole,
        bloodGroup: editBloodGroup,
        address: editAddress.trim(),
        city: editCity.trim(),
        state: editState.trim(),
        pincode: editPincode.trim(),
        emergencyContactName: editEmergencyName.trim(),
        emergencyContactPhone: editEmergencyPhone.replace(/\D/g, ''),
        medicalNotes: editMedicalNotes.trim(),
        ...(editPassword && { password: editPassword }),
      };

      const res = await api.put(`/admin/users/${editingUser.id}`, payload);
      showToast('success', res.data.message || 'User details updated successfully!');
      setEditingUser(null);
      fetchUsersData();
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to update user details');
    } finally {
      setIsSubmittingUserEdit(false);
    }
  };

  const handleToggleBlockUser = async (userObj) => {
    const isCurrentlyBlocked = userObj.safetyStatus === 'BLOCKED';
    const actionLabel = isCurrentlyBlocked ? 'UNBLOCK' : 'BLOCK';
    if (!confirm(`Are you sure you want to ${actionLabel} user "${userObj.fullName}"?`)) return;

    try {
      const res = await api.post(`/admin/users/${userObj.id}/block`);
      showToast('success', res.data.message);
      fetchUsersData();
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to toggle user block status');
    }
  };

  const handleGrantFreeSubscription = async () => {
    if (!grantingUser) return;
    try {
      const payload = {
        durationDays: parseInt(freePlanDuration, 10),
        planName: freePlanDuration === '365' ? 'Free 1-Year Sakhi Protection' : `Free ${freePlanDuration}-Day Pass`,
        ...(customStartDate && { customStartDate }),
        ...(customExpiryDate && { customExpiryDate }),
      };

      const res = await api.post(`/admin/users/${grantingUser.id}/grant-subscription`, payload);
      showToast('success', res.data.message);
      setGrantingUser(null);
      fetchUsersData();
      fetchOverview();
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to grant free subscription');
    }
  };

  // HANDLERS FOR GST MODULE & PLAN MANAGEMENT
  const handleUpdateGlobalGst = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/admin/gst', { gstPercentage: parseFloat(gstPercentage) });
      showToast('success', res.data.message);
      fetchGstData();
      fetchPlansData();
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to update global GST');
    }
  };

  const handleTogglePlanActive = async (planId) => {
    try {
      const res = await api.post(`/admin/plans/${planId}/toggle`);
      showToast('success', res.data.message);
      fetchPlansData();
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to toggle plan status');
    }
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/plans', planForm);
      showToast('success', res.data.message);
      setIsPlanModalOpen(false);
      fetchPlansData();
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to save plan');
    }
  };

  const handleResolveSos = async (sosId) => {
    if (!confirm('Resolve emergency SOS broadcast on behalf of dispatch center?')) return;
    try {
      const res = await api.post('/admin/sos/resolve', { sosSessionId: sosId });
      showToast('success', res.data.message);
      fetchOverview();
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to resolve SOS');
    }
  };

  // FILTER & PAGINATION COMPUTATIONS FOR USERS
  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (u.fullName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').includes(q) ||
      (u.city || '').toLowerCase().includes(q);

    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    const matchesSub = userSubFilter === 'ALL' || u.subscriptionStatus === userSubFilter;
    const matchesStatus =
      userStatusFilter === 'ALL' ||
      (userStatusFilter === 'BLOCKED' ? u.safetyStatus === 'BLOCKED' : u.safetyStatus !== 'BLOCKED');

    return matchesSearch && matchesRole && matchesSub && matchesStatus;
  });

  const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((userPage - 1) * usersPerPage, userPage * usersPerPage);

  // FILTER & PAGINATION COMPUTATIONS FOR PAYMENTS
  const filteredPayments = payments.filter((p) => {
    const q = paymentSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (p.txnid || '').toLowerCase().includes(q) ||
      (p.user?.fullName || '').toLowerCase().includes(q) ||
      (p.user?.email || '').toLowerCase().includes(q);

    const matchesStatus = paymentStatusFilter === 'ALL' || p.status === paymentStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPaymentPages = Math.ceil(filteredPayments.length / paymentsPerPage) || 1;
  const paginatedPayments = filteredPayments.slice((paymentPage - 1) * paymentsPerPage, paymentPage * paymentsPerPage);

  if (!mounted) return null;

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#FFF0F3] text-[#2A0826] font-sans relative overflow-hidden pb-16">
        
        {/* AMBIENT BACKGROUND GLOWS */}
        <div className="absolute w-[800px] h-[800px] rounded-full bg-gold/15 blur-[170px] top-[-100px] left-[-200px] pointer-events-none" />
        <div className="absolute w-[800px] h-[800px] rounded-full bg-[#FF2A6D]/15 blur-[170px] bottom-[100px] right-[-200px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative z-10 animate-fade-up">

          {/* SUPERADMIN HQ HEADER BANNER */}
          <div className="bg-gradient-to-r from-[#2A0826] via-[#3D0C38] to-[#2A0826] text-white p-8 sm:p-10 rounded-[36px] border border-gold/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FFD700] via-[#E6A100] to-[#FFD166] text-[#2A0826] flex items-center justify-center shadow-md shrink-0 border-2 border-white">
                <Crown className="w-9 h-9 text-[#2A0826] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="font-black text-2xl sm:text-3xl text-white tracking-tight">
                    SuperAdmin Command HQ
                  </h1>
                  <span className="bg-gold text-[#2A0826] font-black text-[10px] px-3.5 py-1 rounded-full uppercase tracking-widest shadow-xs">
                    SUPERUSER
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gold/90 font-semibold mt-1">
                  Full control over Users, Subscription Plans, Global GST Settings, and Payment Receipts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={loadAllAdminData}
                disabled={isLoading}
                className="bg-white/10 hover:bg-white/20 text-white font-black text-xs px-5 py-3.5 rounded-2xl border border-white/20 shadow-xs flex items-center space-x-2.5 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 text-gold ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'SYNCING...' : 'REFRESH METRICS'}</span>
              </button>
            </div>
          </div>

          {/* FEEDBACK TOAST NOTIFICATION */}
          {toast && (
            <div className={`p-4 rounded-2xl text-xs font-black shadow-md animate-shake ${
              toast.type === 'error'
                ? 'bg-rose-50 text-[#FF2A6D] border border-[#FF2A6D]/60'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
            }`}>
              {toast.text}
            </div>
          )}

          {/* MASTER TAB NAVIGATION BAR */}
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-2xl p-3 rounded-[32px] border border-[#FFCCE1]/70 shadow-sm overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Emergency Command', icon: AlertOctagon, badge: overview?.metrics?.activeSosCount || 0 },
              { id: 'users', label: 'User Management', icon: Users, badge: users.length },
              { id: 'plans', label: 'Plans & Dynamic GST', icon: Sliders, badge: plans.length },
              { id: 'payments', label: 'Payment Receipts', icon: CreditCard, badge: payments.length },
              { id: 'enquiries', label: 'Contact Support', icon: HelpCircle, badge: (Array.isArray(enquiries) ? enquiries : []).filter(e => e.status === 'PENDING').length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 min-w-[190px] px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white shadow-md shadow-[#FF2A6D]/20 scale-[1.01]'
                      : 'text-[#684E67] hover:bg-[#FFF0F3]/80 hover:text-[#FF2A6D]'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-[#FF2A6D]'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-[#FF2A6D]' : 'bg-[#FFF0F3] text-[#2A0826] border border-[#FFCCE1]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW & ACTIVE SOS INCIDENT COMMAND */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-up">
              
              {/* TOP KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#684E67] uppercase">Active SOS Alerts</span>
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#FF2A6D] flex items-center justify-center border border-rose-200">
                      <AlertOctagon className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-[#2A0826]">{overview?.metrics?.activeSosCount || 0}</p>
                  <p className="text-[11px] font-bold text-[#684E67]">Emergency broadcasts live</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#684E67] uppercase">Total Members</span>
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-[#2A0826]">{overview?.metrics?.totalUsers || users.length}</p>
                  <p className="text-[11px] font-bold text-[#684E67]">Registered Sakhi accounts</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#684E67] uppercase">Active Paid Plans</span>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-[#2A0826]">{overview?.metrics?.activeSubscriptions || 0}</p>
                  <p className="text-[11px] font-bold text-[#684E67]">Active paid protection</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#684E67] uppercase">Total Revenue</span>
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-[#2A0826]">₹{overview?.metrics?.totalRevenue?.toFixed(2) || '0.00'}</p>
                  <p className="text-[11px] font-bold text-[#684E67]">Incl. {gstPercentage}% Global GST</p>
                </div>
              </div>

              {/* LIVE ACTIVE EMERGENCY SOS BROADCASTS TABLE */}
              <div className="bg-white border-2 border-[#FFCCE1] rounded-[32px] p-6 sm:p-8 shadow-md space-y-6">
                <div className="flex items-center justify-between border-b-2 border-[#FFCCE1] pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#FF2A6D] flex items-center justify-center border border-rose-200">
                      <AlertOctagon className="w-5 h-5 text-[#FF2A6D] animate-bounce" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-[#2A0826]">Live Active SOS Emergency Broadcasts</h3>
                      <p className="text-xs text-[#684E67] font-bold">Real-time incident dispatch stream with 1-click resolution</p>
                    </div>
                  </div>
                </div>

                {overview?.activeSos && overview.activeSos.length > 0 ? (
                  <div className="space-y-4">
                    {overview.activeSos.map((sos) => (
                      <div key={sos.id} className="bg-gradient-to-r from-rose-50 via-white to-rose-50 p-5 rounded-2xl border-2 border-[#FF2A6D] flex flex-col sm:flex-row items-center justify-between gap-4 shadow">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#FF2A6D] text-white flex items-center justify-center font-black text-lg shadow shrink-0">
                            SOS
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-black text-base text-[#2A0826]">{sos.user?.fullName}</h4>
                              <span className="bg-[#FF2A6D] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                                BROADCASTING
                              </span>
                            </div>
                            <p className="text-xs font-bold text-[#684E67] mt-0.5">
                              Email: {sos.user?.email} • Phone: {sos.user?.phone}
                            </p>
                            <p className="text-[11px] font-extrabold text-[#FF2A6D] mt-0.5">
                              Started: {new Date(sos.startedAt).toLocaleTimeString()} ({new Date(sos.startedAt).toLocaleDateString('en-IN')})
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleResolveSos(sos.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-3 rounded-xl shadow transition-all cursor-pointer uppercase tracking-wider shrink-0"
                        >
                          RESOLVE SOS INCIDENT
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-[#FFF0F3] rounded-2xl border-2 border-[#FFCCE1] space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <p className="font-black text-base text-[#2A0826]">All Clear! No Active SOS Incidents</p>
                    <p className="text-xs text-[#684E67] font-bold">24/7 Monitoring active across all registered member accounts</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT PORTAL */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-up">
              
              {/* SEARCH, FILTER & ACTION CONTROL BAR */}
              <div className="bg-white border-2 border-[#FFCCE1] p-6 rounded-[32px] shadow-md space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  
                  {/* LIVE SEARCH INPUT */}
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-[#684E67] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search users by Name, Email, Mobile Phone, City..."
                      value={userSearch}
                      onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                      className="w-full pl-11 pr-4 py-3 bg-[#FFF0F3] border-2 border-[#FFCCE1] focus:border-[#FF2A6D] rounded-2xl text-xs font-bold text-[#2A0826] outline-none transition-all"
                    />
                  </div>

                  {/* FILTER SELECTS */}
                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                    <select
                      value={userRoleFilter}
                      onChange={(e) => { setUserRoleFilter(e.target.value); setUserPage(1); }}
                      className="px-3.5 py-3 bg-[#FFF0F3] border-2 border-[#FFCCE1] rounded-2xl text-xs font-black text-[#2A0826] outline-none cursor-pointer"
                    >
                      <option value="ALL">All Roles</option>
                      <option value="USER">Member Users</option>
                      <option value="SUPER_ADMIN">Super Admins</option>
                    </select>

                    <select
                      value={userSubFilter}
                      onChange={(e) => { setUserSubFilter(e.target.value); setUserPage(1); }}
                      className="px-3.5 py-3 bg-[#FFF0F3] border-2 border-[#FFCCE1] rounded-2xl text-xs font-black text-[#2A0826] outline-none cursor-pointer"
                    >
                      <option value="ALL">All Subscriptions</option>
                      <option value="ACTIVE">Active Plan</option>
                      <option value="INACTIVE">No Plan / Expired</option>
                    </select>

                    <select
                      value={userStatusFilter}
                      onChange={(e) => { setUserStatusFilter(e.target.value); setUserPage(1); }}
                      className="px-3.5 py-3 bg-[#FFF0F3] border-2 border-[#FFCCE1] rounded-2xl text-xs font-black text-[#2A0826] outline-none cursor-pointer"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="SAFE">Active Safe</option>
                      <option value="BLOCKED">Blocked Accounts</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-[#684E67] border-t border-[#FFCCE1] pt-3">
                  <span>Showing <strong className="text-[#FF2A6D]">{filteredUsers.length}</strong> matching registered users</span>
                  <span>Page {userPage} of {totalUserPages}</span>
                </div>
              </div>

              {/* USERS TABLE LIST */}
              <div className="bg-white border-2 border-[#FFCCE1] rounded-[32px] overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FFF0F3] border-b-2 border-[#FFCCE1] text-[11px] font-black uppercase text-[#684E67] tracking-wider">
                        <th className="p-4 pl-6">Member Profile</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Subscription</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FFCCE1] text-xs font-bold">
                      {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((u) => {
                          const isBlocked = u.safetyStatus === 'BLOCKED';
                          return (
                            <tr key={u.id} className="hover:bg-[#FFF0F3]/50 transition-colors">
                              <td className="p-4 pl-6">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5C8A] to-[#FF2A6D] text-white flex items-center justify-center font-black text-sm shadow shrink-0">
                                    {(u.fullName || u.name || 'U').slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-black text-[#2A0826]">{u.fullName}</p>
                                    <p className="text-[10px] text-[#684E67] font-extrabold">{u.city || 'Pune'}, {u.state || 'MH'}</p>
                                  </div>
                                </div>
                              </td>

                              <td className="p-4 space-y-0.5">
                                <p className="font-bold text-[#2A0826] flex items-center space-x-1">
                                  <Mail className="w-3 h-3 text-[#FF2A6D]" />
                                  <span>{u.email}</span>
                                </p>
                                <p className="text-[11px] text-[#684E67] font-mono flex items-center space-x-1">
                                  <PhoneCall className="w-3 h-3 text-[#FF2A6D]" />
                                  <span>{u.phone}</span>
                                </p>
                              </td>

                              <td className="p-4">
                                {u.role === 'SUPER_ADMIN' ? (
                                  <span className="bg-gold text-[#2A0826] font-black text-[10px] px-2.5 py-1 rounded-full uppercase flex items-center space-x-1 w-fit shadow-xs">
                                    <Crown className="w-3 h-3" />
                                    <span>SUPER ADMIN</span>
                                  </span>
                                ) : (
                                  <span className="bg-gray-100 text-gray-700 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                                    MEMBER USER
                                  </span>
                                )}
                              </td>

                              <td className="p-4">
                                {u.subscriptionStatus === 'ACTIVE' ? (
                                  <div>
                                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-300 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase inline-block">
                                      ✓ ACTIVE
                                    </span>
                                    {u.subscriptionExpiresAt && (
                                      <p className="text-[10px] text-[#684E67] mt-0.5 font-extrabold">
                                        Exp: {new Date(u.subscriptionExpiresAt).toLocaleDateString('en-IN')}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <span className="bg-rose-50 text-[#FF2A6D] border border-[#FF2A6D] font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase inline-block">
                                    INACTIVE
                                  </span>
                                )}
                              </td>

                              <td className="p-4">
                                {isBlocked ? (
                                  <span className="bg-rose-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase flex items-center space-x-1 w-fit shadow-xs">
                                    <UserX className="w-3 h-3" />
                                    <span>BLOCKED</span>
                                  </span>
                                ) : (
                                  <span className="bg-emerald-100 text-emerald-800 font-black text-[10px] px-2.5 py-1 rounded-full uppercase flex items-center space-x-1 w-fit">
                                    <UserCheck className="w-3 h-3" />
                                    <span>SAFE / ACTIVE</span>
                                  </span>
                                )}
                              </td>

                              <td className="p-4 pr-6 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditUserModal(u)}
                                    title="Edit All Details (Direct Email Change without OTP)"
                                    className="bg-[#FFF0F3] hover:bg-[#FF2A6D] text-[#FF2A6D] hover:text-white p-2 rounded-xl border border-[#FFCCE1] shadow-xs transition-all cursor-pointer"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setGrantingUser(u)}
                                    title="Grant Free Subscription / Renewal"
                                    className="bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white p-2 rounded-xl border border-emerald-300 shadow-xs transition-all cursor-pointer"
                                  >
                                    <Zap className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleBlockUser(u)}
                                    title={isBlocked ? 'Unblock User' : 'Block User'}
                                    className={`p-2 rounded-xl border shadow-xs transition-all cursor-pointer ${
                                      isBlocked
                                        ? 'bg-amber-50 hover:bg-amber-500 text-amber-700 hover:text-white border-amber-300'
                                        : 'bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border-rose-300'
                                    }`}
                                  >
                                    {isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[#684E67] font-black">
                            No matching user accounts found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION CONTROLS */}
                <div className="p-4 bg-[#FFF0F3] border-t-2 border-[#FFCCE1] flex items-center justify-between">
                  <button
                    type="button"
                    disabled={userPage === 1}
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-white border border-[#FFCCE1] rounded-xl text-xs font-black text-[#2A0826] disabled:opacity-50 flex items-center space-x-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <span className="text-xs font-black text-[#684E67]">
                    Page {userPage} of {totalUserPages}
                  </span>

                  <button
                    type="button"
                    disabled={userPage >= totalUserPages}
                    onClick={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
                    className="px-4 py-2 bg-white border border-[#FFCCE1] rounded-xl text-xs font-black text-[#2A0826] disabled:opacity-50 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUBSCRIPTION PLANS & DYNAMIC GLOBAL GST MODULE */}
          {activeTab === 'plans' && (
            <div className="space-y-8 animate-fade-up">
              
              {/* GLOBAL GST PERCENTAGE MODULE CARD */}
              <div className="bg-gradient-to-br from-white via-[#FFF0F3] to-white border-2 border-[#FFCCE1] rounded-[32px] p-6 sm:p-8 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#FFCCE1] pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5C8A] via-[#FF2A6D] to-[#FFD166] text-white flex items-center justify-center shadow shrink-0">
                      <Sliders className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-[#2A0826]">Global Dynamic GST Rate Control</h3>
                      <p className="text-xs text-[#684E67] font-bold">Modifying GST percentage instantly recalculates total pricing for all subscription plans</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdateGlobalGst} className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <div className="flex items-center space-x-3 flex-1 w-full">
                    <label className="text-xs font-black text-[#2A0826] shrink-0">Global GST Percentage (%):</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={gstPercentage}
                      onChange={(e) => setGstPercentage(e.target.value)}
                      className="w-32 px-4 py-3 bg-white border-2 border-[#FF2A6D] rounded-2xl text-center text-base font-black text-[#2A0826] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black text-xs px-8 py-3.5 rounded-2xl shadow hover:scale-105 transition-all uppercase tracking-wider cursor-pointer"
                  >
                    UPDATE GLOBAL GST RATE
                  </button>
                </form>
              </div>

              {/* DYNAMIC PLANS MANAGEMENT TABLE */}
              <div className="bg-white border-2 border-[#FFCCE1] rounded-[32px] p-6 sm:p-8 shadow-md space-y-6">
                <div className="flex items-center justify-between border-b-2 border-[#FFCCE1] pb-4">
                  <div>
                    <h3 className="font-black text-lg text-[#2A0826]">Subscription Plans in Database</h3>
                    <p className="text-xs text-[#684E67] font-bold">Dynamic subscription offerings for Sakhi Suraksha members</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPlanForm({
                        id: null,
                        name: '',
                        description: '',
                        basePrice: '',
                        gstPercentage: gstPercentage,
                        durationDays: 365,
                        isActive: true,
                      });
                      setIsPlanModalOpen(true);
                    }}
                    className="bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white font-black text-xs px-5 py-3 rounded-2xl shadow hover:scale-105 transition-all flex items-center space-x-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" />
                    <span>CREATE NEW PLAN</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {plans.map((p) => {
                    const base = parseFloat(p.basePrice || 0);
                    const gst = parseFloat(p.gstPercentage || gstPercentage);
                    const total = parseFloat((base + (base * gst) / 100).toFixed(2));
                    return (
                      <div key={p.id} className={`p-6 rounded-3xl border-2 space-y-4 transition-all relative ${
                        p.isActive ? 'bg-white border-[#FF2A6D] shadow-md' : 'bg-gray-50 border-gray-300 opacity-70'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                              p.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-300' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {p.isActive ? 'ENABLED' : 'DISABLED'}
                            </span>
                            <h4 className="font-black text-lg text-[#2A0826] mt-2">{p.name}</h4>
                          </div>

                          <div className="text-right">
                            <p className="font-black text-2xl text-[#FF2A6D]">₹{total}</p>
                            <p className="text-[10px] font-bold text-[#684E67]">₹{base} + {gst}% GST</p>
                          </div>
                        </div>

                        <p className="text-xs text-[#684E67] font-bold leading-relaxed">{p.description}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-[#FFCCE1]">
                          <span className="text-xs font-black text-[#2A0826]">Validity: {p.durationDays} Days</span>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setPlanForm({
                                  id: p.id,
                                  name: p.name,
                                  description: p.description,
                                  basePrice: p.basePrice,
                                  gstPercentage: p.gstPercentage || gstPercentage,
                                  durationDays: p.durationDays,
                                  isActive: p.isActive,
                                });
                                setIsPlanModalOpen(true);
                              }}
                              className="bg-[#FFF0F3] text-[#FF2A6D] font-black text-xs px-3.5 py-2 rounded-xl border border-[#FFCCE1] hover:bg-[#FF2A6D] hover:text-white transition-all cursor-pointer"
                            >
                              EDIT PLAN
                            </button>

                            <button
                              type="button"
                              onClick={() => handleTogglePlanActive(p.id)}
                              className={`font-black text-xs px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                                p.isActive
                                  ? 'bg-rose-50 text-[#FF2A6D] border-[#FF2A6D]'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-400'
                              }`}
                            >
                              {p.isActive ? 'DISABLE' : 'ENABLE'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENT TRANSACTIONS & RECEIPTS */}
          {activeTab === 'payments' && (
            <div className="space-y-8 animate-fade-up">
              
              {/* REVENUE RECAP CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-1">
                  <span className="text-xs font-black text-[#684E67] uppercase">Total Revenue Collected</span>
                  <p className="text-3xl font-black text-emerald-600">₹{paymentSummary?.totalRevenue?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-1">
                  <span className="text-xs font-black text-[#684E67] uppercase">Successful Transactions</span>
                  <p className="text-3xl font-black text-[#2A0826]">{paymentSummary?.successCount || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-1">
                  <span className="text-xs font-black text-[#684E67] uppercase">Total GST Collected</span>
                  <p className="text-3xl font-black text-purple-600">₹{paymentSummary?.totalGstCollected?.toFixed(2) || '0.00'}</p>
                </div>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="bg-white border-2 border-[#FFCCE1] p-6 rounded-[32px] shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-[#684E67] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search transactions by Txn ID, User Name, Email..."
                      value={paymentSearch}
                      onChange={(e) => { setPaymentSearch(e.target.value); setPaymentPage(1); }}
                      className="w-full pl-11 pr-4 py-3 bg-[#FFF0F3] border-2 border-[#FFCCE1] rounded-2xl text-xs font-bold text-[#2A0826] outline-none"
                    />
                  </div>

                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => { setPaymentStatusFilter(e.target.value); setPaymentPage(1); }}
                    className="px-4 py-3 bg-[#FFF0F3] border-2 border-[#FFCCE1] rounded-2xl text-xs font-black text-[#2A0826] outline-none cursor-pointer"
                  >
                    <option value="ALL">All Payment Statuses</option>
                    <option value="SUCCESS">Successful Only</option>
                    <option value="PENDING">Pending Only</option>
                    <option value="FAILED">Failed Only</option>
                  </select>
                </div>
              </div>

              {/* PAYMENTS TABLE LIST */}
              <div className="bg-white border-2 border-[#FFCCE1] rounded-[32px] overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FFF0F3] border-b-2 border-[#FFCCE1] text-[11px] font-black uppercase text-[#684E67] tracking-wider">
                        <th className="p-4 pl-6">Txn ID & Date</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Plan Name</th>
                        <th className="p-4">Amount Paid</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FFCCE1] text-xs font-bold">
                      {paginatedPayments.length > 0 ? (
                        paginatedPayments.map((p) => (
                          <tr key={p.id} className="hover:bg-[#FFF0F3]/50 transition-colors">
                            <td className="p-4 pl-6">
                              <p className="font-mono font-black text-[#2A0826]">{p.txnid || `TXN_${p.id}`}</p>
                              <p className="text-[10px] text-[#684E67] font-extrabold">{new Date(p.createdAt).toLocaleString('en-IN')}</p>
                            </td>

                            <td className="p-4">
                              <p className="font-black text-[#2A0826]">{p.user?.fullName || 'N/A'}</p>
                              <p className="text-[10px] text-[#684E67] font-mono">{p.user?.email || 'N/A'}</p>
                            </td>

                            <td className="p-4 text-[#684E67]">
                              {p.plan?.name || 'Sakhi Protection Plan'}
                            </td>

                            <td className="p-4">
                              <p className="font-black text-[#FF2A6D] text-sm">₹{p.amount}</p>
                              <p className="text-[10px] text-[#684E67]">Base ₹{p.baseAmount} + GST ₹{p.gstAmount}</p>
                            </td>

                            <td className="p-4">
                              {p.status === 'SUCCESS' ? (
                                <span className="bg-emerald-50 text-emerald-600 border border-emerald-300 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                                  ✓ SUCCESS
                                </span>
                              ) : p.status === 'FAILED' ? (
                                <span className="bg-rose-50 text-rose-600 border border-rose-300 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                                  FAILED
                                </span>
                              ) : (
                                <span className="bg-amber-50 text-amber-700 border border-amber-300 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                                  PENDING
                                </span>
                              )}
                            </td>

                            <td className="p-4 pr-6 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedReceipt(p)}
                                className="bg-[#FFF0F3] hover:bg-[#FF2A6D] text-[#FF2A6D] hover:text-white px-3 py-1.5 rounded-xl border border-[#FFCCE1] font-black text-xs transition-all cursor-pointer flex items-center space-x-1 ml-auto"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>VIEW RECEIPT</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[#684E67] font-black">
                            No payment transactions recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION CONTROLS */}
                <div className="p-4 bg-[#FFF0F3] border-t-2 border-[#FFCCE1] flex items-center justify-between">
                  <button
                    type="button"
                    disabled={paymentPage === 1}
                    onClick={() => setPaymentPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-white border border-[#FFCCE1] rounded-xl text-xs font-black text-[#2A0826] disabled:opacity-50 cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-black text-[#684E67]">
                    Page {paymentPage} of {totalPaymentPages}
                  </span>
                  <button
                    type="button"
                    disabled={paymentPage >= totalPaymentPages}
                    onClick={() => setPaymentPage((p) => Math.min(totalPaymentPages, p + 1))}
                    className="px-4 py-2 bg-white border border-[#FFCCE1] rounded-xl text-xs font-black text-[#2A0826] disabled:opacity-50 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT ENQUIRIES & SUPPORT MESSAGES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6 animate-fade-up">
              {/* TOP HEADER & SEARCH */}
              <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-xl text-[#2A0826]">Contact Enquiries & Support Messages</h3>
                  <p className="text-xs text-[#684E67] font-bold">Manage inquiries received from website visitors & Sakhi members</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-[#684E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name, email, phone..."
                      value={enquirySearch}
                      onChange={(e) => setEnquirySearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FFF0F3] border border-[#FFCCE1] rounded-2xl text-xs font-bold text-[#2A0826] outline-none"
                    />
                  </div>

                  <select
                    value={enquiryStatusFilter}
                    onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                    className="px-4 py-2.5 bg-[#FFF0F3] border border-[#FFCCE1] rounded-2xl text-xs font-bold text-[#2A0826] outline-none cursor-pointer"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending Only</option>
                    <option value="RESOLVED">Resolved Only</option>
                  </select>
                </div>
              </div>

              {/* ENQUIRIES LIST TABLE */}
              <div className="bg-white rounded-3xl border-2 border-[#FFCCE1] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FFF0F3] border-b-2 border-[#FFCCE1] text-[11px] font-black uppercase text-[#2A0826] tracking-wider">
                        <th className="p-4">ID & Date</th>
                        <th className="p-4">Sender Details</th>
                        <th className="p-4">Topic / Subject</th>
                        <th className="p-4">Message</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FFCCE1]/50 text-xs font-bold text-[#2A0826]">
                      {enquiries.length > 0 ? (
                        enquiries
                          .filter((e) => {
                            const matchSearch =
                              e.fullName?.toLowerCase().includes(enquirySearch.toLowerCase()) ||
                              e.email?.toLowerCase().includes(enquirySearch.toLowerCase()) ||
                              e.phone?.includes(enquirySearch) ||
                              e.subject?.toLowerCase().includes(enquirySearch.toLowerCase());
                            const matchStatus =
                              enquiryStatusFilter === 'ALL' ? true : e.status === enquiryStatusFilter;
                            return matchSearch && matchStatus;
                          })
                          .map((enq) => (
                            <tr key={enq.id} className="hover:bg-[#FFF0F3]/40 transition-colors">
                              <td className="p-4">
                                <span className="font-mono text-[#FF2A6D] font-black">#{enq.id}</span>
                                <p className="text-[10px] text-[#684E67]">{new Date(enq.createdAt).toLocaleString('en-IN')}</p>
                              </td>

                              <td className="p-4">
                                <p className="font-black text-[#2A0826]">{enq.fullName}</p>
                                <p className="text-[11px] font-mono text-[#684E67]">{enq.email}</p>
                                {enq.phone && <p className="text-[10px] font-mono text-[#FF2A6D]">{enq.phone}</p>}
                              </td>

                              <td className="p-4">
                                <span className="bg-[#FFF0F3] text-[#FF2A6D] px-2.5 py-1 rounded-lg text-[10px] font-black border border-[#FFCCE1]">
                                  {enq.subject || 'General Inquiry'}
                                </span>
                              </td>

                              <td className="p-4 max-w-xs">
                                <p className="text-xs text-[#2A0826] line-clamp-3 leading-relaxed font-normal bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                                  {enq.message}
                                </p>
                              </td>

                              <td className="p-4">
                                {enq.status === 'RESOLVED' ? (
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center space-x-1 w-fit">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>RESOLVED</span>
                                  </span>
                                ) : (
                                  <span className="bg-amber-50 text-amber-700 border border-amber-300 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center space-x-1 w-fit animate-pulse">
                                    <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
                                    <span>PENDING</span>
                                  </span>
                                )}
                              </td>

                              <td className="p-4 text-right">
                                {enq.status === 'PENDING' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleResolveEnquiry(enq.id)}
                                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                  >
                                    MARK AS RESOLVED
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-gray-500 font-bold">Resolved</span>
                                )}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[#684E67] font-black">
                            No contact enquiries or support messages recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* MODAL 1: EDIT USER DETAILS (DIRECT EMAIL CHANGE WITHOUT OTP) */}
        {editingUser && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-[36px] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#FF2A6D] relative animate-scale-up">
              
              <div className="flex items-center justify-between border-b-2 border-[#FFCCE1] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#FF2A6D] flex items-center justify-center">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#2A0826]">SuperAdmin Edit User Details</h3>
                    <p className="text-xs text-[#684E67] font-bold">Direct Email Change without OTP Verification</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="p-2 text-[#684E67] hover:text-[#FF2A6D] cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveUserEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-[#684E67] mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-xs font-bold text-[#2A0826] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#684E67] mb-1">
                      Email Address (Direct Update) *
                    </label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-xs font-black text-emerald-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#684E67] mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-xs font-mono font-bold text-[#2A0826] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#684E67] mb-1">Account Role *</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-xs font-bold text-[#2A0826] outline-none cursor-pointer"
                    >
                      <option value="USER">MEMBER USER</option>
                      <option value="SUPER_ADMIN">SUPER ADMIN</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#684E67] mb-1">Blood Group</label>
                    <select
                      value={editBloodGroup}
                      onChange={(e) => setEditBloodGroup(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-xs font-bold text-[#2A0826] outline-none cursor-pointer"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#684E67] mb-1">New Password (Optional)</label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-xs font-bold text-[#2A0826] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-[#684E67] mb-1">Residential Address</label>
                    <input
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-xs font-bold text-[#2A0826] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#684E67] mb-1">City</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-xs font-bold text-[#2A0826] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#684E67] mb-1">State</label>
                    <input
                      type="text"
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-xs font-bold text-[#2A0826] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#684E67] mb-1">Primary Guardian Name</label>
                    <input
                      type="text"
                      value={editEmergencyName}
                      onChange={(e) => setEditEmergencyName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-xs font-bold text-[#2A0826] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#684E67] mb-1">Guardian Phone</label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={editEmergencyPhone}
                      onChange={(e) => setEditEmergencyPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-xs font-mono font-bold text-[#2A0826] outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#FFCCE1]">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-5 py-3 rounded-full text-xs font-black text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingUserEdit}
                    className="px-8 py-3 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] uppercase tracking-wider shadow cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingUserEdit ? 'SAVING...' : 'SAVE USER DETAILS'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* MODAL 2: GRANT FREE CUSTOM SUBSCRIPTION / RENEWAL */}
        {grantingUser && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[36px] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-emerald-500 relative animate-scale-up">
              
              <div className="flex items-center justify-between border-b-2 border-[#FFCCE1] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-[#2A0826]">Grant Free Subscription</h3>
                    <p className="text-xs text-[#684E67] font-bold">For user: {grantingUser.fullName}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setGrantingUser(null)}
                  className="p-2 text-[#684E67] hover:text-[#FF2A6D] cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#684E67] mb-1.5">Select Free Subscription Duration</label>
                  <select
                    value={freePlanDuration}
                    onChange={(e) => setFreePlanDuration(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-emerald-500 rounded-xl text-xs font-black text-[#2A0826] outline-none cursor-pointer"
                  >
                    <option value="365">1 Year Full Protection (365 Days)</option>
                    <option value="90">3 Months Pass (90 Days)</option>
                    <option value="30">1 Month Trial Pass (30 Days)</option>
                    <option value="CUSTOM">Custom Date Range</option>
                  </select>
                </div>

                {freePlanDuration === 'CUSTOM' && (
                  <div className="grid grid-cols-2 gap-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-300">
                    <div>
                      <label className="block text-[11px] font-black text-emerald-900 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-emerald-400 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-emerald-900 mb-1">Expiry Date</label>
                      <input
                        type="date"
                        value={customExpiryDate}
                        onChange={(e) => setCustomExpiryDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-emerald-400 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGrantingUser(null)}
                  className="px-5 py-3 rounded-full text-xs font-black text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleGrantFreeSubscription}
                  className="px-8 py-3 rounded-full text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 uppercase tracking-wider shadow cursor-pointer"
                >
                  GRANT FREE PLAN NOW
                </button>
              </div>

            </div>
          </div>
        )}

        {/* MODAL 3: CREATE / EDIT PLAN FORM */}
        {isPlanModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[36px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#FF2A6D] relative animate-scale-up">
              
              <div className="flex items-center justify-between border-b-2 border-[#FFCCE1] pb-4">
                <h3 className="font-black text-lg text-[#2A0826]">
                  {planForm.id ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="p-2 text-[#684E67] hover:text-[#FF2A6D] cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSavePlan} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#684E67] mb-1">Plan Title / Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sakhi Suraksha 365 Plan"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-xs font-bold text-[#2A0826] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#684E67] mb-1">Plan Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe plan features & coverage..."
                    value={planForm.description}
                    onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                    className="w-full p-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-xs font-bold text-[#2A0826] outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-[#684E67] mb-1">Base Price (INR ₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 24.00"
                      value={planForm.basePrice}
                      onChange={(e) => setPlanForm({ ...planForm, basePrice: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-xs font-bold text-[#2A0826] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#684E67] mb-1">Duration (Days) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 365"
                      value={planForm.durationDays}
                      onChange={(e) => setPlanForm({ ...planForm, durationDays: parseInt(e.target.value, 10) })}
                      className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-xs font-bold text-[#2A0826] outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#FFCCE1]">
                  <button
                    type="button"
                    onClick={() => setIsPlanModalOpen(false)}
                    className="px-5 py-3 rounded-full text-xs font-black text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] uppercase tracking-wider shadow cursor-pointer"
                  >
                    SAVE PLAN
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* MODAL 4: PRINTABLE PAYMENT RECEIPT VIEWER */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[36px] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#FF2A6D] relative animate-scale-up">
              
              <div className="flex items-center justify-between border-b-2 border-[#FFCCE1] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-[#2A0826]">Official Payment Receipt</h3>
                    <p className="text-xs text-[#684E67] font-mono">TXN: {selectedReceipt.txnid}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="p-2 text-[#684E67] hover:text-[#FF2A6D] cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-[#FFF0F3] p-5 rounded-2xl border border-[#FFCCE1] space-y-4">
                <div className="flex justify-between items-center border-b border-[#FFCCE1] pb-3">
                  <div>
                    <h4 className="font-black text-sm text-[#2A0826]">Sakhi Suraksha SOS Protection</h4>
                    <p className="text-[11px] text-[#684E67] font-bold">Encrypted 24/7 Safety Command Network</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-300 font-black text-xs px-3 py-1 rounded-full uppercase">
                    PAID SUCCESS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <span className="text-[#684E67] text-[10px] uppercase font-black">Customer Name</span>
                    <p className="text-[#2A0826] font-black">{selectedReceipt.user?.fullName}</p>
                  </div>
                  <div>
                    <span className="text-[#684E67] text-[10px] uppercase font-black">Customer Email</span>
                    <p className="text-[#2A0826] font-black font-mono">{selectedReceipt.user?.email}</p>
                  </div>
                  <div>
                    <span className="text-[#684E67] text-[10px] uppercase font-black">Payment Date</span>
                    <p className="text-[#2A0826]">{new Date(selectedReceipt.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-[#684E67] text-[10px] uppercase font-black">Payment Mode</span>
                    <p className="text-[#2A0826]">{selectedReceipt.paymentMode || 'PAYU_ONLINE'}</p>
                  </div>
                </div>

                <div className="border-t border-[#FFCCE1] pt-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#684E67]">Plan Base Price:</span>
                    <span className="font-black">₹{selectedReceipt.baseAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#684E67]">GST ({selectedReceipt.gstPercentage || gstPercentage}%):</span>
                    <span className="font-black">₹{selectedReceipt.gstAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-[#FF2A6D] pt-2 border-t border-[#FFCCE1]">
                    <span>Total Amount Paid:</span>
                    <span>₹{selectedReceipt.amount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-3 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] flex items-center space-x-1.5 shadow cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>PRINT RECEIPT</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}

export default function SuperAdminHQPage() {
  return (
    <Suspense
      fallback={
        <AppLayout>
          <div className="min-h-screen bg-[#FFF0F3] p-8 text-center font-black text-xs text-[#2A0826]">
            Loading SuperAdmin HQ Command Portal...
          </div>
        </AppLayout>
      }
    >
      <SuperAdminHQContent />
    </Suspense>
  );
}
