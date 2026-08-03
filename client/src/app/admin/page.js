'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout.js';
import { AdminHeaderNav } from '../../components/admin/AdminHeaderNav.js';
import { api } from '../../utils/api.js';
import {
  AlertOctagon, Users, ShieldCheck, TrendingUp, CheckCircle2,
  MapPin, Eye, PhoneCall, Mail
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SuperAdminOverviewPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchOverviewData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/overview');
      setOverview(res.data || null);
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to load Emergency Command overview');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchOverviewData();
  }, []);

  const handleResolveSos = async (sosId) => {
    if (!confirm('Resolve emergency SOS broadcast on behalf of dispatch center?')) return;
    try {
      const res = await api.post('/admin/sos/resolve', { sosSessionId: sosId });
      showToast('success', res.data.message);
      fetchOverviewData();
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to resolve SOS');
    }
  };

  if (!mounted) return null;

  const activeSosList = overview?.activeSos || [];
  const recentSosList = overview?.recentSos || [];

  const metrics = {
    activeSosCount: overview?.metrics?.activeSosCount || 0,
    totalUsers: overview?.metrics?.totalUsers || 0,
    activePlansCount: overview?.metrics?.activeSubscriptions || 0,
    paymentsCount: overview?.metrics?.totalSuccessfulTransactions || 0,
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* HEADER NAVIGATION */}
        <AdminHeaderNav
          metrics={metrics}
          onRefresh={fetchOverviewData}
          toast={toast}
          activeTabOverride="overview"
        />

        {/* OVERVIEW CONTENT */}
        <div className="space-y-8 animate-fade-up">
          
          {/* TOP KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#684E67] uppercase tracking-wider">Active SOS Alerts</span>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#FF2A6D] flex items-center justify-center border border-rose-200">
                  <AlertOctagon className="w-5 h-5 animate-pulse" />
                </div>
              </div>
              <p className="text-3xl font-black text-[#2A0826]">{metrics.activeSosCount}</p>
              <p className="text-[11px] font-bold text-rose-500">Emergency broadcasts live</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#684E67] uppercase tracking-wider">Total Members</span>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-[#2A0826]">{metrics.totalUsers}</p>
              <p className="text-[11px] font-bold text-[#684E67]">Registered Sakhi accounts</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#684E67] uppercase tracking-wider">Active Paid Plans</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-[#2A0826]">{metrics.activePlansCount}</p>
              <p className="text-[11px] font-bold text-emerald-600">Active paid protection</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#684E67] uppercase tracking-wider">Total Revenue</span>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-[#2A0826]">₹{overview?.metrics?.totalRevenue?.toFixed(2) || '0.00'}</p>
              <p className="text-[11px] font-bold text-amber-600">Incl. 18% Global GST</p>
            </div>
          </div>

          {/* LIVE EMERGENCY SOS BROADCAST STREAM */}
          <div className="bg-white p-6 sm:p-8 rounded-[36px] border-2 border-[#FFCCE1] shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-[#FFCCE1] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <h3 className="font-black text-lg text-[#2A0826]">Live Active SOS Emergency Broadcasts</h3>
              </div>
              <span className="text-xs font-black bg-rose-100 text-[#FF2A6D] px-3 py-1 rounded-full uppercase border border-rose-300">
                {activeSosList.length} LIVE INCIDENTS
              </span>
            </div>

            {activeSosList.length > 0 ? (
              <div className="space-y-4">
                {activeSosList.map((sos) => {
                  const latestLoc = sos.locations?.[0];
                  return (
                    <div key={sos.id} className="p-5 rounded-3xl bg-rose-50/60 border-2 border-rose-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-rose-600 bg-white px-2.5 py-0.5 rounded-full border border-rose-300 uppercase">
                            SOS #{sos.id}
                          </span>
                          <h4 className="font-black text-base text-[#2A0826]">{sos.user?.fullName || 'Anonymous Sakhi'}</h4>
                        </div>
                        <p className="text-xs font-bold text-[#684E67] flex items-center space-x-2">
                          <PhoneCall className="w-3.5 h-3.5 text-[#FF2A6D]" />
                          <span>{sos.user?.phone || 'N/A'}</span>
                          <span>•</span>
                          <Mail className="w-3.5 h-3.5 text-[#FF2A6D]" />
                          <span>{sos.user?.email || 'N/A'}</span>
                        </p>
                        <p className="text-xs font-bold text-rose-700 flex items-center space-x-1 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-600" />
                          <span>
                            GPS: {latestLoc?.latitude || sos.latitude || 'N/A'}, {latestLoc?.longitude || sos.longitude || 'N/A'}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => router.push('/active-sos')}
                          className="px-4 py-2.5 bg-white text-[#FF2A6D] border border-rose-300 font-black text-xs rounded-xl shadow-sm hover:bg-rose-100 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>TRACK LIVE</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResolveSos(sos.id)}
                          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs rounded-xl shadow-sm hover:scale-105 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>RESOLVE SOS</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#FFF0F3]/40 rounded-3xl border border-dashed border-[#FFCCE1] space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="font-black text-sm text-[#2A0826]">All Clear — No Active Emergency SOS Incidents</p>
                <p className="text-xs text-[#684E67] font-extrabold">All Sakhi members are safe and monitored 24/7 by HQ command dispatch.</p>
              </div>
            )}
          </div>

          {/* RECENT ACTIVITY & DISPATCH LOGS */}
          <div className="bg-white p-6 sm:p-8 rounded-[36px] border-2 border-[#FFCCE1] shadow-md space-y-4">
            <h3 className="font-black text-lg text-[#2A0826] border-b border-[#FFCCE1] pb-3">Recent System Activity & Dispatch Logs</h3>
            {recentSosList.length > 0 ? (
              <div className="space-y-3">
                {recentSosList.map((sos) => (
                  <div key={sos.id} className="p-4 rounded-2xl bg-[#FFF0F3]/60 border border-[#FFCCE1] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-black text-[#2A0826]">
                        Emergency SOS #{sos.id} ({sos.status}) — {sos.user?.fullName || 'Member'}
                      </span>
                      <p className="text-[11px] text-[#684E67] font-bold mt-0.5">
                        Triggered on {new Date(sos.startedAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase border ${
                      sos.status === 'ACTIVE'
                        ? 'bg-rose-100 text-rose-700 border-rose-300'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    }`}>
                      {sos.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 font-bold text-center py-4">No recent activity logs.</p>
            )}
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
