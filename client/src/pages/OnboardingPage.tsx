import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, User, Users, MapPin, Bell, AlertTriangle, Play } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const steps = [
    { title: 'Create Profile', icon: User, desc: 'Verify your contact information' },
    { title: 'Add Trusted Contacts', icon: Users, desc: 'Connect 3 emergency relatives or friends' },
    { title: 'Verify Contacts', icon: CheckCircle, desc: 'Confirm contact numbers & emails' },
    { title: 'Enable Location', icon: MapPin, desc: 'Grant high-accuracy GPS permissions' },
    { title: 'Enable Notifications', icon: Bell, desc: 'Allow push safety alerts' },
    { title: 'Configure Quick SOS', icon: AlertTriangle, desc: 'Set standard or silent SOS triggers' },
    { title: 'Test Safety Setup', icon: Play, desc: 'Run a 3-second drill test' },
  ];

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      navigate('/');
    }
  };

  const CurrentIcon = steps[step - 1].icon;

  return (
    <div className="min-h-screen bg-blush flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-blush-card border border-blush-border rounded-container p-6 space-y-6 shadow-plum-subtle text-center">
        <div className="flex items-center justify-between text-xs font-bold text-plum mb-2">
          <span>STEP {step} OF 7</span>
          <span>{Math.round((step / 7) * 100)}% COMPLETE</span>
        </div>

        <div className="w-full bg-plum-50 h-2 rounded-full overflow-hidden">
          <div
            className="bg-plum h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          ></div>
        </div>

        <div className="w-16 h-16 rounded-full bg-rose/30 text-plum mx-auto flex items-center justify-center border border-rose/40">
          <CurrentIcon className="w-8 h-8" />
        </div>

        <div>
          <h2 className="font-extrabold text-xl text-plum">{steps[step - 1].title}</h2>
          <p className="text-xs text-tichi-muted mt-1">{steps[step - 1].desc}</p>
        </div>

        <div className="bg-blush p-4 rounded-card border border-blush-border text-xs text-tichi-text font-medium text-left space-y-2">
          <p className="flex items-center text-tichi-success font-bold">
            <CheckCircle className="w-4 h-4 mr-1.5" /> High-precision safety configuration
          </p>
          <p className="text-tichi-muted">
            {step === 1 && 'Your profile information is encrypted and visible only during active SOS sessions.'}
            {step === 2 && 'Your trusted contacts receive instant SMTP emails and live tracking links during emergencies.'}
            {step === 3 && 'Contacts have been flagged as verified and ready to receive emergency location alerts.'}
            {step === 4 && 'GPS tracking provides ±10m location accuracy updated in real-time during active sessions.'}
            {step === 5 && 'Critical alerts bypass silent mode to ensure immediate emergency awareness.'}
            {step === 6 && 'Choose between standard loud alarm or silent covert emergency SOS.'}
            {step === 7 && 'Your safety setup drill is complete and 100% operational.'}
          </p>
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-plum text-white font-bold py-3 rounded-card text-xs shadow hover:bg-plum-dark transition-colors flex items-center justify-center space-x-2"
        >
          <span>{step === 7 ? 'COMPLETE SETUP & GO HOME' : 'CONTINUE SETUP'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
