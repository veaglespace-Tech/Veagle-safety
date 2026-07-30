'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield, Crown, Home, Zap, Info, Image as ImageIcon,
  PhoneCall, LogOut, Menu, X, UserCheck
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice.js';
import { useLocationStore } from '../../redux/useLocationStore.js';

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state?.auth || {});
  const { status } = useLocationStore();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth?mode=login');
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // Clean Navigation Links for the Menu Toggle Dropdown
  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/pricing', label: 'Pricing', icon: Zap },
    { href: '/about', label: 'About', icon: Info },
    { href: '/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/contact', label: 'Contact', icon: PhoneCall },
  ];

  if (mounted && token && isSuperAdmin) {
    navLinks.splice(1, 0, { href: '/admin', label: 'Admin HQ', icon: Crown });
  }

  const isActive = (path) => pathname === path;
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
            
            {/* NON LOGGED IN VISITOR: SIGN IN BUTTON */}
            {!isLoggedIn && (
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

            {/* MENU TOGGLE BUTTON */}
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

        {/* COLLAPSED MENU DROPDOWN */}
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
