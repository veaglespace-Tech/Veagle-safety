'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PublicNavbar } from '../../components/layout/PublicNavbar.js';
import { fetchPlans, initiatePayUCheckout } from '../../redux/slices/planSlice.js';
import { fetchUser } from '../../redux/slices/authSlice.js';
import { Shield, Check, ArrowRight, Zap, Award, Lock, ShieldCheck, CreditCard, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatedHeading } from '../../components/common/AnimatedHeading.jsx';
import { apiClient } from '../../redux/api/apiClient.js';

export const dynamic = 'force-dynamic';

export default function PlatformPricingPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { plans = [], isLoading, paymentData } = useSelector((state) => state.plan || {});
  const { token, user } = useSelector((state) => state.auth || {});

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState(null);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  // Auto-submit POST form to PayU gateway when paymentData is generated
  useEffect(() => {
    if (paymentData && paymentData.actionUrl) {
      setIsProcessing(true);
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentData.actionUrl;

      Object.keys(paymentData).forEach((key) => {
        if (key !== 'actionUrl' && paymentData[key]) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = paymentData[key];
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit();
    }
  }, [paymentData]);

  const yearlyPlan = plans[0] || {
    id: 'plan_yearly_24',
    name: 'Sakhi Suraksha 365 Yearly Protection Plan',
    description: 'Complete 365-Day 24/7 Unlimited SOS Emergency Broadcast, Live GPS Map Sharing, 5 Trusted Contacts Network, and HQ Command Dispatch',
    basePrice: 24,
    gstPercentage: 18,
    totalPrice: 28.32,
    durationDays: 365,
  };

  const handleSelectPlan = () => {
    if (!token) {
      router.push('/auth?mode=register');
    } else {
      setIsProcessing(true);
      dispatch(initiatePayUCheckout({ planId: yearlyPlan.id, amount: yearlyPlan.totalPrice }));
    }
  };

  // Instant Test Mode Activation Handler
  const handleInstantTestActivate = async () => {
    if (!token) {
      router.push('/auth?mode=register');
      return;
    }
    try {
      setIsProcessing(true);
      const res = await apiClient.post('/payment/payu-initiate', { planId: yearlyPlan.id, amount: yearlyPlan.totalPrice });
      if (res.data?.paymentData?.txnid) {
        const txnid = res.data.paymentData.txnid;
        // Direct test success callback
        await apiClient.post('/payment/payu-success', {
          txnid,
          mihpayid: `TEST_PAYU_${Date.now()}`,
          mode: 'TEST_UPI',
          status: 'success',
        });
        await dispatch(fetchUser());
        setPaymentSuccessMsg('Subscription activated successfully! Redirecting to Dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (e) {
      console.error('Instant test activation error:', e);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden">
      <PublicNavbar />

      {/* BACKGROUND AMBIENT GLOW MESHES */}
      <div className="absolute w-[750px] h-[750px] rounded-full bg-rose/15 blur-[160px] top-[-120px] left-[-220px] pointer-events-none" />
      <div className="absolute w-[750px] h-[750px] rounded-full bg-gold/15 blur-[160px] bottom-[80px] right-[-220px] pointer-events-none" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 relative z-10">
        
        {/* TOP HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white text-rose border border-rose/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <Zap className="w-4 h-4 text-rose animate-pulse" />
            <span className="text-shimmer-animated">SINGLE UNIFIED YEARLY PROTECTION PLAN</span>
          </div>
          <AnimatedHeading as="h1" variant="shimmer" className="text-4xl sm:text-6xl font-black tracking-tight">
            Complete 365-Day Safety Protection
          </AnimatedHeading>
          <p className="text-tichi-muted text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Just ₹24 per year (only ₹2/month). Complete your plan formalities to unlock 24/7 Live Emergency SOS, 5 Trusted Contacts, and Encrypted GPS Sharing for a full year.
          </p>
        </div>

        {paymentSuccessMsg && (
          <div className="max-w-md mx-auto bg-tichi-success/15 border-2 border-tichi-success text-tichi-success p-4 rounded-2xl text-xs font-black flex items-center justify-center space-x-2 shadow-lg animate-fade-up">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{paymentSuccessMsg}</span>
          </div>
        )}

        {/* SINGLE YEARLY PLAN CARD */}
        <div className="max-w-3xl mx-auto">
          <div className="card-antique-pink p-8 sm:p-12 border-2 border-rose shadow-coral-glow space-y-8 relative overflow-hidden">
            
            {/* YEARLY BADGE */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-rose via-rose-light to-rose text-white text-xs font-black px-6 py-2 rounded-bl-2xl uppercase tracking-widest shadow-md flex items-center space-x-1.5">
              <Award className="w-4 h-4" />
              <span>365 DAYS UNLIMITED</span>
            </div>

            {/* HEADER */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-rose/15 text-rose border-2 border-rose/30 flex items-center justify-center shadow-sm">
                  <Shield className="w-9 h-9 text-rose" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-tichi-text">{yearlyPlan.name}</h2>
                  <p className="text-xs text-tichi-muted font-black uppercase tracking-wider mt-0.5">1 Full Year (365 Days) Coverage</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-tichi-muted font-semibold leading-relaxed pt-2">
                {yearlyPlan.description}
              </p>
            </div>

            {/* PRICING BREAKDOWN */}
            <div className="bg-blush-subtle p-6 rounded-2xl border border-[#FFCCE1] space-y-3">
              <div className="flex items-baseline space-x-3">
                <span className="text-5xl sm:text-6xl font-black text-tichi-text">₹{yearlyPlan.basePrice}</span>
                <span className="text-sm sm:text-base text-tichi-muted font-bold">/ Year (Just ₹2 / Month)</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-tichi-muted font-mono font-bold border-t border-[#FFCCE1] pt-3 gap-2">
                <span>Base Yearly Fee: ₹{yearlyPlan.basePrice}</span>
                <span>GST (18%): ₹{(yearlyPlan.basePrice * 0.18).toFixed(2)}</span>
                <span className="font-extrabold text-rose text-sm">Total: ₹{yearlyPlan.totalPrice} / Year</span>
              </div>
            </div>

            {/* FULL FEATURE CHECKLIST */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-rose uppercase tracking-wider">Included 6 Safety Modules</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-tichi-text font-bold">
                <div className="flex items-center space-x-3 bg-white p-3.5 rounded-xl border border-[#FFCCE1] shadow-sm">
                  <Check className="w-4 h-4 text-rose shrink-0" />
                  <span>3-Second Hold Emergency SOS Trigger</span>
                </div>
                <div className="flex items-center space-x-3 bg-white p-3.5 rounded-xl border border-[#FFCCE1] shadow-sm">
                  <Check className="w-4 h-4 text-rose shrink-0" />
                  <span>5 Trusted Emergency Contacts Network</span>
                </div>
                <div className="flex items-center space-x-3 bg-white p-3.5 rounded-xl border border-[#FFCCE1] shadow-sm">
                  <Check className="w-4 h-4 text-rose shrink-0" />
                  <span>Real-Time Encrypted Live GPS Tracking</span>
                </div>
                <div className="flex items-center space-x-3 bg-white p-3.5 rounded-xl border border-[#FFCCE1] shadow-sm">
                  <Check className="w-4 h-4 text-rose shrink-0" />
                  <span>Safety Check-in Timer & Escalation</span>
                </div>
                <div className="flex items-center space-x-3 bg-white p-3.5 rounded-xl border border-[#FFCCE1] shadow-sm">
                  <Check className="w-4 h-4 text-rose shrink-0" />
                  <span>Piercing Loud Siren Panic Alarm</span>
                </div>
                <div className="flex items-center space-x-3 bg-white p-3.5 rounded-xl border border-[#FFCCE1] shadow-sm">
                  <Check className="w-4 h-4 text-rose shrink-0" />
                  <span>Fake Simulated Emergency Call</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleSelectPlan}
                disabled={isProcessing}
                className="w-full btn-baby-pink py-4 text-xs sm:text-sm uppercase tracking-wider shadow-coral-glow flex items-center justify-center space-x-2"
              >
                <span>{isProcessing ? 'REDIRECTING TO PAYU GATEWAY...' : token ? 'PURCHASE YEARLY PROTECTION WITH PAYU (₹28.32)' : 'REGISTER & COMPLETE PLAN FORMALITIES'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {token && (
                <button
                  type="button"
                  onClick={handleInstantTestActivate}
                  disabled={isProcessing}
                  className="w-full bg-white hover:bg-rose/5 text-rose border-2 border-rose/40 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>1-CLICK INSTANT TEST ACTIVATION (DEV SANDBOX)</span>
                </button>
              )}

              <div className="flex items-center justify-center space-x-2 text-[11px] text-tichi-muted font-extrabold">
                <Lock className="w-3.5 h-3.5 text-tichi-success" />
                <span>256-Bit SSL Encrypted Payment via PayU Gateway</span>
              </div>
            </div>

          </div>
        </div>

        {/* TRUST & GUARANTEE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="card-antique-pink p-6 space-y-2 text-center">
            <ShieldCheck className="w-8 h-8 text-rose mx-auto" />
            <h4 className="font-black text-sm text-tichi-text">Instant Activation</h4>
            <p className="text-xs text-tichi-muted font-semibold">Your protection activates sub-seconds after payment completion.</p>
          </div>

          <div className="card-antique-pink p-6 space-y-2 text-center">
            <Lock className="w-8 h-8 text-gold-dark mx-auto" />
            <h4 className="font-black text-sm text-tichi-text">Encrypted Location Data</h4>
            <p className="text-xs text-tichi-muted font-semibold">Zero data trading. Shared strictly during active emergencies.</p>
          </div>

          <div className="card-antique-pink p-6 space-y-2 text-center">
            <Award className="w-8 h-8 text-rose mx-auto" />
            <h4 className="font-black text-sm text-tichi-text">365-Day Guarantee</h4>
            <p className="text-xs text-tichi-muted font-semibold">Full 1-year coverage with 24/7 HQ command backup.</p>
          </div>
        </div>

      </section>
    </div>
  );
}
