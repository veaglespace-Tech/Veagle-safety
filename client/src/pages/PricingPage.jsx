import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PublicNavbar } from '../components/layout/PublicNavbar.jsx';
import { fetchPlans, initiatePayUCheckout } from '../store/slices/planSlice.js';
import { Sparkles, Shield, Check, ArrowRight, Zap, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PricingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plans, isLoading, paymentData } = useSelector((state) => state.plan);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleSelectPlan = (plan) => {
    if (!token) {
      navigate('/auth?mode=register');
    } else {
      dispatch(initiatePayUCheckout({ planId: plan.id, amount: plan.totalPrice }));
    }
  };

  return (
    <div className="min-h-screen bg-plum-dark text-white font-sans relative overflow-hidden">
      <PublicNavbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gold/20 text-gold border border-gold/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT PRICING & PROTECTION PLANS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            Invest in Your Safety & Peace of Mind
          </h1>
          <p className="text-rose-muted text-base font-medium">
            Select a plan to complete formalities. All plans include 24/7 Live Emergency SOS, 5 Trusted Contacts, and Encrypted Location Sharing.
          </p>
        </div>

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const isFeatured = index === 0;
            return (
              <div
                key={plan.id || index}
                className={`glass-card-dark rounded-3xl p-8 border space-y-6 relative flex flex-col justify-between transition-all hover:scale-105 ${
                  isFeatured ? 'border-rose shadow-coral-glow' : 'border-gold/40'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 right-6 bg-gradient-to-r from-rose to-plum-light text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                    MOST POPULAR
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isFeatured ? 'bg-rose/20 text-rose border border-rose/40' : 'bg-gold/20 text-gold border border-gold/40'}`}>
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                      <p className="text-xs text-rose-muted font-bold">{plan.durationDays} Days Duration</p>
                    </div>
                  </div>

                  <p className="text-xs text-tichi-faint leading-relaxed">{plan.description}</p>

                  <div className="pt-4 border-t border-rose/10 space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl font-black text-white">₹{plan.totalPrice}</span>
                      <span className="text-xs text-rose-muted font-medium">/ {plan.durationDays} Days</span>
                    </div>
                    <p className="text-[10px] text-gold font-mono">
                      (Base Price: ₹{plan.basePrice} + {plan.gstPercentage}% GST)
                    </p>
                  </div>

                  {/* FEATURE CHECKLIST */}
                  <ul className="space-y-2.5 pt-2 text-xs text-white">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-rose shrink-0" />
                      <span>3-Second Emergency SOS Broadcast</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-rose shrink-0" />
                      <span>Up to 5 Trusted Emergency Contacts</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-rose shrink-0" />
                      <span>Live GPS Track Sharing & Map View</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-rose shrink-0" />
                      <span>Safety Check-in Timer Escalation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-rose shrink-0" />
                      <span>Loud Alarm Siren & Simulated Fake Call</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                    isFeatured
                      ? 'bg-gradient-to-r from-rose via-plum-light to-rose text-white shadow-coral-glow hover:brightness-110'
                      : 'bg-gradient-to-r from-gold via-gold-dark to-gold text-plum shadow-gold-glow hover:brightness-110'
                  }`}
                >
                  <span>{token ? 'PURCHASE WITH PAYU' : 'REGISTER & GET PROTECTED'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
