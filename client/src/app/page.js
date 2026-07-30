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

import { MagneticButton } from '../components/ui/MagneticButton.js';

export default function LandingPage() {
  const { token, user } = useSelector((state) => state?.auth || {});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted && (token || (typeof window !== 'undefined' && localStorage.getItem('tichi_token')));
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <div style={{ minHeight: '100vh', background: '#FFF0F3', fontFamily: 'Manrope, sans-serif', color: '#2A0826' }}>
      <PublicNavbar />

      {/* TOP NOTIFICATION BANNER */}
      {isLoggedIn && (
        <div style={{
          background: 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
          color: '#fff', textAlign: 'center', padding: '12px 20px',
          position: 'relative', zIndex: 10,
          boxShadow: '0 4px 15px rgba(255, 92, 138, 0.3)',
        }}>
          <div style={{
            maxWidth: '1280px', margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '12px', flexWrap: 'wrap', fontSize: '13px', fontWeight: 800,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} />
              <span>Welcome Back, <strong style={{ color: '#FFE600' }}>{user?.fullName || 'Sakhi Member'}</strong>! Active Protection Enabled.</span>
            </div>
            <MagneticButton pullStrength={0.2}>
              <Link href={isSuperAdmin ? '/admin' : '/dashboard'} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: '#FFFFFF', color: '#FF2A6D',
                padding: '4px 14px', borderRadius: '999px',
                fontSize: '11px', fontWeight: 900, textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}>
                {isSuperAdmin ? <Crown size={13} /> : <LayoutDashboard size={13} />}
                <span>{isSuperAdmin ? 'Go to Admin Panel' : 'Go to Dashboard'}</span>
                <ArrowRight size={13} />
              </Link>
            </MagneticButton>
          </div>
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

        {/* MAGNETIC HERO CTA BUTTONS */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: 'clamp(14px,3vw,24px)', marginBottom: 'clamp(48px,8vw,80px)',
        }}>
          {isLoggedIn ? (
            <>
              <MagneticButton pullStrength={0.4}>
                <Link href={isSuperAdmin ? '/admin' : '/dashboard'} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  background: 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
                  color: '#fff', fontWeight: 900, fontSize: 'clamp(12px,2vw,15px)',
                  padding: 'clamp(14px,2.2vw,18px) clamp(28px,4vw,42px)', borderRadius: '20px',
                  textDecoration: 'none', boxShadow: '0 8px 30px rgba(255,92,138,0.45)',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                  {isSuperAdmin ? <Crown size={18} /> : <LayoutDashboard size={18} />}
                  <span>{isSuperAdmin ? 'ADMIN PANEL' : 'MY DASHBOARD'}</span>
                  <ArrowRight size={16} />
                </Link>
              </MagneticButton>

              <MagneticButton pullStrength={0.35}>
                <Link href="/profile" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  background: 'rgba(255,255,255,0.98)', color: '#2A0826',
                  fontWeight: 800, fontSize: 'clamp(12px,2vw,15px)',
                  padding: 'clamp(14px,2.2vw,18px) clamp(24px,3vw,34px)', borderRadius: '20px',
                  textDecoration: 'none', border: '2px solid #FFCCE1',
                  boxShadow: '0 6px 22px rgba(42,8,38,0.08)', textTransform: 'uppercase',
                }}>
                  <Shield size={16} color="#FF5C8A" />
                  <span>MY PROFILE</span>
                </Link>
              </MagneticButton>
            </>
          ) : (
            <>
              <MagneticButton pullStrength={0.4}>
                <Link href="/auth?mode=register" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  background: 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
                  color: '#fff', fontWeight: 900, fontSize: 'clamp(12px,2vw,15px)',
                  padding: 'clamp(14px,2.2vw,18px) clamp(28px,4vw,42px)', borderRadius: '20px',
                  textDecoration: 'none', boxShadow: '0 8px 30px rgba(255,92,138,0.45)',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                  <span>PROTECT YOURSELF NOW</span>
                  <ArrowRight size={16} />
                </Link>
              </MagneticButton>

              <MagneticButton pullStrength={0.35}>
                <Link href="/about" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  background: 'rgba(255,255,255,0.98)', color: '#2A0826',
                  fontWeight: 800, fontSize: 'clamp(12px,2vw,15px)',
                  padding: 'clamp(14px,2.2vw,18px) clamp(24px,3vw,34px)', borderRadius: '20px',
                  textDecoration: 'none', border: '2px solid #FFCCE1',
                  boxShadow: '0 6px 22px rgba(42,8,38,0.08)', textTransform: 'uppercase',
                }}>
                  <Shield size={16} color="#FF5C8A" />
                  <span>HOW IT WORKS</span>
                </Link>
              </MagneticButton>
            </>
          )}
        </div>

        {/* FEATURE CARDS WITH MAGNETIC HOVER */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: 'clamp(14px,3vw,24px)',
          maxWidth: '1000px', margin: '0 auto', textAlign: 'left',
        }}>
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
              icon: Users, color: '#E6A100',
              title: 'Trusted Guardian Circle',
              desc: 'Build your personal network of family & emergency guardians for automated response alerts.'
            },
          ].map((item, idx) => (
            <MagneticButton key={idx} pullStrength={0.2} style={{ width: '100%' }}>
              <div className="card-antique-pink" style={{
                padding: 'clamp(20px,4vw,32px)', borderRadius: '24px',
                height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '16px',
                    background: '#FFF0F3', border: '1px solid #FFCCE1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '16px', boxShadow: '0 4px 12px rgba(255,92,138,0.15)',
                  }}>
                    <item.icon size={24} color={item.color} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#2A0826', marginBottom: '8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#684E67', fontWeight: 600, lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </MagneticButton>
          ))}
        </div>

      </section>

      {/* STATS SECTION WITH MAGNETIC HOVER */}
      <section style={{
        background: 'rgba(255,255,255,0.95)', borderTop: '2px solid #FFCCE1', borderBottom: '2px solid #FFCCE1',
        padding: 'clamp(40px,6vw,70px) clamp(16px,4vw,32px)', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
          {[
            { value: '50,000+', label: 'Protected Sakhi Members', icon: Heart },
            { value: '99.9%', label: 'Emergency Signal Delivery', icon: Zap },
            { value: '< 3 Sec', label: 'Alert Dispatch Time', icon: Bell },
            { value: '24/7/365', label: 'Active Command Monitoring', icon: ShieldCheck },
          ].map((stat, i) => (
            <MagneticButton key={i} pullStrength={0.25}>
              <div style={{
                background: '#FFF0F3', border: '1.5px solid #FFCCE1',
                padding: '24px 16px', borderRadius: '20px',
                boxShadow: '0 4px 16px rgba(255,92,138,0.08)',
              }}>
                <stat.icon size={24} color="#FF5C8A" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#FF2A6D', lineHeight: 1.1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#684E67', marginTop: '6px', textTransform: 'uppercase' }}>
                  {stat.label}
                </div>
              </div>
            </MagneticButton>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
