'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PublicNavbar } from '../../components/layout/PublicNavbar.js';
import { fetchPlans } from '../../redux/slices/planSlice.js';
import { Shield, Check, ArrowRight, Award, Zap } from 'lucide-react';
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

  const activePlans = plans.length > 0 ? plans : [
    {
      id: 'plan_yearly_24',
      name: 'Sakhi Suraksha 365 Yearly Plan',
      description: 'Complete 365-Day 24/7 Unlimited SOS Emergency Broadcast, Live GPS Map Sharing, and Guardian Network',
      basePrice: 24,
      durationDays: 365,
    }
  ];

  const handleSelectPlan = (planId) => {
    const hasRegToken = registrationToken || (typeof window !== 'undefined' && localStorage.getItem('tichi_reg_token'));
    if (!token && !hasRegToken && !user) {
      router.push('/auth?mode=register');
      return;
    }
    router.push(`/checkout?planId=${planId}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden flex flex-col">
      <PublicNavbar />

      {/* BACKGROUND AMBIENT GLOW MESHES */}
      <div className="absolute w-[750px] h-[750px] rounded-full bg-rose/15 blur-[160px] top-[-120px] left-[-220px] pointer-events-none" />
      <div className="absolute w-[750px] h-[750px] rounded-full bg-gold/15 blur-[160px] bottom-[80px] right-[-220px] pointer-events-none" />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-12 relative z-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white text-rose border border-rose/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <Zap className="w-4 h-4 text-rose" />
            <span>Select Protection Plan</span>
          </div>
          <AnimatedHeading as="h1" variant="shimmer" className="text-3xl sm:text-5xl font-black tracking-tight">
            Women Safety Protection Plans
          </AnimatedHeading>
          <p className="text-tichi-muted text-sm sm:text-base font-semibold leading-relaxed">
            Choose your safety plan to activate 24/7 Live Emergency SOS and Guardian Tracking.
          </p>
        </div>

        {/* PLAN CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {activePlans.map((plan) => (
            <div
              key={plan.id}
              className="card-antique-pink p-8 border-2 border-rose shadow-coral-glow flex flex-col justify-between space-y-6 relative overflow-hidden hover:scale-[1.02] transition-transform duration-300"
            >
              {/* BADGE */}
              <div className="absolute top-0 right-0 bg-rose text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-wider flex items-center space-x-1">
                <Award className="w-3.5 h-3.5" />
                <span>{plan.durationDays || 365} DAYS COVERAGE</span>
              </div>

              <div className="space-y-4 pt-2">
                <div className="w-14 h-14 rounded-2xl bg-rose/15 text-rose border-2 border-rose/30 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-rose" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-tichi-text">{plan.name}</h3>
                  <p className="text-xs text-tichi-muted font-semibold mt-1 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* PRICE DISPLAY - BASE PRICE ONLY (WITHOUT GST) */}
                <div className="bg-blush-subtle p-4 rounded-xl border border-[#FFCCE1] space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-black text-tichi-text">₹{plan.basePrice}</span>
                    <span className="text-xs text-tichi-muted font-bold">/ {plan.durationDays >= 365 ? 'Year' : 'Period'}</span>
                  </div>
                  <span className="text-[11px] text-tichi-muted font-bold block">
                    (Base Price • Taxes calculated at checkout)
                  </span>
                </div>

                {/* FEATURES CHECKLIST */}
                <div className="space-y-2.5 pt-2">
                  {[
                    'Instant 3-Second Hold Emergency SOS',
                    '5 Guardian Emergency Contacts Alert',
                    'Encrypted Live GPS Tracking',
                    'Siren Alarm & Fake Emergency Call',
                    '24/7 Active Command Support',
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 text-xs font-bold text-tichi-text">
                      <Check className="w-4 h-4 text-rose shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button
                type="button"
                onClick={() => handleSelectPlan(plan.id)}
                className="w-full btn-baby-pink py-3.5 text-xs uppercase font-black tracking-wider shadow-coral-glow flex items-center justify-center space-x-2 mt-4 cursor-pointer"
              >
                <span>SELECT PLAN & CONTINUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}
