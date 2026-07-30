'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, AlertTriangle, Users, User } from 'lucide-react';
import { useSOSStore } from '../../redux/useSOSStore.js';

export const BottomNavigation = () => {
  const pathname = usePathname();
  const { activeSession } = useSOSStore();

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/track-journey', label: 'Track', icon: MapPin },
    { path: '/active-sos', label: 'SOS', icon: AlertTriangle, isCenter: true },
    { path: '/contacts', label: 'Contacts', icon: Users },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-[#FFCCE1] safe-pb shadow-[0_-4px_25px_-4px_rgba(255,92,138,0.25)]">
      <div className="max-w-xl mx-auto flex items-center justify-around px-2 pt-1 pb-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path === '/active-sos' && pathname === '/active-sos');

          if (item.isCenter) {
            return (
              <Link
                key={item.path}
                href={activeSession ? '/active-sos' : '/dashboard'}
                className="relative -top-5 flex flex-col items-center group"
              >
                <div className={`absolute -inset-2 rounded-full transition-all ${activeSession ? 'animate-ping bg-[#FF2A6D]/20' : ''}`} />
                <div
                  className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-coral-glow transition-transform group-hover:scale-105 border-2 border-white ${
                    activeSession
                      ? 'bg-gradient-to-r from-[#FF2A6D] to-rose text-white animate-pulse'
                      : 'bg-gradient-to-r from-[#FF2A6D] to-rose text-white ring-4 ring-rose/30'
                  }`}
                >
                  <AlertTriangle className="w-7 h-7 fill-white/20" />
                </div>
                <span className="text-[10px] font-black text-[#FF2A6D] mt-0.5 tracking-widest uppercase">
                  {activeSession ? 'ACTIVE' : 'SOS'}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center py-2 px-3.5 rounded-2xl transition-all ${
                isActive
                  ? 'text-rose font-black'
                  : 'text-tichi-muted hover:text-rose'
              }`}
            >
              <Icon className={`w-5 h-5 transition-all ${isActive ? 'stroke-[2.5px] text-rose' : 'stroke-[1.8px]'}`} />
              <div className={`mt-1 transition-all ${isActive ? 'w-4 h-1 rounded-full bg-rose' : 'w-0 h-1'}`} />
              <span className={`text-[10px] mt-0.5 font-extrabold ${isActive ? 'text-rose' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
