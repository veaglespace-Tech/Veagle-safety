'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield, Zap, ArrowRight, PhoneCall,
  Info, Image as ImageIcon, UserCheck,
  LayoutDashboard, LogOut, Menu, X, Crown
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const isActive = (path) => pathname === path;

  const navLinks = [
    { href: '/', label: 'Home', icon: Shield },
    { href: '/pricing', label: 'Pricing', icon: Zap },
    { href: '/about', label: 'About', icon: Info },
    { href: '/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/contact', label: 'Contact', icon: PhoneCall },
  ];

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #FFCCE1',
        boxShadow: scrolled ? '0 4px 24px rgba(255,92,138,0.10)' : '0 2px 10px rgba(255,92,138,0.05)',
        transition: 'all 0.3s ease',
        fontFamily: 'Manrope, sans-serif',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 16px',
          height: '68px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px',
        }}>

          {/* BRAND LOGO */}
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            textDecoration: 'none', flexShrink: 0,
          }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(255,92,138,0.35)',
            }}>
              <Shield size={20} color="#fff" />
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontWeight: 900, fontSize: '16px', color: '#2A0826', letterSpacing: '-0.01em' }}>
                Sakhi Suraksha
              </div>
              <div style={{ fontSize: '9px', color: '#FF5C8A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Safety Platform
              </div>
            </div>
          </Link>

          {/* CENTER NAV — Desktop only */}
          <nav style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: '#FFF0F3', borderRadius: '16px',
            border: '1px solid #FFCCE1', padding: '6px',
            // Hidden on mobile via inline media — we toggle via JS
          }} className="navbar-desktop-nav">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: '11px',
                fontSize: '12px', fontWeight: 800,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                background: isActive(href) ? 'linear-gradient(135deg,#FF5C8A,#FF2A6D)' : 'transparent',
                color: isActive(href) ? '#fff' : '#684E67',
                boxShadow: isActive(href) ? '0 4px 12px rgba(255,92,138,0.30)' : 'none',
              }}>
                <Icon size={13} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {token ? (
              <>
                <Link href={user?.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard'} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'linear-gradient(135deg,#FF5C8A,#FF2A6D)',
                  color: '#fff', fontWeight: 900, fontSize: '12px',
                  padding: '9px 18px', borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(255,92,138,0.35)',
                  whiteSpace: 'nowrap',
                }}>
                  {user?.role === 'SUPER_ADMIN' ? <Crown size={14} /> : <LayoutDashboard size={14} />}
                  <span className="nav-btn-text">
                    {user?.role === 'SUPER_ADMIN' ? 'Admin Panel' : 'Dashboard'}
                  </span>
                </Link>
                <button onClick={handleLogout} style={{
                  background: 'none', border: '1px solid #FFCCE1',
                  color: '#684E67', fontSize: '12px', fontWeight: 800,
                  padding: '8px 14px', borderRadius: '10px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  whiteSpace: 'nowrap', transition: 'all 0.2s',
                }}>
                  <LogOut size={13} />
                  <span className="nav-btn-text">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/auth?mode=login" style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  color: '#2A0826', fontWeight: 800, fontSize: '12px',
                  padding: '9px 16px', borderRadius: '12px',
                  textDecoration: 'none', border: '1px solid #FFCCE1',
                  background: 'rgba(255,255,255,0.9)',
                  whiteSpace: 'nowrap', transition: 'all 0.2s',
                }}>
                  <UserCheck size={14} color="#FF5C8A" />
                  <span>Sign In</span>
                </Link>
                <Link href="/auth?mode=register" style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'linear-gradient(135deg,#FF5C8A,#FF2A6D)',
                  color: '#fff', fontWeight: 900, fontSize: '12px',
                  padding: '9px 18px', borderRadius: '12px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(255,92,138,0.35)',
                  whiteSpace: 'nowrap',
                }}>
                  <span>Sign Up</span>
                  <ArrowRight size={13} />
                </Link>
              </>
            )}

            {/* HAMBURGER — Mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="navbar-hamburger"
              style={{
                background: '#FFF0F3', border: '1px solid #FFCCE1',
                borderRadius: '10px', padding: '8px',
                cursor: 'pointer', display: 'none',
                alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} color="#FF5C8A" /> : <Menu size={20} color="#FF5C8A" />}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid #FFCCE1',
            background: 'rgba(255,255,255,0.99)',
            padding: '12px 16px 16px',
          }} className="navbar-mobile-menu">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '11px 14px', borderRadius: '12px',
                fontSize: '13px', fontWeight: 800,
                textDecoration: 'none', marginBottom: '4px',
                background: isActive(href) ? 'linear-gradient(135deg,#FF5C8A,#FF2A6D)' : '#FFF0F3',
                color: isActive(href) ? '#fff' : '#2A0826',
              }}>
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (min-width: 768px) {
          .navbar-desktop-nav { display: flex !important; }
          .navbar-hamburger { display: none !important; }
          .navbar-mobile-menu { display: none !important; }
          .nav-btn-text { display: inline !important; }
        }
        @media (max-width: 767px) {
          .navbar-desktop-nav { display: none !important; }
          .navbar-hamburger { display: flex !important; }
          .nav-btn-text { display: none !important; }
        }
        @media (max-width: 380px) {
          .navbar-hamburger { padding: 6px !important; }
        }
      `}</style>
    </>
  );
};
