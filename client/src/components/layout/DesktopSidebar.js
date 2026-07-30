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

export const DesktopSidebar = () => {
  const dispatch = useDispatch();
  const { user, logout } = useAuthStore();
  const { activeSession } = useSOSStore();
  const { status } = useLocationStore();
  const pathname = usePathname();
  const router = useRouter();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

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
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-[#FFF0F3] border-r-2 border-[#FFCCE1] z-50 overflow-y-auto font-sans shadow-md">
      
      {/* BRAND HEADER LOGO */}
      <div className="px-6 py-6 border-b border-[#FFCCE1] bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF5C8A] via-[#FF85A2] to-[#FFD166] p-0.5 shadow-coral-glow shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-rose" />
            </div>
          </div>
          <div>
            <h1 className="font-black text-base text-tichi-text leading-tight tracking-tight">Sakhi Suraksha SOS</h1>
            <p className="text-[10px] font-black text-rose tracking-widest uppercase mt-0.5">24/7 Women Protection</p>
          </div>
        </div>
      </div>

      {/* ACTIVE EMERGENCY SOS NOTICE */}
      {activeSession && (
        <div className="mx-4 mt-4 bg-gradient-to-r from-[#FF2A6D] to-rose text-white text-xs font-black p-3.5 rounded-2xl flex items-center space-x-2.5 animate-pulse shadow-coral-glow border border-white">
          <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
          <span>SOS ACTIVE — LIVE TRACKING</span>
        </div>
      )}

      {/* NAVIGATION LINKS LIST */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          const isAdminTab = item.path === '/admin';
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-xs font-black transition-all group border ${
                isActive
                  ? isAdminTab
                    ? 'bg-gradient-to-r from-gold via-[#FFE29A] to-gold text-tichi-text font-black shadow-gold-glow border-gold/50'
                    : 'btn-baby-pink shadow-coral-glow border-transparent'
                  : isAdminTab
                  ? 'bg-gold/10 text-gold-dark font-black hover:bg-gold/20 border-gold/30'
                  : 'bg-white text-tichi-text border-[#FFCCE1] hover:border-rose hover:bg-rose/10 hover:text-rose'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? (isAdminTab ? 'text-tichi-text' : 'text-white') : 'text-rose'}`} />
              <div className="flex-1 min-w-0">
                <p className={`font-black text-xs ${isActive ? (isAdminTab ? 'text-tichi-text' : 'text-white') : 'text-tichi-text group-hover:text-rose'}`}>{item.label}</p>
                <p className={`text-[10px] font-bold truncate mt-0.5 ${isActive ? (isAdminTab ? 'text-tichi-text/80' : 'text-white/90') : 'text-tichi-muted'}`}>{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="px-4 py-5 border-t border-[#FFCCE1] bg-white space-y-3">
        <Link
          href={activeSession ? '/active-sos' : '/dashboard'}
          className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-[#FF2A6D] via-rose to-[#FF2A6D] text-white font-black px-4 py-3.5 rounded-2xl text-xs shadow-coral-glow hover:brightness-110 transition-all uppercase tracking-wider border border-white/30"
        >
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span>{activeSession ? '🚨 VIEW SOS STATUS' : 'EMERGENCY SOS'}</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-2 w-full text-tichi-muted hover:text-[#FF2A6D] px-3 py-2.5 rounded-xl text-xs font-black transition-colors hover:bg-rose/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
