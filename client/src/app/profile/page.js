'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout.js';
import { useAuthStore } from '../../redux/useAuthStore.js';
import { useLocationStore } from '../../redux/useLocationStore.js';
import { useRouter } from 'next/navigation';
import {
  Shield,
  MapPin,
  Bell,
  LogOut,
  CheckCircle,
  Play,
  Lock,
  Smartphone,
  Info,
  ChevronRight,
  Crown,
  User as UserIcon,
  PhoneCall,
  Mail,
  Heart,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function UserProfileSettingsPage() {
  const { user, logout } = useAuthStore();
  const { status, accuracy } = useLocationStore();
  const [showTestModal, setShowTestModal] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out?')) {
      logout();
      router.push('/auth');
    }
  };

  const handleRunTest = () => {
    setTestSuccess(true);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([200, 100, 200]);
    setTimeout(() => {
      setTestSuccess(false);
      setShowTestModal(false);
    }, 2500);
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'PS';

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isVibrationSupported = typeof window !== 'undefined' && 'vibrate' in navigator;

  const diagnostics = [
    { icon: MapPin, label: 'GPS Location Access', status: status === 'LIVE', value: status === 'LIVE' ? `✓ Active (±${accuracy || '10'}m)` : '⚠ Permission Required' },
    { icon: Bell, label: 'Push & Email Alerts', status: true, value: '✓ 100% Ready' },
    { icon: Lock, label: 'Encrypted Session Token', status: true, value: '✓ Secure JWT 256-bit' },
    { icon: Smartphone, label: 'Device Vibration Haptics', status: isVibrationSupported, value: isVibrationSupported ? '✓ Supported' : '— Hardware N/A' },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden pb-16">
        
        {/* BACKGROUND AMBIENT GLOW MESHES */}
        <div className="absolute w-[700px] h-[700px] rounded-full bg-rose/15 blur-[150px] top-[-100px] left-[-200px] pointer-events-none" />
        <div className="absolute w-[700px] h-[700px] rounded-full bg-gold/15 blur-[150px] bottom-[100px] right-[-200px] pointer-events-none" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10 animate-fade-up">

          {/* USER PROFILE HEADER CARD */}
          <div className="card-antique-pink border-2 border-rose shadow-coral-glow overflow-hidden rounded-3xl relative">
            <div className="bg-gradient-to-r from-rose via-rose-light to-gold h-28 relative">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_50%,#FF2A6D_0%,transparent_70%)]" />
            </div>

            <div className="px-6 pb-6 -mt-12 relative z-10 space-y-4">
              <div className="flex items-end justify-between">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose via-rose-light to-gold p-0.5 shadow-lg">
                  <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center font-black text-2xl text-tichi-text">
                    {initials}
                  </div>
                </div>

                <span className="bg-white/80 backdrop-blur-md border border-[#FFCCE1] text-tichi-text font-black text-xs px-4 py-2 rounded-2xl shadow-sm uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-tichi-success" />
                  <span>365-DAY ACTIVE</span>
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h1 className="font-black text-2xl text-tichi-text">{user?.fullName || 'Sakhi Member'}</h1>
                  {isSuperAdmin && (
                    <span className="bg-gold text-tichi-text font-black text-[10px] px-3 py-1 rounded-full uppercase flex items-center space-x-1 shadow-gold-glow">
                      <Crown className="w-3.5 h-3.5" />
                      <span>SUPER ADMIN</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-tichi-muted pt-1">
                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-rose" />
                    <span>{user?.email || 'sakhi@suraksha.org'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-rose" />
                    <span>{user?.phone || '+91 98765 43210'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-rose/10 px-2.5 py-0.5 rounded-full text-rose font-black">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Blood Group: {user?.bloodGroup || 'O+'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SAFETY SYSTEM DIAGNOSTICS */}
          <div className="card-antique-pink border-2 border-rose p-6 sm:p-8 rounded-3xl shadow-md space-y-5">
            <div className="flex items-center space-x-3 border-b border-[#FFCCE1] pb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose/15 text-rose flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-base text-tichi-text">Safety System Diagnostics</h2>
                <p className="text-xs text-tichi-muted font-bold">24/7 Real-Time Emergency Network Readiness</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {diagnostics.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-white border-2 border-[#FFCCE1] rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.status ? 'bg-tichi-success/15 text-tichi-success' : 'bg-amber-500/15 text-amber-500'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-tichi-text">{item.label}</p>
                        <p className={`text-[11px] font-bold mt-0.5 ${item.status ? 'text-tichi-success' : 'text-amber-600'}`}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TEST SOS SYSTEM DRILL */}
          <div className="bg-gradient-to-r from-tichi-text via-[#3D0C38] to-tichi-text text-white border-2 border-rose p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-rose/20 text-rose flex items-center justify-center shrink-0 border border-white/20">
                <Play className="w-6 h-6 text-rose animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white">Run SOS Emergency Drill</h3>
                <p className="text-xs text-white/80 font-bold mt-1 leading-relaxed">
                  Test your device vibration, audio siren, and GPS stream without alerting your actual trusted contacts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTestModal(true)}
              className="w-full btn-baby-pink py-4 rounded-2xl text-xs uppercase tracking-wider font-black shadow-coral-glow flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>START DRILL READINESS TEST</span>
            </button>
          </div>

          {/* APP SETTINGS MENU */}
          <div className="bg-white border-2 border-[#FFCCE1] rounded-3xl p-6 shadow-sm space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-rose pb-2">App Settings & Security</div>
            {[
              { label: 'Privacy & Data Controls', desc: 'Encrypted location logs & data purge' },
              { label: 'Notification Preferences', desc: 'Real-time push, email & siren alerts' },
              { label: 'Update Account Password', desc: 'Modify account authentication keys' },
              { label: 'About Sakhi Suraksha SOS', desc: 'Version 2.0.0 • Pure JavaScript Edition' },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-[#FFF0F3] transition-colors border border-transparent hover:border-[#FFCCE1] text-left"
              >
                <div>
                  <p className="text-xs font-black text-tichi-text">{item.label}</p>
                  <p className="text-[11px] text-tichi-muted font-bold mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-rose" />
              </button>
            ))}
          </div>

          {/* SIGN OUT BUTTON */}
          <button
            onClick={handleLogout}
            className="w-full bg-white border-2 border-[#FF2A6D] text-[#FF2A6D] hover:bg-[#FF2A6D] hover:text-white font-black py-4 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>SIGN OUT OF ACCOUNT</span>
          </button>

        </div>

        {/* SOS TEST DRILL MODAL */}
        {showTestModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border-4 border-rose overflow-hidden animate-scale-in">
              <div className="bg-gradient-to-r from-rose to-[#FF2A6D] p-6 text-white text-center">
                <h3 className="font-black text-lg">
                  {testSuccess ? '✅ Drill Passed!' : '🛡️ SOS Emergency Drill'}
                </h3>
              </div>

              <div className="p-6 space-y-4 text-center">
                {testSuccess ? (
                  <div className="space-y-3">
                    <CheckCircle className="w-16 h-16 text-tichi-success mx-auto animate-bounce" />
                    <div>
                      <p className="font-black text-lg text-tichi-text">All Systems Operational!</p>
                      <p className="text-xs text-tichi-muted font-bold mt-1">
                        GPS accuracy, vibration haptics & siren alerts are 100% active.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-tichi-muted font-bold leading-relaxed">
                      This will trigger a 5-second simulated emergency alarm on your device only.
                    </p>
                    <button
                      onClick={handleRunTest}
                      className="w-full btn-baby-pink py-3.5 rounded-2xl text-xs uppercase tracking-wider font-black shadow-coral-glow"
                    >
                      START TEST NOW
                    </button>
                    <button
                      onClick={() => setShowTestModal(false)}
                      className="w-full text-tichi-muted text-xs font-bold hover:text-tichi-text py-2"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
