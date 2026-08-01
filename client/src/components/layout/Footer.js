'use client';

import React from 'react';
import Link from 'next/link';
import { Logo3DFlip } from '../ui/Logo3DFlip.js';

export const Footer = () => {
  return (
    <footer className="bg-white/95 backdrop-blur-xl border-t-1.5 border-[#FFCCE1] py-4 text-[#2A0826] shadow-sm relative z-20 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-3 text-xs font-extrabold text-[#684E67]">

        {/* LEFT: LOGO & BRAND */}
        <div className="flex items-center space-x-2.5 shrink-0 justify-center lg:justify-start">
          <Logo3DFlip size={30} />
          <span className="text-sm font-black text-[#2A0826] tracking-tight">Sakhi Suraksha SOS</span>
        </div>

        {/* CENTER: TERMS & PRIVACY */}
        <div className="flex items-center justify-center space-x-4 text-[11px] font-black tracking-wide text-[#684E67] shrink-0">
          <Link href="/terms" className="hover:text-[#FF2A6D] transition-colors">Terms of Service</Link>
          <span className="text-[#FFCCE1]">|</span>
          <Link href="/privacy" className="hover:text-[#FF2A6D] transition-colors">Privacy Policy</Link>
        </div>

        {/* RIGHT: DESIGNED & DEVELOPED BY (RESPONSIVE SINGLE LINE ON DESKTOP, CLEAN WRAP ON MOBILE) */}
        <div className="flex items-center justify-center lg:justify-end text-[10px] sm:text-[11px] font-black tracking-wide text-[#684E67] text-center lg:text-right lg:whitespace-nowrap max-w-full">
          <span>
            Designed & Developed by{' '}
            <a
              href="https://veaglespace.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF2A6D] hover:text-[#E01A4F] underline decoration-1.5 underline-offset-2 transition-colors font-black"
            >
              Veagle Space Technology Pvt. Ltd.
            </a>
            {' '}<span className="hidden sm:inline">|</span><br className="sm:hidden" /> © 2026 All Rights Reserved.
          </span>
        </div>

      </div>
    </footer>
  );
};

export const PublicFooter = Footer;
export default Footer;
