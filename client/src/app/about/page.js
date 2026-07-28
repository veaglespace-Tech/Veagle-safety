'use client';

import React from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar.js';
import { Shield, Heart, Lock, Award, Users, Globe, Zap, Radio, CheckCircle2, ArrowRight, Activity, Terminal } from 'lucide-react';
import Link from 'next/link';
import { AnimatedHeading } from '../../components/common/AnimatedHeading.jsx';

export const dynamic = 'force-dynamic';

export default function AboutUsPage() {
  const pillars = [
    {
      icon: Radio,
      title: '3-Second Ultra-Fast SOS Broadcast',
      description: 'Engineered for extreme emergency speed. Pressing the SOS trigger broadcasts your precise GPS location to 5 trusted guardians and HQ within sub-seconds.',
      badge: 'SUB-SECOND RESPONSE',
      color: 'rose',
    },
    {
      icon: Lock,
      title: 'Privacy-First Encrypted Architecture',
      description: 'Your location data is encrypted and strictly private. It is shared ONLY during active SOS emergencies or explicitly authorized journey tracking.',
      badge: 'ZERO DATA TRADING',
      color: 'gold',
    },
    {
      icon: Shield,
      title: '24/7 HQ Command & Dispatch Monitoring',
      description: 'Integrated with Company Super Admin HQ and national helplines (112, 1091, 181) to ensure continuous monitoring and emergency escalation.',
      badge: '24/7 COMMAND ONLINE',
      color: 'rose',
    },
    {
      icon: Award,
      title: 'Production-Grade High Reliability',
      description: 'Powered by Node.js, Express, Socket.IO, MySQL, and Redux Toolkit for maximum uptime and zero latency during critical moments.',
      badge: 'ENTERPRISE TECH STACK',
      color: 'gold',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden">
      <PublicNavbar />

      {/* BACKGROUND AMBIENT GLOW MESHES */}
      <div className="absolute w-[750px] h-[750px] rounded-full bg-rose/15 blur-[160px] top-[-120px] left-[-220px] pointer-events-none" />
      <div className="absolute w-[750px] h-[750px] rounded-full bg-gold/15 blur-[160px] bottom-[80px] right-[-220px] pointer-events-none" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 relative z-10">
        
        {/* HERO MISSION HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white text-rose border border-rose/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <Heart className="w-4 h-4 fill-rose text-rose animate-pulse" />
            <span className="text-shimmer-animated">OUR MISSION & CORE ARCHITECTURE</span>
          </div>

          <AnimatedHeading as="h1" variant="shimmer" className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Built to Shield & Empower <br />
            <span className="text-shimmer-animated text-glow-animated">Every Girl and Woman</span>
          </AnimatedHeading>

          <p className="text-tichi-muted text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Sakhi Suraksha SOS was created to combine cutting-edge technology with compassionate design—ensuring help is always 3 seconds away when it matters most.
          </p>
        </div>

        {/* STATS HIGHLIGHT BAR */}
        <div className="card-antique-pink p-8 border border-[#FFCCE1]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-rose">100%</div>
              <div className="text-xs text-tichi-muted font-black uppercase tracking-wider">Encrypted Privacy</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-gold-dark">&lt; 3 Sec</div>
              <div className="text-xs text-tichi-muted font-black uppercase tracking-wider">Broadcast Speed</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-rose">24 / 7</div>
              <div className="text-xs text-tichi-muted font-black uppercase tracking-wider">Command Operations</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-gold-dark">5 Contacts</div>
              <div className="text-xs text-tichi-muted font-black uppercase tracking-wider">Parallel Alerts</div>
            </div>
          </div>
        </div>

        {/* 4 CORE ARCHITECTURAL PILLARS */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-tichi-text">
              The 4 Pillars of Sakhi Suraksha SOS
            </h2>
            <p className="text-xs text-tichi-muted font-bold">
              Engineering excellence dedicated to non-compromised personal safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isGold = pillar.color === 'gold';
              return (
                <div key={idx} className="card-antique-pink p-8 space-y-4 hover:border-rose transition-all group">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                      isGold ? 'bg-gold/15 text-gold-dark border-gold/30' : 'bg-rose/15 text-rose border-rose/30'
                    }`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                      isGold ? 'bg-gold/10 text-gold-dark border border-gold/30' : 'bg-rose/10 text-rose border border-rose/30'
                    }`}>
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-tichi-text group-hover:text-rose transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-tichi-muted leading-relaxed font-semibold">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CALL TO ACTION BOTTOM BANNER */}
        <div className="card-antique-pink p-8 sm:p-12 text-center space-y-6 max-w-4xl mx-auto border-2 border-rose/40 shadow-coral-glow">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose via-rose-light to-gold text-white flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-tichi-text">
              Join Sakhi Suraksha SOS Today
            </h2>
            <p className="text-xs sm:text-sm text-tichi-muted font-semibold max-w-xl mx-auto">
              Get complete 365-day emergency protection for just ₹24/year. Instant registration in under 2 minutes.
            </p>
          </div>
          <Link
            href="/auth?mode=register"
            className="inline-flex btn-baby-pink px-9 py-4 text-xs font-black uppercase tracking-wider space-x-2"
          >
            <span>START YOUR 365-DAY PROTECTION</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </section>
    </div>
  );
}
