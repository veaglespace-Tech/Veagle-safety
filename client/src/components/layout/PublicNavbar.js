'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Sparkles, PhoneCall, Crown, ArrowRight, Image as ImageIcon, Heart, Info } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice.js';

export const PublicNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state?.auth || {});

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    router.push('/landing');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blush-border shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-plum to-rose flex items-center justify-center text-white shadow-plum-subtle group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-plum block leading-tight">VEAGLE SAFETY</span>
              <span className="text-[10px] font-bold text-rose tracking-widest uppercase block -mt-1">Women Protection</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {[
              { href: '/pricing', label: 'Pricing & Plans', icon: Sparkles },
              { href: '/about', label: 'About Us', icon: Info },
              { href: '/gallery', label: 'Gallery & Media', icon: ImageIcon },
              { href: '/contact', label: 'Contact Support', icon: PhoneCall },
            ].map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                    active ? 'bg-blush text-plum shadow-inner' : 'text-tichi-text/80 hover:text-plum hover:bg-blush/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-rose' : 'text-tichi-muted'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {token ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className="bg-plum text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-plum-subtle hover:bg-plum-dark transition-all flex items-center space-x-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>MY DASHBOARD</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-tichi-muted hover:text-tichi-emergency px-3 py-2 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="text-xs font-extrabold text-plum hover:bg-blush px-3.5 py-2.5 rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?tab=signup"
                  className="bg-gradient-to-r from-rose to-plum text-white text-xs font-extrabold px-4.5 py-2.5 rounded-xl shadow-plum-subtle hover:brightness-110 transition-all flex items-center space-x-1"
                >
                  <span>GET PROTECTED</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}

            <Link
              href="/admin/login"
              className="text-[11px] font-black text-gold/90 bg-plum px-2.5 py-1.5 rounded-lg border border-gold/30 hover:bg-plum-dark transition-all hidden sm:flex items-center space-x-1"
              title="Super Admin HQ Portal"
            >
              <Crown className="w-3 h-3 text-gold" />
              <span>HQ</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
