'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, AlertTriangle, Users, User } from 'lucide-react';
import { useSOSStore } from '../../redux/useSOSStore.js';

export const BottomNavigation = () => {
  const pathname = usePathname();
  const { activeSession } = useSOSStore();
  const [mounted, setMounted] = useState(false);
  const [pressingSOS, setPressingSOS] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const navItems = [
    { path: '/dashboard',     label: 'Home',     icon: Home },
    { path: '/track-journey', label: 'Track',    icon: MapPin },
    { path: '/active-sos',    label: 'SOS',      icon: AlertTriangle, isCenter: true },
    { path: '/contacts',      label: 'Contacts', icon: Users },
    { path: '/profile',       label: 'Profile',  icon: User },
  ];

  if (!mounted) return null;

  return (
    <>
      {/* MAGIC FLOATING BOTTOM NAV */}
      <nav style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'calc(100% - 32px)',
        maxWidth: '480px',
        // Glassmorphism pill
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '999px',
        border: '1.5px solid rgba(255,204,225,0.80)',
        boxShadow: '0 8px 32px rgba(255,92,138,0.18), 0 2px 8px rgba(255,92,138,0.10), inset 0 1px 0 rgba(255,255,255,0.9)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        fontFamily: 'Manrope, sans-serif',
      }} className="lg:hidden">

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          /* ---- SOS CENTER BUTTON ---- */
          if (item.isCenter) {
            return (
              <Link
                key={item.path}
                href={item.path}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  position: 'relative',
                  marginTop: '-32px', // Elevate above navbar
                  textDecoration: 'none',
                }}
                onMouseDown={() => setPressingSOS(true)}
                onMouseUp={() => setPressingSOS(false)}
                onTouchStart={() => setPressingSOS(true)}
                onTouchEnd={() => setPressingSOS(false)}
              >
                {/* Outer pulse rings */}
                {activeSession && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '90px', height: '90px',
                      borderRadius: '50%',
                      background: 'rgba(255,42,109,0.15)',
                      animation: 'sosPulse1 1.8s ease-out infinite',
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '75px', height: '75px',
                      borderRadius: '50%',
                      background: 'rgba(255,42,109,0.20)',
                      animation: 'sosPulse2 1.8s ease-out infinite 0.4s',
                    }} />
                  </>
                )}

                {/* Idle glow ring */}
                {!activeSession && (
                  <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '72px', height: '72px',
                    borderRadius: '50%',
                    background: 'rgba(255,92,138,0.12)',
                    animation: 'idleGlow 2.5s ease-in-out infinite',
                  }} />
                )}

                {/* Main SOS button */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: activeSession
                    ? 'linear-gradient(135deg, #FF0043, #FF2A6D)'
                    : 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: activeSession
                    ? '0 0 0 4px rgba(255,0,67,0.25), 0 8px 24px rgba(255,42,109,0.5)'
                    : '0 0 0 3px rgba(255,92,138,0.20), 0 6px 20px rgba(255,42,109,0.40)',
                  border: '3px solid #fff',
                  transform: pressingSOS ? 'scale(0.92)' : 'scale(1)',
                  transition: 'transform 0.15s ease, box-shadow 0.2s ease',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <AlertTriangle
                    size={26}
                    color="#fff"
                    strokeWidth={2.5}
                    style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.25))' }}
                  />
                </div>

                <span style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  color: '#FF2A6D',
                  marginTop: '4px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {activeSession ? 'ACTIVE' : 'SOS'}
                </span>
              </Link>
            );
          }

          /* ---- REGULAR NAV ITEMS ---- */
          return (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '6px 10px',
                borderRadius: '16px',
                textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                background: isActive ? 'rgba(255,92,138,0.10)' : 'transparent',
                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                minWidth: '52px',
              }}
            >
              {/* Icon with active state */}
              <div style={{
                width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '10px',
                background: isActive ? 'rgba(255,92,138,0.12)' : 'transparent',
                transition: 'all 0.2s ease',
              }}>
                <Icon
                  size={20}
                  color={isActive ? '#FF5C8A' : '#9B7C99'}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>

              {/* Active dot indicator */}
              <div style={{
                width: isActive ? '18px' : '0px',
                height: '3px',
                borderRadius: '999px',
                background: 'linear-gradient(90deg, #FF5C8A, #FF2A6D)',
                marginTop: '2px',
                transition: 'width 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow: isActive ? '0 0 6px rgba(255,92,138,0.5)' : 'none',
              }} />

              <span style={{
                fontSize: '10px',
                fontWeight: isActive ? 900 : 700,
                color: isActive ? '#FF5C8A' : '#9B7C99',
                marginTop: '2px',
                transition: 'color 0.2s',
              }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom padding spacer so content doesn't hide behind nav */}
      <div style={{ height: '90px' }} className="lg:hidden" />

      {/* KEYFRAME ANIMATIONS */}
      <style>{`
        @keyframes sosPulse1 {
          0%   { transform: translate(-50%,-50%) scale(0.8); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(1.6); opacity: 0; }
        }
        @keyframes sosPulse2 {
          0%   { transform: translate(-50%,-50%) scale(0.8); opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(1.4); opacity: 0; }
        }
        @keyframes idleGlow {
          0%, 100% { transform: translate(-50%,-50%) scale(1);    opacity: 0.7; }
          50%       { transform: translate(-50%,-50%) scale(1.15); opacity: 1;   }
        }
      `}</style>
    </>
  );
};
