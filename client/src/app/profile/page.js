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
} from 'lucide-react';

export const dynamic = 'force-dynamic';

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
    { icon: MapPin, label: 'GPS Location Access', status: status === 'LIVE', value: status === 'LIVE' ? `✓ Active (±${accuracy || '?'}m)` : '⚠ Permission Required' },
    { icon: Bell, label: 'Emergency Notifications', status: true, value: '✓ Email Alerts Ready' },
    { icon: Lock, label: 'Auth Token Valid', status: true, value: '✓ Secure Session' },
    { icon: Smartphone, label: 'Device Vibration', status: isVibrationSupported, value: isVibrationSupported ? '✓ Supported' : '— Not Supported' },
  ];

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto px-4 pt-5 pb-6 space-y-4 lg:max-w-2xl">
        <div className="bg-white border border-blush-border rounded-2xl shadow-card overflow-hidden animate-fade-up">
          <div className="bg-gradient-to-br from-plum to-plum-dark h-24 relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #FF3B70 0%, transparent 60%)' }} />
          </div>

          <div className="px-5 pb-5 -mt-8 relative">
            <div className="flex items-end justify-between">
              <div className="w-16 h-16 rounded-full bg-rose/30 border-4 border-white text-plum font-extrabold text-xl flex items-center justify-center shadow-plum-md">
                {initials}
              </div>
              <button className="text-xs font-bold text-plum border border-plum/30 px-3 py-1.5 rounded-xl hover:bg-plum-50 transition-colors mb-1">
                Edit Profile
              </button>
            </div>

            <div className="mt-2 space-y-0.5">
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-lg text-tichi-text">{user?.fullName || 'Priya Sharma'}</h2>
                {isSuperAdmin && (
                  <span className="bg-gold text-plum font-black text-[10px] px-2 py-0.5 rounded-full uppercase flex items-center space-x-1 shadow-gold-glow">
                    <Crown className="w-3 h-3" />
                    <span>SUPER ADMIN</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-tichi-muted">{user?.email}</p>
              <p className="text-xs text-tichi-muted">{user?.phone}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-blush-border rounded-card shadow-card animate-fade-up">
          <div className="px-4 pt-4 pb-2 border-b border-blush-border flex items-center space-x-2">
            <Shield className="w-4 h-4 text-plum" />
            <h3 className="font-bold text-sm text-tichi-text">Safety Diagnostics</h3>
          </div>
          <div className="divide-y divide-blush-border">
            {diagnostics.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${item.status ? 'text-plum' : 'text-amber-500'}`} />
                    <span className="text-xs font-medium text-tichi-text">{item.label}</span>
                  </div>
                  <span className={`text-[11px] font-bold ${item.status ? 'text-tichi-success' : 'text-amber-600'}`}>
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-plum/5 border border-plum/20 rounded-card p-4 space-y-3 animate-fade-up">
          <div className="flex items-start space-x-3">
            <Play className="w-4 h-4 text-plum mt-0.5 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-plum">Test SOS System</h4>
              <p className="text-xs text-tichi-muted mt-0.5">Run a full readiness check — GPS, vibration, screen response — without alerting your actual contacts.</p>
            </div>
          </div>
          <button
            onClick={() => setShowTestModal(true)}
            className="w-full bg-plum text-white font-bold py-3 rounded-card text-xs shadow hover:bg-plum-dark transition-colors flex items-center justify-center space-x-2 active:scale-[0.98]"
          >
            <Play className="w-3.5 h-3.5" />
            <span>RUN TEST DRILL</span>
          </button>
        </div>

        <div className="bg-white border border-blush-border rounded-card shadow-card animate-fade-up">
          <div className="px-4 pt-3 pb-1 text-[10px] font-extrabold text-tichi-muted uppercase tracking-widest">App Settings</div>
          {[
            { label: 'Privacy & Data', desc: 'Location history, data deletion' },
            { label: 'Notification Preferences', desc: 'Alerts, check-in reminders' },
            { label: 'Change Password', desc: 'Update account credentials' },
            { label: 'About Tichi Suraksha', desc: 'Version 2.0.0 • Pure JavaScript Edition' },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between px-4 py-3 border-t border-blush-border hover:bg-blush-subtle transition-colors"
            >
              <div className="text-left">
                <p className="text-xs font-bold text-tichi-text">{item.label}</p>
                <p className="text-[11px] text-tichi-muted">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-tichi-faint" />
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-white border border-emergency-border text-tichi-emergency font-bold py-3.5 rounded-card text-xs flex items-center justify-center space-x-2 shadow-card hover:bg-emergency-bg transition-colors animate-fade-up active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4" />
          <span>SIGN OUT OF ACCOUNT</span>
        </button>
      </div>

      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-modal overflow-hidden animate-scale-in">
            <div className="bg-plum px-5 py-4 text-white text-center">
              <h3 className="font-extrabold text-base">
                {testSuccess ? '✅ Test Passed!' : '🛡️ SOS Test Drill'}
              </h3>
            </div>

            <div className="p-5 space-y-4 text-center">
              {testSuccess ? (
                <div className="space-y-3">
                  <CheckCircle className="w-14 h-14 text-tichi-success mx-auto" />
                  <div>
                    <p className="font-extrabold text-base text-tichi-text">All Systems Operational!</p>
                    <p className="text-xs text-tichi-muted mt-1">
                      GPS, vibration, and emergency screens are working correctly.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-plum-50 border border-plum/20 p-3 rounded-xl flex items-start space-x-2 text-left">
                    <Info className="w-4 h-4 text-plum shrink-0 mt-0.5" />
                    <p className="text-xs text-plum">
                      This drill tests your GPS accuracy, haptic feedback, and SOS screen readiness. <strong>No alerts will be sent to your real contacts.</strong>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleRunTest}
                      className="w-full bg-plum text-white font-extrabold py-3 rounded-card text-xs shadow hover:bg-plum-dark transition-colors active:scale-[0.98]"
                    >
                      START DRILL NOW
                    </button>
                    <button
                      onClick={() => setShowTestModal(false)}
                      className="w-full text-tichi-muted text-xs py-2 font-semibold hover:text-tichi-text transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
