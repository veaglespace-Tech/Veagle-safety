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

  const handleLogout = () => {
    dispatch(reduxLogout());
    if (typeof window !== 'undefined') {
      window.location.href = '/auth?mode=login';
    } else {
      router.push('/auth?mode=login');
    }
  };

  const memberNavItems = [
    { path: '/dashboard', label: 'Home', icon: Home, desc: 'Safety Dashboard' },
    { path: '/track-journey', label: 'Track Journey', icon: MapPin, desc: 'Journey & Check-ins' },
    { path: '/contacts', label: 'Contacts', icon: Users, desc: 'Trusted Network' },
    { path: '/subscription', label: 'Subscription', icon: ShieldCheck, desc: 'Active Plan & Validity' },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Emergency Command', icon: AlertOctagon, desc: 'Active SOS & Incident HQ' },
    { path: '/admin/users', label: 'User Management', icon: Users, desc: 'All Users & Free Grants' },
    { path: '/admin/plans', label: 'Plans & Dynamic GST', icon: Sliders, desc: 'DB Plans & Global GST' },
    { path: '/admin/payments', label: 'Payment Receipts', icon: CreditCard, desc: 'Txn History & Revenue' },
    { path: '/admin/enquiries', label: 'Contact Support', icon: HelpCircle, desc: 'Support & Inquiries' },
    { path: '/contacts', label: 'My Guardians', icon: Users, desc: 'Personal Safety Contacts' },
    { path: '/track-journey', label: 'Track My Journey', icon: MapPin, desc: 'Live Route Sharing' },
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
          /* SUPERADMIN UNIFIED NAVIGATION LIST */
          <div className="space-y-3">
            <div className="flex items-center space-x-2 px-2 pb-1 text-[11px] font-black text-[#FF2A6D] uppercase tracking-wider">
              <Crown className="w-4 h-4 text-[#FF2A6D]" />
              <span>SuperAdmin Command HQ</span>
            </div>

            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 group border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black shadow-md shadow-[#FF2A6D]/20 border-white scale-[1.02]'
                      : 'bg-white/80 text-[#2A0826] border-[#FFCCE1]/60 hover:border-[#FF2A6D]/60 hover:bg-[#FFF0F3]/80'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#FFF0F3] text-[#FF2A6D]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`font-black text-xs tracking-tight truncate ${isActive ? 'text-white' : 'text-[#2A0826] group-hover:text-[#FF2A6D]'}`}>
                      {item.label}
                    </p>
                    <p className={`text-[10px] font-semibold truncate mt-0.5 ${isActive ? 'text-white/90' : 'text-[#684E67]'}`}>
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
          href={isSuperAdmin ? '/admin?tab=overview' : (activeSession ? '/active-sos' : '/dashboard')}
          className="flex items-center justify-center space-x-2.5 w-full bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black px-4 py-3.5 rounded-2xl text-xs shadow-md shadow-[#FF2A6D]/25 hover:shadow-lg hover:shadow-[#FF2A6D]/35 hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-wider border border-white/30"
        >
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span>{isSuperAdmin ? '🚨 EMERGENCY COMMAND' : (activeSession ? '🚨 VIEW SOS STATUS' : 'EMERGENCY SOS')}</span>
        </Link>

        {/* LOGGED IN USER CARD WITH SIGN OUT */}
        <div className="bg-[#FFF0F3]/80 border border-[#FFCCE1] p-3 rounded-2xl flex items-center justify-between shadow-xs">
          <Link href="/settings" className="flex items-center space-x-3 min-w-0 group cursor-pointer flex-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5C8A] to-[#FF2A6D] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs overflow-hidden">
              {currentUser?.profilePhoto ? (
                <img src={currentUser.profilePhoto} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-xs text-[#2A0826] group-hover:text-[#FF2A6D] transition-colors truncate">
                {displayName}
              </p>
              <p className="text-[10px] font-bold text-[#FF2A6D] truncate">
                {isSuperAdmin ? 'Super Admin' : 'Active Protection'}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-xl text-[#FF2A6D] hover:bg-[#FF2A6D] hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
