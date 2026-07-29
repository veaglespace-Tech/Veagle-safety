'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PublicNavbar } from '../components/layout/PublicNavbar.js';
import { Shield, ShieldCheck, Zap, MapPin, BellRing, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFF0F3', fontFamily: 'Manrope, sans-serif' }}>
      <PublicNavbar />

      {/* BACKGROUND GLOWS */}
      <div style={{
        position: 'fixed', top: '-100px', left: '-200px',
        width: '700px', height: '700px', borderRadius: '50%',
        background: 'rgba(255,92,138,0.12)', filter: 'blur(120px)',
        pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '50px', right: '-200px',
        width: '700px', height: '700px', borderRadius: '50%',
        background: 'rgba(230,161,0,0.10)', filter: 'blur(120px)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* HERO SECTION */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 20px 80px', textAlign: 'center' }}>

        {/* BADGE */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.95)', border: '1px solid #FFCCE1',
          padding: '10px 22px', borderRadius: '999px',
          fontSize: '11px', fontWeight: 900, textTransform: 'uppercase',
          letterSpacing: '0.1em', color: '#2A0826', marginBottom: '28px',
          boxShadow: '0 2px 12px rgba(255,92,138,0.12)'
        }}>
          <ShieldCheck size={15} color="#FF5C8A" />
          <span>India's Most Trusted Personal Safety Platform</span>
        </div>

        {/* TITLE */}
        <h1 style={{
          fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: 900,
          color: '#2A0826', margin: '0 0 12px', lineHeight: 1.1,
          letterSpacing: '-0.02em'
        }}>
          Sakhi Suraksha SOS
        </h1>
        <p style={{
          fontSize: 'clamp(14px, 2vw, 20px)', color: '#684E67',
          fontWeight: 700, maxWidth: '580px', margin: '0 auto 40px',
          lineHeight: 1.6
        }}>
          A modern personal safety companion for girls & women — instant emergency alerts,
          live GPS tracking, and 24/7 command dispatch.
        </p>

        {/* MARQUEE STRIP */}
        <div style={{
          width: '100%', borderTop: '2px solid #FFCCE1', borderBottom: '2px solid #FFCCE1',
          background: 'rgba(255,255,255,0.95)', padding: '14px 0',
          overflow: 'hidden', marginBottom: '40px'
        }}>
          <div style={{
            display: 'flex', gap: '48px', whiteSpace: 'nowrap',
            animation: 'marqueeScroll 20s linear infinite', width: 'max-content'
          }}>
            {['⚡ INSTANT 3-SECOND SOS PROTECTION', '📍 24/7 LIVE GPS TRACKING', '🔔 GUARDIAN SIREN BROADCAST', '🛡️ 365-DAY WOMEN SAFETY NETWORK',
              '⚡ INSTANT 3-SECOND SOS PROTECTION', '📍 24/7 LIVE GPS TRACKING', '🔔 GUARDIAN SIREN BROADCAST', '🛡️ 365-DAY WOMEN SAFETY NETWORK'].map((item, i) => (
              <span key={i} style={{ fontSize: '15px', fontWeight: 900, color: '#FF5C8A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* CTA BUTTONS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginBottom: '64px' }}>
          <Link href="/auth?mode=register" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
            color: '#fff', fontWeight: 900, fontSize: '14px',
            padding: '16px 36px', borderRadius: '18px', textDecoration: 'none',
            boxShadow: '0 0 28px rgba(255,92,138,0.40)',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            transition: 'transform 0.2s'
          }}>
            <span>PROTECT YOURSELF NOW</span>
            <ArrowRight size={18} />
          </Link>

          <Link href="/about" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.95)', color: '#2A0826',
            fontWeight: 800, fontSize: '14px',
            padding: '16px 32px', borderRadius: '18px', textDecoration: 'none',
            border: '1.5px solid #FFCCE1',
            boxShadow: '0 4px 16px rgba(42,8,38,0.06)',
            letterSpacing: '0.03em', textTransform: 'uppercase',
          }}>
            <Shield size={18} color="#FF5C8A" />
            <span>HOW IT PROTECTS YOU</span>
          </Link>
        </div>

        {/* FEATURES GRID */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px', maxWidth: '1000px', margin: '0 auto', textAlign: 'left'
        }}>
          {[
            { icon: Zap, title: '3-Second SOS Trigger', desc: 'Press and hold the SOS button for 3 seconds to immediately broadcast emergency alerts to 5 trusted contacts.' },
            { icon: MapPin, title: 'Live GPS Satellite Stream', desc: 'Real-time encrypted geolocation tracking with accuracy pin and Google Maps integration for guardians.' },
            { icon: BellRing, title: 'Guardian Siren Broadcast', desc: 'Triggers loud siren alarms and push notifications directly on your trusted guardians\' devices instantly.' },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.97)', border: '2px solid #FF5C8A',
                borderRadius: '24px', padding: '32px',
                boxShadow: '0 8px 30px rgba(255,92,138,0.10)'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'rgba(255,92,138,0.10)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px', border: '1px solid rgba(255,92,138,0.2)'
                }}>
                  <Icon size={22} color="#FF5C8A" />
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#2A0826', margin: '0 0 10px' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#684E67', fontWeight: 600, lineHeight: 1.65, margin: 0 }}>
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '2px solid #FFCCE1', background: '#ffffff',
        padding: '28px 20px', textAlign: 'center',
        fontSize: '12px', fontWeight: 700, color: '#684E67'
      }}>
        <p suppressHydrationWarning style={{ margin: 0 }}>
          &copy; {year} Sakhi Suraksha SOS. Built with care for Women's Safety in India. 🌸
        </p>
      </footer>

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
