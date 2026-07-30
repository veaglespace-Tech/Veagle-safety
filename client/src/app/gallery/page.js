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
  Maximize2,
  X
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedHeading } from '../../components/common/AnimatedHeading.jsx';
import { MagneticButton } from '../../components/ui/MagneticButton.js';

export const dynamic = 'force-dynamic';

export default function PlatformGalleryPage() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState(null);

  const galleryItems = [
    {
      id: 'sos_button',
      category: 'EMERGENCY',
      title: 'Emergency SOS Radar Trigger',
      subtitle: 'Instant 3-Second Hold Radar Broadcast',
      badge: 'SUB-SECOND DISPATCH',
      icon: Radio,
      accentColor: 'rose',
      renderGraphic: () => (
        <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-[#FFF0F3] via-white to-[#FFE4EC] border-1.5 border-[#FFCCE1] flex flex-col items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-all shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FF5C8A]/10 via-transparent to-transparent animate-pulse pointer-events-none" />
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#FF2A6D] animate-ping opacity-75" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] border-4 border-white text-white flex flex-col items-center justify-center shadow-[0_8px_25px_rgba(255,42,109,0.45)]">
              <Radio className="w-8 h-8 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">3s SOS</span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-black text-[#FF2A6D] mt-3 bg-[#FFF0F3] px-3 py-1 rounded-full border-1.5 border-[#FF5C8A] shadow-sm">
            HOLD FOR 3 SECONDS
          </span>
        </div>
      ),
      description: 'Press & hold the center SOS trigger to instantly activate real-time GPS tracking and send high-priority alerts to family & HQ.',
    },
    {
      id: 'gps_map',
      category: 'TRACKING',
      title: 'Live GPS Satellite Map Link',
      subtitle: 'Real-Time Encrypted Web Map',
      badge: '100% ENCRYPTED',
      icon: MapPin,
      accentColor: 'rose',
      renderGraphic: () => (
        <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-[#FFF8FA] via-white to-[#FFF0F3] border-1.5 border-[#FFCCE1] flex flex-col items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-all shadow-inner">
          <div className="w-full bg-white/95 p-3.5 rounded-2xl border-1.5 border-[#FFCCE1] shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
                <span className="text-[10px] font-black text-[#2A0826] uppercase">GPS Satellite Locked</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#FF2A6D]">Accuracy: ~3m</span>
            </div>
            <div className="flex items-center space-x-2 bg-[#FFF0F3] p-2.5 rounded-xl border border-[#FFCCE1] text-[11px] font-extrabold text-[#2A0826]">
              <MapPin className="w-4 h-4 text-[#FF5C8A] shrink-0" />
              <span className="truncate">18.5204° N, 73.8567° E — MG Road, Pune</span>
            </div>
          </div>
          <div className="inline-flex items-center space-x-1.5 text-[10px] font-black text-[#684E67] mt-3">
            <Activity className="w-3.5 h-3.5 text-[#059669]" />
            <span>Web Tracking Link Active</span>
          </div>
        </div>
      ),
      description: 'Generates an end-to-end encrypted live map link accessible by trusted contacts across any browser or mobile phone.',
    },
    {
      id: 'trusted_contacts',
      category: 'NETWORK',
      title: 'Trusted Guardian Network',
      subtitle: 'Instant Multi-Channel Dispatch',
      badge: '5 CONTACTS NETWORK',
      icon: Users,
      accentColor: 'rose',
      renderGraphic: () => (
        <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-[#FFF0F3] via-white to-[#FFE6EE] border-1.5 border-[#FFCCE1] flex flex-col items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-all shadow-inner">
          <div className="flex items-center -space-x-2 mb-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF5C8A] to-[#FF2A6D] text-white border-2 border-white flex items-center justify-center font-black text-xs shadow-md">P1</div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FFE6EE] to-[#FFCCE1] text-[#2A0826] border-2 border-white flex items-center justify-center font-black text-xs shadow-md">P2</div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF5C8A] to-[#FF2A6D] text-white border-2 border-white flex items-center justify-center font-black text-xs shadow-md">P3</div>
            <div className="w-11 h-11 rounded-full bg-[#FFF0F3] text-[#FF5C8A] border-2 border-white flex items-center justify-center font-black text-xs shadow-md">+2</div>
          </div>
          <span className="text-xs font-black text-[#2A0826]">Guardian Emergency Broadcast</span>
          <span className="text-[10px] font-mono font-black text-[#FF2A6D] bg-white px-3 py-1 rounded-full border-1.5 border-[#FFCCE1] mt-1.5 shadow-sm">
            PARALLEL SMS & CALL ALERTS
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
        <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-[#FFF0F3] via-white to-[#FFE4EC] border-1.5 border-[#FFCCE1] flex flex-col items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-all shadow-inner">
          <div className="w-16 h-16 rounded-full border-4 border-[#FFCCE1] border-t-[#FF2A6D] flex items-center justify-center mb-2 animate-spin-slow shadow-sm">
            <span className="text-xs font-mono font-black text-[#FF2A6D]">15:00</span>
          </div>
          <span className="text-xs font-black text-[#2A0826]">Solo Travel Check-in</span>
          <span className="text-[10px] font-mono font-bold text-[#684E67] mt-1">AUTO-ESCALATION IF UNANSWERED</span>
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
      accentColor: 'rose',
      renderGraphic: () => (
        <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-[#FFF0F3] via-white to-[#FFE6EE] border-1.5 border-[#FFCCE1] flex flex-col items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-all shadow-inner">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5C8A] to-[#FF2A6D] text-white border-1.5 border-white flex items-center justify-center mb-2.5 shadow-md">
            <Crown className="w-6 h-6" />
          </div>
          <span className="text-xs font-black text-[#2A0826]">Company Headquarters Portal</span>
          <span className="text-[10px] font-mono font-black text-[#FF2A6D] bg-white px-3 py-1 rounded-full border-1.5 border-[#FFCCE1] mt-1.5 shadow-sm">
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
        <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-[#FFF0F3] via-white to-[#FFE4EC] border-1.5 border-[#FFCCE1] flex flex-col items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition-all shadow-inner">
          <div className="flex items-center space-x-1.5 mb-2.5">
            <div className="w-2.5 h-9 bg-[#FF5C8A] rounded-full animate-bounce" />
            <div className="w-2.5 h-13 bg-[#FFCCE1] rounded-full animate-bounce [animation-delay:0.1s]" />
            <div className="w-2.5 h-16 bg-[#FF2A6D] rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2.5 h-13 bg-[#FFCCE1] rounded-full animate-bounce [animation-delay:0.3s]" />
            <div className="w-2.5 h-9 bg-[#FF5C8A] rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
          <span className="text-xs font-black text-[#2A0826]">High-Decibel Panic Siren</span>
          <span className="text-[10px] font-mono font-black text-[#FF2A6D] mt-1">INSTANT HARASSER DETERRENT</span>
        </div>
      ),
      description: 'Emits a piercing high-decibel audio frequency to shock potential assailants and attract immediate surrounding public attention.',
    },
  ];

  const categories = ['ALL', 'EMERGENCY', 'TRACKING', 'NETWORK', 'AUTOMATION', 'COMMAND'];

  const filteredItems = activeTab === 'ALL'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeTab);

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-[#2A0826] font-sans relative overflow-hidden">
      <PublicNavbar />

      {/* BACKGROUND AMBIENT GLOW MESHES */}
      <div className="absolute w-[800px] h-[800px] rounded-full bg-[#FF5C8A]/12 blur-[170px] top-[-140px] left-[-240px] pointer-events-none" />
      <div className="absolute w-[750px] h-[750px] rounded-full bg-[#FFCCE1]/25 blur-[160px] bottom-[60px] right-[-220px] pointer-events-none" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14 relative z-10">
        
        {/* TOP HERO HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white/90 text-[#FF5C8A] border-1.5 border-[#FFCCE1] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#FF5C8A] animate-pulse" />
            <span className="bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] bg-clip-text text-transparent">
              PLATFORM VISUAL SHOWCASE
            </span>
          </div>

          <AnimatedHeading as="h1" variant="shimmer" className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            <span className="heading-gradient-hero">Designed for </span>
            <span className="heading-highlight-pill">Simplicity, Speed & Safety</span>
          </AnimatedHeading>

          <p className="text-[#684E67] text-base sm:text-lg font-bold max-w-2xl mx-auto leading-relaxed">
            Explore interactive previews of Sakhi Suraksha SOS’s emergency response interfaces, GPS tracking, and safety tools.
          </p>

          {/* CATEGORY FILTER CAPSULE BAR */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            <div className="nav-chip-capsule flex flex-wrap items-center gap-1.5 p-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer ${
                    activeTab === cat
                      ? 'bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white shadow-md shadow-[#FF5C8A]/30 scale-105'
                      : 'text-[#2A0826] hover:bg-white hover:text-[#FF5C8A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 6 TOP-NOTCH UNIQUE GALLERY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl space-y-5 flex flex-col justify-between group border-1.5 border-[#FFCCE1] hover:border-[#FF5C8A] shadow-[0_10px_30px_rgba(255,92,138,0.10)] hover:shadow-[0_16px_40px_rgba(255,92,138,0.22)] transition-all duration-300 cursor-pointer"
              >
                <div className="space-y-4">
                  
                  {/* CARD GRAPHIC PREVIEW WITH LIGHTBOX HOVER ICON */}
                  <div className="relative">
                    {item.renderGraphic()}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#FF5C8A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* TITLE & BADGE */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider bg-[#FFF0F3] text-[#FF2A6D] border-1.5 border-[#FF5C8A]">
                        {item.badge}
                      </span>
                      <Icon className="w-5 h-5 text-[#FF5C8A]" />
                    </div>

                    <h3 className="text-lg font-black text-[#2A0826] group-hover:text-[#FF2A6D] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-extrabold text-[#684E67]">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-[#684E67] leading-relaxed font-bold">
                    {item.description}
                  </p>
                </div>

                {/* BOTTOM ACTION LINK */}
                <div className="pt-3.5 border-t-1.5 border-[#FFCCE1] flex items-center justify-between text-xs font-black text-[#FF2A6D]">
                  <span>Click to Preview Feature</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CTA BANNER WITH MAGNETIC BUTTON */}
        <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-12 text-center space-y-6 max-w-4xl mx-auto rounded-3xl border-1.5 border-[#FFCCE1] shadow-[0_12px_40px_rgba(255,92,138,0.14)] relative overflow-hidden">
          {/* ACCENT GLOW STRIP */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F]" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2A0826]">
              Ready to Protect Yourself & Your Loved Ones?
            </h2>
            <p className="text-xs sm:text-sm text-[#684E67] font-bold max-w-xl mx-auto leading-relaxed">
              Get complete 365-day emergency SOS protection for just ₹24/year (only ₹2/month). Setup in under 2 minutes.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <MagneticButton pullStrength={0.35}>
              <Link
                href="/auth?mode=register"
                className="bg-gradient-to-r from-[#FFF0F3] via-[#FFE6EE] to-[#FFCCE1] border-1.5 border-[#FF5C8A] text-[#2A0826] hover:bg-gradient-to-r hover:from-[#FF5C8A] hover:to-[#FF2A6D] hover:text-white hover:border-transparent px-9 py-4 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-[0_4px_16px_rgba(255,92,138,0.22)] hover:shadow-[0_8px_28px_rgba(255,42,109,0.50)] flex items-center justify-center space-x-3 cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <span>REGISTER FOR ₹24 YEARLY PLAN</span>
                <ArrowRight className="w-4 h-4 text-[#FF2A6D] group-hover:text-white shrink-0" />
              </Link>
            </MagneticButton>
          </div>
        </div>

      </section>

      {/* FULLSCREEN LIGHTBOX PREVIEW MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-[#2A0826]/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border-2 border-[#FF5C8A] shadow-2xl relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FFF0F3] text-[#FF5C8A] flex items-center justify-center hover:bg-[#FF5C8A] hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider bg-[#FFF0F3] text-[#FF2A6D] border-1.5 border-[#FF5C8A]">
                {selectedItem.badge}
              </span>
              <h3 className="text-2xl font-black text-[#2A0826]">{selectedItem.title}</h3>
              {selectedItem.renderGraphic()}
              <p className="text-xs text-[#684E67] font-bold leading-relaxed">{selectedItem.description}</p>
            </div>

            <div className="flex justify-center pt-2">
              <MagneticButton pullStrength={0.3}>
                <Link
                  href="/auth?mode=register"
                  className="w-full bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-center shadow-md flex items-center justify-center space-x-2"
                >
                  <span>GET FULL ACCESS NOW</span>
                  <Zap className="w-4 h-4" />
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
