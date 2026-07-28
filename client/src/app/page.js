'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '../components/layout/PublicNavbar.js';
import { Shield, ShieldCheck, Radio, Zap, ArrowRight, MapPin, BellRing, Award, CheckCircle2 } from 'lucide-react';
import { AnimatedHeading } from '../components/common/AnimatedHeading.jsx';
import { TypewriterText } from '../components/common/TypewriterText.jsx';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text selection:bg-rose selection:text-white font-sans relative overflow-hidden">
      <PublicNavbar />

      {/* BACKGROUND AMBIENT GLOW MESHES */}
      <div className="absolute w-[750px] h-[750px] rounded-full bg-rose/15 blur-[160px] top-[-120px] left-[-220px] pointer-events-none" />
      <div className="absolute w-[750px] h-[750px] rounded-full bg-gold/15 blur-[160px] bottom-[80px] right-[-220px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center space-y-10">

        {/* HERO BADGE */}
        <div className="inline-flex items-center space-x-2 bg-white/95 border border-[#FFCCE1] px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest animate-fade-up shadow-sm">
          <ShieldCheck className="w-4 h-4 text-rose animate-pulse" />
          <span className="text-shimmer-animated">INDIA'S MOST TRUSTED PERSONAL SAFETY PLATFORM</span>
        </div>

        {/* HERO TITLE (ANTIQUE-MODERN BABY PINK HEADING) */}
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
          <p className="text-base sm:text-xl text-tichi-muted max-w-2xl mx-auto font-medium leading-relaxed">
            A modern, calm, and trustworthy personal safety companion designed specifically for girls and women. Fast emergency alerts, live GPS location sharing, and 24/7 command dispatch.
          </p>
        </div>

        {/* CTA BUTTONS (BEST-OF-BEST ANTIQUE BABY PINK BUTTONS) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/auth?mode=register"
            className="w-full sm:w-auto btn-baby-pink text-base px-9 py-4 shadow-coral-glow flex items-center justify-center space-x-3"
          >
            <span>PROTECT YOURSELF NOW</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/pricing"
            className="w-full sm:w-auto btn-baby-pink-outline text-base px-8 py-4 flex items-center justify-center space-x-2"
          >
            <Zap className="w-5 h-5 text-rose" />
            <span>VIEW SAFETY PLAN</span>
          </Link>
        </div>

        {/* RADAR SOS PULSE HERO MOCKUP (CARD-ANTIQUE-PINK GLASS CARD) */}
        <div className="pt-10 max-w-3xl mx-auto relative">
          <div className="card-antique-pink p-8 sm:p-10 relative overflow-hidden group">
            
            {/* Animated Radar Scanning Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose/5 via-transparent to-transparent opacity-60 animate-pulse pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              
              {/* Left Column: Interactive SOS Button Preview */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-[#FF2A6D] animate-ping" />
                  <div className="w-28 h-28 rounded-full sos-btn-gradient border-4 border-white flex flex-col items-center justify-center">
                    <Radio className="w-9 h-9 text-white animate-pulse" />
                    <span className="text-[11px] font-black text-white uppercase mt-1 tracking-wider">PRESS SOS</span>
                  </div>
                </div>
                <span className="text-xs font-black text-rose uppercase tracking-wider">3-Sec Hold Trigger</span>
              </div>

              {/* Right Column: Live Status Highlights */}
              <div className="text-left space-y-3 flex-1">
                <div className="flex items-center space-x-3.5 bg-blush-subtle p-4 rounded-2xl border border-[#FFCCE1] shadow-sm">
                  <div className="w-11 h-11 rounded-2xl bg-rose/15 text-rose flex items-center justify-center shrink-0 border border-rose/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-tichi-text">Encrypted Live GPS Tracking</div>
                    <div className="text-[11px] text-tichi-muted font-bold">Shares exact coordinates with trusted contacts</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 bg-blush-subtle p-4 rounded-2xl border border-[#FFCCE1] shadow-sm">
                  <div className="w-11 h-11 rounded-2xl bg-gold/15 text-gold-dark flex items-center justify-center shrink-0 border border-gold/30">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-tichi-text">Instant Email & SMS Alerting</div>
                    <div className="text-[11px] text-tichi-muted font-bold">Instant broadcast to family & emergency response</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* METRICS & STATS BAR */}
      <section className="border-y border-[#FFCCE1] bg-white/85 py-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-rose">100%</div>
            <div className="text-xs text-tichi-muted font-black uppercase tracking-wider">Encrypted Privacy</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-gold-dark">&lt; 3 Sec</div>
            <div className="text-xs text-tichi-muted font-black uppercase tracking-wider">Emergency Response</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-rose">24 / 7</div>
            <div className="text-xs text-tichi-muted font-black uppercase tracking-wider">HQ Dispatch Monitoring</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-gold-dark">5 Contacts</div>
            <div className="text-xs text-tichi-muted font-black uppercase tracking-wider">Instant Broadcast</div>
          </div>
        </div>
      </section>

      {/* KEY FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-tichi-text">
            Designed For Real Safety in Any Situation
          </h2>
          <p className="text-tichi-muted text-sm sm:text-base max-w-xl mx-auto font-medium">
            From night commutes to solitary journeys, Sakhi Suraksha SOS delivers peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="card-antique-pink p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose/15 border border-rose/30 text-rose flex items-center justify-center">
              <Radio className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-tichi-text">One-Touch SOS Broadcast</h3>
            <p className="text-xs text-tichi-muted leading-relaxed font-semibold">
              Press and hold the SOS button for 3 seconds to instantly send your live coordinates, battery level, and emergency link to all trusted contacts.
            </p>
          </div>

          {/* Card 2 */}
          <div className="card-antique-pink p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/30 text-gold-dark flex items-center justify-center">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-tichi-text">Live Journey Companion</h3>
            <p className="text-xs text-tichi-muted leading-relaxed font-semibold">
              Share a protected journey link with family before taking a cab or walking alone at night. Auto-alerts triggers if you fail to reach safely.
            </p>
          </div>

          {/* Card 3 */}
          <div className="card-antique-pink p-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose/15 border border-rose/30 text-rose flex items-center justify-center">
              <BellRing className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-tichi-text">Loud Panic Alarm & Fake Call</h3>
            <p className="text-xs text-tichi-muted leading-relaxed font-semibold">
              Deter harassers with a high-decibel piercing alarm siren or escape uncomfortable situations using realistic automated fake incoming calls.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#FFCCE1] bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-6 h-6 text-rose" />
            <span className="font-black text-lg text-tichi-text">Sakhi Suraksha SOS</span>
          </div>
          <p className="text-xs text-tichi-muted font-bold">
            © 2026 Sakhi Suraksha SOS Network. Built with care for Women & Girls everywhere.
          </p>
        </div>
      </footer>

    </div>
  );
}
