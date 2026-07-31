'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PublicNavbar } from '../../components/layout/PublicNavbar.js';
import { Footer } from '../../components/layout/Footer.js';
import { fetchPlans } from '../../redux/slices/planSlice.js';
import { Logo3DFlip } from '../../components/ui/Logo3DFlip.js';
import { 
  ShieldCheck, ArrowRight, Zap, Sparkles, 
  Radio, MapPin, Users, Volume2, Headphones, Lock, CheckCircle2, Shield
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatedHeading } from '../../components/common/AnimatedHeading.jsx';

export const dynamic = 'force-dynamic';

export default function PlatformPricingPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { plans = [] } = useSelector((state) => state.plan || {});
  const { token, registrationToken, user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const activePlan = (plans.length > 0 ? plans[0] : null) || {
    id: 'plan_yearly_24',
    name: 'Sakhi Suraksha 365 Protection Plan',
    description: 'Complete 365-Day 24/7 Unlimited Emergency SOS, Live GPS Tracking & Guardian Network.',
    basePrice: 24,
    durationDays: 365,
  };

  const handleSelectPlan = (planId) => {
    const hasRegToken = registrationToken || (typeof window !== 'undefined' && localStorage.getItem('tichi_reg_token'));
    if (!token && !hasRegToken && !user) {
      router.push('/auth?mode=register');
      return;
    }
    router.push(`/checkout?planId=${planId}`);
  };

  const features = [
    { icon: Radio, text: 'Instant 3-Second Hold Emergency SOS' },
    { icon: Users, text: '5 Guardian Emergency Alerts (SMS & Push)' },
    { icon: MapPin, text: 'Encrypted Real-Time Live GPS Map Sharing' },
    { icon: Volume2, text: 'High-Decibel Siren Alarm & Siren Control' },
    { icon: ShieldCheck, text: 'Direct 112 & 1091 Helpline Access' },
    { icon: Headphones, text: '24/7 Active Safety Command Support' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-[#2A0826] font-sans relative overflow-hidden flex flex-col">
      <PublicNavbar />

      {/* BACKGROUND AMBIENT GLOW MESHES */}
      <div className="absolute w-[800px] h-[800px] rounded-full bg-[#FF5C8A]/12 blur-[170px] top-[-140px] left-[-240px] pointer-events-none animate-pulse" />
      <div className="absolute w-[750px] h-[750px] rounded-full bg-[#FFCCE1]/25 blur-[160px] bottom-[60px] right-[-220px] pointer-events-none animate-pulse" />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 space-y-8 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 max-w-xl mx-auto">
          
          {/* ROTATING EMBLEM LOGO */}
          <div className="relative flex items-center justify-center mb-1">
            <div className="absolute -inset-3 rounded-2xl bg-[#FF5C8A]/20 animate-pulse blur-lg" />
            <div className="relative z-10 p-3 rounded-2xl bg-white border-1.5 border-[#FFCCE1] shadow-md flex items-center justify-center">
              <Logo3DFlip size={48} />
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 bg-white/90 border border-[#FFCCE1] px-3.5 py-1 rounded-full text-[10px] font-black text-[#FF2A6D] uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3 h-3 text-[#FF5C8A] animate-pulse" />
            <span>365-Day Women Safety Protection</span>
          </div>

          <AnimatedHeading as="h1" variant="shimmer" className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            <span className="heading-gradient-hero">Women Safety </span>
            <span className="heading-highlight-pill">Protection Plan</span>
          </AnimatedHeading>
        </div>

        {/* SLEEK COMPACT ANTIQUE PLAN CARD */}
        <div className="max-w-lg mx-auto w-full">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-[#FFCCE1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_20px_60px_rgba(255,92,138,0.18)] hover:shadow-[0_25px_70px_rgba(255,42,109,0.25)] transition-all duration-500 relative overflow-hidden">
            
            {/* TOP DECORATIVE ACCENT STRIP */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F]" />

            {/* PLAN TITLE & HEADER WITH INTEGRATED ROYAL BADGE */}
            <div className="flex items-start space-x-3.5 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFF0F3] to-[#FFCCE1] border border-[#FFCCE1] text-[#FF2A6D] flex items-center justify-center shrink-0 shadow-sm mt-1">
                <ShieldCheck className="w-7 h-7 text-[#FF2A6D]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-black text-[#2A0826] tracking-tight">
                  {activePlan.name}
                </h2>
                <p className="text-xs text-[#684E67] font-bold">
                  {activePlan.description}
                </p>
              </div>
            </div>

            {/* SLEEK PRICE DISPLAY BOX */}
            <div className="bg-[#FFF0F3]/90 p-4 rounded-2xl border border-[#FFCCE1] flex items-center justify-between shadow-inner">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#2A0826] via-[#FF2A6D] to-[#FF5C8A] bg-clip-text text-transparent">
                  ₹{activePlan.basePrice}
                </span>
                <span className="text-xs text-[#684E67] font-extrabold">/ Year (Just ₹2/month)</span>
              </div>

              {/* SIMPLE GST BADGE */}
              <div className="bg-white border border-[#FFCCE1] px-3 py-1 rounded-full text-[10px] font-black text-[#FF2A6D] shadow-sm">
                + 18% GST
              </div>
            </div>

            {/* INCLUDED FEATURES CHECKLIST */}
            <div className="space-y-3 pt-1">
              <span className="text-[10px] font-black text-[#FF2A6D] uppercase tracking-wider block">
                Includes All 6 Safety Features:
              </span>

              <div className="space-y-2.5">
                {features.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center space-x-3 text-xs font-extrabold text-[#2A0826]">
                      <div className="w-6 h-6 rounded-lg bg-[#FFF0F3] text-[#FF2A6D] border border-[#FFCCE1] flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SLEEK MODERN FLOATING CTA BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSelectPlan(activePlan.id)}
                className="w-full bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-wider shadow-[0_8px_25px_rgba(255,42,109,0.35)] hover:shadow-[0_12px_35px_rgba(255,42,109,0.50)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer border border-white/20"
              >
                <Zap className="w-4 h-4 text-white animate-pulse" />
                <span>ACTIVATE PROTECTION NOW</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* SECURITY TRUST STRIP */}
            <div className="flex items-center justify-around pt-2 border-t border-[#FFCCE1] text-[10px] font-black text-[#684E67]">
              <div className="flex items-center space-x-1">
                <Lock className="w-3 h-3 text-[#00C853]" />
                <span>256-Bit SSL Secured</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-[#FF5C8A]" />
                <span>Govt 112 Compatible</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-[#FF2A6D]" />
                <span>24/7 Live Support</span>
              </div>
            </div>

          </div>
        </div>

      </section>

      <Footer />
    </div>
  );
}
