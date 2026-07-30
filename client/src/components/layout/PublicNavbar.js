'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield, Zap, ArrowRight, PhoneCall,
  Info, Image as ImageIcon, UserCheck,
  LogOut, Menu, X, Crown, Home
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
    router.push('/auth?mode=login');
  };

  const isActive = (path) => pathname === path;
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

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

  const isLoggedIn = mounted && (token || (typeof window !== 'undefined' && localStorage.getItem('tichi_token')));

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

          {/* DESKTOP HORIZONTAL NAVIGATION CAPSULE (Visible ONLY on desktop md:flex) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#FFF0F3] p-1.5 rounded-2xl border border-[#FFCCE1]">
            {navLinks.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white shadow-md shadow-[#FF5C8A]/30'
                      : 'text-[#2A0826] hover:bg-white/80 hover:text-[#FF5C8A]'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* DESKTOP DYNAMIC CTA BUTTON */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] text-[#FF2A6D] text-xs font-black px-3.5 py-1.5 rounded-xl cursor-pointer hover:bg-[#FFCCE1]/30 transition-all shadow-sm"
                title="Sign Out"
              >
                <LogOut size={13} color="#FF2A6D" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth?mode=login" className="flex items-center gap-1.5 bg-white border border-[#FFCCE1] text-[#2A0826] text-xs font-extrabold px-3.5 py-1.5 rounded-xl hover:bg-[#FFF0F3] transition-all">
                  <UserCheck size={13} color="#FF5C8A" />
                  <span>Sign In</span>
                </Link>
                <Link href="/auth?mode=register" className="flex items-center gap-1.5 bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-md shadow-[#FF5C8A]/30 hover:opacity-95 transition-all">
                  <span>Sign Up</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}

            {/* MOBILE MENU TOGGLE BUTTON (Visible ONLY on mobile md:hidden - HIDDEN ON DESKTOP!) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-[#FFF0F3] border border-[#FFCCE1] flex items-center justify-center text-[#FF5C8A] cursor-pointer"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE COLLAPSED MENU DROPDOWN (Visible ONLY when opened on mobile md:hidden) */}
        {menuOpen && (
          <div className="md:hidden border-t-1.5 border-[#FFCCE1] bg-white/99 p-3 shadow-xl">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-extrabold mb-1 ${
                isActive(href)
                  ? 'bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white'
                  : 'bg-[#FFF0F3] text-[#2A0826]'
              }`}>
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            ))}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full p-2.5 rounded-xl text-xs font-extrabold border border-[#FFCCE1] bg-[#FFF0F3] text-[#FF2A6D] cursor-pointer mt-2"
              >
                <LogOut size={16} color="#FF2A6D" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                href="/auth?mode=login"
                className="flex items-center gap-2.5 w-full p-2.5 rounded-xl text-xs font-extrabold border border-[#FFCCE1] bg-white text-[#2A0826] cursor-pointer mt-2 shadow-sm"
              >
                <UserCheck size={16} color="#FF5C8A" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
};
