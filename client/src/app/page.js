'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield, Zap, Users, ArrowRight, ShieldCheck, Heart, MapPin, Bell,
  PhoneCall, LayoutDashboard, Crown, Sparkles, CheckCircle2, Star, Award
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { PublicNavbar } from '../components/layout/PublicNavbar.js';
import { MagneticButton } from '../components/ui/MagneticButton.js';
import { Logo3DFlip } from '../components/ui/Logo3DFlip.js';

export default function LandingPage() {
  const { token, user } = useSelector((state) => state?.auth || {});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted && (token || (typeof window !== 'undefined' && localStorage.getItem('tichi_token')));
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

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
              <span>Welcome Back, <strong className="text-[#FFE600] font-black">{user?.fullName || 'Sakhi Member'}</strong>! Active Protection Enabled.</span>
            </div>
            <MagneticButton pullStrength={0.2}>
              <Link 
                href={isSuperAdmin ? '/admin' : '/dashboard'} 
                className="inline-flex items-center gap-1.5 bg-white text-[#FF2A6D] px-3.5 py-1 rounded-full text-[11px] font-black text-decoration-none shadow-sm hover:bg-[#FFF0F3] transition-all"
              >
                {isSuperAdmin ? <Crown size={13} /> : <LayoutDashboard size={13} />}
                <span>{isSuperAdmin ? 'Go to Admin Panel' : 'Go to Dashboard'}</span>
                <ArrowRight size={13} />
              </Link>
            </MagneticButton>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 text-center space-y-8">

        {/* HERO BADGE */}
        <div className="inline-flex items-center space-x-2 bg-white/90 text-[#FF5C8A] border-1.5 border-[#FFCCE1] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-[#FF5C8A]" />
          <span className="bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] bg-clip-text text-transparent">
            India's Most Trusted Personal Safety Platform
          </span>
        </div>

        {/* MAIN TITLE */}
        <h1 className="heading-gradient-hero text-4xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-tight max-w-5xl mx-auto">
          Sakhi Suraksha <span className="heading-highlight-pill">SOS</span>
        </h1>

        <p className="text-[#684E67] text-base sm:text-xl font-bold max-w-xl mx-auto leading-relaxed">
          A modern personal safety companion for girls & women — instant emergency alerts,
          live GPS tracking, and 24/7 command dispatch.
        </p>

        {/* MARQUEE STRIP (FULL SCREEN WIDTH) */}
        <div className="w-full bg-white/95 border-y-1.5 border-[#FFCCE1] py-4 overflow-hidden my-6 shadow-sm">
          <div className="flex gap-12 whitespace-nowrap animate-marquee width-max-content">
            {[
              '⚡ INSTANT 3-SECOND SOS', '📍 24/7 LIVE GPS TRACKING',
              '🔔 GUARDIAN SIREN BROADCAST', '🛡️ 365-DAY WOMEN SAFETY',
              '⚡ INSTANT 3-SECOND SOS', '📍 24/7 LIVE GPS TRACKING',
              '🔔 GUARDIAN SIREN BROADCAST', '🛡️ 365-DAY WOMEN SAFETY',
            ].map((item, i) => (
              <span key={i} className="text-xs sm:text-sm font-black text-[#FF2A6D] uppercase tracking-widest">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* MAGNETIC HERO CTA BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          {isLoggedIn ? (
            <>
              <MagneticButton pullStrength={0.4}>
                <Link 
                  href={isSuperAdmin ? '/admin' : '/dashboard'} 
                  className="bg-gradient-to-r from-[#FFF0F3] via-[#FFE6EE] to-[#FFCCE1] border-1.5 border-[#FF5C8A] text-[#2A0826] hover:bg-gradient-to-r hover:from-[#FF5C8A] hover:to-[#FF2A6D] hover:text-white hover:border-transparent px-9 py-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-[0_4px_16px_rgba(255,92,138,0.22)] hover:shadow-[0_8px_28px_rgba(255,42,109,0.50)] flex items-center justify-center space-x-3 cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  {isSuperAdmin ? <Crown size={18} /> : <LayoutDashboard size={18} />}
                  <span>{isSuperAdmin ? 'ADMIN PANEL' : 'MY DASHBOARD'}</span>
                  <ArrowRight size={16} />
                </Link>
              </MagneticButton>

              <MagneticButton pullStrength={0.35}>
                <Link 
                  href="/profile" 
                  className="bg-white/95 border-1.5 border-[#FFCCE1] text-[#2A0826] hover:border-[#FF5C8A] hover:text-[#FF2A6D] px-8 py-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-sm flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <Shield size={16} className="text-[#FF5C8A]" />
                  <span>MY PROFILE</span>
                </Link>
              </MagneticButton>
            </>
          ) : (
            <>
              <MagneticButton pullStrength={0.4}>
                <Link 
                  href="/auth?mode=register" 
                  className="bg-gradient-to-r from-[#FFF0F3] via-[#FFE6EE] to-[#FFCCE1] border-1.5 border-[#FF5C8A] text-[#2A0826] hover:bg-gradient-to-r hover:from-[#FF5C8A] hover:to-[#FF2A6D] hover:text-white hover:border-transparent px-9 py-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-[0_4px_16px_rgba(255,92,138,0.22)] hover:shadow-[0_8px_28px_rgba(255,42,109,0.50)] flex items-center justify-center space-x-3 cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <span>PROTECT YOURSELF NOW</span>
                  <ArrowRight size={16} className="text-[#FF2A6D] group-hover:text-white shrink-0" />
                </Link>
              </MagneticButton>

              <MagneticButton pullStrength={0.35}>
                <Link 
                  href="/about" 
                  className="bg-white/95 border-1.5 border-[#FFCCE1] text-[#2A0826] hover:border-[#FF5C8A] hover:text-[#FF2A6D] px-8 py-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-sm flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  <Shield size={16} className="text-[#FF5C8A]" />
                  <span>HOW IT WORKS</span>
                </Link>
              </MagneticButton>
            </>
          )}
        </div>

        {/* 3 FEATURE CARDS WITH MAGNETIC HOVER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-8 text-left">
          {[
            {
              icon: Zap, color: '#FF5C8A',
              title: '3-Second Emergency SOS',
              desc: 'Trigger loud siren & instant SMS/WhatsApp alerts with exact GPS coordinates to trusted emergency contacts.'
            },
            {
              icon: MapPin, color: '#FF2A6D',
              title: 'Encrypted GPS Journey Tracking',
              desc: 'Share live movement updates securely during travel so guardians know you are safe in real time.'
            },
            {
              icon: Users, color: '#FF5C8A',
              title: 'Trusted Guardian Circle',
              desc: 'Build your personal network of family & emergency guardians for automated response alerts.'
            },
          ].map((item, idx) => (
            <MagneticButton key={idx} pullStrength={0.2}>
              <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl space-y-4 border-1.5 border-[#FFCCE1] hover:border-[#FF5C8A] shadow-[0_10px_30px_rgba(255,92,138,0.10)] hover:shadow-[0_16px_40px_rgba(255,92,138,0.22)] transition-all duration-300 h-full flex flex-col justify-between">
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#FFF0F3] to-[#FFCCE1] text-[#FF2A6D] border-1.5 border-[#FF5C8A] flex items-center justify-center mb-4 shadow-sm">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-[#2A0826] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#684E67] font-bold leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </MagneticButton>
          ))}
        </div>

      </section>

      {/* FULL-SCREEN WIDTH STATS SECTION */}
      <section className="w-full bg-white/95 backdrop-blur-xl border-y-1.5 border-[#FFCCE1] py-12 shadow-[0_10px_35px_rgba(255,92,138,0.12)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50,000+', label: 'Protected Sakhi Members', icon: Heart },
            { value: '99.9%', label: 'Emergency Signal Delivery', icon: Zap },
            { value: '< 3 Sec', label: 'Alert Dispatch Time', icon: Bell },
            { value: '24/7/365', label: 'Active Command Monitoring', icon: ShieldCheck },
          ].map((stat, i) => (
            <MagneticButton key={i} pullStrength={0.25}>
              <div className="bg-[#FFF0F3]/80 p-6 rounded-2xl border-1.5 border-[#FFCCE1] shadow-sm space-y-1.5">
                <stat.icon className="w-6 h-6 text-[#FF5C8A] mx-auto" />
                <div className="text-3xl sm:text-4xl font-black text-[#FF2A6D]">
                  {stat.value}
                </div>
                <div className="text-xs font-black text-[#684E67] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </MagneticButton>
          ))}
        </div>
      </section>

      {/* 100% BLACK FREE ROYAL ANTIQUE FOOTER */}
      <footer className="bg-white/95 backdrop-blur-xl border-t-1.5 border-[#FFCCE1] py-12 text-center text-[#2A0826] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Logo3DFlip size={36} />
            <span className="text-lg font-black text-[#2A0826] tracking-tight">Sakhi Suraksha SOS</span>
          </div>
          <p className="text-xs text-[#684E67] font-bold max-w-md mx-auto leading-relaxed">
            Empowering women & girls with 24/7 encrypted emergency safety network across India.
          </p>
          <div className="text-xs text-[#684E67] font-extrabold pt-2">
            © {new Date().getFullYear()} Sakhi Suraksha SOS · All Rights Reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
