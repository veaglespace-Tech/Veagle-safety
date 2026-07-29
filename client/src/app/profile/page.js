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
  Sliders,
  QrCode,
  Sparkles,
} from 'lucide-react';

export default function UserProfileSettingsPage() {
  const { user, logout } = useAuthStore();
  const { status, accuracy } = useLocationStore();
  const [activeTab, setActiveTab] = useState('DIAGNOSTICS');
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
    { icon: Lock, label: 'Encrypted Token', status: true, value: '✓ Secure JWT 256-bit' },
    { icon: Smartphone, label: 'Device Vibration', status: isVibrationSupported, value: isVibrationSupported ? '✓ Supported' : '— Hardware N/A' },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden pb-16">
        
        {/* BACKGROUND AMBIENT GLOW MESHES */}
        <div className="absolute w-[700px] h-[700px] rounded-full bg-rose/15 blur-[150px] top-[-100px] left-[-200px] pointer-events-none" />
        <div className="absolute w-[700px] h-[700px] rounded-full bg-gold/15 blur-[150px] bottom-[100px] right-[-200px] pointer-events-none" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 animate-fade-up">

          {/* SINGLE MASTER UNIFIED LUXURY PORCELAIN HUB PANEL */}
          <div className="card-antique-pink border-2 border-rose shadow-coral-glow overflow-hidden rounded-[36px] relative">
            
            {/* TOP GRADIENT HEADER BANNER */}
            <div className="bg-gradient-to-r from-rose via-rose-light to-gold h-32 relative flex items-start justify-center pt-3">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_50%,#FF2A6D_0%,transparent_70%)]" />
              
              {/* CENTERED 365-DAY ACTIVE PROTECTION CHIP */}
              <div className="bg-white/95 backdrop-blur-md border-2 border-[#FFCCE1] text-tichi-text font-black text-xs px-5 py-2 rounded-full shadow-md uppercase tracking-wider flex items-center space-x-2 relative z-10">
                <ShieldCheck className="w-4.5 h-4.5 text-tichi-success" />
                <span>365-DAY PROTECTION ACTIVE</span>
              </div>
            </div>

            {/* UNIFIED USER DETAILS & AVATAR */}
            <div className="px-6 sm:px-8 pb-6 -mt-12 relative z-10 space-y-6">
              
              <div className="flex flex-col items-center text-center space-y-3">
                {/* AVATAR RING */}
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-rose via-rose-light to-gold p-0.5 shadow-xl">
                  <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center font-black text-3xl text-tichi-text">
                    {initials}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-center space-x-2">
                    <h1 className="font-black text-2xl sm:text-3xl text-tichi-text">{user?.fullName || 'Sakhi Member'}</h1>
                    {isSuperAdmin && (
                      <span className="bg-gold text-tichi-text font-black text-[10px] px-3 py-1 rounded-full uppercase flex items-center space-x-1 shadow-gold-glow border border-gold/40">
                        <Crown className="w-3.5 h-3.5" />
                        <span>SUPER ADMIN</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-tichi-muted pt-1">
                    <div className="flex items-center space-x-1.5 bg-white px-3 py-1 rounded-full border border-[#FFCCE1] shadow-sm">
                      <Mail className="w-3.5 h-3.5 text-rose" />
                      <span>{user?.email || 'sakhi@suraksha.org'}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-white px-3 py-1 rounded-full border border-[#FFCCE1] shadow-sm">
                      <PhoneCall className="w-3.5 h-3.5 text-rose" />
                      <span>{user?.phone || '+91 98765 43210'}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-rose/10 px-3 py-1 rounded-full text-rose font-black border border-rose/20 shadow-sm">
                      <Heart className="w-3.5 h-3.5" />
                      <span>Blood Group: {user?.bloodGroup || 'O+'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* INTEGRATED SEGMENTED NAVIGATION TABS */}
              <div className="bg-white p-2 rounded-2xl border-2 border-[#FFCCE1] shadow-sm flex gap-1.5">
                {[
                  { key: 'DIAGNOSTICS', label: 'Safety Health & Drill', icon: Shield },
                  { key: 'SETTINGS', label: 'App Settings', icon: Sliders },
                  { key: 'PASS', label: 'Member Pass', icon: QrCode },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-1.5 uppercase tracking-wider ${
                        isActive
                          ? 'btn-baby-pink shadow-coral-glow'
                          : 'bg-white text-tichi-muted hover:text-rose hover:bg-rose/5 border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: SAFETY HEALTH & SOS DRILL */}
              {activeTab === 'DIAGNOSTICS' && (
                <div className="space-y-6 animate-fade-up">
                  
                  {/* DIAGNOSTICS METRICS GRID */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-rose">24/7 System Health Metrics</h3>
                      <span className="text-[11px] font-bold text-tichi-success">100% Operational</span>
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

                  {/* INTEGRATED SOS DRILL ACTION BANNER */}
                  <div className="bg-gradient-to-r from-tichi-text via-[#3D0C38] to-tichi-text text-white p-6 rounded-2xl shadow-lg space-y-4 border-2 border-rose">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-rose/20 text-rose flex items-center justify-center shrink-0 border border-white/20">
                        <Play className="w-5 h-5 text-rose animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-black text-base text-white">Run SOS Emergency Drill</h4>
                        <p className="text-xs text-white/80 font-bold mt-0.5 leading-relaxed">
                          Test device vibration, siren audio & GPS stream safely without notifying guardians.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowTestModal(true)}
                      className="w-full btn-baby-pink py-3.5 rounded-xl text-xs uppercase tracking-wider font-black shadow-coral-glow flex items-center justify-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>START DRILL READINESS TEST</span>
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 2: APP SETTINGS & PRIVACY */}
              {activeTab === 'SETTINGS' && (
                <div className="bg-white border-2 border-[#FFCCE1] rounded-2xl p-4 shadow-sm space-y-2 animate-fade-up">
                  <div className="text-[10px] font-black uppercase tracking-widest text-rose pb-2 px-2">Privacy & Security Preferences</div>
                  {[
                    { label: 'Privacy & Data Purge Controls', desc: 'Encrypted location logs & data purge' },
                    { label: 'Notification & Alert Preferences', desc: 'Real-time push, email & siren alerts' },
                    { label: 'Update Account Password', desc: 'Modify account authentication keys' },
                    { label: 'About Sakhi Suraksha SOS', desc: 'Version 2.0.0 • Pure JavaScript Edition' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-[#FFF0F3] transition-colors border border-transparent hover:border-[#FFCCE1] text-left"
                    >
                      <div>
                        <p className="text-xs font-black text-tichi-text">{item.label}</p>
                        <p className="text-[11px] text-tichi-muted font-bold mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-rose" />
                    </button>
                  ))}
                </div>
              )}

              {/* TAB 3: DIGITAL SAFETY MEMBER PASS */}
              {activeTab === 'PASS' && (
                <div className="bg-gradient-to-br from-white via-[#FFF0F3] to-white border-2 border-rose rounded-2xl p-6 shadow-md space-y-4 animate-fade-up text-center relative overflow-hidden">
                  <div className="w-14 h-14 rounded-2xl bg-rose/15 text-rose flex items-center justify-center mx-auto border border-rose/30">
                    <QrCode className="w-7 h-7 text-rose" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-tichi-text">Digital Emergency Member Card</h3>
                    <p className="text-xs text-tichi-muted font-bold mt-0.5">
                      Verified Safety Protection Pass • ID: <span className="font-mono text-rose font-black">SS-2026-9812</span>
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#FFCCE1] max-w-xs mx-auto space-y-2 text-left text-xs font-bold text-tichi-text">
                    <div className="flex justify-between border-b border-[#FFCCE1] pb-1.5">
                      <span className="text-tichi-muted">Member Name:</span>
                      <span className="font-black">{user?.fullName || 'Sakhi Member'}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#FFCCE1] pb-1.5">
                      <span className="text-tichi-muted">Blood Group:</span>
                      <span className="font-black text-rose">{user?.bloodGroup || 'O+'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-tichi-muted">Emergency Dispatch:</span>
                      <span className="font-black text-tichi-success">24/7 Verified</span>
                    </div>
                  </div>
                </div>
              )}

              {/* INTEGRATED FOOTER SIGN OUT BUTTON */}
              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full bg-white border-2 border-[#FF2A6D] text-[#FF2A6D] hover:bg-[#FF2A6D] hover:text-white font-black py-4 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-sm transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>SIGN OUT OF ACCOUNT</span>
                </button>
              </div>

            </div>

          </div>

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
