import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PublicNavbar } from '../components/layout/PublicNavbar.jsx';
import { fetchPlans, initiatePayUCheckout } from '../store/slices/planSlice.js';
import { Sparkles, Shield, Check, ArrowRight, Zap, Award, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PricingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plans, isLoading } = useSelector((state) => state.plan);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

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
      navigate('/auth?mode=register');
    } else {
      dispatch(initiatePayUCheckout({ planId: yearlyPlan.id, amount: yearlyPlan.totalPrice }));
    }
  };

  return (
    <div className="min-h-screen bg-plum-dark text-white font-sans relative overflow-hidden">
      <PublicNavbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gold/20 text-gold border border-gold/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-gold animate-pulse" />
            <span>SINGLE UNIFIED YEARLY PROTECTION PLAN</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            Complete 365-Day Safety Protection
          </h1>
          <p className="text-rose-muted text-base font-medium">
            Just ₹24 per year. Complete your plan formalities to unlock 24/7 Live Emergency SOS, 5 Trusted Contacts, and Encrypted GPS Location Sharing for a full year.
          </p>
        </div>

        {/* SINGLE YEARLY PLAN CARD */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-card-dark rounded-3xl p-8 sm:p-10 border-2 border-rose shadow-coral-glow space-y-8 relative overflow-hidden">
            
            {/* YEARLY BADGE */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-rose to-plum-light text-white text-xs font-black px-6 py-2 rounded-bl-2xl uppercase tracking-widest shadow-md flex items-center space-x-1">
              <Award className="w-4 h-4" />
              <span>365 DAYS UNLIMITED</span>
            </div>

            {/* HEADER */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-rose/20 text-rose border-2 border-rose/40 flex items-center justify-center shadow-coral-glow">
                  <Shield className="w-8 h-8 text-rose" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{yearlyPlan.name}</h2>
                  <p className="text-xs text-rose-muted font-bold">1 Full Year (365 Days) Coverage</p>
                </div>
              </div>

              <p className="text-xs text-tichi-faint leading-relaxed pt-2">
                {yearlyPlan.description}
              </p>
            </div>

            {/* PRICING BREAKDOWN */}
            <div className="bg-plum-dark/90 p-6 rounded-2xl border border-rose/30 space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-5xl font-black text-white">₹{yearlyPlan.basePrice}</span>
                <span className="text-sm text-rose-muted font-bold">/ Year (₹2/Month)</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gold font-mono border-t border-rose/20 pt-3">
                <span>Base Yearly Fee: ₹{yearlyPlan.basePrice}</span>
                <span>GST (18%): ₹{(yearlyPlan.basePrice * 0.18).toFixed(2)}</span>
                <span className="font-bold text-white">Total: ₹{yearlyPlan.totalPrice}</span>
              </div>
            </div>

            {/* FULL FEATURE CHECKLIST */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-gold uppercase tracking-wider">Included Safety Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white">
                <div className="flex items-center space-x-2.5 bg-plum-dark/50 p-3 rounded-xl border border-rose/20">
                  <Check className="w-4 h-4 text-rose shrink-0" />
                  <span>3-Second Hold Emergency SOS Trigger</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-plum-dark/50 p-3 rounded-xl border border-rose/20">
                  <Check className="w-4 h-4 text-rose shrink-0" />
                  <span>5 Trusted Emergency Contacts Network</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-plum-dark/50 p-3 rounded-xl border border-rose/20">
                  <Check className="w-4 h-4 text-rose shrink-0" />
                  <span>Real-Time Encrypted Live GPS Tracking</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-plum-dark/50 p-3 rounded-xl border border-rose/20">
                  <Check className="w-4 h-4 text-rose shrink-0" />
                  <span>Safety Check-in Timer & Escalation</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-plum-dark/50 p-3 rounded-xl border border-rose/20">
                  <Check className="w-4 h-4 text-rose shrink-0" />
                  <span>Piercing Loud Siren Panic Alarm</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-plum-dark/50 p-3 rounded-xl border border-rose/20">
                  <Check className="w-4 h-4 text-rose shrink-0" />
                  <span>Fake Simulated Emergency Call</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={handleSelectPlan}
              className="w-full bg-gradient-to-r from-rose via-plum-light to-rose text-white font-black py-4 rounded-xl text-sm uppercase tracking-wider shadow-coral-glow hover:brightness-110 active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <span>{token ? 'PURCHASE YEARLY PROTECTION WITH PAYU' : 'REGISTER & COMPLETE PLAN FORMALITIES'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

          </div>
        </div>
      </section>
    </div>
  );
};
