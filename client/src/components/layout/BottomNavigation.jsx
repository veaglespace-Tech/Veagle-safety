import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, MapPin, AlertTriangle, Users, User } from 'lucide-react';
import { useSOSStore } from '../../store/useSOSStore.js';

export const BottomNavigation = () => {
  const location = useLocation();
  const { activeSession } = useSOSStore();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/track', label: 'Track', icon: MapPin },
    { path: '/sos', label: 'SOS', icon: AlertTriangle, isCenter: true },
    { path: '/contacts', label: 'Contacts', icon: Users },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-blush-border safe-pb shadow-[0_-4px_20px_-4px_rgba(36,26,32,0.08)]">
      <div className="max-w-xl mx-auto flex items-center justify-around px-2 pt-1 pb-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/sos' && location.pathname === '/sos/active');

          if (item.isCenter) {
            return (
              <NavLink
                key={item.path}
                to={activeSession ? '/sos/active' : '/sos'}
                className="relative -top-5 flex flex-col items-center group"
              >
                <div className={`absolute -inset-2 rounded-full transition-all ${activeSession ? 'animate-ping bg-tichi-emergency/20' : ''}`} />
                <div
                  className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-sos-glow transition-transform group-hover:scale-105 ${
                    activeSession
                      ? 'bg-tichi-emergency text-white animate-pulse'
                      : 'bg-tichi-emergency text-white ring-4 ring-rose/30'
                  }`}
                >
                  <AlertTriangle className="w-7 h-7 fill-white/20" />
                </div>
                <span className="text-[10px] font-extrabold text-tichi-emergency mt-0.5 tracking-widest">
                  {activeSession ? 'ACTIVE' : 'SOS'}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={`flex flex-col items-center py-2 px-3.5 rounded-xl transition-all ${
                isActive
                  ? 'text-plum'
                  : 'text-tichi-faint hover:text-plum'
              }`}
            >
              <Icon className={`w-5 h-5 transition-all ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <div className={`mt-1 transition-all ${isActive ? 'w-4 h-0.5 rounded-full bg-plum' : 'w-0 h-0.5'}`} />
              <span className={`text-[10px] mt-0.5 font-semibold ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
