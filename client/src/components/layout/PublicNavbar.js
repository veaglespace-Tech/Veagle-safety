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
import { MagneticButton } from '../ui/MagneticButton.js';

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
        boxShadow: scrolled ? '0 4px 24px rgba(255,92,138,0.14)' : '0 2px 10px rgba(255,92,138,0.05)',
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

          {/* BRAND LOGO WITH MAGNETIC EFFECT */}
          <MagneticButton pullStrength={0.15}>
            <Link href="/" className="group flex items-center gap-2.5 no-underline shrink-0 whitespace-nowrap">
              <div style={{
                width: '38px', height: '38px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(255,92,138,0.35)', flexShrink: 0,
              }} className="group-hover:rotate-6 transition-transform duration-300">
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
          </MagneticButton>

          {/* DESKTOP ANIMATED NAV CHIPS CAPSULE */}
          <nav className="hidden md:flex items-center gap-1.5 nav-chip-capsule">
            {navLinks.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
                    active
                      ? 'nav-chip-active'
                      : 'nav-chip-hover'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE MAGNETIC ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {isLoggedIn ? (
              <MagneticButton pullStrength={0.3}>
                <button
                  onClick={handleLogout}
                  className="group hidden md:flex items-center gap-2 bg-gradient-to-r from-[#FFF0F3] to-[#FFCCE1] border-1.5 border-[#FF5C8A] text-[#FF2A6D] text-xs font-extrabold px-5 py-2.5 rounded-full cursor-pointer hover:bg-gradient-to-r hover:from-[#FF2A6D] hover:to-[#E01A4F] hover:text-white hover:border-transparent transition-all duration-300 shadow-[0_4px_16px_rgba(255,92,138,0.20)] hover:shadow-[0_8px_25px_rgba(255,42,109,0.45)] active:scale-95"
                  title="Sign Out"
                >
                  <span className="tracking-wide">Sign Out</span>
                  <LogOut size={15} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>
              </MagneticButton>
            ) : (
              <div className="hidden md:flex items-center gap-2.5">
                {/* ULTRA-MODERN SIGN IN BUTTON */}
                <MagneticButton pullStrength={0.35}>
                  <Link 
                    href="/auth?mode=login" 
                    className="group flex items-center gap-2 bg-gradient-to-r from-[#FFF0F3] via-[#FFE6EE] to-[#FFCCE1] border-1.5 border-[#FF5C8A] text-[#2A0826] text-xs font-extrabold px-5 py-2.5 rounded-full hover:bg-gradient-to-r hover:from-[#FF5C8A] hover:to-[#FF2A6D] hover:text-white hover:border-transparent transition-all duration-300 shadow-[0_4px_16px_rgba(255,92,138,0.22)] hover:shadow-[0_8px_28px_rgba(255,42,109,0.50)] active:scale-95"
                  >
                    <span className="tracking-wide">Sign In</span>
                    <UserCheck size={15} className="text-[#FF2A6D] group-hover:text-white group-hover:scale-110 group-hover:translate-x-0.5 transition-all duration-300" />
                  </Link>
                </MagneticButton>

                {/* ULTRA-MODERN SIGN UP BUTTON (EXACT TWIN STYLE AS SIGN IN) */}
                <MagneticButton pullStrength={0.4}>
                  <Link 
                    href="/auth?mode=register" 
                    className="group flex items-center gap-2 bg-gradient-to-r from-[#FFF0F3] via-[#FFE6EE] to-[#FFCCE1] border-1.5 border-[#FF5C8A] text-[#2A0826] text-xs font-extrabold px-5 py-2.5 rounded-full hover:bg-gradient-to-r hover:from-[#FF5C8A] hover:to-[#FF2A6D] hover:text-white hover:border-transparent transition-all duration-300 shadow-[0_4px_16px_rgba(255,92,138,0.22)] hover:shadow-[0_8px_28px_rgba(255,42,109,0.50)] active:scale-95"
                  >
                    <span className="tracking-wide">Sign Up</span>
                    <ArrowRight size={15} className="text-[#FF2A6D] group-hover:text-white group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300" />
                  </Link>
                </MagneticButton>
              </div>
            )}

            {/* MOBILE MENU TOGGLE BUTTON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 rounded-2xl bg-[#FFF0F3] border-1.5 border-[#FFCCE1] flex items-center justify-center text-[#FF5C8A] cursor-pointer hover:bg-[#FF5C8A] hover:text-white transition-all duration-300 shadow-sm"
              aria-label="Toggle menu"
            >
              <div className={`transition-transform duration-300 ${menuOpen ? 'rotate-90' : 'rotate-0'}`}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </div>
            </button>
          </div>
        </div>

        {/* MOBILE COLLAPSED MENU DROPDOWN */}
        {menuOpen && (
          <div className="md:hidden border-t-1.5 border-[#FFCCE1] bg-white/99 p-3.5 shadow-2xl animate-fade-up">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={`flex items-center gap-3 p-3 rounded-xl text-xs font-black mb-1.5 transition-all duration-200 ${
                isActive(href)
                  ? 'bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white shadow-md shadow-[#FF5C8A]/30'
                  : 'bg-[#FFF0F3] text-[#2A0826] hover:bg-white hover:text-[#FF5C8A]'
              }`}>
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            ))}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2.5 w-full p-3 rounded-xl text-xs font-black border-1.5 border-[#FFCCE1] bg-[#FFF0F3] text-[#FF2A6D] hover:bg-[#FF2A6D] hover:text-white transition-all duration-200 mt-2 shadow-sm"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                href="/auth?mode=login"
                className="flex items-center justify-center gap-2.5 w-full p-3 rounded-xl text-xs font-black border-1.5 border-[#FFCCE1] bg-white text-[#2A0826] hover:bg-[#FF5C8A] hover:text-white transition-all duration-200 mt-2 shadow-sm"
              >
                <UserCheck size={16} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
};
