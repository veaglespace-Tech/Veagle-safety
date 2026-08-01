'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  ShieldCheck,
  Home,
  MapPin,
  AlertTriangle,
  Users,
  User,
  Sliders,
  Bell,
  HelpCircle,
  LogOut,
  Crown,
  Sparkles,
  ChevronRight,
  CreditCard,
  AlertOctagon,
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
  const currentAdminTab = mounted && typeof window !== 'undefined'
    ? (new URLSearchParams(window.location.search).get('tab') || 'overview')
    : 'overview';

  const memberNavItems = [
    { path: '/dashboard', label: 'Home', icon: Home, desc: 'Safety Dashboard' },
    { path: '/track-journey', label: 'Track Journey', icon: MapPin, desc: 'Journey & Check-ins' },
    { path: '/contacts', label: 'Contacts', icon: Users, desc: 'Trusted Network' },
    { path: '/subscription', label: 'Subscription', icon: ShieldCheck, desc: 'Active Plan & Validity' },
  ];

  const adminNavItems = [
    { path: '/admin?tab=overview', tabKey: 'overview', label: 'Admin Overview', icon: Crown, desc: 'Incident Command' },
    { path: '/admin?tab=users', tabKey: 'users', label: 'User Management', icon: Users, desc: 'All Users & Free Grants' },
    { path: '/admin?tab=plans', tabKey: 'plans', label: 'Plans & Dynamic GST', icon: Sliders, desc: 'DB Plans & Global GST' },
    { path: '/admin?tab=payments', tabKey: 'payments', label: 'Payment Receipts', icon: CreditCard, desc: 'Txn History & Revenue' },
  ];

  const displayName = mounted
    ? (user?.fullName || user?.name || (user?.email ? user.email.split('@')[0] : 'Kaveri'))
    : 'Kaveri';

  const initials = mounted && (user?.fullName || user?.name)
    ? (user.fullName || user.name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'KS';

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
      <nav className="flex-1 px-4 py-5 space-y-4">
        {isSuperAdmin ? (
          /* SUPERADMIN HQ MANAGEMENT SECTION ONLY */
          <div className="space-y-2.5">
            <div className="flex items-center space-x-1.5 px-2 pb-1 text-[10px] font-black text-[#E6A100] uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              <span>SuperAdmin Command HQ</span>
            </div>

            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === '/admin' && currentAdminTab === item.tabKey;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-3.5 rounded-2xl text-xs font-black transition-all duration-300 group border-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#E6A100] text-[#2A0826] shadow-[0_8px_22px_rgba(230,161,0,0.4)] border-white scale-[1.02]'
                      : 'bg-[#FFF9E6] text-[#2A0826] border-[#FFE29A] hover:border-[#E6A100] hover:bg-[#FFE29A]/40'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    isActive ? 'bg-white/40 text-[#2A0826]' : 'bg-[#FFE29A]/60 text-[#E6A100]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs tracking-tight truncate">{item.label}</p>
                    <p className={`text-[9.5px] font-bold truncate mt-0.5 ${isActive ? 'text-[#2A0826]/80' : 'text-[#684E67]'}`}>
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* MEMBER NAVIGATION SECTION ONLY */
          <div className="space-y-2.5">
            {memberNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-xs font-black transition-all duration-300 group relative border-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black shadow-[0_10px_28px_rgba(255,42,109,0.38)] border-white/40 scale-[1.02]'
                      : 'bg-white text-[#2A0826] border-[#FFCCE1] hover:border-[#FF2A6D] hover:bg-[#FFF0F3] hover:shadow-[0_6px_20px_rgba(255,92,138,0.18)] hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#FFF0F3] text-[#FF2A6D]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`font-black text-xs tracking-tight ${isActive ? 'text-white' : 'text-[#2A0826] group-hover:text-[#FF2A6D]'}`}>
                      {item.label}
                    </p>
                    <p className={`text-[10px] font-extrabold truncate mt-0.5 ${isActive ? 'text-white/95' : 'text-[#684E67]'}`}>
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* FOOTER USER PROFILE AREA */}
      <div className="px-4 py-4 border-t-2 border-[#FFCCE1] bg-white/90 backdrop-blur-md space-y-3">
        <Link
          href={activeSession ? '/active-sos' : '/dashboard'}
          className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black px-4 py-3 rounded-full text-xs shadow-[0_6px_20px_rgba(255,42,109,0.35)] hover:shadow-[0_10px_28px_rgba(255,42,109,0.5)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider border border-white/30"
        >
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span>{activeSession ? '🚨 VIEW SOS STATUS' : 'EMERGENCY SOS'}</span>
        </Link>

        {/* LOGGED IN USER CARD WITH PROFILE LINK */}
        <Link
          href="/settings"
          className="bg-[#FFF0F3] border-2 border-[#FFCCE1] hover:border-[#FF2A6D] p-2.5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5C8A] to-[#FF2A6D] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-xs text-[#2A0826] group-hover:text-[#FF2A6D] transition-colors truncate">
                {displayName}
              </p>
              <p className="text-[10px] font-extrabold text-[#FF2A6D] truncate">
                {isSuperAdmin ? 'Super Admin' : 'Active Protection'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#FF2A6D] transform group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </aside>
  );
};
