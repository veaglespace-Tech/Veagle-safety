import React from 'react';
import { Shield, Bell, Crown } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useLocationStore } from '../../store/useLocationStore.js';
import { useSOSStore } from '../../store/useSOSStore.js';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { user } = useAuthStore();
  const { status } = useLocationStore();
  const { activeSession } = useSOSStore();

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'PS';

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <header className="lg:hidden bg-white border-b border-blush-border px-4 py-3 sticky top-0 z-30 safe-pt">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-plum flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-rose fill-rose/20" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-extrabold text-base text-plum tracking-tight leading-none block">Sakhi Suraksha SOS</span>
              {isSuperAdmin && (
                <span className="bg-gold text-plum font-black text-[9px] px-1 rounded-sm uppercase">ADMIN</span>
              )}
            </div>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'LIVE' ? 'bg-tichi-success animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-[11px] text-tichi-muted font-semibold">{status === 'LIVE' ? 'Protected' : 'GPS Updating'}</span>
            </div>
          </div>
        </Link>

        <div className="flex items-center space-x-1.5">
          {isSuperAdmin && (
            <Link
              to="/admin"
              className="bg-gold text-plum text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-gold-glow flex items-center space-x-1"
            >
              <Crown className="w-3 h-3" />
              <span>HQ</span>
            </Link>
          )}

          {activeSession && (
            <Link
              to="/sos/active"
              className="flex items-center space-x-1.5 bg-tichi-emergency text-white text-[10px] font-black px-2.5 py-1.5 rounded-full animate-pulse shadow-sos-glow"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>SOS LIVE</span>
            </Link>
          )}

          <Link
            to="/alarm"
            className="p-2 text-tichi-muted hover:text-tichi-emergency hover:bg-rose-soft rounded-xl transition-colors"
            title="Emergency Alarm"
          >
            <Bell className="w-5 h-5" />
          </Link>

          <Link
            to="/profile"
            className="flex items-center space-x-2 p-1 rounded-xl hover:bg-plum-50 transition-colors border border-transparent hover:border-blush-border"
          >
            <div className="w-8 h-8 rounded-full bg-rose/30 text-plum flex items-center justify-center font-extrabold text-xs border border-rose/30">
              {initials}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
