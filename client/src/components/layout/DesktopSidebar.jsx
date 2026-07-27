import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
import { useAuthStore } from '../../store/useAuthStore.js';
import { useSOSStore } from '../../store/useSOSStore.js';
import { useLocationStore } from '../../store/useLocationStore.js';

export const DesktopSidebar = () => {
  const { user, logout } = useAuthStore();
  const { activeSession } = useSOSStore();
  const { status } = useLocationStore();
  const navigate = useNavigate();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const navItems = [
    { path: '/', label: 'Home', icon: Home, desc: 'Safety Dashboard' },
    { path: '/track', label: 'Track Journey', icon: MapPin, desc: 'Journey & Check-ins' },
    { path: '/contacts', label: 'Contacts', icon: Users, desc: 'Trusted Network' },
    { path: '/help', label: 'Emergency Help', icon: HelpCircle, desc: 'Hotlines & Services' },
    { path: '/alarm', label: 'Loud Alarm', icon: Bell, desc: 'Emergency Siren' },
    { path: '/profile', label: 'Profile', icon: User, desc: 'Settings & Diagnostics' },
  ];

  if (isSuperAdmin) {
    navItems.unshift({ path: '/admin', label: 'Super Admin HQ', icon: Crown, desc: 'Incident Command' });
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-white border-r border-blush-border z-50 overflow-y-auto">
      <div className="px-5 py-5 border-b border-blush-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-plum flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-rose fill-rose/20" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-plum tracking-tight">Sakhi Suraksha SOS</h1>
            <div className="flex items-center space-x-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'LIVE' ? 'bg-tichi-success animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-[10px] font-semibold text-tichi-muted">{status === 'LIVE' ? 'GPS Active' : 'Connecting...'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-blush-border bg-blush">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-rose/30 text-plum font-extrabold text-base flex items-center justify-center border border-rose/40">
            {user?.fullName?.charAt(0) || 'S'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <p className="font-bold text-xs text-tichi-text truncate">{user?.fullName || 'User Profile'}</p>
              {isSuperAdmin && (
                <span className="bg-gold text-plum font-black text-[9px] px-1.5 py-0.5 rounded-md uppercase">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-[10px] text-tichi-muted truncate">{user?.email}</p>
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
          const isAdminTab = item.path === '/admin';
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? isAdminTab
                      ? 'bg-gold text-plum font-black shadow-gold-glow'
                      : 'bg-plum text-white shadow-sm'
                    : isAdminTab
                    ? 'bg-gold/10 text-gold-dark font-bold hover:bg-gold/20'
                    : 'text-tichi-muted hover:bg-plum-50 hover:text-plum'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? (isAdminTab ? 'text-plum' : 'text-rose') : ''}`} />
                  <div>
                    <p className={`font-bold ${isActive ? (isAdminTab ? 'text-plum' : 'text-white') : ''}`}>{item.label}</p>
                    <p className={`text-[10px] font-medium ${isActive ? (isAdminTab ? 'text-plum/80' : 'text-rose/80') : 'text-tichi-muted'}`}>{item.desc}</p>
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-blush-border space-y-2">
        <NavLink
          to={activeSession ? '/sos/active' : '/sos'}
          className="flex items-center justify-center space-x-2 w-full bg-tichi-emergency text-white font-extrabold px-4 py-3 rounded-xl text-xs shadow-sos-glow hover:brightness-105 transition-all"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{activeSession ? '🚨 VIEW SOS STATUS' : 'EMERGENCY SOS'}</span>
        </NavLink>

        <button
          onClick={() => { logout(); navigate('/auth'); }}
          className="flex items-center space-x-2 w-full text-tichi-muted hover:text-tichi-emergency px-3 py-2 rounded-xl text-xs font-semibold hover:bg-rose-soft transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
