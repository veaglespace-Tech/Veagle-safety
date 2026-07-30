'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PublicNavbar } from '../../../components/layout/PublicNavbar.js';
import { CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../../../redux/slices/authSlice.js';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const txnid = searchParams.get('txnid') || 'VEAGLE_SUCCESS';
  const planName = searchParams.get('plan') || 'Sakhi Suraksha 365 Yearly Plan';
  const amount = searchParams.get('amount') || '28.32';

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    dispatch(fetchUser());

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  // Separate effect for router push to avoid React setState in render console error
  useEffect(() => {
    if (countdown === 0) {
      router.push('/dashboard');
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden flex flex-col">
      <PublicNavbar />

      {/* AMBIENT MESH GLOWS */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-rose/15 blur-[150px] top-[-100px] left-[-200px] pointer-events-none" />
      <div className="absolute w-[700px] h-[700px] rounded-full bg-gold/15 blur-[150px] bottom-[100px] right-[-200px] pointer-events-none" />

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-lg card-antique-pink p-8 sm:p-10 border-2 border-rose shadow-coral-glow space-y-6 text-center animate-fade-up">
          
          {/* SUCCESS ANIMATED ICON */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-tichi-success/20 animate-ping" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-tichi-success to-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg relative z-10">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 bg-tichi-success/10 border border-tichi-success/30 px-3.5 py-1 rounded-full text-xs font-black text-tichi-success uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Payment Successful & Protection Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-tichi-text">Thank You for Registering!</h1>
            <p className="text-xs text-tichi-muted font-bold leading-relaxed">
              Your PayU transaction has been completed and your 365-day safety protection is now fully activated in the system.
            </p>
          </div>

          {/* TRANSACTION SUMMARY BOX */}
          <div className="bg-blush-subtle p-5 rounded-2xl border border-[#FFCCE1] text-xs font-semibold space-y-2 text-left">
            <div className="flex justify-between items-center">
              <span className="text-tichi-muted font-bold">Transaction ID:</span>
              <span className="font-mono text-tichi-text font-black">{txnid}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-tichi-muted font-bold">Activated Plan:</span>
              <span className="font-bold text-tichi-text">{planName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-tichi-muted font-bold">Amount Paid (Inc. GST):</span>
              <span className="font-mono text-rose font-black text-sm">₹{amount}</span>
            </div>

            <div className="flex justify-between items-center border-t border-[#FFCCE1] pt-2 mt-2">
              <span className="text-tichi-muted font-bold">Protection Status:</span>
              <span className="font-black text-tichi-success flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4" />
                <span>ACTIVE (365 DAYS)</span>
              </span>
            </div>
          </div>

          {/* 5-SECOND AUTO REDIRECT TIMER */}
          <div className="bg-rose/10 border border-rose/30 p-4 rounded-xl space-y-2">
            <p className="text-xs font-extrabold text-rose">
              Automatically navigating to your Dashboard in <span className="font-mono text-sm font-black text-rose underline">{countdown}</span> seconds...
            </p>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full btn-baby-pink py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 shadow-coral-glow"
            >
              <span>GO TO DASHBOARD NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF0F3] flex items-center justify-center font-bold text-rose">Loading Success Page...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
