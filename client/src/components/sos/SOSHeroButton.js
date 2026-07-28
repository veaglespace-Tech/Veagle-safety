'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useSOSStore } from '../../redux/useSOSStore.js';
import { useLocationStore } from '../../redux/useLocationStore.js';
import { useRouter } from 'next/navigation';

export const SOSHeroButton = ({ onTriggerComplete }) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [isSilent, setIsSilent] = useState(false);
  const progressIntervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const { triggerSos, activeSession } = useSOSStore();
  const { latitude, longitude } = useLocationStore();
  const router = useRouter();

  const HOLD_DURATION = 3000;

  const startHold = () => {
    if (activeSession) {
      router.push('/active-sos');
      return;
    }

    setHolding(true);
    setProgress(0);
    setCountdown(3);
    startTimeRef.current = Date.now();

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      const remainingSecs = Math.max(Math.ceil((HOLD_DURATION - elapsed) / 1000), 1);

      setProgress(pct);
      setCountdown(remainingSecs);

      if (elapsed >= HOLD_DURATION) {
        clearInterval(progressIntervalRef.current);
        handleTriggered();
      }
    }, 50);
  };

  const endHold = () => {
    if (!holding) return;
    setHolding(false);
    setProgress(0);
    setCountdown(3);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const handleTriggered = async () => {
    setHolding(false);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 300]);
    }
    const success = await triggerSos(isSilent, latitude || 28.6139, longitude || 77.2090);
    if (success) {
      if (onTriggerComplete) onTriggerComplete();
      router.push('/active-sos');
    }
  };

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center my-6">
      <div className="relative flex items-center justify-center">
        <div
          className={`absolute inset-0 rounded-full bg-tichi-emergency/15 ${
            holding ? 'animate-none scale-125 bg-tichi-emergency/30' : 'animate-radar'
          }`}
          style={{ width: '220px', height: '220px', margin: '-10px' }}
        ></div>

        <svg className="w-52 h-52 transform -rotate-90 pointer-events-none z-10">
          <circle
            cx="104"
            cy="104"
            r="80"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-rose/40"
          />
          <circle
            cx="104"
            cy="104"
            r="80"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-tichi-emergency transition-all duration-75"
          />
        </svg>

        <button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          className={`absolute w-44 h-44 rounded-full flex flex-col items-center justify-center shadow-sos-glow z-20 transition-transform active:scale-95 select-none cursor-pointer ${
            holding
              ? 'bg-tichi-emergency text-white shadow-sos-holding scale-105'
              : activeSession
              ? 'bg-tichi-emergency text-white animate-pulse'
              : 'bg-tichi-emergency text-white hover:brightness-105'
          }`}
        >
          <AlertTriangle className={`w-10 h-10 mb-1 ${holding ? 'animate-bounce' : ''}`} />
          <span className="text-3xl font-extrabold tracking-wider">
            {holding ? `${countdown}s` : activeSession ? 'ACTIVE' : 'SOS'}
          </span>
          <span className="text-[11px] font-semibold text-white/90 uppercase tracking-widest mt-1">
            {holding ? 'KEEP HOLDING' : activeSession ? 'VIEW STATUS' : 'HOLD 3 SECONDS'}
          </span>
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center space-y-2">
        <p className="text-xs text-rose-muted font-medium text-center">
          Press & hold for 3 seconds to instantly alert contacts
        </p>

        <button
          onClick={() => setIsSilent(!isSilent)}
          className={`flex items-center space-x-2 text-xs font-semibold px-4 py-1.5 rounded-full transition-all border ${
            isSilent
              ? 'bg-rose text-white border-rose shadow-coral-glow'
              : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20'
          }`}
        >
          <span>Silent SOS Mode: {isSilent ? 'ON (No Loud Siren)' : 'OFF'}</span>
        </button>
      </div>
    </div>
  );
};
