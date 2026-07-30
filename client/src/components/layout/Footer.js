'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, PhoneCall, Mail, MapPin, ExternalLink } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton.js';

export const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, #FFF0F3 0%, #FFE6ED 100%)',
      borderTop: '2px solid #FFCCE1',
      color: '#2A0826',
      fontFamily: 'Manrope, sans-serif',
      padding: 'clamp(40px, 6vw, 64px) clamp(16px, 4vw, 40px) 24px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'clamp(24px, 4vw, 40px)',
          marginBottom: '40px',
        }}>
          {/* BRAND COLUMN */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
                width: '36px', height: '36px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', boxShadow: '0 4px 12px rgba(255,92,138,0.3)',
              }}>
                <ShieldCheck size={22} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#2A0826', letterSpacing: '-0.02em' }}>
                Sakhi Suraksha SOS
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#684E67', fontWeight: 600, lineHeight: 1.6, marginBottom: '16px' }}>
              Empowering women and girls across India with instant 3-second SOS alerts, real-time GPS movement tracking, and automated emergency notification dispatch.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#FF2A6D', fontWeight: 800 }}>
              <Heart size={14} fill="#FF2A6D" />
              <span>Dedicated 24/7 Women Protection</span>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#2A0826', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', fontWeight: 700 }}>
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Photo Gallery', href: '/gallery' },
                { name: 'Protection Plans', href: '/pricing' },
                { name: 'Contact & Support', href: '/contact' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} style={{ color: '#684E67', textDecoration: 'none', transition: 'color 0.2s ease' }}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* EMERGENCY HELPLINES */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#2A0826', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Emergency Helplines (India)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', fontWeight: 700 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF2A6D' }}>
                <PhoneCall size={16} />
                <span>Women Helpline: <strong>1091</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2A0826' }}>
                <PhoneCall size={16} />
                <span>National Emergency: <strong>112</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#684E67' }}>
                <PhoneCall size={16} />
                <span>Cyber Crime Helpline: <strong>1930</strong></span>
              </div>
            </div>
          </div>

          {/* CONTACT & SUPPORT */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 900, color: '#2A0826', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Contact & Assistance
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#684E67', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#FF5C8A" />
                <span>Maharashtra, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#FF5C8A" />
                <span>support@sakhisuraksha.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT STRIP */}
        <div style={{
          borderTop: '1px solid #FFCCE1',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justify: 'space-between',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12px',
          color: '#684E67',
          fontWeight: 700,
        }}>
          <div>
            © {new Date().getFullYear()} Sakhi Suraksha SOS. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
