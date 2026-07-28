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
    startTracking();
    fetchActiveSos();
    loadContacts();
    loadActiveJourney();
  }, []);

  const loadContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(res.data.contacts);
    } catch (err) {}
  };

  const loadActiveJourney = async () => {
    try {
      const res = await api.get('/journey/active');
      setActiveJourney(res.data.journey);
    } catch (err) {}
  };

  const getGreeting = () => {
    if (!mounted) return 'Welcome';
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

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
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase tracking-widest text-rose">{getGreeting()}</span>
                  <Sparkles className="w-4 h-4 text-gold-dark" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-tichi-text mt-1 tracking-tight">
                  {firstName}'s Safety Command
                </h1>
                <p className="text-xs sm:text-sm text-tichi-muted font-bold mt-1">
                  24/7 Encrypted GPS Tracking & Emergency Guardian Network
                </p>
              </div>

              {/* LIVE GPS STATUS CHIP */}
              <div className="flex items-center space-x-3 self-start sm:self-auto bg-white p-3 rounded-2xl border border-[#FFCCE1] shadow-sm">
                <div className="relative flex items-center justify-center">
                  <span className={`w-3 h-3 rounded-full ${locInfo.dot} ${status === 'LIVE' ? 'animate-ping absolute inset-0 opacity-75' : ''}`}></span>
                  <span className={`w-3 h-3 rounded-full ${locInfo.dot}`}></span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-tichi-text">{status === 'LIVE' ? 'GPS PROTECTION LIVE' : locInfo.label}</p>
                  <p className="text-[10px] text-tichi-muted font-mono font-bold">Accuracy: ±{accuracy || '10'}m</p>
                </div>
              </div>
            </div>

            {/* CENTRAL HERO SOS BUTTON SECTION */}
            <div className="py-2">
              <SOSHeroButton />
            </div>

          </div>

          {/* UNIFIED QUICK ACTION GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                href: '/track-journey',
                icon: Share2,
                title: 'Share Live Location',
                desc: 'Send encrypted GPS tracking link to family',
                badge: 'Real-Time Map',
              },
              {
                href: '/track-journey',
                icon: Navigation,
                title: 'Track My Journey',
                desc: 'Protected trip monitoring & arrival alarms',
                badge: 'Smart Trip',
              },
              {
                href: '/track-journey',
                icon: Clock,
                title: 'Check On Me',
                desc: 'Timed check-in timer with auto escalation',
                badge: 'Safety Timer',
              },
              {
                href: '/contact',
                icon: PhoneCall,
                title: 'Emergency Helplines',
                desc: 'One-tap dial 112, 1091 & national support',
                badge: '24/7 Helpline',
                emergency: true,
              },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  href={action.href}
                  className={`group bg-white border-2 rounded-3xl p-6 shadow-sm hover:shadow-coral-glow hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 ${
                    action.emergency
                      ? 'border-[#FF2A6D]/40 hover:border-[#FF2A6D]'
                      : 'border-[#FFCCE1] hover:border-rose'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      action.emergency
                        ? 'bg-[#FF2A6D]/15 text-[#FF2A6D]'
                        : 'bg-rose/15 text-rose'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                      action.emergency ? 'bg-[#FF2A6D]/10 text-[#FF2A6D]' : 'bg-rose/10 text-rose'
                    }`}>
                      {action.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-base text-tichi-text group-hover:text-rose transition-colors flex items-center justify-between">
                      <span>{action.title}</span>
                      <ChevronRight className="w-4 h-4 text-tichi-muted group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <p className="text-xs text-tichi-muted font-bold mt-1 leading-relaxed">{action.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* UNIFIED GUARDIAN NETWORK & SAFETY READINESS HUB */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT 2 COLUMNS: TRUSTED CONTACTS NETWORK */}
            <div className="lg:col-span-2 card-antique-pink p-6 sm:p-8 border-2 border-rose shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-[#FFCCE1] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose/15 text-rose flex items-center justify-center shadow-sm">
                    <Users className="w-6 h-6 text-rose" />
                  </div>
                  <div>
                    <h2 className="font-black text-lg text-tichi-text">Trusted Guardian Network</h2>
                    <p className="text-xs text-tichi-muted font-bold">5 Family & contacts notified instantly during SOS alerts</p>
                  </div>
                </div>

                <Link
                  href="/contacts"
                  className="btn-baby-pink px-4 py-2 text-xs font-black uppercase tracking-wider shadow-sm flex items-center space-x-1"
                >
                  <span>Manage</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {contacts.length === 0 ? (
                <div className="bg-blush-subtle border-2 border-dashed border-[#FFCCE1] rounded-3xl p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-rose/15 text-rose flex items-center justify-center mx-auto shadow-sm">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-black text-base text-tichi-text">No Trusted Guardians Added Yet</p>
                    <p className="text-xs text-tichi-muted font-bold max-w-sm mx-auto mt-1 leading-relaxed">
                      Add family members or trusted emergency contacts to ensure they receive real-time SOS siren alarms and live tracking links.
                    </p>
                  </div>
                  <Link
                    href="/contacts"
                    className="inline-flex items-center space-x-2 btn-baby-pink px-6 py-3 text-xs font-black uppercase tracking-wider shadow-coral-glow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD FIRST GUARDIAN CONTACT</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contacts.slice(0, 4).map((contact) => (
                    <TrustedContactCard key={contact.id} contact={contact} />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT 1 COLUMN: SAFETY READINESS INDEX */}
            <div className="bg-gradient-to-br from-tichi-text via-[#3D0C38] to-tichi-text text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-gold/40 space-y-6 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-6 h-6 text-tichi-success" />
                    <h3 className="font-black text-base text-white">Readiness Score</h3>
                  </div>
                  <span className="text-2xl font-black text-gold font-mono">{readinessScore}%</span>
                </div>

                {/* READINESS PROGRESS BAR */}
                <div className="space-y-2">
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="bg-gradient-to-r from-rose via-rose-light to-gold h-full rounded-full transition-all duration-700 shadow-md"
                      style={{ width: `${readinessScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-gold font-black text-right uppercase tracking-wider">
                    {readinessScore === 100 ? '🛡️ Full Emergency Readiness' : '⚠️ Add 3+ Guardians for 100% Score'}
                  </p>
                </div>

                {/* READINESS CHECKLIST */}
                <div className="space-y-3 pt-2">
                  {[
                    { done: status === 'LIVE', label: 'Live Encrypted GPS Access' },
                    { done: contacts.length > 0, label: `${contacts.length} Guardians Connected` },
                    { done: true, label: 'Email & Push Siren Broadcast' },
                    { done: contacts.length >= 2, label: 'Multi-Contact Network' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 text-xs font-bold">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? 'text-tichi-success' : 'text-white/30'}`} />
                      <span className={item.done ? 'text-white' : 'text-white/50'}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/profile"
                className="w-full bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white font-black text-xs py-3.5 rounded-2xl transition-all text-center uppercase tracking-wider block relative z-10"
              >
                RUN SAFETY DIAGNOSTICS
              </Link>
            </div>

          </div>

        </div>
      </div>
    </AppLayout>
  );
}
