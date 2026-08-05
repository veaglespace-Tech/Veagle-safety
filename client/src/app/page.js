'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield, Zap, Users, ArrowRight, ShieldCheck, Heart, MapPin, Bell,
  PhoneCall, LayoutDashboard, Crown, Sparkles, CheckCircle2, Star, Award
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { PublicNavbar } from '../components/layout/PublicNavbar.js';
import { Footer } from '../components/layout/Footer.js';
import { Logo3DFlip } from '../components/ui/Logo3DFlip.js';
import { HeroBannerCarousel } from '../components/ui/HeroBannerCarousel.js';
import { Feature3DCard } from '../components/ui/Feature3DCard.js';

export default function LandingPage() {
  const { token, user } = useSelector((state) => state?.auth || {});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted && (token || (typeof window !== 'undefined' && localStorage.getItem('tichi_token')));
  const isSuperAdmin = mounted && user?.role === 'SUPER_ADMIN';
  const displayName = mounted && (user?.fullName || user?.name) ? (user.fullName || user.name) : 'Sakhi Member';

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-[#2A0826] font-sans relative overflow-hidden">
      <PublicNavbar />

      {/* BACKGROUND AMBIENT GLOW MESHES */}
      <div className="absolute w-[800px] h-[800px] rounded-full bg-[#FF5C8A]/12 blur-[170px] top-[-140px] left-[-240px] pointer-events-none" />
      <div className="absolute w-[750px] h-[750px] rounded-full bg-[#FFCCE1]/25 blur-[160px] bottom-[60px] right-[-220px] pointer-events-none" />

      {/* TOP NOTIFICATION BANNER */}
      {isLoggedIn && (
        <div className="bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white text-center py-3 px-4 relative z-10 shadow-[0_4px_20px_rgba(255,92,138,0.3)]">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap text-xs font-black">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              <span>Welcome Back, <strong className="text-[#FFE600] font-black">{displayName}</strong>! Active Protection Enabled.</span>
            </div>
            <Link
              href={isSuperAdmin ? '/admin' : '/dashboard'}
              className="inline-flex items-center gap-1.5 bg-white text-[#FF2A6D] px-3.5 py-1 rounded-full text-[11px] font-black text-decoration-none shadow-sm hover:bg-[#FFF0F3] transition-all"
            >
              {isSuperAdmin ? <Crown size={13} /> : <LayoutDashboard size={13} />}
              <span>{isSuperAdmin ? 'Go to Admin Panel' : 'Go to Dashboard'}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* HERO SECTION WITH DIRECT AUTO-SCROLLING HERO BANNER */}
      <section className="relative z-10 pt-6 sm:pt-10 pb-6 px-4 sm:px-6 lg:px-8 text-center space-y-8">

        {/* DIRECT 4K AUTO-SCROLL HERO BANNER */}
        <HeroBannerCarousel />

        {/* MAIN TITLE */}
        <h1 className="heading-gradient-hero text-4xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-tight max-w-5xl mx-auto">
          Sakhi Suraksha <span className="heading-highlight-pill">SOS</span>
        </h1>

        <p className="text-[#684E67] text-base sm:text-xl font-bold max-w-xl mx-auto leading-relaxed">
          A modern personal safety companion for girls & women — instant emergency alerts,
          live GPS tracking, and 24/7 command dispatch.
        </p>

        {/* MARQUEE STRIP (FULL SCREEN WIDTH & LIVE CONTINUOUS SCROLLING) */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white/95 border-y-1.5 border-[#FFCCE1] py-3.5 overflow-hidden my-8 shadow-sm">
          <div className="animate-marquee-scroll">
            {[
              '⚡ INSTANT 3-SECOND SOS DISPATCH', '📍 24/7 LIVE GPS TRACKING',
              '🔔 GUARDIAN SIREN BROADCAST', '🛡️ 365-DAY WOMEN SAFETY',
              '⚡ INSTANT 3-SECOND SOS DISPATCH', '📍 24/7 LIVE GPS TRACKING',
              '🔔 GUARDIAN SIREN BROADCAST', '🛡️ 365-DAY WOMEN SAFETY',
              '⚡ INSTANT 3-SECOND SOS DISPATCH', '📍 24/7 LIVE GPS TRACKING',
              '🔔 GUARDIAN SIREN BROADCAST', '🛡️ 365-DAY WOMEN SAFETY',
            ].map((item, i) => (
              <span key={i} className="text-xs sm:text-sm font-black text-[#FF2A6D] uppercase tracking-widest flex items-center gap-3">
                <span>{item}</span>
                <span className="text-[#FF5C8A] font-light">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* HERO CTA BUTTONS WITH PURE 3D POP-UP EFFECT (NO MAGNETIC MOTION) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-3 px-4 w-full">
          {isLoggedIn ? (
            <>
              <Link
                href={isSuperAdmin ? '/admin' : '/dashboard'}
                className="btn-3d-rose-pop w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 sm:gap-3 whitespace-nowrap"
              >
                {isSuperAdmin ? <Crown size={18} className="shrink-0" /> : <LayoutDashboard size={18} className="shrink-0" />}
                <span>{isSuperAdmin ? 'ADMIN PANEL' : 'MY DASHBOARD'}</span>
                <ArrowRight size={16} className="shrink-0" />
              </Link>

              <Link
                href="/profile"
                className="btn-3d-white-pop w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 sm:gap-2 whitespace-nowrap"
              >
                <Shield size={16} className="text-[#FF5C8A] shrink-0" />
                <span>MY PROFILE</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth?mode=register"
                className="btn-3d-rose-pop w-full sm:w-auto px-6 sm:px-9 py-3.5 sm:py-4 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 sm:gap-3 whitespace-nowrap"
              >
                <span>PROTECT YOURSELF NOW</span>
                <ArrowRight size={16} className="shrink-0" />
              </Link>

              <Link
                href="/about"
                className="btn-3d-white-pop w-full sm:w-auto px-6 sm:px-9 py-3.5 sm:py-4 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 sm:gap-2 whitespace-nowrap"
              >
                <Shield size={16} className="text-[#FF5C8A] shrink-0" />
                <span>HOW IT WORKS</span>
              </Link>
            </>
          )}
        </div>

        {/* 3 FEATURE CARDS IN 3D FLIP ARCHITECTURE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-8 text-left">
          <Feature3DCard
            icon={Zap}
            title="3-Second Emergency SOS"
            desc="Trigger loud siren & instant SMS/WhatsApp alerts with exact GPS coordinates to trusted emergency contacts."
            backTitle="⚡ Emergency SOS Features"
            badgeText="ZERO DELAY DISPATCH"
            gradient="bg-gradient-to-br from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F]"
            points={[
              '📢 High-Decibel Guardian Siren Broadcast',
              '📍 Precise GPS Coordinates & Maps Link',
              '💬 One-Tap Emergency WhatsApp Alerts',
            ]}
          />

          <Feature3DCard
            icon={MapPin}
            title="Encrypted GPS Journey Tracking"
            desc="Share live movement updates securely during travel so guardians know you are safe in real time."
            backTitle="📍 Live Tracking Specs"
            badgeText="REAL-TIME TELEMETRY"
            gradient="bg-gradient-to-br from-[#FF2A6D] via-[#E01A4F] to-[#2A0826]"
            points={[
              '🛡️ AES-256 Encrypted Location Stream',
              '⏱️ 5-Minute Periodic Email Updates',
              '🗺️ Interactive Live Map Share Token',
            ]}
          />

          <Feature3DCard
            icon={Users}
            title="Trusted Guardian Circle"
            desc="Build your personal network of family & emergency guardians for automated response alerts."
            backTitle="👥 Guardian Circle Specs"
            badgeText="AUTOMATED RESPONSE"
            gradient="bg-gradient-to-br from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F]"
            points={[
              '👨‍👩‍👧 Family & Parent Email Registration',
              '🔔 Multi-Device Guardian Audio Siren',
              '📱 Direct Emergency Phone Calling',
            ]}
          />
        </div>


      </section>


      <Footer />

    </div>
  );
}
