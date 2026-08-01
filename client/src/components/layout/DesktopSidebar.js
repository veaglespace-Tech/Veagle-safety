'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import { useSelector, useDispatch } from 'react-redux';
import { logout as reduxLogout } from '../../redux/slices/authSlice.js';
import { Logo3DFlip } from '../ui/Logo3DFlip.js';

export const DesktopSidebar = () => {
  const dispatch = useDispatch();
  const reduxAuth = useSelector((state) => state?.auth || {});
  const { activeSession } = useSelector((state) => state?.sos || {});
  const { status } = useSelector((state) => state?.location || {});
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = reduxAuth?.user || (mounted && typeof window !== 'undefined' && localStorage.getItem('tichi_user') ? JSON.parse(localStorage.getItem('tichi_user')) : null);
  const isSuperAdmin = mounted && currentUser?.role === 'SUPER_ADMIN';
  const currentAdminTab = searchParams?.get('tab') || 'overview';

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
    { path: '/admin?tab=enquiries', tabKey: 'enquiries', label: 'Contact Enquiries', icon: HelpCircle, desc: 'Support & Inquiries' },
  ];

  const displayName = mounted
    ? (currentUser?.fullName || currentUser?.name || (currentUser?.email ? currentUser.email.split('@')[0] : 'Kaveri'))
    : 'Kaveri';

  const initials = mounted && (currentUser?.fullName || currentUser?.name)
    ? (currentUser.fullName || currentUser.name).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'KS';

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 flex-col bg-white/90 backdrop-blur-2xl border-r border-[#FFCCE1]/70 z-50 font-sans shadow-[6px_0_30px_rgba(255,92,138,0.06)]">
      
      {/* BRAND HEADER LOGO */}
      <div className="px-6 py-6 border-b border-[#FFCCE1]/60 bg-white/60">
        <Link href="/" className="flex items-center space-x-3.5 group cursor-pointer">
          <Logo3DFlip size={44} className="shrink-0 group-hover:scale-105 transition-transform" />
          <div style={{ lineHeight: 1.2 }}>
            <h1 className="font-black text-base text-[#2A0826] tracking-tight group-hover:text-[#FF2A6D] transition-colors">
              Sakhi Suraksha
            </h1>
            <p className="text-[10px] font-extrabold text-[#FF2A6D] tracking-widest uppercase mt-0.5">
              24/7 Safety Command
            </p>
          </div>
        </Link>
      </div>

      {/* ACTIVE EMERGENCY SOS NOTICE */}
      {activeSession && (
        <div className="mx-5 mt-5 bg-gradient-to-r from-[#FF2A6D] to-[#E01A4F] text-white text-xs font-black p-4 rounded-2xl flex items-center space-x-3 shadow-lg shadow-[#FF2A6D]/25 border border-white/30 animate-pulse">
          <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
          <span>SOS ACTIVE — LIVE MAP SHARING</span>
        </div>
      )}

      {/* NAVIGATION LINKS LIST */}
      <nav className="flex-1 px-5 py-6 space-y-6 overflow-y-auto scrollbar-none">
        {isSuperAdmin ? (
          /* SUPERADMIN HQ MANAGEMENT SECTION ONLY */
          <div className="space-y-3">
            <div className="flex items-center space-x-2 px-2 pb-1 text-[11px] font-black text-[#E6A100] uppercase tracking-wider">
              <Crown className="w-4 h-4" />
              <span>SuperAdmin Control HQ</span>
            </div>

            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = (pathname === '/admin' || pathname.startsWith('/admin')) && currentAdminTab === item.tabKey;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 group border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#E6A100] text-[#2A0826] font-black shadow-md shadow-[#E6A100]/20 border-white scale-[1.02]'
                      : 'bg-[#FFF9E6]/60 text-[#2A0826] border-[#FFE29A]/80 hover:border-[#E6A100] hover:bg-[#FFE29A]/40'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isActive ? 'bg-white/40 text-[#2A0826]' : 'bg-[#FFE29A]/60 text-[#E6A100]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs tracking-tight truncate">{item.label}</p>
                    <p className={`text-[10px] font-semibold truncate mt-0.5 ${isActive ? 'text-[#2A0826]/80' : 'text-[#684E67]'}`}>
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* MEMBER NAVIGATION SECTION ONLY */
          <div className="space-y-3">
            {memberNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-xs transition-all duration-300 group relative border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black shadow-lg shadow-[#FF2A6D]/25 border-white/30 scale-[1.02]'
                      : 'bg-white/80 text-[#2A0826] border-[#FFCCE1]/60 hover:border-[#FF2A6D]/60 hover:bg-[#FFF0F3]/80 hover:shadow-md hover:shadow-[#FF2A6D]/5 hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#FFF0F3] text-[#FF2A6D]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`font-black text-xs tracking-tight ${isActive ? 'text-white' : 'text-[#2A0826] group-hover:text-[#FF2A6D]'}`}>
                      {item.label}
                    </p>
                    <p className={`text-[10.5px] font-semibold truncate mt-0.5 ${isActive ? 'text-white/90' : 'text-[#684E67]'}`}>
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
      <div className="px-5 py-5 border-t border-[#FFCCE1]/60 bg-white/70 backdrop-blur-md space-y-3">
        <Link
          href={activeSession ? '/active-sos' : '/dashboard'}
          className="flex items-center justify-center space-x-2.5 w-full bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black px-4 py-3.5 rounded-2xl text-xs shadow-md shadow-[#FF2A6D]/25 hover:shadow-lg hover:shadow-[#FF2A6D]/35 hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-wider border border-white/30"
        >
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span>{activeSession ? '🚨 VIEW SOS STATUS' : 'EMERGENCY SOS'}</span>
        </Link>

        {/* LOGGED IN USER CARD WITH PROFILE LINK */}
        <Link
          href="/settings"
          className="bg-[#FFF0F3]/60 border border-[#FFCCE1]/80 hover:border-[#FF2A6D]/60 p-3 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5C8A] to-[#FF2A6D] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-xs text-[#2A0826] group-hover:text-[#FF2A6D] transition-colors truncate">
                {displayName}
              </p>
              <p className="text-[10px] font-bold text-[#FF2A6D] truncate">
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
