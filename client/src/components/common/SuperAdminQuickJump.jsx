'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Home, Crown, ArrowRight } from 'lucide-react';
import { Logo3DFlip } from '../ui/Logo3DFlip.js';

export const SuperAdminQuickJump = () => {
  const pathname = usePathname();
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

  const targetHref = isAdminPage ? '/' : '/admin';
  const targetLabel = isAdminPage ? 'Switch to Main Website' : 'Super Admin HQ';

  return (
    <div className="w-full flex flex-col items-center justify-center pt-8 pb-6 text-center px-4 font-sans relative z-20">
      {/* CENTERED 3D SWITCHER BUTTON */}
      <Link
        href={targetHref}
        className="group bg-white/95 backdrop-blur-xl border-2 border-[#FF2A6D] text-[#2A0826] hover:bg-gradient-to-r hover:from-[#FF5C8A] hover:to-[#FF2A6D] hover:text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-[0_8px_30px_rgba(255,42,109,0.25)] hover:shadow-[0_12px_40px_rgba(255,42,109,0.40)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer relative overflow-hidden"
        title={isAdminPage ? "Switch to Main Website" : "Go to Super Admin HQ"}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F]" />
        
        <Logo3DFlip size={30} />

        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm font-black tracking-wide uppercase transition-colors">
            {targetLabel}
          </span>
          <ArrowRight className="w-4 h-4 text-[#FF2A6D] group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
      
      <p className="text-[11px] text-[#684E67] font-extrabold mt-2.5">
        {isAdminPage ? 'Return to Sakhi Suraksha Public Landing Page & Features' : 'Access Operations Control Center'}
      </p>
    </div>
  );
};

export default SuperAdminQuickJump;
