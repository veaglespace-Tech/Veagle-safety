'use client';

import React, { useState } from 'react';
import { RotateCw, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const Feature3DCard = ({
  icon: Icon,
  title,
  desc,
  backTitle,
  points,
  badgeText,
  gradient = 'bg-gradient-to-tr from-[#FF2A6D] via-[#E01A4F] to-[#2A0826]',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 w-full h-[270px] cursor-pointer group select-none"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <div
        className={`relative w-full h-full duration-700 transform-style-3d transition-transform ease-out ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT FACE OF 3D CARD (CLEAN & SLEEK) */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white/95 backdrop-blur-2xl p-8 rounded-3xl border-1.5 border-[#FFCCE1] hover:border-[#FF5C8A] shadow-[0_10px_30px_rgba(255,92,138,0.10)] hover:shadow-[0_20px_50px_rgba(255,92,138,0.25)] flex flex-col justify-between transition-all duration-300">
          <div>
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#FFF0F3] to-[#FFCCE1] text-[#FF2A6D] border-1.5 border-[#FF5C8A] flex items-center justify-center mb-5 shadow-xs group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <Icon className="w-6.5 h-6.5 stroke-[2.5]" />
            </div>

            <h3 className="text-xl font-black mb-2 text-[#2A0826] group-hover:text-[#FF2A6D] transition-colors duration-300">
              {title}
            </h3>

            <p className="text-xs text-[#684E67] font-bold leading-relaxed">
              {desc}
            </p>
          </div>
        </div>

        {/* BACK FACE OF 3D CARD */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-7 rounded-3xl border-2 border-white/30 text-white flex flex-col justify-between shadow-[0_20px_60px_rgba(255,42,109,0.35)] relative overflow-hidden ${gradient}`}
        >
          {/* AMBIENT BACKGROUND GLOW INSIDE BACK FACE */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5 shadow-sm">
                <ShieldCheck size={13} className="text-[#FFE600]" />
                <span>{badgeText || '3D SAFETY SPECS'}</span>
              </span>
              <RotateCw size={13} className="text-white/80 animate-spin" />
            </div>

            <h4 className="text-lg font-black tracking-tight mb-2.5 text-white">
              {backTitle || title}
            </h4>

            <ul className="space-y-2 text-xs font-black text-white/95">
              {points?.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 bg-black/20 backdrop-blur-sm p-2 rounded-xl border border-white/15 shadow-xs">
                  <CheckCircle2 size={14} className="text-[#FFE600] shrink-0 mt-0.5 stroke-[2.5]" />
                  <span className="leading-snug">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 pt-2 border-t border-white/20 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-white/90">
            <span className="flex items-center gap-1">
              <Sparkles size={11} className="text-[#FFE600]" />
              <span>Sakhi 365 Security</span>
            </span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full border border-white/30 text-white">Tap to Flip 🔄</span>
          </div>
        </div>
      </div>
    </div>
  );
};
