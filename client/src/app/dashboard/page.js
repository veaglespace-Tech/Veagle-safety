'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout.js';
import { SOSHeroButton } from '../../components/sos/SOSHeroButton.js';
import { TrustedContactCard } from '../../components/contacts/TrustedContactCard.js';
import { useAuthStore } from '../../redux/useAuthStore.js';
import { useSOSStore } from '../../redux/useSOSStore.js';
import { useLocationStore } from '../../redux/useLocationStore.js';
import { api } from '../../utils/api.js';
import Link from 'next/link';
import { AnimatedHeading } from '../../components/common/AnimatedHeading.jsx';
import {
  Share2,
  Navigation,
  Clock,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
  AlertOctagon,
  MapPin,
  Users,
  WifiOff,
  Crown,
  Sparkles,
  Zap,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Shield,
  BellRing,
  Heart,
  Plus,
  Sun,
  SunMedium,
  Moon,
} from 'lucide-react';

export default function DashboardAppPage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();
  const { activeSession, fetchActiveSos } = useSOSStore();
  const { status, startTracking, accuracy } = useLocationStore();
  const [contacts, setContacts] = useState([]);
  const [activeJourney, setActiveJourney] = useState(null);

  useEffect(() => {
    setMounted(true);
    fetchContacts();
    fetchActiveJourney();
    fetchActiveSos();
    startTracking();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(res.data.contacts || []);
    } catch (err) {}
  };

  const fetchActiveJourney = async () => {
    try {
      const res = await api.get('/journey/active');
      setActiveJourney(res.data.journey);
    } catch (err) {}
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getGreetingIcon = () => {
    const h = new Date().getHours();
    if (h < 12) return Sun;
    if (h < 17) return SunMedium;
    return Moon;
  };

  const GreetingIcon = getGreetingIcon();
  const firstName = user?.fullName?.split(' ')[0] || 'Sakhi Member';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const locationStatusInfo = {
    LIVE: { label: 'GPS Live Active', color: 'text-tichi-success', dot: 'bg-tichi-success', icon: MapPin },
    STALE: { label: 'GPS Updating', color: 'text-tichi-warning', dot: 'bg-amber-500', icon: MapPin },
    DENIED: { label: 'Location Denied', color: 'text-[#FF2A6D]', dot: 'bg-[#FF2A6D]', icon: WifiOff },
    OFFLINE: { label: 'Offline Mode', color: 'text-tichi-muted', dot: 'bg-tichi-muted', icon: WifiOff },
  };
  const locInfo = locationStatusInfo[status] || locationStatusInfo.LIVE;

  const readinessScore = contacts.length >= 3 && status === 'LIVE' ? 100 : contacts.length > 0 ? 85 : 45;

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden pb-16">
        
        {/* BACKGROUND AMBIENT GLOW MESHES */}
        <div className="absolute w-[800px] h-[800px] rounded-full bg-rose/15 blur-[160px] top-[-100px] left-[-200px] pointer-events-none" />
        <div className="absolute w-[800px] h-[800px] rounded-full bg-gold/15 blur-[160px] bottom-[100px] right-[-200px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10 animate-fade-up">

          {/* CRITICAL SOS ACTIVE ALERT BAR */}
          {activeSession && (
            <div className="bg-gradient-to-r from-[#FF2A6D] via-rose to-[#FF2A6D] text-white p-5 rounded-3xl shadow-coral-glow flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse border-2 border-white">
              <div className="flex items-center space-x-3 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shrink-0">
                  <AlertOctagon className="w-7 h-7 text-white animate-bounce" />
                </div>
                <div>
                  <p className="font-black text-base uppercase tracking-wider">CRITICAL EMERGENCY SOS ACTIVE</p>
                  <p className="text-xs text-white/90 font-bold">Encrypted GPS stream broadcasting to 5 trusted guardians</p>
                </div>
              </div>
              <Link
                href="/active-sos"
                className="w-full sm:w-auto bg-white text-[#FF2A6D] font-black text-xs px-6 py-3 rounded-2xl shadow-lg hover:bg-rose/10 transition-all flex items-center justify-center space-x-1.5 uppercase tracking-wider shrink-0"
              >
                <span>OPEN LIVE COMMAND VIEW</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* PROTECTED JOURNEY BANNER */}
          {activeJourney && !activeSession && (
            <div className="card-antique-pink p-5 border-2 border-rose shadow-md flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-rose/15 text-rose flex items-center justify-center shrink-0 border border-rose/30">
                  <Navigation className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <p className="font-black text-sm text-tichi-text">Protected Journey Active</p>
                  <p className="text-xs text-tichi-muted font-bold mt-0.5">Destination: <span className="text-rose font-black">{activeJourney.destinationName}</span></p>
                </div>
              </div>
              <Link
                href="/track-journey"
                className="btn-baby-pink px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-sm"
              >
                MANAGE TRIP
              </Link>
            </div>
          )}

          {/* SUPER ADMIN HQ ACCESSIBILITY BAR */}
          {isSuperAdmin && (
            <div className="bg-gradient-to-r from-tichi-text via-[#3D0C38] to-tichi-text border-2 border-gold/40 text-gold p-4 sm:p-5 rounded-3xl shadow-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6 text-gold shrink-0 animate-pulse" />
                <div>
                  <span className="font-black text-xs uppercase tracking-wider text-white">Super Admin Command Privilege</span>
                  <span className="text-xs text-gold/90 font-bold ml-2 hidden sm:inline">• Incident Monitoring Operations</span>
                </div>
              </div>
              <Link
                href="/admin"
                className="bg-gold text-tichi-text font-black text-xs px-4 py-2 rounded-xl shadow hover:brightness-110 transition-all flex items-center space-x-1 uppercase tracking-wider"
              >
                <span>HQ PORTAL</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* MAIN UNIFIED HERO SAFETY HUB */}
          <div className="card-antique-pink p-6 sm:p-10 border-2 border-rose shadow-coral-glow space-y-8 relative overflow-hidden">
            
            {/* AMBIENT SHIMMER BADGE */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-rose via-rose-light to-rose text-white text-[11px] font-black px-6 py-2 rounded-bl-2xl uppercase tracking-widest shadow-sm flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>365-DAY PROTECTION ACTIVE</span>
            </div>

            {/* HEADER STATUS BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFCCE1] pb-6">
              <div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-black uppercase tracking-widest text-rose">{getGreeting()}</span>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-2xl bg-gradient-to-tr from-rose via-rose-light to-gold text-white shadow-coral-glow border-2 border-white transform hover:scale-110 transition-transform">
                    <GreetingIcon className="w-4 h-4 text-white drop-shadow-sm" />
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-tichi-text mt-1 tracking-tight">
                  {firstName}'s Safety Command
                </h1>
                <p className="text-xs sm:text-sm text-tichi-muted font-bold mt-1">
                  24/7 Encrypted GPS Tracking & Emergency Guardian Network
                </p>
              </div>

              {/* GPS METER PILL */}
              <div className="bg-white/95 border-2 border-[#FFCCE1] p-3.5 rounded-2xl flex items-center space-x-3.5 shadow-sm shrink-0">
                <div className="w-3 h-3 rounded-full bg-tichi-success animate-ping"></div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-tichi-text">{locInfo.label}</span>
                    <span className="bg-tichi-success/15 text-tichi-success text-[10px] font-black px-2 py-0.5 rounded-full border border-tichi-success/30">
                      ±{accuracy || '10'}m
                    </span>
                  </div>
                  <p className="text-[11px] text-tichi-muted font-bold mt-0.5">Real-Time Geolocation Sync</p>
                </div>
              </div>
            </div>

            {/* EMERGENCY SOS HERO ACTION BUTTON */}
            <div className="py-4 text-center space-y-4">
              <SOSHeroButton />
              <p className="text-xs text-tichi-muted font-black tracking-wider uppercase">
                HOLD FOR 3 SECONDS OR DOUBLE-CLICK TO BROADCAST EMERGENCY ALERTS
              </p>
            </div>

            {/* 4-GRID QUICK ACTIONS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <Link
                href="/track-journey"
                className="bg-white p-4 rounded-2xl border-2 border-[#FFCCE1] hover:border-rose transition-all text-center space-y-2 group shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-rose/15 text-rose flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Navigation className="w-5 h-5" />
                </div>
                <p className="text-xs font-black text-tichi-text">Track Journey</p>
                <p className="text-[10px] text-tichi-muted font-bold">Share Live Route</p>
              </Link>

              <Link
                href="/track-journey"
                className="bg-white p-4 rounded-2xl border-2 border-[#FFCCE1] hover:border-rose transition-all text-center space-y-2 group shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-rose/15 text-rose flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-xs font-black text-tichi-text">Check On Me</p>
                <p className="text-[10px] text-tichi-muted font-bold">Safety Alarm Timer</p>
              </Link>

              <Link
                href="/contacts"
                className="bg-white p-4 rounded-2xl border-2 border-[#FFCCE1] hover:border-rose transition-all text-center space-y-2 group shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-rose/15 text-rose flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-xs font-black text-tichi-text">Guardians</p>
                <p className="text-[10px] text-tichi-muted font-bold">{contacts.length} Trusted Listed</p>
              </Link>

              <Link
                href="/help"
                className="bg-white p-4 rounded-2xl border-2 border-[#FFCCE1] hover:border-rose transition-all text-center space-y-2 group shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-rose/15 text-rose flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <p className="text-xs font-black text-tichi-text">Helplines</p>
                <p className="text-[10px] text-tichi-muted font-bold">National 112 & 1091</p>
              </Link>
            </div>

          </div>

          {/* SAFETY READINESS INDEX & TRUSTED GUARDIANS QUICK ACCESS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* SAFETY READINESS METER CARD */}
            <div className="card-antique-pink p-6 border-2 border-rose shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-tichi-text uppercase tracking-wider">Safety Readiness</span>
                <span className="text-xs font-black text-tichi-success bg-tichi-success/15 px-3 py-1 rounded-full border border-tichi-success/30">
                  {readinessScore}% READY
                </span>
              </div>

              <div className="w-full bg-white rounded-full h-3.5 p-0.5 border border-[#FFCCE1]">
                <div
                  className="bg-gradient-to-r from-rose via-rose-light to-tichi-success h-full rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>

              <div className="space-y-2 text-xs font-bold text-tichi-muted pt-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-tichi-success" />
                    <span>GPS Location Permissions</span>
                  </span>
                  <span className="text-tichi-success font-black">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle2 className={`w-4 h-4 ${contacts.length >= 3 ? 'text-tichi-success' : 'text-amber-500'}`} />
                    <span>Trusted Contacts Count</span>
                  </span>
                  <span className={`font-black ${contacts.length >= 3 ? 'text-tichi-success' : 'text-amber-600'}`}>
                    {contacts.length}/5 Added
                  </span>
                </div>
              </div>
            </div>

            {/* TRUSTED GUARDIANS PREVIEW CARD */}
            <div className="md:col-span-2 card-antique-pink p-6 border-2 border-rose shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#FFCCE1] pb-3">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4.5 h-4.5 text-rose fill-rose/20" />
                  <h3 className="font-black text-sm text-tichi-text uppercase tracking-wider">Emergency Guardians</h3>
                </div>
                <Link
                  href="/contacts"
                  className="text-xs font-black text-rose hover:underline flex items-center space-x-1"
                >
                  <span>Manage All ({contacts.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {contacts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {contacts.slice(0, 2).map((contact) => (
                    <TrustedContactCard key={contact.id} contact={contact} onEdit={() => {}} onDelete={() => {}} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 space-y-3 bg-white rounded-2xl border border-[#FFCCE1] p-4">
                  <Users className="w-10 h-10 text-rose/40 mx-auto" />
                  <div>
                    <p className="font-black text-xs text-tichi-text">No Trusted Guardians Added Yet</p>
                    <p className="text-[11px] text-tichi-muted font-bold mt-0.5">Add up to 5 guardians to receive instant siren alerts.</p>
                  </div>
                  <Link
                    href="/contacts"
                    className="inline-flex items-center space-x-1.5 btn-baby-pink px-4 py-2 text-xs font-black uppercase shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD FIRST GUARDIAN</span>
                  </Link>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </AppLayout>
  );
}
