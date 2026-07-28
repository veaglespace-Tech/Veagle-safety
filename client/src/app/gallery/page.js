'use client';

import React, { useState } from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar.js';
import {
  Image as ImageIcon,
  Shield,
  Radio,
  MapPin,
  Users,
  Clock,
  Crown,
  Volume2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Activity,
  BellRing,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function PlatformGalleryPage() {
  const [activeTab, setActiveTab] = useState('ALL');

  const galleryItems = [
    {
      id: 'sos_button',
      category: 'EMERGENCY',
      title: 'Emergency SOS Radar Button',
      subtitle: 'Instant 3-Second Hold Trigger',
      badge: 'SUB-SECOND DISPATCH',
      icon: Radio,
      accentColor: 'rose',
      renderGraphic: () => (
        <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-[#FFF0F3] via-white to-[#FFE4EC] border border-[#FFCCE1] flex flex-col items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-all">
          <div className="absolute inset-0 bg-gradient-to-b from-rose/10 via-transparent to-transparent animate-pulse pointer-events-none" />
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-emergency animate-ping" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emergency via-rose to-emergency-dark border-4 border-white text-white flex flex-col items-center justify-center shadow-sos-glow">
              <Radio className="w-8 h-8 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">3s SOS</span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-extrabold text-emergency mt-2 bg-emergency-bg px-2.5 py-0.5 rounded-full border border-emergency-border">
            HOLD FOR 3 SECONDS
          </span>
        </div>
      ),
      description: 'Press & hold the center SOS trigger to instantly activate real-time GPS tracking and send high-priority alerts to family & HQ.',
    },
    {
      id: 'gps_map',
      category: 'TRACKING',
      title: 'Live GPS Location Map',
      subtitle: 'Real-Time Encrypted Map Sharing',
      badge: '100% ENCRYPTED',
      icon: MapPin,
      accentColor: 'rose',
      renderGraphic: () => (
        <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-[#FFF8FA] via-white to-[#FFF0F3] border border-[#FFCCE1] flex flex-col items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-all">
          <div className="w-full bg-white/90 p-3 rounded-xl border border-blush-border shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-tichi-success animate-pulse" />
                <span className="text-[10px] font-black text-tichi-text uppercase">GPS Satellite Locked</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-rose">Accuracy: ~3m</span>
            </div>
            <div className="flex items-center space-x-2 bg-blush-subtle p-2 rounded-lg border border-blush-border text-[11px] font-bold text-tichi-text">
              <MapPin className="w-4 h-4 text-rose shrink-0" />
              <span className="truncate">18.5204° N, 73.8567° E — MG Road, Pune</span>
            </div>
          </div>
          <div className="inline-flex items-center space-x-1 text-[10px] font-bold text-tichi-muted mt-2">
            <Activity className="w-3 h-3 text-tichi-success" />
            <span>Web Tracking Link Active</span>
          </div>
        </div>
      ),
      description: 'Generates an end-to-end encrypted live map link accessible by trusted contacts across any browser or mobile phone.',
    },
    {
      id: 'trusted_contacts',
      category: 'NETWORK',
      title: 'Trusted Contacts Broadcast',
      subtitle: 'Instant Email & SMS Dispatch',
      badge: '5 CONTACTS NETWORK',
      icon: Users,
      accentColor: 'gold',
      renderGraphic: () => (
        <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-[#FFF9E6] via-white to-[#FFF0F3] border border-gold/30 flex flex-col items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-all">
          <div className="flex items-center -space-x-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-rose/20 text-rose border-2 border-white flex items-center justify-center font-black text-xs shadow-sm">P1</div>
            <div className="w-10 h-10 rounded-full bg-gold/20 text-gold-dark border-2 border-white flex items-center justify-center font-black text-xs shadow-sm">P2</div>
            <div className="w-10 h-10 rounded-full bg-tichi-success/20 text-tichi-success border-2 border-white flex items-center justify-center font-black text-xs shadow-sm">P3</div>
            <div className="w-10 h-10 rounded-full bg-rose-light/20 text-rose border-2 border-white flex items-center justify-center font-black text-xs shadow-sm">+2</div>
          </div>
          <span className="text-xs font-black text-tichi-text">Guardian Emergency Broadcast</span>
          <span className="text-[10px] font-mono font-extrabold text-gold-dark bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/30 mt-1">
            PARALLEL MULTI-CHANNEL ALERTS
          </span>
        </div>
      ),
      description: 'Automatically notifies up to 5 designated guardians simultaneously with location coordinates and distress siren notifications.',
    },
    {
      id: 'checkin_timer',
      category: 'AUTOMATION',
      title: 'Safety Check-in Timer',
      subtitle: 'Automated Overdue Escalation',
      badge: 'SMART TIMER',
      icon: Clock,
      accentColor: 'rose',
      renderGraphic: () => (
        <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-[#FFF0F3] via-white to-[#FFE4EC] border border-[#FFCCE1] flex flex-col items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-all">
          <div className="w-16 h-16 rounded-full border-4 border-rose/30 border-t-rose flex items-center justify-center mb-2 animate-spin-slow">
            <span className="text-xs font-mono font-black text-rose">15:00</span>
          </div>
          <span className="text-xs font-black text-tichi-text">Journey Arrival Countdown</span>
          <span className="text-[10px] font-mono font-bold text-tichi-muted mt-0.5">AUTO-ESCALATION IF UNANSWERED</span>
        </div>
      ),
      description: 'Set a check-in reminder during solo travel. If you don’t confirm safe arrival, the system automatically triggers an SOS alert.',
    },
    {
      id: 'admin_portal',
      category: 'COMMAND',
      title: 'Super Admin HQ Command Portal',
      subtitle: '24/7 Operations Monitoring',
      badge: 'AUTHORIZED PERSONNEL',
      icon: Crown,
      accentColor: 'gold',
      renderGraphic: () => (
        <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-[#FFF9E6] via-white to-[#FFF0F3] border border-gold/40 flex flex-col items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-all">
          <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold-dark border border-gold/40 flex items-center justify-center mb-2 shadow-sm">
            <Crown className="w-6 h-6" />
          </div>
          <span className="text-xs font-black text-tichi-text">Company Headquarters Portal</span>
          <span className="text-[10px] font-mono font-black text-gold-dark bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/30 mt-1">
            URL: /admin/login
          </span>
        </div>
      ),
      description: 'Dedicated command portal for company personnel to monitor incident feeds, system health, and manage user subscriptions.',
    },
    {
      id: 'loud_siren',
      category: 'EMERGENCY',
      title: 'Loud Panic Alarm Siren',
      subtitle: 'High Decibel Acoustic Deterrent',
      badge: '110 dB SIREN',
      icon: Volume2,
      accentColor: 'rose',
      renderGraphic: () => (
        <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-[#FFF0F3] via-white to-[#FFE4EC] border border-[#FFCCE1] flex flex-col items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-all">
          <div className="flex items-center space-x-1.5 mb-2">
            <div className="w-2 h-8 bg-rose rounded-full animate-bounce" />
            <div className="w-2 h-12 bg-rose-light rounded-full animate-bounce [animation-delay:0.1s]" />
            <div className="w-2 h-16 bg-emergency rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-12 bg-rose-light rounded-full animate-bounce [animation-delay:0.3s]" />
            <div className="w-2 h-8 bg-rose rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
          <span className="text-xs font-black text-tichi-text">High-Decibel Panic Sound Siren</span>
          <span className="text-[10px] font-mono font-extrabold text-emergency mt-0.5">INSTANT HARASSER DETERRENT</span>
        </div>
      ),
      description: 'Emits a piercing high-decibel audio frequency to shock potential assailants and attract immediate surrounding public attention.',
    },
  ];

  const filteredItems = activeTab === 'ALL'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden">
      <PublicNavbar />

      {/* BACKGROUND AMBIENT GLOW MESHES */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-rose/15 blur-[150px] top-[-100px] left-[-200px] pointer-events-none" />
      <div className="absolute w-[700px] h-[700px] rounded-full bg-gold/15 blur-[150px] bottom-[100px] right-[-200px] pointer-events-none" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 relative z-10">
        
        {/* TOP HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white text-rose border border-rose/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <ImageIcon className="w-4 h-4 text-rose animate-pulse" />
            <span>PLATFORM VISUAL SHOWCASE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-tichi-text">
            Designed for Simplicity, Speed & Safety
          </h1>
          <p className="text-tichi-muted text-base font-medium leading-relaxed">
            Explore interactive previews of Veagle Safety SOS’s emergency response interfaces, GPS tracking, and safety tools.
          </p>

          {/* CATEGORY FILTER TABS */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {['ALL', 'EMERGENCY', 'TRACKING', 'NETWORK', 'COMMAND'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === cat
                    ? 'btn-baby-pink shadow-coral-glow'
                    : 'bg-white text-tichi-muted border border-[#FFCCE1] hover:text-tichi-text hover:bg-blush-subtle'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 6 TOP-NOTCH UNIQUE GALLERY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isGold = item.accentColor === 'gold';
            return (
              <div
                key={item.id}
                className="card-antique-pink p-6 space-y-5 flex flex-col justify-between group hover:border-rose transition-all"
              >
                <div className="space-y-4">
                  
                  {/* CARD GRAPHIC PREVIEW */}
                  {item.renderGraphic()}

                  {/* TITLE & BADGE */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isGold ? 'bg-gold/15 text-gold-dark border border-gold/30' : 'bg-rose/10 text-rose border border-rose/30'
                      }`}>
                        {item.badge}
                      </span>
                      <Icon className={`w-4 h-4 ${isGold ? 'text-gold-dark' : 'text-rose'}`} />
                    </div>

                    <h3 className="text-lg font-black text-tichi-text group-hover:text-rose transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-bold text-tichi-muted">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-tichi-muted leading-relaxed font-semibold">
                    {item.description}
                  </p>
                </div>

                {/* BOTTOM ACTION LINK */}
                <div className="pt-3 border-t border-blush-border flex items-center justify-between text-xs font-black">
                  <span className={isGold ? 'text-gold-dark' : 'text-rose'}>Feature Live in App</span>
                  <ArrowRight className="w-4 h-4 text-tichi-muted group-hover:translate-x-1 group-hover:text-rose transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CTA BANNER */}
        <div className="card-antique-pink p-8 sm:p-10 text-center space-y-6 max-w-4xl mx-auto border-2 border-rose/40 shadow-coral-glow">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose via-rose-light to-gold text-white flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-tichi-text">
              Ready to Protect Yourself & Your Loved Ones?
            </h2>
            <p className="text-xs sm:text-sm text-tichi-muted font-medium max-w-xl mx-auto">
              Get complete 365-day emergency SOS protection for just ₹24/year. Instant setup in less than 2 minutes.
            </p>
          </div>
          <Link
            href="/auth?mode=register"
            className="inline-flex btn-baby-pink px-8 py-4 text-xs font-black uppercase tracking-wider space-x-2"
          >
            <span>REGISTER FOR ₹24 YEARLY PLAN</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </section>
    </div>
  );
}
