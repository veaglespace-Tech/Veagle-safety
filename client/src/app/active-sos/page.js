'use client';

import React, { useState, useEffect } from 'react';
import { useSOSStore } from '../../redux/useSOSStore.js';
import { useLocationStore } from '../../redux/useLocationStore.js';
import { useAuthStore } from '../../redux/useAuthStore.js';
import { LiveLocationMap } from '../../components/location/DynamicLiveLocationMap.js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  PhoneCall,
  Bell,
  BellOff,
  ShieldCheck,
  Users,
  Copy,
  Clock,
  MapPin,
  X,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ActiveSOSLivePage() {
  const { activeSession, resolveSos, isAlarmPlaying, toggleAlarm } = useSOSStore();
  const { latitude, longitude, accuracy } = useLocationStore();
  const { user } = useAuthStore();
  const [showConfirmSafeModal, setShowConfirmSafeModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!activeSession) { router.push('/dashboard'); return; }
    const startTime = new Date(activeSession.startedAt).getTime();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession, router]);

  const formatElapsed = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleMarkSafe = async () => {
    const success = await resolveSos();
    if (success) { setShowConfirmSafeModal(false); router.push('/dashboard'); }
  };

  const copyTrackingLink = () => {
    if (activeSession?.trackingUrl) {
      navigator.clipboard.writeText(activeSession.trackingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (!activeSession) return null;

  const firstName = user?.fullName?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-tichi-emergency/5">
      <div className="bg-tichi-emergency text-white safe-pt sticky top-0 z-40">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 animate-bounce fill-white/20" />
            <div>
              <h1 className="font-extrabold text-base tracking-tight">🚨 SOS ACTIVE</h1>
              <p className="text-xs text-white/80">Alerting trusted contacts</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-1.5">
              <Clock className="w-3 h-3" />
              <span className="text-xs font-black font-mono">{formatElapsed(elapsed)}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span className="text-[10px] font-black tracking-widest">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-4 space-y-4 pb-12 lg:max-w-2xl">
        <div className="rounded-2xl overflow-hidden shadow-plum-lg border-2 border-tichi-emergency/30 h-64">
          <LiveLocationMap
            lat={latitude || 28.6139}
            lng={longitude || 77.2090}
            accuracy={accuracy || 12}
            userName={`${firstName} (EMERGENCY)`}
            isEmergency={true}
          />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: MapPin, label: 'GPS Accuracy', value: `±${accuracy || '--'}m` },
            { icon: Users, label: 'Notified', value: '3 Contacts' },
            { icon: Clock, label: 'Duration', value: formatElapsed(elapsed) },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white border border-blush-border rounded-card p-3 text-center shadow-card">
                <Icon className="w-4 h-4 text-plum mx-auto mb-1" />
                <p className="text-xs font-extrabold text-tichi-text">{stat.value}</p>
                <p className="text-[10px] text-tichi-muted">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-blush-border rounded-card p-4 shadow-card">
          <p className="text-xs font-bold text-tichi-text mb-1.5">Live Tracking Link</p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-blush-subtle border border-blush-border rounded-xl px-3 py-2 min-w-0">
              <p className="text-[11px] text-tichi-muted font-mono truncate">{activeSession.trackingUrl}</p>
            </div>
            <button
              onClick={copyTrackingLink}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                copied ? 'bg-tichi-success text-white' : 'bg-plum text-white hover:bg-plum-dark'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href="tel:112"
            className="bg-tichi-emergency text-white font-extrabold p-4 rounded-card text-center shadow-sos-glow flex flex-col items-center justify-center space-y-2 hover:brightness-105 active:scale-95 transition-all"
          >
            <PhoneCall className="w-7 h-7" />
            <div>
              <span className="text-base font-black block">CALL 112</span>
              <span className="text-[10px] text-white/80">National Emergency</span>
            </div>
          </a>

          <Link
            href="/contacts"
            className="bg-plum text-white font-extrabold p-4 rounded-card text-center shadow-plum-lg flex flex-col items-center justify-center space-y-2 hover:bg-plum-dark active:scale-95 transition-all"
          >
            <Users className="w-7 h-7 text-rose" />
            <div>
              <span className="text-base font-black block">CALL CONTACT</span>
              <span className="text-[10px] text-rose/80">Trusted Network</span>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => toggleAlarm()}
            className={`font-bold p-4 rounded-card flex flex-col items-center justify-center space-y-1.5 border transition-all active:scale-95 ${
              isAlarmPlaying
                ? 'bg-amber-500 text-white border-amber-600 shadow-lg animate-pulse'
                : 'bg-white text-plum border-blush-border hover:bg-plum-50 hover:border-plum/30 shadow-card'
            }`}
          >
            {isAlarmPlaying ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            <span className="text-xs">{isAlarmPlaying ? 'STOP ALARM' : 'SOUND ALARM'}</span>
          </button>

          <button
            onClick={() => setShowConfirmSafeModal(true)}
            className="bg-tichi-success text-white font-bold p-4 rounded-card flex flex-col items-center justify-center space-y-1.5 shadow-lg hover:brightness-105 active:scale-95 transition-all"
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs">I'M SAFE NOW</span>
          </button>
        </div>
      </div>

      {showConfirmSafeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-modal overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-blush-border">
              <h3 className="font-extrabold text-base text-tichi-text">Confirm You're Safe</h3>
              <button onClick={() => setShowConfirmSafeModal(false)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-blush-subtle text-tichi-muted hover:text-plum transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="w-16 h-16 bg-success-bg border border-success-border rounded-full mx-auto flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-tichi-success" />
              </div>

              <div className="text-center">
                <p className="font-bold text-sm text-tichi-text">Are you completely safe?</p>
                <p className="text-xs text-tichi-muted mt-2 leading-relaxed">
                  This will stop live location tracking, deactivate the emergency link, and send a "safe" notification to all your trusted contacts.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleMarkSafe}
                  className="w-full bg-tichi-success text-white font-extrabold py-3.5 rounded-card text-sm shadow hover:brightness-105 transition-all active:scale-[0.98]"
                >
                  YES — I'M SAFE NOW
                </button>
                <button
                  onClick={() => setShowConfirmSafeModal(false)}
                  className="w-full text-tichi-muted text-xs py-2 font-semibold hover:text-tichi-text transition-colors"
                >
                  Cancel — Keep Tracking Active
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
