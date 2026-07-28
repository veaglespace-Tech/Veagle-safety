'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Zap, UserPlus, LogIn, PhoneCall, ArrowRight, Image as ImageIcon, Info, Heart, UserCheck } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice.js';
import { GsapMagneticButton } from '../common/GsapMagneticButton.js';

export const PublicNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state?.auth || {});

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    router.push('/page');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-[#FFCCE1] shadow-[0_4px_25px_-5px_rgba(255,92,138,0.08)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* BRAND LOGO EMBLEM */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose via-rose-light to-gold p-0.5 shadow-coral-glow group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-rose group-hover:text-gold transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-xl tracking-tight text-tichi-text group-hover:text-rose transition-colors">
                Sakhi Suraksha SOS
              </span>
              <span className="bg-rose/15 text-rose border border-rose/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-tichi-muted font-black tracking-wide">
              Personal Safety & Emergency Companion
            </p>
          </div>
        </Link>

        {/* CENTER FLOATING CAPSULE NAVIGATION NAVBAR */}
        <nav className="hidden md:flex items-center space-x-1.5 bg-blush-subtle p-1.5 rounded-2xl border border-[#FFCCE1] shadow-inner">
          <Link
            href="/"
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              isActive('/')
                ? 'btn-baby-pink shadow-coral-glow'
                : 'text-tichi-muted hover:text-tichi-text hover:bg-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <Link
            href="/pricing"
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              isActive('/pricing')
                ? 'btn-baby-pink shadow-coral-glow'
                : 'text-tichi-muted hover:text-tichi-text hover:bg-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Pricing</span>
          </Link>

          <Link
            href="/about"
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              isActive('/about')
                ? 'btn-baby-pink shadow-coral-glow'
                : 'text-tichi-muted hover:text-tichi-text hover:bg-white'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>About Us</span>
          </Link>

          <Link
            href="/gallery"
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              isActive('/gallery')
                ? 'btn-baby-pink shadow-coral-glow'
                : 'text-tichi-muted hover:text-tichi-text hover:bg-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery</span>
          </Link>

          <Link
            href="/contact"
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
              isActive('/contact')
                ? 'btn-baby-pink shadow-coral-glow'
                : 'text-tichi-muted hover:text-tichi-text hover:bg-white'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Contact Us</span>
          </Link>
        </nav>

        {/* RIGHT SIDE ACTION BUTTONS WITH GSAP MAGNETIC PHYSICS */}
        <div className="flex items-center space-x-3">
          {token ? (
            <div className="flex items-center space-x-3">
              <GsapMagneticButton strength={0.2}>
                <Link
                  href={user?.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard'}
                  className="btn-baby-pink text-xs px-4 py-2.5 shadow-coral-glow flex items-center space-x-2"
                >
                  <span>{user?.role === 'SUPER_ADMIN' ? 'HQ Command Center' : 'Safety Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </GsapMagneticButton>
              <button
                onClick={handleLogout}
                className="text-xs font-black text-tichi-muted hover:text-rose px-3 py-2 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2.5">
              {/* CLEAN LUXURY SIGN IN CAPSULE */}
              <GsapMagneticButton strength={0.2}>
                <Link
                  href="/auth?mode=login"
                  className="btn-signin-luxury flex items-center space-x-1.5 group"
                >
                  <UserCheck className="w-4 h-4 text-rose group-hover:scale-110 transition-transform" />
                  <span>Sign In</span>
                </Link>
              </GsapMagneticButton>

              {/* VIBRANT LUXURY SIGN UP GRADIENT PILL */}
              <GsapMagneticButton strength={0.25}>
                <Link
                  href="/auth?mode=register"
                  className="btn-signup-luxury flex items-center space-x-2 group"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </Link>
              </GsapMagneticButton>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
