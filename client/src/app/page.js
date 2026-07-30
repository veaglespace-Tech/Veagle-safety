'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { PublicNavbar } from '../components/layout/PublicNavbar.js';
import { Shield, ShieldCheck, Zap, MapPin, BellRing, ArrowRight, LayoutDashboard, Crown, Star, Lock } from 'lucide-react';

export default function LandingPage() {
  const [year, setYear] = useState(2026);
  const { token, user } = useSelector((state) => state?.auth || {});

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isLoggedIn = !!token;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFF0F3', fontFamily: 'Manrope, sans-serif', overflowX: 'hidden' }}>
      <PublicNavbar />

      {/* BACKGROUND GLOWS */}
      <div style={{
        position: 'fixed', top: '-150px', left: '-200px',
        width: 'min(700px, 100vw)', height: 'min(700px, 100vw)', borderRadius: '50%',
        background: 'rgba(255,92,138,0.10)', filter: 'blur(100px)',
        pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '0px', right: '-150px',
        width: 'min(600px, 90vw)', height: 'min(600px, 90vw)', borderRadius: '50%',
        background: 'rgba(230,161,0,0.08)', filter: 'blur(100px)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* LOGGED IN USER BANNER */}
      {isLoggedIn && (
        <div style={{
          background: isSuperAdmin
            ? 'linear-gradient(135deg, #2A0826, #5C1A55)'
            : 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
          color: '#fff', textAlign: 'center',
          padding: '12px 20px', position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <span style={{ fontSize: '13px', fontWeight: 800 }}>
            {isSuperAdmin
              ? `👑 Super Admin logged in as ${user?.fullName || 'Admin'}`
              : `🛡️ Welcome back, ${user?.fullName?.split(' ')[0] || 'Sakhi'}!`}
          </span>
          <Link href={isSuperAdmin ? '/admin' : '/dashboard'} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.20)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.4)',
            padding: '6px 16px', borderRadius: '999px',
            fontSize: '12px', fontWeight: 900, textDecoration: 'none',
            backdropFilter: 'blur(4px)',
          }}>
            {isSuperAdmin ? <Crown size={13} /> : <LayoutDashboard size={13} />}
            <span>{isSuperAdmin ? 'Go to Admin Panel' : 'Go to Dashboard'}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* HERO SECTION */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(40px,8vw,80px) clamp(16px,5vw,40px) clamp(60px,8vw,100px)', textAlign: 'center' }}>

        {/* BADGE */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.95)', border: '1px solid #FFCCE1',
          padding: 'clamp(8px,2vw,11px) clamp(16px,4vw,24px)', borderRadius: '999px',
          fontSize: 'clamp(9px,2vw,11px)', fontWeight: 900, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: '#2A0826', marginBottom: 'clamp(20px,4vw,32px)',
          boxShadow: '0 2px 12px rgba(255,92,138,0.12)',
          flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <ShieldCheck size={14} color="#FF5C8A" />
          <span>India's Most Trusted Personal Safety Platform</span>
        </div>

        {/* MAIN TITLE */}
        <h1 style={{
          fontSize: 'clamp(32px, 7vw, 76px)', fontWeight: 900,
          color: '#2A0826', margin: '0 0 clamp(12px,2vw,18px)',
          lineHeight: 1.08, letterSpacing: '-0.025em',
          maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto',
        }}>
          Sakhi Suraksha SOS
        </h1>

        <p style={{
          fontSize: 'clamp(14px, 2.2vw, 20px)', color: '#684E67',
          fontWeight: 700, maxWidth: '560px', margin: '0 auto clamp(32px,5vw,52px)',
          lineHeight: 1.65,
        }}>
          A modern personal safety companion for girls & women — instant emergency alerts,
          live GPS tracking, and 24/7 command dispatch.
        </p>

        {/* MARQUEE STRIP */}
        <div style={{
          width: '100vw', marginLeft: 'calc(-50vw + 50%)',
          borderTop: '2px solid #FFCCE1', borderBottom: '2px solid #FFCCE1',
          background: 'rgba(255,255,255,0.95)', padding: 'clamp(10px,2vw,16px) 0',
          overflow: 'hidden', marginBottom: 'clamp(32px,5vw,52px)',
        }}>
          <div style={{
            display: 'flex', gap: 'clamp(32px,5vw,56px)', whiteSpace: 'nowrap',
            animation: 'marqueeScroll 20s linear infinite', width: 'max-content',
          }}>
            {[
              '⚡ INSTANT 3-SECOND SOS', '📍 24/7 LIVE GPS TRACKING',
              '🔔 GUARDIAN SIREN BROADCAST', '🛡️ 365-DAY WOMEN SAFETY',
              '⚡ INSTANT 3-SECOND SOS', '📍 24/7 LIVE GPS TRACKING',
              '🔔 GUARDIAN SIREN BROADCAST', '🛡️ 365-DAY WOMEN SAFETY',
            ].map((item, i) => (
              <span key={i} style={{
                fontSize: 'clamp(12px,2vw,16px)', fontWeight: 900,
                color: '#FF5C8A', textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* CTA BUTTONS */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: 'clamp(12px,3vw,20px)', marginBottom: 'clamp(48px,8vw,80px)',
        }}>
          {isLoggedIn ? (
            <>
              <Link href={isSuperAdmin ? '/admin' : '/dashboard'} style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
                color: '#fff', fontWeight: 900, fontSize: 'clamp(12px,2vw,15px)',
                padding: 'clamp(12px,2vw,16px) clamp(24px,4vw,38px)', borderRadius: '18px',
                textDecoration: 'none', boxShadow: '0 0 28px rgba(255,92,138,0.40)',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                {isSuperAdmin ? <Crown size={18} /> : <LayoutDashboard size={18} />}
                <span>{isSuperAdmin ? 'ADMIN PANEL' : 'MY DASHBOARD'}</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/profile" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.95)', color: '#2A0826',
                fontWeight: 800, fontSize: 'clamp(12px,2vw,15px)',
                padding: 'clamp(12px,2vw,16px) clamp(20px,3vw,30px)', borderRadius: '18px',
                textDecoration: 'none', border: '1.5px solid #FFCCE1',
                boxShadow: '0 4px 16px rgba(42,8,38,0.06)', textTransform: 'uppercase',
              }}>
                <Shield size={16} color="#FF5C8A" />
                <span>MY PROFILE</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth?mode=register" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
                color: '#fff', fontWeight: 900, fontSize: 'clamp(12px,2vw,15px)',
                padding: 'clamp(12px,2vw,16px) clamp(24px,4vw,38px)', borderRadius: '18px',
                textDecoration: 'none', boxShadow: '0 0 28px rgba(255,92,138,0.40)',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                <span>PROTECT YOURSELF NOW</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/about" style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.95)', color: '#2A0826',
                fontWeight: 800, fontSize: 'clamp(12px,2vw,15px)',
                padding: 'clamp(12px,2vw,16px) clamp(20px,3vw,30px)', borderRadius: '18px',
                textDecoration: 'none', border: '1.5px solid #FFCCE1',
                boxShadow: '0 4px 16px rgba(42,8,38,0.06)', textTransform: 'uppercase',
              }}>
                <Shield size={16} color="#FF5C8A" />
                <span>HOW IT WORKS</span>
              </Link>
            </>
          )}
        </div>

        {/* FEATURE CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: 'clamp(14px,3vw,24px)',
          maxWidth: '1000px', margin: '0 auto', textAlign: 'left',
        }}>
          {[
            {
              icon: Zap, color: '#FF5C8A',
              title: '3-Second SOS Trigger',
              desc: 'Press and hold the SOS button for 3 seconds to immediately broadcast emergency alerts to 5 trusted contacts and command center.',
            },
            {
              icon: MapPin, color: '#FF2A6D',
              title: 'Live GPS Satellite Stream',
              desc: 'Real-time encrypted geolocation tracking with accuracy pin and Google Maps integration — guardians see you live.',
            },
            {
              icon: BellRing, color: '#E6A100',
              title: 'Guardian Siren Broadcast',
              desc: 'Triggers loud siren alarms and instant push notifications on all trusted guardians\' devices the moment SOS is activated.',
            },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.97)',
                border: '2px solid #FFCCE1',
                borderRadius: 'clamp(16px,3vw,24px)',
                padding: 'clamp(20px,4vw,32px)',
                boxShadow: '0 6px 28px rgba(255,92,138,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 14px 40px rgba(255,92,138,0.16)';
                e.currentTarget.style.borderColor = feat.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 28px rgba(255,92,138,0.08)';
                e.currentTarget.style.borderColor = '#FFCCE1';
              }}
              >
                <div style={{
                  width: 'clamp(40px,6vw,52px)', height: 'clamp(40px,6vw,52px)',
                  borderRadius: '14px',
                  background: `${feat.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 'clamp(12px,2vw,18px)',
                  border: `1px solid ${feat.color}30`,
                }}>
                  <Icon size={22} color={feat.color} />
                </div>
                <h3 style={{
                  fontSize: 'clamp(14px,2vw,18px)', fontWeight: 900,
                  color: '#2A0826', margin: '0 0 10px',
                }}>
                  {feat.title}
                </h3>
                <p style={{
                  fontSize: 'clamp(12px,1.5vw,14px)', color: '#684E67',
                  fontWeight: 600, lineHeight: 1.65, margin: 0,
                }}>
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* TRUST BADGES */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: 'clamp(10px,2vw,16px)', marginTop: 'clamp(40px,6vw,64px)',
        }}>
          {[
            { icon: Shield, text: '10,000+ Women Protected' },
            { icon: Star, text: '4.9★ Safety Rating' },
            { icon: Lock, text: 'Bank-Level Encryption' },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.90)', border: '1px solid #FFCCE1',
              padding: 'clamp(8px,1.5vw,11px) clamp(14px,2.5vw,22px)', borderRadius: '999px',
              fontSize: 'clamp(11px,1.5vw,13px)', fontWeight: 800, color: '#2A0826',
            }}>
              <Icon size={14} color="#FF5C8A" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '2px solid #FFCCE1', background: '#ffffff',
        padding: 'clamp(20px,4vw,32px) clamp(16px,5vw,40px)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
            gap: 'clamp(12px,3vw,24px)', marginBottom: '16px',
          }}>
            {[
              { href: '/about', label: 'About' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/contact', label: 'Contact' },
              { href: '/gallery', label: 'Gallery' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{
                fontSize: '12px', fontWeight: 800, color: '#684E67',
                textDecoration: 'none',
              }}>
                {label}
              </Link>
            ))}
          </div>
          <p suppressHydrationWarning style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#9B7C99' }}>
            &copy; {year} Sakhi Suraksha SOS · Built with ❤️ for Women's Safety in India 🌸
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
