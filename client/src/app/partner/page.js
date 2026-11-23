'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PublicNavbar } from '../../components/layout/PublicNavbar.js';
import { Footer } from '../../components/layout/Footer.js';
import {
  ShieldCheck,
  Mail,
  LogIn,
  RefreshCw,
  AlertCircle,
  Users,
  Award,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { referralApi } from '../../redux/api/referralApi.js';

export default function PartnerLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // If already logged in as partner, redirect to /partner/dashboard
  useEffect(() => {
    const savedToken = localStorage.getItem('partner_token');
    if (savedToken) {
      router.replace('/partner/dashboard');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    try {
      const res = await referralApi.loginPartner({
        identifier: identifier.trim(),
        email: identifier.trim(),
      });

      if (res.success && res.token) {
        localStorage.setItem('partner_token', res.token);
        if (res.partner) {
          localStorage.setItem('partner_data', JSON.stringify(res.partner));
        }
        router.push('/partner/dashboard');
      } else {
        setLoginError(res.message || 'Invalid credentials. No partner found with this email or mobile.');
      }
    } catch (err) {
      setLoginError(
        err.response?.data?.message || 'Login failed. Please verify your registered email or mobile number.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FFF0F3] flex flex-col items-center justify-center">
        <RefreshCw className="w-10 h-10 text-[#FF2A6D] animate-spin mb-3" />
        <p className="text-gray-600 font-bold text-sm">Checking Partner Authorization...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F3] via-white to-[#FFF0F3] flex flex-col font-sans selection:bg-[#FF2A6D] selection:text-white">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-pink-100 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#FF2A6D]/15 to-transparent rounded-bl-full pointer-events-none" />

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF2A6D] to-[#FF5E8E] flex items-center justify-center shadow-lg shadow-pink-500/25 text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Partner Portal</h1>
              <p className="text-xs text-[#FF2A6D] font-bold tracking-wide uppercase">Sakhi Suraksha SOS Partner Access</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Enter your registered Email Address or 10-digit Mobile Number to access your dedicated Partner Dashboard.
          </p>

          {loginError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Registered Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. partner@college.edu or 9876543210"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF2A6D] focus:border-transparent transition-all font-medium"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Use the email or mobile number provided when applying for the partnership.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#FF2A6D] to-[#FF5E8E] hover:from-[#e0205f] hover:to-[#e44d7c] text-white font-bold rounded-2xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Authenticating Partner...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                  <span>Sign In to Partner Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-3 text-center">
            <p className="text-xs text-gray-500">
              Want to become an official Safety Partner?{' '}
              <Link href="/join-partner" className="text-[#FF2A6D] font-bold hover:underline">
                Apply here
              </Link>
            </p>
            <p className="text-xs text-gray-400">
              Looking for regular user login?{' '}
              <Link href="/auth" className="text-gray-600 font-semibold hover:underline">
                Member Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
