'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, VolumeX, Volume2, Radio, Sparkles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { startEmergencySos } from '../../redux/slices/sosSlice.js';
import { useRouter } from 'next/navigation';

export const SOSHeroButton = ({ onTriggerComplete }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [isSilent, setIsSilent] = useState(false);
  const progressIntervalRef = useRef(null);
  const startTimeRef = useRef(0);

  const { activeSession } = useSelector((state) => state?.sos || {});
  const { latitude, longitude } = useSelector((state) => state?.location || {});

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
    try {
      await dispatch(
        startEmergencySos({
          isSilent,
          latitude: latitude || 18.5204,
          longitude: longitude || 73.8567,
          emergencyMessage: isSilent ? 'Discreet Emergency SOS Triggered' : 'EMERGENCY SOS! I NEED HELP IMMEDIATELY!',
        })
      ).unwrap();

      if (onTriggerComplete) onTriggerComplete();
      router.push('/active-sos');
    } catch (e) {
      console.error('[SOS Trigger Error]:', e);
    }
  };

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const circumference = 2 * Math.PI * 120; // Radius = 120px
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center my-6 relative select-none">
      
      {/* 3D EMBLEM CONTAINER */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        
        {/* RADAR AURA WAVES */}
        <div
          className={`absolute inset-4 rounded-full transition-all duration-500 ${
            holding
              ? 'bg-[#FF2A6D]/30 scale-110 blur-xl animate-pulse'
              : activeSession
              ? 'bg-[#FF2A6D]/20 blur-xl animate-ping'
              : 'bg-[#FF5C8A]/15 blur-2xl'
          }`}
        />

        {/* ELEGANT OUTER GOLD ACCENT RING */}
        <div className="absolute w-[290px] h-[290px] rounded-full border border-gold/40 shadow-xs pointer-events-none" />

        {/* HIGH-PRECISION SVG TIMER RING */}
        <svg className="w-72 h-72 transform -rotate-90 pointer-events-none z-10">
          <circle
            cx="144"
            cy="144"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-[#FFCCE1]/40"
          />
          <circle
            cx="144"
            cy="144"
            r="120"
            stroke="url(#sosLuxuryGradient)"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-75 drop-shadow-[0_0_12px_rgba(255,42,109,0.9)]"
          />
          <defs>
            <linearGradient id="sosLuxuryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF2A6D" />
              <stop offset="50%" stopColor="#FF5C8A" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>
        </svg>

        {/* MAIN 3D SOS BUTTON CORE */}
        <button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          className={`absolute w-52 h-52 rounded-full flex flex-col items-center justify-center z-30 transition-all duration-300 transform active:scale-95 cursor-pointer shadow-2xl border-4 ${
            holding
              ? 'bg-gradient-to-b from-[#FF2A6D] via-[#FF5C8A] to-[#D90429] text-white border-white scale-105 shadow-coral-glow'
              : activeSession
              ? 'bg-gradient-to-b from-[#FF2A6D] to-[#D90429] text-white border-white animate-pulse shadow-coral-glow'
              : 'bg-gradient-to-br from-[#FF2A6D] via-[#FF5C8A] to-[#FF80A0] text-white border-white hover:scale-105 shadow-[0_15px_35px_rgba(255,92,138,0.4)]'
          }`}
        >
          <div className="relative z-10 flex flex-col items-center justify-center space-y-1 text-center">
            
            <ShieldAlert className={`w-9 h-9 text-white drop-shadow-md mb-0.5 ${
              holding ? 'animate-bounce' : ''
            }`} />

            <span className="text-3xl font-black tracking-widest text-white drop-shadow-md">
              {holding ? `${countdown}s` : activeSession ? 'ACTIVE' : 'SOS'}
            </span>

            <span className="text-[10px] font-black uppercase tracking-widest text-white/95 bg-black/25 px-3.5 py-1 rounded-full border border-white/20 backdrop-blur-sm shadow-sm">
              {holding ? 'DISPATCHING...' : activeSession ? 'VIEW STATUS' : 'HOLD 3 SECONDS'}
            </span>

          </div>
        </button>

      </div>

      {/* FOOTER SILENT MODE SWITCH */}
      <div className="mt-4 flex flex-col items-center space-y-3 z-30">
        <p className="text-xs font-bold text-[#684E67] text-center tracking-wide flex items-center space-x-1.5">
          <Radio className="w-4 h-4 text-[#FF2A6D] animate-pulse" />
          <span>Press & hold for 3 seconds to broadcast live GPS location</span>
        </p>

        <button
          type="button"
          onClick={() => setIsSilent(!isSilent)}
          className={`flex items-center space-x-2 text-xs font-black px-5 py-2.5 rounded-full transition-all border-2 shadow-xs cursor-pointer ${
            isSilent
              ? 'bg-[#FF2A6D] text-white border-white shadow-coral-glow'
              : 'bg-white text-[#2A0826] border-[#FFCCE1] hover:border-[#FF2A6D]'
          }`}
        >
          {isSilent ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-[#FF2A6D]" />}
          <span>Silent Emergency Mode: {isSilent ? 'ON (Discreet Alert)' : 'OFF (Loud Siren)'}</span>
          <span className={`w-2 h-2 rounded-full ${isSilent ? 'bg-white animate-ping' : 'bg-emerald-500'}`} />
        </button>
      </div>

    </div>
  );
};
