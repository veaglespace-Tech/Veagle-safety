'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield, Zap, ArrowRight, PhoneCall,
  Info, Image as ImageIcon, UserCheck,
  LayoutDashboard, LogOut, Menu, X, Crown, Home, MapPin, Users, User
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice.js';

export const PublicNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state?.auth || {});
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const isActive = (path) => pathname === path;
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
  ];

  if (mounted && token) {
    navLinks.push({ 
      href: isSuperAdmin ? '/admin' : '/dashboard', 
      label: isSuperAdmin ? 'Admin Panel' : 'Dashboard', 
      icon: isSuperAdmin ? Crown : LayoutDashboard 
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

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 80,
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1.5px solid #FFCCE1',
        boxShadow: scrolled ? '0 4px 24px rgba(255,92,138,0.10)' : '0 2px 10px rgba(255,92,138,0.05)',
        transition: 'all 0.3s ease',
        fontFamily: 'Manrope, sans-serif',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 16px',
          height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px',
        }}>

          {/* BRAND LOGO (NOWRAP) */}
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255,92,138,0.35)', flexShrink: 0,
            }}>
              <Shield size={19} color="#fff" />
            </div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontWeight: 900, fontSize: '15px', color: '#2A0826', letterSpacing: '-0.01em' }}>
                Sakhi Suraksha SOS
              </div>
              <div style={{ fontSize: '9.5px', color: '#FF5C8A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Personal Safety
              </div>
            </div>
          </Link>

          {/* RIGHT SIDE ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {mounted && token ? (
              <Link href={isSuperAdmin ? '/admin' : '/dashboard'} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'linear-gradient(135deg,#FF5C8A,#FF2A6D)',
                color: '#fff', fontWeight: 900, fontSize: '11px',
                padding: '7px 14px', borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(255,92,138,0.35)',
                whiteSpace: 'nowrap',
              }}>
                {isSuperAdmin ? <Crown size={13} /> : <LayoutDashboard size={13} />}
                <span>{isSuperAdmin ? 'Admin Panel' : 'Dashboard'}</span>
              </Link>
            ) : (
              <>
                <Link href="/auth?mode=login" style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  color: '#2A0826', fontWeight: 800, fontSize: '11px',
                  padding: '7px 14px', borderRadius: '12px',
                  textDecoration: 'none', border: '1px solid #FFCCE1',
                  background: 'rgba(255,255,255,0.9)',
                  whiteSpace: 'nowrap', transition: 'all 0.2s',
                }}>
                  <UserCheck size={13} color="#FF5C8A" />
                  <span>Sign In</span>
                </Link>
                <Link href="/auth?mode=register" style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  background: 'linear-gradient(135deg,#FF5C8A,#FF2A6D)',
                  color: '#fff', fontWeight: 900, fontSize: '11px',
                  padding: '7px 14px', borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(255,92,138,0.35)',
                  whiteSpace: 'nowrap',
                }} className="hidden sm:flex">
                  <span>Sign Up</span>
                  <ArrowRight size={13} />
                </Link>
              </>
            )}

            {/* HAMBURGER MENU TOGGLE BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: '#FFF0F3', border: '1px solid #FFCCE1',
                borderRadius: '12px', width: '36px', height: '36px',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#FF5C8A', flexShrink: 0,
              }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE & DESKTOP COLLAPSED DROPDOWN MENU */}
        {menuOpen && (
          <div style={{
            borderTop: '1.5px solid #FFCCE1',
            background: 'rgba(255,255,255,0.99)',
            padding: '12px 16px 16px',
            boxShadow: '0 10px 25px rgba(255,92,138,0.12)',
          }}>
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: '12px',
                fontSize: '13px', fontWeight: 800,
                textDecoration: 'none', marginBottom: '4px',
                background: isActive(href) ? 'linear-gradient(135deg,#FF5C8A,#FF2A6D)' : '#FFF0F3',
                color: isActive(href) ? '#fff' : '#2A0826',
              }}>
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
