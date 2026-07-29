'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, VolumeX, Volume2, Radio, Zap } from 'lucide-react';
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
      navigator.vibrate([80, 50, 80]);
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
    }, 40);
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
      navigator.vibrate([300, 100, 300, 100, 400]);
    }
    const success = await triggerSos(isSilent, latitude || 18.5204, longitude || 73.8567);
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

  const circumference = 2 * Math.PI * 92;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center my-6 relative select-none">
      
      {/* OUTER 3D RADAR PULSE WAVES */}
      <div className="relative flex items-center justify-center">
        
        {/* WAVE 1: AMBIENT OUTER GLOW */}
        <div
          className={`absolute rounded-full transition-all duration-500 ${
            holding
              ? 'bg-[#FF2A6D]/40 scale-125 blur-xl animate-pulse'
              : activeSession
              ? 'bg-[#FF2A6D]/30 scale-110 blur-xl animate-ping'
              : 'bg-rose/20 blur-2xl animate-pulse'
          }`}
          style={{ width: '260px', height: '260px' }}
        />

        {/* WAVE 2: STAGGERED HOLOGRAPHIC RINGS */}
        <div
          className={`absolute rounded-full border-2 border-rose/30 ${
            holding ? 'scale-110 border-[#FF2A6D]' : 'animate-ping'
          }`}
          style={{ width: '230px', height: '230px' }}
        />
        
        <div
          className={`absolute rounded-full border border-gold/40 ${
            holding ? 'scale-105 border-gold' : 'animate-pulse'
          }`}
          style={{ width: '200px', height: '200px' }}
        />

        {/* HIGH-PRECISION SVG COUNTDOWN TIMER RING */}
        <svg className="w-60 h-60 transform -rotate-90 pointer-events-none z-20">
          {/* TRACK BACKGROUND */}
          <circle
            cx="120"
            cy="120"
            r="92"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-rose/20"
          />
          {/* PROGRESS FILL */}
          <circle
            cx="120"
            cy="120"
            r="92"
            stroke="url(#sosGradient)"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-75 drop-shadow-[0_0_12px_rgba(255,42,109,0.8)]"
          />
          <defs>
            <linearGradient id="sosGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF2A6D" />
              <stop offset="50%" stopColor="#FF5C8A" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
        </svg>

        {/* MAIN 3D CRYSTAL SOS BUTTON CORE */}
        <button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          className={`absolute w-48 h-48 rounded-full flex flex-col items-center justify-center z-30 transition-all duration-300 transform active:scale-95 cursor-pointer shadow-2xl border-4 ${
            holding
              ? 'bg-gradient-to-b from-[#FF2A6D] via-[#FF5C8A] to-[#D90429] text-white border-white scale-105 shadow-coral-glow'
              : activeSession
              ? 'bg-gradient-to-b from-[#FF2A6D] to-[#D90429] text-white border-white animate-pulse shadow-coral-glow'
              : 'bg-gradient-to-br from-[#FF2A6D] via-[#FF5C8A] to-[#FF80A0] text-white border-white/80 hover:scale-105 shadow-[0_15px_35px_rgba(255,92,138,0.55)]'
          }`}
        >
          {/* INNER GLASS REFLECTION SHINE */}
          <div className="absolute inset-x-4 top-2 h-16 rounded-full bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

          {/* ICON & COUNTDOWN TEXT */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md shadow-inner ${
              holding ? 'animate-bounce bg-white text-[#FF2A6D]' : ''
            }`}>
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>

            <span className="text-3xl font-black tracking-widest drop-shadow-md">
              {holding ? `${countdown}s` : activeSession ? 'ACTIVE' : 'SOS'}
            </span>

            <span className="text-[10px] font-black uppercase tracking-widest text-white/95 bg-black/20 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
              {holding ? 'DISPATCHING...' : activeSession ? 'VIEW STATUS' : 'HOLD 3 SECONDS'}
            </span>
          </div>
        </button>

      </div>

      {/* FOOTER CONTROLS & SILENT MODE SWITCH */}
      <div className="mt-8 flex flex-col items-center space-y-3 z-30">
        <p className="text-xs font-bold text-tichi-muted text-center tracking-wide flex items-center space-x-1">
          <Radio className="w-3.5 h-3.5 text-rose animate-pulse" />
          <span>Press & hold for 3 seconds to broadcast live GPS location</span>
        </p>

        <button
          type="button"
          onClick={() => setIsSilent(!isSilent)}
          className={`flex items-center space-x-2 text-xs font-black px-5 py-2.5 rounded-full transition-all border-2 shadow-sm cursor-pointer ${
            isSilent
              ? 'bg-[#FF2A6D] text-white border-white shadow-coral-glow'
              : 'bg-white text-tichi-text border-[#FFCCE1] hover:border-rose'
          }`}
        >
          {isSilent ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-rose" />}
          <span>Silent Emergency Mode: {isSilent ? 'ON (Discreet Alert)' : 'OFF (Loud Siren)'}</span>
          <span className={`w-2 h-2 rounded-full ${isSilent ? 'bg-white animate-ping' : 'bg-tichi-success'}`} />
        </button>
      </div>

    </div>
  );
};
