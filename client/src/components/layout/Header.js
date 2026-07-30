'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield, Bell, Crown, Home, Zap, Info, Image as ImageIcon,
  PhoneCall, LayoutDashboard, LogOut, Menu, X, CheckCircle2, UserCheck
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice.js';
import { useLocationStore } from '../../redux/useLocationStore.js';
import { useSOSStore } from '../../redux/useSOSStore.js';

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state?.auth || {});
  const { status } = useLocationStore();
  const { activeSession } = useSOSStore();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'PS';

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/pricing', label: 'Pricing', icon: Zap },
    { href: '/about', label: 'About', icon: Info },
    { href: '/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/contact', label: 'Contact', icon: PhoneCall },
  ];

  if (isSuperAdmin) {
    navLinks.splice(1, 0, { href: '/admin', label: 'Admin HQ', icon: Crown });
  }

  const isActive = (path) => pathname === path;

  return (
    <>
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1.5px solid #FFCCE1',
          boxShadow: '0 4px 20px rgba(255, 92, 138, 0.08)',
          fontFamily: 'Manrope, sans-serif',
        }}
      >
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>

          {/* BRAND LOGO + STATUS */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '13px',
              background: 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 92, 138, 0.35)',
            }}>
              <Shield size={20} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 900, fontSize: '15px', color: '#2A0826', letterSpacing: '-0.01em' }}>
                  Sakhi Suraksha SOS
                </span>
                {isSuperAdmin && (
                  <span style={{
                    background: '#E6A100', color: '#FFFFFF',
                    fontWeight: 900, fontSize: '9px', padding: '2px 6px',
                    borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>
                    ADMIN
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: status === 'LIVE' ? '#059669' : '#F59E0B',
                  boxShadow: status === 'LIVE' ? '0 0 6px #059669' : 'none'
                }} />
                <span style={{ fontSize: '10px', color: '#684E67', fontWeight: 800 }}>
                  {status === 'LIVE' ? 'Protected · GPS Active' : 'GPS Syncing'}
                </span>
              </div>
            </div>
          </Link>

          {/* CENTER DESKTOP NAVIGATION TABS (Visible on Medium/Desktop Screens) */}
          <nav 
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: '#FFF0F3', borderRadius: '16px',
              border: '1px solid #FFCCE1', padding: '4px',
            }}
            className="hidden md:flex"
          >
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '6px 12px', borderRadius: '10px',
                  fontSize: '12px', fontWeight: 800,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  background: isActive(href) ? 'linear-gradient(135deg, #FF5C8A, #FF2A6D)' : 'transparent',
                  color: isActive(href) ? '#FFFFFF' : '#684E67',
                  boxShadow: isActive(href) ? '0 3px 10px rgba(255,92,138,0.3)' : 'none',
                }}
              >
                <Icon size={13} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE USER ACTION CONTROLS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            {/* SOS Active Live Badge */}
            {activeSession && (
              <Link
                href="/active-sos"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'linear-gradient(135deg, #FF0043, #FF2A6D)',
                  color: '#FFFFFF', fontSize: '10px', fontWeight: 900,
                  padding: '6px 12px', borderRadius: '999px',
                  textDecoration: 'none', boxShadow: '0 0 16px rgba(255,0,67,0.4)',
                  animation: 'pulse 1.5s infinite',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFF' }} />
                <span>SOS LIVE</span>
              </Link>
            )}

            {/* Emergency Alarm Quick Button */}
            <Link
              href="/alarm"
              style={{
                width: '36px', height: '36px', borderRadius: '12px',
                background: '#FFF0F3', border: '1px solid #FFCCE1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FF2A6D', textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              title="Trigger Emergency Alarm Siren"
            >
              <Bell size={18} />
            </Link>

            {/* User Profile Avatar Pill */}
            {mounted && user && (
              <Link
                href="/profile"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '3px 10px 3px 4px', borderRadius: '999px',
                  background: '#FFF0F3', border: '1.5px solid #FFCCE1',
                  textDecoration: 'none', transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
                  color: '#FFFFFF', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 900, fontSize: '11px',
                  boxShadow: '0 2px 8px rgba(255,92,138,0.3)',
                }}>
                  {initials}
                </div>
                <div className="hidden sm:block" style={{ lineHeight: 1.1, textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: '#2A0826' }}>
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#FF5C8A' }}>
                    {isSuperAdmin ? 'Super Admin' : 'Protected User'}
                  </div>
                </div>
              </Link>
            )}

            {/* Logout Button */}
            {mounted && token && (
              <button
                onClick={handleLogout}
                style={{
                  background: 'none', border: '1px solid #FFCCE1',
                  color: '#684E67', fontSize: '11px', fontWeight: 800,
                  padding: '7px 12px', borderRadius: '10px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                  whiteSpace: 'nowrap', transition: 'all 0.2s',
                }}
                className="hidden sm:flex"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                width: '36px', height: '36px', borderRadius: '12px',
                background: '#FFF0F3', border: '1px solid #FFCCE1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FF5C8A', cursor: 'pointer',
              }}
              className="md:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {mobileMenuOpen && (
          <div 
            style={{
              borderTop: '1px solid #FFCCE1',
              background: 'rgba(255, 255, 255, 0.99)',
              padding: '12px 16px 16px',
            }} 
            className="md:hidden"
          >
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: '12px',
                  fontSize: '13px', fontWeight: 800,
                  textDecoration: 'none', marginBottom: '4px',
                  background: isActive(href) ? 'linear-gradient(135deg, #FF5C8A, #FF2A6D)' : '#FFF0F3',
                  color: isActive(href) ? '#FFFFFF' : '#2A0826',
                }}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            ))}

            {mounted && token && (
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  width: '100%', padding: '10px 14px', borderRadius: '12px',
                  fontSize: '13px', fontWeight: 800,
                  border: '1px solid #FFCCE1', background: '#FFFFFF',
                  color: '#FF2A6D', cursor: 'pointer', marginTop: '8px',
                }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
};
