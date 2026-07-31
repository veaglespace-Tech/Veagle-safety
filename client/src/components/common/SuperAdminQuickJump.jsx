'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { 
  Home, Crown, ShieldAlert, Sparkles, ChevronUp, 
  ArrowRight, X, ShieldCheck
} from 'lucide-react';
import { Logo3DFlip } from '../ui/Logo3DFlip.js';

export const SuperAdminQuickJump = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const reduxRole = useSelector((state) => state?.auth?.user?.role);
  const reduxToken = useSelector((state) => state?.auth?.token);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  let isSuperAdmin = false;
  let hasToken = false;

  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem('tichi_token');
    const localUserRaw = localStorage.getItem('tichi_user');
    let localRole = null;
    try {
      if (localUserRaw) {
        const parsed = JSON.parse(localUserRaw);
        localRole = parsed?.role;
      }
    } catch (e) {}

    hasToken = Boolean(localToken || reduxToken);
    isSuperAdmin = reduxRole === 'SUPER_ADMIN' || localRole === 'SUPER_ADMIN';
  }

  const isAdminPage = pathname?.startsWith('/admin');

  // Show button on all /admin pages OR whenever Super Admin is logged in
  if (!isAdminPage && (!isSuperAdmin || !hasToken)) {
    return null;
  }

  const destinations = [
    { href: '/', label: 'Main Landing Page', desc: 'Public Website & Features', icon: Home },
    { href: '/dashboard', label: 'User Safety App', desc: 'SOS Dashboard & Map', icon: ShieldAlert },
    { href: '/admin', label: 'Super Admin HQ', desc: 'Control Center & Dispatch', icon: Crown },
    { href: '/pricing', label: 'Pricing Plans', desc: 'Subscription Plans', icon: ShieldCheck },
  ];

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[9999] font-sans">
      
      {/* QUICK JUMP DROPDOWN MENU */}
      {open && (
        <div className="mb-3 w-72 bg-white/98 backdrop-blur-2xl border-2 border-[#FFCCE1] rounded-3xl p-3.5 shadow-[0_15px_45px_rgba(255,42,109,0.25)] animate-fade-up space-y-2">
          
          <div className="flex items-center justify-between px-2 py-1 border-b border-[#FFCCE1]">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FF2A6D] animate-pulse" />
              <span className="text-[11px] font-black uppercase text-[#2A0826] tracking-wider">Super Admin Switcher</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[#684E67] hover:text-[#FF2A6D] p-1 rounded-full hover:bg-[#FFF0F3] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 pt-1">
            {destinations.map((dest) => {
              const Icon = dest.icon;
              const isCurrent = pathname === dest.href;
              return (
                <Link
                  key={dest.href}
                  href={dest.href}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white shadow-sm'
                      : 'bg-[#FFF0F3]/70 hover:bg-[#FFF0F3] text-[#2A0826] border border-[#FFCCE1]/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-1.5 rounded-xl ${isCurrent ? 'bg-white/20 text-white' : 'bg-white text-[#FF2A6D] shadow-xs'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-xs font-black leading-tight ${isCurrent ? 'text-white' : 'text-[#2A0826]'}`}>
                        {dest.label}
                      </p>
                      <p className={`text-[10px] font-bold ${isCurrent ? 'text-white/80' : 'text-[#684E67]'}`}>
                        {dest.desc}
                      </p>
                    </div>
                  </div>

                  {!isCurrent && (
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF5C8A] group-hover:translate-x-1 transition-transform" />
                  )}
                </Link>
              );
            })}
          </div>

        </div>
      )}

      {/* FLOATING 3D MAIN TRIGGER BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="group bg-white/95 backdrop-blur-xl border-2 border-[#FF2A6D] text-[#2A0826] px-4 py-2.5 rounded-full shadow-[0_8px_30px_rgba(255,42,109,0.30)] hover:shadow-[0_12px_40px_rgba(255,42,109,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center space-x-2.5 cursor-pointer relative overflow-hidden"
        title="Super Admin Navigation Quick Jump"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F]" />
        
        <Logo3DFlip size={28} />

        <div className="flex items-center space-x-1.5 text-left">
          <span className="text-xs font-black tracking-tight text-[#2A0826] group-hover:text-[#FF2A6D] transition-colors">
            {isAdminPage ? 'Switch to Website' : 'Admin HQ'}
          </span>
          <ChevronUp className={`w-3.5 h-3.5 text-[#FF2A6D] transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

    </div>
  );
};

export default SuperAdminQuickJump;
