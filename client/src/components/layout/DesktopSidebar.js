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
} from 'lucide-react';
import { useAuthStore } from '../../redux/useAuthStore.js';
import { useSOSStore } from '../../redux/useSOSStore.js';
import { useLocationStore } from '../../redux/useLocationStore.js';

export const DesktopSidebar = () => {
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
    logout();
    router.push('/auth');
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-white border-r border-blush-border z-50 overflow-y-auto">
      <div className="px-5 py-5 border-b border-blush-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-plum flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-rose fill-rose/20" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-plum leading-tight">VEAGLE SAFETY</h1>
            <p className="text-[10px] font-bold text-rose tracking-wider uppercase">Women Protection</p>
          </div>
        </div>
      </div>

      {activeSession && (
        <div className="mx-3 mt-3 bg-tichi-emergency text-white text-xs font-bold p-3 rounded-xl flex items-center space-x-2 animate-pulse shadow-sos-glow">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>SOS ACTIVE — TRACKING LIVE</span>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          const isAdminTab = item.path === '/admin';
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? isAdminTab
                    ? 'bg-gold text-plum font-black shadow-gold-glow'
                    : 'bg-plum text-white shadow-sm'
                  : isAdminTab
                  ? 'bg-gold/10 text-gold-dark font-bold hover:bg-gold/20'
                  : 'text-tichi-muted hover:bg-plum-50 hover:text-plum'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? (isAdminTab ? 'text-plum' : 'text-rose') : ''}`} />
              <div>
                <p className={`font-bold ${isActive ? (isAdminTab ? 'text-plum' : 'text-white') : ''}`}>{item.label}</p>
                <p className={`text-[10px] font-medium ${isActive ? (isAdminTab ? 'text-plum/80' : 'text-rose/80') : 'text-tichi-muted'}`}>{item.desc}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-blush-border space-y-2">
        <Link
          href={activeSession ? '/active-sos' : '/dashboard'}
          className="flex items-center justify-center space-x-2 w-full bg-tichi-emergency text-white font-extrabold px-4 py-3 rounded-xl text-xs shadow-sos-glow hover:brightness-105 transition-all"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{activeSession ? '🚨 VIEW SOS STATUS' : 'EMERGENCY SOS'}</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full text-tichi-muted hover:text-tichi-emergency px-3 py-2 rounded-xl text-xs font-semibold hover:bg-rose-soft transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
