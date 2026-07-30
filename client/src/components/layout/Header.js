'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield, Crown, Home, Zap, Info, Image as ImageIcon,
  PhoneCall, LayoutDashboard, LogOut, Menu, X, UserCheck,
  MapPin, Users, User
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

  // Navigation Links for Collapsed Menu Dropdown
  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
  ];

  if (mounted && token) {
    navLinks.push({
      href: isSuperAdmin ? '/admin' : '/dashboard',
      label: isSuperAdmin ? 'Admin Panel' : 'Dashboard',
      icon: isSuperAdmin ? Crown : LayoutDashboard,
    });
    navLinks.push({ href: '/track-journey', label: 'Track Journey', icon: MapPin });
    navLinks.push({ href: '/contacts', label: 'Contacts', icon: Users });
    navLinks.push({ href: '/profile', label: 'Profile', icon: User });
  }

  navLinks.push(
    { href: '/pricing', label: 'Pricing', icon: Zap },
    { href: '/about', label: 'About', icon: Info },
    { href: '/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/contact', label: 'Contact', icon: PhoneCall }
  );

  const isActive = (path) => pathname === path;

  // Check if logged in
  const isLoggedIn = mounted && (token || (typeof window !== 'undefined' && localStorage.getItem('tichi_token')));

  return (
    <>
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 80,
          background: 'rgba(255, 255, 255, 0.98)',
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

          {/* BRAND LOGO + TITLE + STATUS */}
          <Link 
            href="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 92, 138, 0.35)',
              flexShrink: 0,
            }}>
              <Shield size={19} color="#FFFFFF" />
            </div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 900, fontSize: '15px', color: '#2A0826', letterSpacing: '-0.01em' }}>
                  Sakhi Suraksha SOS
                </span>
                {isSuperAdmin && (
                  <span style={{
                    background: '#E6A100', color: '#FFFFFF',
                    fontWeight: 900, fontSize: '9px', padding: '1px 5px',
                    borderRadius: '5px', textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>
                    ADMIN
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: status === 'LIVE' ? '#059669' : '#F59E0B',
                  boxShadow: status === 'LIVE' ? '0 0 6px #059669' : 'none'
                }} />
                <span style={{ fontSize: '10px', color: '#684E67', fontWeight: 800 }}>
                  {status === 'LIVE' ? 'Protected · GPS Active' : 'GPS Active'}
                </span>
              </div>
            </div>
          </Link>

          {/* RIGHT SIDE USER ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            
            {/* LOGGED IN: ONLY SHOW LOGOUT BUTTON */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                style={{
                  background: '#FFF0F3',
                  border: '1.5px solid #FFCCE1',
                  color: '#FF2A6D',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '7px 14px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(255,92,138,0.12)',
                  flexShrink: 0,
                }}
                title="Logout / Sign Out"
                aria-label="Logout"
              >
                <LogOut size={14} color="#FF2A6D" />
                <span>Logout</span>
              </button>
            ) : (
              /* NON LOGGED IN VISITOR: SIGN IN BUTTON */
              <Link 
                href="/auth?mode=login" 
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  color: '#2A0826', fontWeight: 800, fontSize: '11px',
                  padding: '7px 14px', borderRadius: '12px',
                  textDecoration: 'none', border: '1px solid #FFCCE1',
                  background: 'rgba(255,255,255,0.9)',
                  whiteSpace: 'nowrap', transition: 'all 0.2s',
                }}
              >
                <UserCheck size={13} color="#FF5C8A" />
                <span>Sign In</span>
              </Link>
            )}

            {/* MENU TOGGLE BUTTON (OPENS ALL TABS DROPDOWN) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                width: '36px', height: '36px', borderRadius: '12px',
                background: '#FFF0F3', border: '1px solid #FFCCE1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FF5C8A', cursor: 'pointer',
                flexShrink: 0,
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* COLLAPSED MENU DROPDOWN CONTAINING ALL NAVIGATION TABS */}
        {mobileMenuOpen && (
          <div 
            style={{
              borderTop: '1.5px solid #FFCCE1',
              background: 'rgba(255, 255, 255, 0.99)',
              padding: '12px 16px 16px',
              boxShadow: '0 10px 25px rgba(255, 92, 138, 0.12)',
            }} 
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

            {isLoggedIn && (
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
