'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '../components/layout/PublicNavbar.js';
import { Shield, Sparkles, PhoneCall, Radio, Eye, Lock, Zap, ArrowRight, HeartHandshake, MapPin, BellRing, Award, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-plum-dark text-white selection:bg-rose selection:text-white font-sans relative overflow-hidden">
      <PublicNavbar />

      {/* BACKGROUND AMBIENT GLOW MESHES */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-rose/10 blur-[150px] top-[-100px] left-[-200px] pointer-events-none" />
      <div className="absolute w-[700px] h-[700px] rounded-full bg-gold/10 blur-[150px] bottom-[100px] right-[-200px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center space-y-10">

        {/* HERO BADGE */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose/20 via-plum-light/30 to-gold/20 border border-rose/40 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest animate-fade-up shadow-coral-glow">
          <Sparkles className="w-4 h-4 text-gold animate-pulse" />
          <span className="text-white">INDIA'S MOST TRUSTED PERSONAL SAFETY PLATFORM</span>
        </div>

        {/* HERO TITLE */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
            Empowering Every Woman With <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose via-coral to-gold">
              Instant 24/7 Protection
            </span>
          </h1>
          <p className="text-base sm:text-xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
            One-touch Emergency SOS broadcasting, real-time GPS tracking, automated check-ins, and trusted guardian alerts designed to keep you safe everywhere.
          </p>
        </div>

        {/* HERO BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-4">
          <Link
            href="/auth?tab=signup"
            className="w-full sm:w-auto bg-gradient-to-r from-rose to-coral text-white font-black text-base px-8 py-4 rounded-2xl shadow-coral-glow hover:brightness-110 transition-all flex items-center justify-center space-x-3 group"
          >
            <Shield className="w-5 h-5 fill-white/20 group-hover:scale-110 transition-transform" />
            <span>START FREE PROTECTION</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/pricing"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base px-8 py-4 rounded-2xl transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span>VIEW PRICING</span>
          </Link>
        </div>

        {/* PRICING BANNER PREVIEW */}
        <div className="pt-6">
          <div className="inline-flex items-center space-x-3 bg-white/5 border border-gold/40 px-5 py-2.5 rounded-2xl backdrop-blur-md">
            <span className="bg-gold text-plum text-xs font-black px-2.5 py-1 rounded-md uppercase">SPECIAL OFFER</span>
            <span className="text-sm font-extrabold text-white">Full Protection Plan at just <span className="text-gold font-mono text-base">₹24 + GST</span> / month</span>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10">
          {[
            { metric: '< 3 Secs', label: 'SOS Alert Dispatch' },
            { metric: '99.9%', label: 'Uptime Reliability' },
            { metric: '100% Real-time', label: 'GPS Live Stream' },
            { metric: '₹24 / mo', label: 'Affordable SaaS Safety' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:border-rose/40 transition-all">
              <p className="text-2xl sm:text-3xl font-black text-gold font-mono">{item.metric}</p>
              <p className="text-xs text-white/70 font-semibold mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
