'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '../components/layout/PublicNavbar.js';
import { Shield, ShieldCheck, Radio, Zap, ArrowRight, MapPin, BellRing, Award, CheckCircle2, PhoneCall } from 'lucide-react';
import { AnimatedHeading } from '../components/common/AnimatedHeading.jsx';
import { TypewriterText } from '../components/common/TypewriterText.jsx';
import { GsapMagneticButton } from '../components/common/GsapMagneticButton.js';
import { GsapStaggerContainer } from '../components/common/GsapStaggerContainer.js';
import { LottieAnimation } from '../components/common/LottieAnimation.js';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text selection:bg-rose selection:text-white font-sans relative overflow-hidden">
      <PublicNavbar />

      {/* CONTINUOUS SCROLLING MARQUEE ANNOUNCEMENT TICKER */}
      <div className="bg-white/90 backdrop-blur-md border-b-2 border-[#FFCCE1] shadow-sm overflow-hidden py-2.5">
        <AnimatedHeading variant="marquee" className="text-xs font-black uppercase tracking-widest text-[#FF2A6D]">
          🚨 24/7 INSTANT EMERGENCY SOS DISPATCH ✦ LIVE GPS TRACKING STREAM ✦ 365-DAY GUARDIAN PROTECTION ✦ REAL-TIME PUSH & SIREN ALERTS
        </AnimatedHeading>
      </div>

      {/* BACKGROUND AMBIENT GLOW MESHES */}
      <div className="absolute w-[750px] h-[750px] rounded-full bg-rose/15 blur-[160px] top-[-120px] left-[-220px] pointer-events-none" />
      <div className="absolute w-[750px] h-[750px] rounded-full bg-gold/15 blur-[160px] bottom-[80px] right-[-220px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 text-center space-y-10">

        {/* HERO BADGE */}
        <div className="inline-flex items-center space-x-2 bg-white/95 border border-[#FFCCE1] px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest animate-fade-up shadow-sm">
          <ShieldCheck className="w-4 h-4 text-rose animate-pulse" />
          <span className="text-shimmer-animated">INDIA'S MOST TRUSTED PERSONAL SAFETY PLATFORM</span>
        </div>

        {/* HERO TITLE */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <AnimatedHeading as="h1" variant="shimmer" className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight space-y-2">
            <span className="text-tichi-text block drop-shadow-sm">
              Sakhi Suraksha SOS
            </span>
            <span 
              className="block font-black py-1 tracking-tight drop-shadow-[0_4px_15px_rgba(255,92,138,0.25)] text-baby-pink-gradient"
            >
              <TypewriterText text="Instant 3-Second Emergency Protection" speed={60} />
            </span>
          </AnimatedHeading>
          <p className="text-base sm:text-xl text-tichi-muted max-w-2xl mx-auto font-bold leading-relaxed">
            A modern, calm, and trustworthy personal safety companion designed specifically for girls and women. Fast emergency alerts, live GPS location sharing, and 24/7 command dispatch.
          </p>
        </div>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2">
          <GsapMagneticButton strength={0.25}>
            <Link
              href="/auth?mode=register"
              className="w-full sm:w-auto btn-baby-pink text-base px-9 py-4 shadow-coral-glow flex items-center justify-center space-x-3"
            >
              <span>PROTECT YOURSELF NOW</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </GsapMagneticButton>

          <GsapMagneticButton strength={0.2}>
            <Link
              href="/about"
              className="w-full sm:w-auto btn-baby-pink-outline text-base px-8 py-4 flex items-center justify-center space-x-2"
            >
              <Shield className="w-5 h-5 text-rose" />
              <span>HOW IT PROTECTS YOU</span>
            </Link>
          </GsapMagneticButton>
        </div>

        {/* FEATURES GRID */}
        <GsapStaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          {[
            {
              icon: Zap,
              title: '3-Second SOS Trigger',
              desc: 'Press and hold the SOS button for 3 seconds to immediately broadcast alerts to your 5 trusted contacts and dispatch command.',
            },
            {
              icon: MapPin,
              title: 'Live GPS Satellite Stream',
              desc: 'Real-time encrypted geolocation tracking with accuracy pin and Google Maps integration for guardians.',
            },
            {
              icon: BellRing,
              title: 'Guardian Siren Broadcast',
              desc: 'Triggers high-decibel loud siren alarms and push notifications directly on trusted guardians devices.',
            },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="card-antique-pink p-8 space-y-4 shadow-md border-2 border-rose">
                <div className="w-12 h-12 rounded-2xl bg-rose/15 text-rose flex items-center justify-center border border-rose/30">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-tichi-text">{feat.title}</h3>
                <p className="text-xs text-tichi-muted font-bold leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </GsapStaggerContainer>

      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-[#FFCCE1] bg-white py-8 text-center text-xs font-bold text-tichi-muted">
        <p>&copy; {new Date().getFullYear()} Sakhi Suraksha SOS. Built with care for Women's Safety in India.</p>
      </footer>
    </div>
  );
}
