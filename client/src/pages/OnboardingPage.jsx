import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Users, PhoneCall, ArrowRight } from 'lucide-react';

export const OnboardingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blush flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-blush-border rounded-container p-6 space-y-6 shadow-plum-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-plum text-rose mx-auto flex items-center justify-center shadow-md">
          <ShieldCheck className="w-9 h-9 fill-rose/20" />
        </div>

        <div>
          <h1 className="font-extrabold text-2xl text-plum">Welcome to Tichi Suraksha</h1>
          <p className="text-xs text-tichi-muted mt-1 leading-relaxed">
            Your personal safety network is ready. Follow these 3 simple steps to get 100% protected:
          </p>
        </div>

        <div className="space-y-3 text-left">
          {[
            { icon: MapPin, title: '1. Grant GPS Permission', desc: 'Allows instant location broadcasting during emergency SOS.' },
            { icon: Users, title: '2. Add 2+ Trusted Contacts', desc: 'Friends/family who receive live tracking links via SMS/Email.' },
            { icon: PhoneCall, title: '3. Test the SOS Button', desc: 'Try holding the SOS button for 3 seconds in test mode.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="p-3.5 rounded-xl bg-blush-subtle border border-blush-border flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-plum-50 text-plum shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-tichi-text">{item.title}</h3>
                  <p className="text-[11px] text-tichi-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-plum text-white font-extrabold py-3.5 rounded-card text-xs shadow hover:bg-plum-dark transition-all flex items-center justify-center space-x-2"
        >
          <span>CONTINUE TO DASHBOARD</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
