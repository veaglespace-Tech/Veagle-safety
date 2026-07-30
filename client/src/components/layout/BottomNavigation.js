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

  const navItems = [
    { path: '/dashboard',     label: 'Home',     icon: Home },
    { path: '/track-journey', label: 'Track',    icon: MapPin },
    { path: '/active-sos',    label: 'SOS',      icon: AlertTriangle, isCenter: true },
    { path: '/contacts',      label: 'Contacts', icon: Users },
    { path: '/profile',       label: 'Profile',  icon: User },
  ];

  useEffect(() => { 
    setMounted(true); 
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* 3D MAGIC FLOATING NAVIGATION DOCK */}
      <div 
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          width: 'calc(100% - 24px)',
          maxWidth: '440px',
          fontFamily: 'Manrope, sans-serif',
          filter: 'drop-shadow(0 12px 24px rgba(255, 92, 138, 0.22)) drop-shadow(0 4px 10px rgba(42, 8, 38, 0.08))',
        }} 
        className="lg:hidden"
      >
        {/* NAV CONTAINER BAR */}
        <div style={{
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '26px',
          border: '1.5px solid rgba(255, 204, 225, 0.95)',
          padding: '6px 8px 8px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -2px 6px rgba(255, 92, 138, 0.06)',
        }}>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            /* ========================================================
               CENTER 3D FLOATING SOS BUTTON WITH NEON PULSE AURA
               ======================================================== */
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
                    marginTop: '-34px',
                    textDecoration: 'none',
                    zIndex: 10,
                    width: '20%',
                  }}
                  onMouseDown={() => setPressingSOS(true)}
                  onMouseUp={() => setPressingSOS(false)}
                  onTouchStart={() => setPressingSOS(true)}
                  onTouchEnd={() => setPressingSOS(false)}
                >
                  {/* Outer Pulse Waves */}
                  {activeSession && (
                    <>
                      <div style={{
                        position: 'absolute',
                        top: '28px', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90px', height: '90px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,0,67,0.35) 0%, rgba(255,42,109,0) 70%)',
                        animation: 'sos3DPulse1 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                        pointerEvents: 'none',
                      }} />
                      <div style={{
                        position: 'absolute',
                        top: '28px', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '76px', height: '76px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,92,138,0.4) 0%, rgba(255,92,138,0) 70%)',
                        animation: 'sos3DPulse2 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) infinite 0.4s',
                        pointerEvents: 'none',
                      }} />
                    </>
                  )}

                  {/* Ambient Idle Glow */}
                  {!activeSession && (
                    <div style={{
                      position: 'absolute',
                      top: '28px', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '72px', height: '72px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255,92,138,0.22) 0%, rgba(255,92,138,0) 75%)',
                      animation: 'ambient3DGlow 3s ease-in-out infinite',
                      pointerEvents: 'none',
                    }} />
                  )}

                  {/* Main 3D SOS Sphere Button */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: activeSession
                      ? 'linear-gradient(145deg, #FF0043 0%, #FF2A6D 50%, #B80031 100%)'
                      : 'linear-gradient(145deg, #FF7597 0%, #FF5C8A 45%, #FF2A6D 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: activeSession
                      ? '0 10px 26px rgba(255, 0, 67, 0.55), inset 0 2px 3px rgba(255, 255, 255, 0.8), inset 0 -3px 6px rgba(0, 0, 0, 0.35)'
                      : '0 8px 22px rgba(255, 42, 109, 0.42), inset 0 2px 4px rgba(255, 255, 255, 0.85), inset 0 -3px 6px rgba(180, 20, 70, 0.4)',
                    border: '3.5px solid #FFFFFF',
                    transform: pressingSOS ? 'scale(0.92) translateY(2px)' : 'scale(1) translateY(0)',
                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    position: 'relative',
                    cursor: 'pointer',
                  }}>
                    {/* Top 3D Glass Light Reflection */}
                    <div style={{
                      position: 'absolute',
                      top: '3px',
                      left: '15%',
                      width: '70%',
                      height: '35%',
                      borderRadius: '50%',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 100%)',
                      pointerEvents: 'none',
                    }} />

                    <AlertTriangle
                      size={26}
                      color="#FFFFFF"
                      strokeWidth={2.6}
                      style={{ 
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                        transform: activeSession ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.3s ease',
                      }}
                    />
                  </div>

                  {/* 3D Label Badge */}
                  <div style={{
                    marginTop: '3px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: activeSession ? '#FF0043' : '#FF2A6D',
                    boxShadow: '0 2px 6px rgba(255,42,109,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      {activeSession ? 'ACTIVE' : 'SOS'}
                    </span>
                  </div>
                </Link>
              );
            }

            /* ========================================================
               REGULAR PERFECTLY ALIGNED 3D TAB ITEMS
               ======================================================== */
            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px 0',
                  textDecoration: 'none',
                  position: 'relative',
                  zIndex: 2,
                  width: '20%',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                }}
              >
                {/* 3D Active Pill Container Frame */}
                <div style={{
                  position: 'relative',
                  width: '46px',
                  height: '38px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive
                    ? 'linear-gradient(135deg, #FF5C8A 0%, #FF2A6D 100%)'
                    : 'transparent',
                  boxShadow: isActive
                    ? '0 6px 16px rgba(255, 92, 138, 0.38), inset 0 1px 1.5px rgba(255,255,255,0.75)'
                    : 'none',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}>
                  {/* Subtle 3D Glass Light Highlight for active state */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: '10%',
                      width: '80%',
                      height: '30%',
                      borderRadius: '10px',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)',
                      pointerEvents: 'none',
                    }} />
                  )}

                  <Icon
                    size={20}
                    color={isActive ? '#FFFFFF' : '#8A6987'}
                    strokeWidth={isActive ? 2.4 : 1.8}
                    style={{
                      transition: 'all 0.25s ease',
                      filter: isActive ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))' : 'none',
                    }}
                  />
                </div>

                {/* Text Label */}
                <span style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 900 : 700,
                  color: isActive ? '#FF2A6D' : '#8A6987',
                  marginTop: '3px',
                  transition: 'color 0.2s ease',
                  letterSpacing: isActive ? '0.02em' : 'normal',
                }}>
                  {item.label}
                </span>

                {/* Active Indicator Underline Dot */}
                <div style={{
                  width: isActive ? '12px' : '0px',
                  height: '3px',
                  borderRadius: '999px',
                  background: 'linear-gradient(90deg, #FF5C8A, #FF2A6D)',
                  marginTop: '2px',
                  boxShadow: isActive ? '0 2px 6px rgba(255,92,138,0.6)' : 'none',
                  transition: 'width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }} />
              </Link>
            );
          })}

        </div>
      </div>

      {/* Spacer so page content is not blocked */}
      <div style={{ height: '90px' }} className="lg:hidden" />

      {/* 3D KEYFRAME ANIMATIONS */}
      <style>{`
        @keyframes sos3DPulse1 {
          0%   { transform: translate(-50%,-50%) scale(0.7); opacity: 0.9; }
          100% { transform: translate(-50%,-50%) scale(1.65); opacity: 0; }
        }
        @keyframes sos3DPulse2 {
          0%   { transform: translate(-50%,-50%) scale(0.7); opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(1.45); opacity: 0; }
        }
        @keyframes ambient3DGlow {
          0%, 100% { transform: translate(-50%,-50%) scale(1);   opacity: 0.6; }
          50%       { transform: translate(-50%,-50%) scale(1.2); opacity: 1;   }
        }
      `}</style>
    </>
  );
};
