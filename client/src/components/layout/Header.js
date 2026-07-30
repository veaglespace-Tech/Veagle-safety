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

  // Navigation Links
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
            className="group flex items-center gap-2.5 no-underline shrink-0 whitespace-nowrap transition-transform duration-300 hover:scale-105"
          >
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF5C8A, #FF2A6D)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 92, 138, 0.35)',
              flexShrink: 0,
            }} className="group-hover:rotate-6 transition-transform duration-300">
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
                  boxShadow: status === 'LIVE' ? '0 0 8px #059669' : 'none'
                }} className="animate-pulse" />
                <span style={{ fontSize: '10px', color: '#684E67', fontWeight: 800 }}>
                  {status === 'LIVE' ? 'Protected · GPS Active' : 'GPS Active'}
                </span>
              </div>
            </div>
          </Link>

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

          {/* RIGHT SIDE ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            
            {/* DESKTOP DYNAMIC CTA BUTTON WITH HOVER ANIMATION */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] text-[#FF2A6D] text-xs font-black px-4 py-2 rounded-xl cursor-pointer hover:bg-[#FF2A6D] hover:text-white hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#FF2A6D]/30 group hover:scale-105 active:scale-95"
                title="Sign Out"
              >
                <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link 
                href="/auth?mode=login" 
                className="hidden md:flex items-center gap-2 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] text-[#2A0826] text-xs font-black px-4 py-2 rounded-xl hover:bg-[#FF5C8A] hover:text-white hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#FF5C8A]/30 group hover:scale-105 active:scale-95"
              >
                <UserCheck size={14} className="text-[#FF5C8A] group-hover:text-white transition-colors" />
                <span>Sign In</span>
              </Link>
            )}

            {/* MOBILE MENU TOGGLE BUTTON (WITH ROTATION ANIMATION) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-[#FFF0F3] border-1.5 border-[#FFCCE1] flex items-center justify-center text-[#FF5C8A] cursor-pointer hover:bg-[#FF5C8A] hover:text-white transition-all duration-300 active:scale-90 shadow-sm"
              aria-label="Toggle navigation menu"
            >
              <div className={`transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </div>
            </button>
          </div>
        </div>

        {/* MOBILE COLLAPSED MENU DROPDOWN (WITH ANIMATED ENTRANCE) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-1.5 border-[#FFCCE1] bg-white/99 p-3.5 shadow-2xl animate-fade-up">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 p-3 rounded-xl text-xs font-black mb-1.5 transition-all duration-200 ${
                  isActive(href)
                    ? 'bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white shadow-md shadow-[#FF5C8A]/30'
                    : 'bg-[#FFF0F3] text-[#2A0826] hover:bg-white hover:text-[#FF5C8A]'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            ))}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2.5 w-full p-3 rounded-xl text-xs font-black border-1.5 border-[#FFCCE1] bg-[#FFF0F3] text-[#FF2A6D] hover:bg-[#FF2A6D] hover:text-white transition-all duration-200 mt-2 shadow-sm active:scale-98"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                href="/auth?mode=login"
                className="flex items-center justify-center gap-2.5 w-full p-3 rounded-xl text-xs font-black border-1.5 border-[#FFCCE1] bg-white text-[#2A0826] hover:bg-[#FF5C8A] hover:text-white transition-all duration-200 mt-2 shadow-sm active:scale-98"
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
