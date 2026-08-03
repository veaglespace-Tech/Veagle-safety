'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../../components/layout/AppLayout.js';
import { AdminHeaderNav } from '../../../components/admin/AdminHeaderNav.js';
import { api } from '../../../utils/api.js';
import {
  CreditCard, Search, Eye, Printer, X, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const [mounted, setMounted] = useState(false);
  const [payments, setPayments] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // SEARCH, FILTER & PAGINATION
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [paymentPage, setPaymentPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const paymentsPerPage = 8;

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPaymentsData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/payments');
      setPayments(res.data.payments || []);
      setPaymentSummary(res.data.summary || null);
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to fetch payment transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchPaymentsData();
  }, []);

  if (!mounted) return null;

  // FILTER & PAGINATION COMPUTATIONS FOR PAYMENTS
  const filteredPayments = payments.filter((p) => {
    const q = paymentSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (p.txnid || '').toLowerCase().includes(q) ||
      (p.user?.fullName || '').toLowerCase().includes(q) ||
      (p.user?.email || '').toLowerCase().includes(q) ||
      (p.plan?.name || '').toLowerCase().includes(q);

    const matchesStatus = paymentStatusFilter === 'ALL' || p.status === paymentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPaymentPages = Math.ceil(filteredPayments.length / paymentsPerPage) || 1;
  const paginatedPayments = filteredPayments.slice((paymentPage - 1) * paymentsPerPage, paymentPage * paymentsPerPage);

  const metrics = {
    paymentsCount: payments.length,
    totalRevenue: paymentSummary?.totalRevenue || 0,
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* HEADER NAVIGATION */}
        <AdminHeaderNav
          metrics={metrics}
          onRefresh={fetchPaymentsData}
          toast={toast}
          activeTabOverride="payments"
        />

        {/* PAYMENTS CONTENT */}
        <div className="space-y-6 animate-fade-up">
          
          {/* SUMMARY STATS BAR */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-1">
              <span className="text-xs font-black text-[#684E67] uppercase">Total Revenue</span>
              <p className="text-3xl font-black text-emerald-600">₹{paymentSummary?.totalRevenue?.toFixed(2) || '0.00'}</p>
              <p className="text-[11px] font-bold text-gray-500">Gross total revenue collected</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-1">
              <span className="text-xs font-black text-[#684E67] uppercase">Successful Transactions</span>
              <p className="text-3xl font-black text-[#2A0826]">{paymentSummary?.successCount || 0}</p>
              <p className="text-[11px] font-bold text-emerald-600">Completed payments</p>
            </div>

            <div className="bg-white p-6 rounded-[32px] border-2 border-[#FFCCE1] shadow-sm space-y-1">
              <span className="text-xs font-black text-[#684E67] uppercase">GST Tax Collected</span>
              <p className="text-3xl font-black text-purple-600">₹{paymentSummary?.totalGstCollected?.toFixed(2) || '0.00'}</p>
              <p className="text-[11px] font-bold text-purple-600">18% GST audit ledger</p>
            </div>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-[#684E67] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Txn ID, member name, email, plan..."
                value={paymentSearch}
                onChange={(e) => { setPaymentSearch(e.target.value); setPaymentPage(1); }}
                className="w-full pl-11 pr-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-2xl text-xs font-bold text-[#2A0826] outline-none"
              />
            </div>

            <select
              value={paymentStatusFilter}
              onChange={(e) => { setPaymentStatusFilter(e.target.value); setPaymentPage(1); }}
              className="px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-2xl text-xs font-black text-[#2A0826] outline-none cursor-pointer w-full md:w-auto"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          {/* PAYMENTS TABLE LIST */}
          <div className="bg-white rounded-[36px] border-2 border-[#FFCCE1] shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFF0F3] border-b border-[#FFCCE1] text-[11px] font-black text-[#684E67] uppercase tracking-wider">
                    <th className="py-4 px-6">Transaction ID & Date</th>
                    <th className="py-4 px-6">Member & Email</th>
                    <th className="py-4 px-6">Plan Name</th>
                    <th className="py-4 px-6">Amount (Net + GST)</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Receipt Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#FFCCE1]/60 text-xs font-extrabold text-[#2A0826]">
                  {paginatedPayments.length > 0 ? (
                    paginatedPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FFF0F3]/40 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-mono text-xs font-black text-[#FF2A6D]">{p.txnid}</p>
                          <p className="text-[10px] text-gray-500 font-bold">{new Date(p.createdAt).toLocaleString()}</p>
                        </td>

                        <td className="py-4 px-6">
                          <p className="font-black text-[#2A0826]">{p.user?.fullName || 'Anonymous Member'}</p>
                          <p className="text-[11px] text-[#684E67] font-bold">{p.user?.email || 'N/A'}</p>
                        </td>

                        <td className="py-4 px-6 font-bold text-[#2A0826]">
                          {p.plan?.name || 'Sakhi Suraksha Protection Plan'}
                        </td>

                        <td className="py-4 px-6">
                          <p className="font-mono text-sm font-black text-[#2A0826]">₹{p.amount?.toFixed(2)}</p>
                          <p className="text-[10px] text-gray-500 font-bold">Base: ₹{p.baseAmount} + {p.gstPercentage}% GST</p>
                        </td>

                        <td className="py-4 px-6">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                            p.status === 'SUCCESS'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-300'
                              : p.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-600 border border-amber-300'
                              : 'bg-rose-50 text-rose-600 border border-rose-300'
                          }`}>
                            {p.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(p)}
                            className="px-3 py-1.5 bg-[#FFF0F3] text-[#FF2A6D] border border-[#FFCCE1] rounded-xl text-xs font-black hover:bg-[#FF2A6D] hover:text-[#FFFFFF] transition-all inline-flex items-center space-x-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>VIEW RECEIPT</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500 font-bold">
                        No payment transactions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="p-5 bg-[#FFF0F3]/60 border-t border-[#FFCCE1] flex items-center justify-between">
              <span className="text-xs font-black text-[#684E67]">
                Showing {filteredPayments.length === 0 ? 0 : (paymentPage - 1) * paymentsPerPage + 1} - {Math.min(paymentPage * paymentsPerPage, filteredPayments.length)} of {filteredPayments.length} Transactions
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  disabled={paymentPage === 1}
                  onClick={() => setPaymentPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-xl bg-white border border-[#FFCCE1] disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[#2A0826]" />
                </button>

                <span className="text-xs font-black text-[#2A0826] px-2">
                  Page {paymentPage} of {totalPaymentPages}
                </span>

                <button
                  type="button"
                  disabled={paymentPage >= totalPaymentPages}
                  onClick={() => setPaymentPage((p) => Math.min(totalPaymentPages, p + 1))}
                  className="p-2 rounded-xl bg-white border border-[#FFCCE1] disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-[#2A0826]" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* MODAL 4: ITEMIZED OFFICIAL GST RECEIPT VIEWER */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[36px] max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#FF2A6D] relative animate-scale-up">
              
              <div className="flex items-center justify-between border-b-2 border-[#FFCCE1] pb-4">
                <div>
                  <h3 className="font-black text-lg text-[#2A0826]">Official Payment Receipt</h3>
                  <p className="font-mono text-xs font-bold text-[#FF2A6D]">{selectedReceipt.txnid}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="p-2 text-[#684E67] hover:text-[#FF2A6D] cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-bold text-[#2A0826]">
                <div className="bg-[#FFF0F3] p-4 rounded-2xl border border-[#FFCCE1] space-y-2">
                  <p className="text-[11px] text-[#684E67] font-black uppercase">Member & Plan Info</p>
                  <p className="font-black text-[#2A0826]">{selectedReceipt.user?.fullName || 'Sakhi Member'}</p>
                  <p className="text-[#684E67]">{selectedReceipt.user?.email || 'N/A'}</p>
                  <p className="text-[#FF2A6D] font-black pt-1">{selectedReceipt.plan?.name || 'Sakhi Protection Plan'}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#FFCCE1] space-y-3">
                  <p className="text-[11px] text-[#684E67] font-black uppercase">Itemized GST Billing</p>
                  <div className="flex justify-between">
                    <span>Base Plan Net Price:</span>
                    <span className="font-mono font-black">₹{selectedReceipt.baseAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-[#FFCCE1] pb-2">
                    <span>GST ({selectedReceipt.gstPercentage}%):</span>
                    <span className="font-mono font-black">₹{selectedReceipt.gstAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#FF2A6D] pt-1">
                    <span>Total Paid:</span>
                    <span className="font-mono">₹{selectedReceipt.amount?.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 font-extrabold pt-2">
                  <span>Payment Status: {selectedReceipt.status}</span>
                  <span>Date: {new Date(selectedReceipt.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#FFCCE1]">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-full text-xs font-black text-[#2A0826] bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center space-x-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>PRINT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="px-6 py-2.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] uppercase tracking-wider shadow cursor-pointer"
                >
                  CLOSE
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
