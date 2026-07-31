'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  Home,
  MapPin,
  AlertTriangle,
  Users,
  User,
  Bell,
  HelpCircle,
  LogOut,
  Crown,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../redux/useAuthStore.js';
import { useSOSStore } from '../../redux/useSOSStore.js';
import { useLocationStore } from '../../redux/useLocationStore.js';
import { useDispatch } from 'react-redux';
import { logout as reduxLogout } from '../../redux/slices/authSlice.js';
import { Logo3DFlip } from '../ui/Logo3DFlip.js';

export const DesktopSidebar = () => {
  const dispatch = useDispatch();
  const { user, logout } = useAuthStore();
  const { activeSession } = useSOSStore();
  const { status } = useLocationStore();
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isSuperAdmin = mounted && user?.role === 'SUPER_ADMIN';

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home, desc: 'Safety Dashboard' },
    { path: '/track-journey', label: 'Track Journey', icon: MapPin, desc: 'Journey & Check-ins' },
    { path: '/contacts', label: 'Contacts', icon: Users, desc: 'Trusted Network' },
    { path: '/profile', label: 'Profile', icon: User, desc: 'Settings & Diagnostics' },
  ];

  if (isSuperAdmin) {
    navItems.unshift({ path: '/admin', label: 'Super Admin HQ', icon: Crown, desc: 'Incident Command' });
  }

  const handleLogout = () => {
    dispatch(reduxLogout());
    logout();
    router.push('/auth?mode=login');
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-gradient-to-b from-[#FFF0F3] via-white to-[#FFF0F3] border-r-2 border-[#FFCCE1] z-50 overflow-y-auto font-sans shadow-[4px_0_24px_rgba(255,92,138,0.12)]">
      
      {/* BRAND HEADER LOGO */}
      <div className="px-5 py-5 border-b-2 border-[#FFCCE1] bg-white/90 backdrop-blur-md">
        <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
          <Logo3DFlip size={42} className="shrink-0 group-hover:scale-105 transition-transform" />
          <div style={{ lineHeight: 1.15 }}>
            <h1 className="font-black text-sm text-[#2A0826] tracking-tight truncate group-hover:text-[#FF2A6D] transition-colors">
              Sakhi Suraksha SOS
            </h1>
            <p className="text-[9.5px] font-extrabold text-[#FF2A6D] tracking-widest uppercase mt-0.5">
              24/7 Women Protection
            </p>
          </div>
        </Link>
      </div>

      {/* ACTIVE EMERGENCY SOS NOTICE */}
      {activeSession && (
        <div className="mx-4 mt-4 bg-gradient-to-r from-[#FF2A6D] to-[#E01A4F] text-white text-xs font-black p-3.5 rounded-2xl flex items-center space-x-2.5 animate-pulse shadow-[0_8px_25px_rgba(255,42,109,0.4)] border border-white/40">
          <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
          <span>SOS ACTIVE — LIVE TRACKING</span>
        </div>
      )}

      {/* NAVIGATION LINKS LIST */}
      <nav className="flex-1 px-4 py-6 space-y-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          const isAdminTab = item.path === '/admin';
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-xs font-black transition-all duration-300 group relative border-2 ${
                isActive
                  ? isAdminTab
                    ? 'bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#E6A100] text-[#2A0826] font-black shadow-[0_8px_25px_rgba(230,161,0,0.38)] border-white/50 scale-[1.02]'
                    : 'bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black shadow-[0_10px_28px_rgba(255,42,109,0.38)] border-white/40 scale-[1.02]'
                  : isAdminTab
                  ? 'bg-[#FFF9E6] text-[#E6A100] font-black hover:bg-[#FFE29A]/30 border-[#FFE29A] hover:border-[#E6A100]'
                  : 'bg-white text-[#2A0826] border-[#FFCCE1] hover:border-[#FF2A6D] hover:bg-[#FFF0F3] hover:shadow-[0_6px_20px_rgba(255,92,138,0.18)] hover:-translate-y-0.5'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 transition-transform group-hover:scale-110 ${
                isActive
                  ? isAdminTab
                    ? 'bg-white/30 text-[#2A0826]'
                    : 'bg-white/20 text-white'
                  : isAdminTab
                  ? 'bg-[#FFE29A]/50 text-[#E6A100]'
                  : 'bg-[#FFF0F3] text-[#FF2A6D]'
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-black text-xs tracking-tight ${
                  isActive
                    ? isAdminTab
                      ? 'text-[#2A0826]'
                      : 'text-white'
                    : 'text-[#2A0826] group-hover:text-[#FF2A6D]'
                }`}>
                  {item.label}
                </p>
                <p className={`text-[10px] font-extrabold truncate mt-0.5 ${
                  isActive
                    ? isAdminTab
                      ? 'text-[#2A0826]/85'
                      : 'text-white/95'
                    : 'text-[#684E67]'
                }`}>
                  {item.desc}
                </p>
              </div>

              {isActive && (
                <ChevronRight className={`w-4 h-4 shrink-0 animate-pulse ${isAdminTab ? 'text-[#2A0826]' : 'text-white'}`} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="px-4 py-5 border-t-2 border-[#FFCCE1] bg-white/90 backdrop-blur-md space-y-3">
        <Link
          href={activeSession ? '/active-sos' : '/dashboard'}
          className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black px-4 py-3.5 rounded-full text-xs shadow-[0_6px_20px_rgba(255,42,109,0.35)] hover:shadow-[0_10px_28px_rgba(255,42,109,0.5)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider border border-white/30"
        >
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span>{activeSession ? '🚨 VIEW SOS STATUS' : 'EMERGENCY SOS'}</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-2 w-full text-[#684E67] hover:text-[#FF2A6D] px-3 py-2.5 rounded-xl text-xs font-black transition-colors hover:bg-[#FFF0F3] border border-transparent hover:border-[#FFCCE1] cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
