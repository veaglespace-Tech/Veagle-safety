'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PublicNavbar } from '../../components/layout/PublicNavbar.js';
import { Footer } from '../../components/layout/Footer.js';
import { fetchPlans } from '../../redux/slices/planSlice.js';
import { Logo3DFlip } from '../../components/ui/Logo3DFlip.js';
import { 
  Shield, Check, ArrowRight, Award, Zap, Crown, Sparkles, 
  Radio, MapPin, Users, Volume2, ShieldCheck, Headphones, Lock, CheckCircle2
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
    name: 'Sakhi Suraksha 365 Yearly Protection Plan',
    description: 'Complete 365-Day 24/7 Unlimited SOS Emergency Broadcast, Live GPS Map Sharing, 5 Trusted Contacts Network, and HQ Command Dispatch.',
    basePrice: 24,
    totalPrice: 28.32,
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
    {
      icon: Radio,
      title: 'Instant 3-Sec SOS Trigger',
      desc: 'Press & hold SOS button for 3 seconds to launch immediate emergency alert.',
    },
    {
      icon: Users,
      title: '5 Guardian Alert Broadcast',
      desc: 'Automatic SMS & Web Push notifications dispatched to 5 trusted contacts.',
    },
    {
      icon: MapPin,
      title: 'Encrypted Live GPS Tracking',
      desc: 'Real-time location map updates shared securely during active emergencies.',
    },
    {
      icon: Volume2,
      title: 'Siren & Siren Sound Control',
      desc: 'High-decibel audible device alarm trigger to deter perpetrators on the spot.',
    },
    {
      icon: ShieldCheck,
      title: 'Direct Helpline Integration',
      desc: 'Instant 1-tap call access to 112 (National Emergency) & 1091 (Women Helpline).',
    },
    {
      icon: Headphones,
      title: '24/7 Active Command Support',
      desc: 'Continuous technical and safety system assistance 365 days a year.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-[#2A0826] font-sans relative overflow-hidden flex flex-col">
      <PublicNavbar />

      {/* BACKGROUND ANIMATED AMBIENT GLOW MESHES */}
      <div className="absolute w-[850px] h-[850px] rounded-full bg-[#FF5C8A]/15 blur-[180px] top-[-150px] left-[-260px] pointer-events-none animate-pulse" />
      <div className="absolute w-[800px] h-[800px] rounded-full bg-[#FFCCE1]/30 blur-[170px] bottom-[40px] right-[-240px] pointer-events-none animate-pulse" />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 space-y-12 relative z-10">
        
        {/* TOP HEADER SECTION */}
        <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-2xl mx-auto">
          
          {/* ROTATING EMBLEM LOGO */}
          <div className="relative flex items-center justify-center mb-1">
            <div className="absolute -inset-4 rounded-3xl bg-[#FF5C8A]/25 animate-pulse blur-xl" />
            <div className="relative z-10 p-3.5 rounded-2xl bg-white border-1.5 border-[#FFCCE1] shadow-lg flex items-center justify-center">
              <Logo3DFlip size={58} />
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 bg-white/90 border border-[#FFCCE1] px-4 py-1.5 rounded-full text-[11px] font-black text-[#FF2A6D] uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5C8A] animate-pulse" />
            <span>365-Day Complete Women Safety Coverage</span>
          </div>

          <AnimatedHeading as="h1" variant="shimmer" className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Official Protection Plan
          </AnimatedHeading>

          <p className="text-[#684E67] text-sm sm:text-base font-bold leading-relaxed max-w-xl">
            Activate instant 3-second SOS alerts, live GPS map sharing, and 5-guardian alert dispatch for you and your loved ones.
          </p>
        </div>

        {/* ULTRA-PREMIUM ANTIQUE SINGLE PLAN CARD */}
        <div className="max-w-2xl mx-auto w-full">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-[#FFCCE1] rounded-3xl p-6 sm:p-10 space-y-8 shadow-[0_24px_70px_rgba(255,92,138,0.22)] hover:shadow-[0_30px_80px_rgba(255,42,109,0.30)] transition-all duration-500 relative overflow-hidden">
            
            {/* TOP DECORATIVE 3D ACCENT STRIP */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F]" />

            {/* FLOATING TOP CORNER BADGE */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center space-x-1.5 border border-white/30">
              <Crown className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
              <span>365 DAYS COVERAGE</span>
            </div>

            {/* PLAN TITLE & ICON */}
            <div className="flex items-start space-x-4 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFF0F3] via-[#FFE6EE] to-[#FFCCE1] border-1.5 border-[#FFCCE1] text-[#FF2A6D] flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-9 h-9 text-[#FF2A6D] drop-shadow-sm" />
              </div>
              <div className="space-y-1 pr-16 sm:pr-24">
                <h2 className="text-xl sm:text-2xl font-black text-[#2A0826] tracking-tight leading-snug">
                  {activePlan.name}
                </h2>
                <p className="text-xs text-[#684E67] font-bold leading-relaxed">
                  {activePlan.description}
                </p>
              </div>
            </div>

            {/* HERO PRICE DISPLAY BOX */}
            <div className="bg-[#FFF0F3]/90 p-6 rounded-2xl border-1.5 border-[#FFCCE1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-inner">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-[#2A0826] via-[#FF2A6D] to-[#FF5C8A] bg-clip-text text-transparent">
                    ₹{activePlan.basePrice}
                  </span>
                  <span className="text-sm sm:text-base text-[#684E67] font-extrabold">/ Year</span>
                </div>
                <p className="text-xs text-[#684E67] font-extrabold mt-1">
                  Just <span className="text-[#FF2A6D] font-black underline">₹2 per Month</span> • Unbeatable Safety Value
                </p>
              </div>

              <div className="inline-flex items-center space-x-1.5 bg-white border border-[#FFCCE1] px-3.5 py-1.5 rounded-xl text-[11px] font-black text-[#FF2A6D] shadow-sm self-start sm:self-auto">
                <CheckCircle2 className="w-4 h-4 text-[#00C853]" />
                <span>Total ₹{activePlan.totalPrice || '28.32'} (Incl. 18% GST)</span>
              </div>
            </div>

            {/* INCLUDED MODULES GRID */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#FF2A6D] uppercase tracking-wider flex items-center space-x-2">
                <Award className="w-4 h-4 text-[#FF5C8A]" />
                <span>6 Core Women Safety Modules Included</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {features.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 bg-[#FFF0F3]/50 hover:bg-white p-3.5 rounded-2xl border border-[#FFCCE1] hover:border-[#FF5C8A] transition-all duration-300 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#FFF0F3] text-[#FF2A6D] border border-[#FFCCE1] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-[#2A0826] block">{item.title}</span>
                        <span className="text-[11px] text-[#684E67] font-bold block leading-normal">{item.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3D POP-UP ACTION BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSelectPlan(activePlan.id)}
                className="w-full btn-3d-rose-pop py-4.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center space-x-3 cursor-pointer shadow-lg"
              >
                <Zap className="w-4 h-4 text-white animate-pulse" />
                <span>ACTIVATE 365-DAY PROTECTION NOW</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* SECURITY & GUARANTEE FOOTNOTE */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#FFCCE1] text-center text-[10px] font-black text-[#684E67]">
              <div className="flex items-center justify-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-[#00C853]" />
                <span>256-Bit SSL Secured</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-[#FF2A6D]" />
                <span>Instant Activation</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF5C8A]" />
                <span>Govt 112 Compatible</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF2A6D]" />
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
