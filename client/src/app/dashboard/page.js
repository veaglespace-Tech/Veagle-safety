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
} from 'lucide-react';

export const dynamic = 'force-dynamic';

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

  const firstName = user?.fullName?.split(' ')[0] || 'Priya';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const locationStatusInfo = {
    LIVE: { label: 'GPS Active', color: 'text-tichi-success', dot: 'bg-tichi-success', icon: MapPin },
    STALE: { label: 'GPS Updating', color: 'text-tichi-warning', dot: 'bg-amber-500', icon: MapPin },
    DENIED: { label: 'Location Denied', color: 'text-tichi-emergency', dot: 'bg-tichi-emergency', icon: WifiOff },
    OFFLINE: { label: 'Offline', color: 'text-tichi-muted', dot: 'bg-tichi-muted', icon: WifiOff },
  };
  const locInfo = locationStatusInfo[status] || locationStatusInfo.LIVE;
  const LocIcon = locInfo.icon;

  const readinessScore = contacts.length >= 3 && status === 'LIVE' ? 100 : contacts.length > 0 ? 80 : 40;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 lg:max-w-5xl animate-fade-up">

        {/* ACTIVE EMERGENCY BANNER (Pulsing Bar) */}
        {activeSession && (
          <div className="bg-gradient-to-r from-tichi-emergency via-rose-600 to-tichi-emergency text-white p-4 rounded-2xl shadow-sos-glow flex items-center justify-between animate-pulse border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <AlertOctagon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-wider">CRITICAL SOS BROADCAST ACTIVE</p>
                <p className="text-xs text-white/80">Live GPS tracking link sent to emergency network</p>
              </div>
            </div>
            <Link
              href="/active-sos"
              className="bg-white text-tichi-emergency font-black text-xs px-4 py-2.5 rounded-xl shadow hover:bg-red-50 transition-all flex items-center space-x-1"
            >
              <span>OPEN LIVE VIEW</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* ACTIVE JOURNEY BANNER */}
        {activeJourney && !activeSession && (
          <div className="bg-gradient-to-r from-plum via-plum-dark to-plum text-white p-4 rounded-2xl shadow-plum-lg flex items-center justify-between border border-rose/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                <Navigation className="w-5 h-5 text-rose animate-spin" />
              </div>
              <div>
                <p className="font-extrabold text-sm">Protected Journey In Progress</p>
                <p className="text-xs text-rose/80 mt-0.5">Destination: <span className="text-white font-bold">{activeJourney.destinationName}</span></p>
              </div>
            </div>
            <Link
              href="/track-journey"
              className="bg-rose text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-coral-glow hover:brightness-110 transition-colors"
            >
              MANAGE TRIP
            </Link>
          </div>
        )}

        {/* SUPER ADMIN HQ ACCESSIBILITY BAR */}
        {isSuperAdmin && (
          <div className="bg-gradient-to-r from-plum-dark via-plum to-plum-dark border border-gold/40 text-gold px-5 py-3 rounded-2xl shadow-gold-glow flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="w-5 h-5 text-gold" />
              <div>
                <span className="font-black text-xs uppercase tracking-wider text-white">Super Admin Privilege Active</span>
                <span className="text-xs text-gold/80 ml-2 hidden sm:inline">• Emergency Incident Command Operations</span>
              </div>
            </div>
            <Link
              href="/admin"
              className="bg-gold text-plum font-black text-xs px-3.5 py-1.5 rounded-xl shadow hover:brightness-110 transition-all flex items-center space-x-1"
            >
              <span>HQ PORTAL</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* MAIN UNIFIED HERO SAFETY HUB */}
        <div className="bg-gradient-to-br from-plum-dark via-plum to-plum-dark text-white rounded-3xl p-6 sm:p-8 border border-rose/30 shadow-2xl relative overflow-hidden space-y-6">
          {/* Ambient Background Glow Effects */}
          <div className="absolute w-96 h-96 rounded-full bg-rose/15 blur-[120px] top-[-50px] left-[-100px] pointer-events-none" />
          <div className="absolute w-96 h-96 rounded-full bg-gold/10 blur-[120px] bottom-[-50px] right-[-100px] pointer-events-none" />

          {/* HEADER STATUS BAR */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-widest text-gold">{getGreeting()}</span>
                <Sparkles className="w-3.5 h-3.5 text-gold" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                {firstName}'s Safety Command
              </h1>
              <p className="text-xs text-rose-muted font-medium mt-0.5">
                24/7 Encrypted GPS Tracking & Emergency Guardian Network
              </p>
            </div>

            {/* LIVE GPS STATUS CHIP */}
            <div className="flex items-center space-x-3 self-start sm:self-auto bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md">
              <div className="relative flex items-center justify-center">
                <span className={`w-2.5 h-2.5 rounded-full ${locInfo.dot} ${status === 'LIVE' ? 'animate-ping absolute inset-0 opacity-75' : ''}`}></span>
                <span className={`w-2.5 h-2.5 rounded-full ${locInfo.dot}`}></span>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-white">{status === 'LIVE' ? 'PROTECTION ACTIVE' : locInfo.label}</p>
                <p className="text-[10px] text-rose-muted font-mono">GPS Accuracy: ±{accuracy || '--'}m</p>
              </div>
            </div>
          </div>

          {/* CENTRAL HERO SOS BUTTON SECTION */}
          <div className="relative z-10 py-2">
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
              badge: 'Real-time',
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
                className={`group bg-white border rounded-2xl p-5 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 ${
                  action.emergency
                    ? 'border-tichi-emergency/40 hover:border-tichi-emergency'
                    : 'border-blush-border hover:border-plum/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    action.emergency
                      ? 'bg-emergency-bg text-tichi-emergency'
                      : 'bg-plum-50 text-plum'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    action.emergency ? 'bg-tichi-emergency/10 text-tichi-emergency' : 'bg-plum-50 text-plum'
                  }`}>
                    {action.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-tichi-text group-hover:text-plum transition-colors flex items-center justify-between">
                    <span>{action.title}</span>
                    <ChevronRight className="w-4 h-4 text-tichi-muted group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-tichi-muted mt-1 leading-relaxed">{action.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* UNIFIED GUARDIAN NETWORK & SAFETY READINESS HUB */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT 2 COLUMNS: TRUSTED CONTACTS NETWORK */}
          <div className="lg:col-span-2 bg-white border border-blush-border rounded-3xl p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-blush-border pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-plum/10 text-plum flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-tichi-text">Trusted Guardian Network</h2>
                  <p className="text-xs text-tichi-muted">Family & contacts notified instantly during SOS alerts</p>
                </div>
              </div>

              <Link
                href="/contacts"
                className="bg-plum text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow hover:bg-plum-dark transition-colors flex items-center space-x-1"
              >
                <span>Manage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {contacts.length === 0 ? (
              <div className="bg-blush-subtle border border-blush-border rounded-2xl p-6 text-center space-y-3">
                <Users className="w-10 h-10 text-blush-border mx-auto" />
                <div>
                  <p className="font-extrabold text-sm text-tichi-text">No Trusted Contacts Added Yet</p>
                  <p className="text-xs text-tichi-muted max-w-sm mx-auto mt-1 leading-relaxed">
                    Add family members or trusted guardians to ensure they receive emergency SMS and live tracking emails when SOS is activated.
                  </p>
                </div>
                <Link
                  href="/contacts"
                  className="inline-flex items-center space-x-1.5 bg-plum text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow hover:bg-plum-dark transition-all"
                >
                  <span>+ Add First Contact</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contacts.slice(0, 4).map((contact) => (
                  <TrustedContactCard key={contact.id} contact={contact} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT 1 COLUMN: SAFETY READINESS INDEX */}
          <div className="bg-gradient-to-br from-plum-dark to-plum text-white rounded-3xl p-6 shadow-plum-lg border border-rose/30 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-tichi-success" />
                  <h3 className="font-extrabold text-sm text-white">Readiness Score</h3>
                </div>
                <span className="text-xl font-black text-gold font-mono">{readinessScore}%</span>
              </div>

              {/* READINESS PROGRESS BAR */}
              <div className="space-y-1.5">
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-rose via-coral to-gold h-full rounded-full transition-all duration-700"
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>
                <p className="text-[10px] text-rose-muted text-right font-medium">
                  {readinessScore === 100 ? '🛡️ Full Emergency Readiness' : '⚠️ Add more contacts for 100% score'}
                </p>
              </div>

              {/* READINESS CHECKLIST */}
              <div className="space-y-2.5 pt-2">
                {[
                  { done: status === 'LIVE', label: 'Live GPS Location Access' },
                  { done: contacts.length > 0, label: `${contacts.length} Guardians Connected` },
                  { done: true, label: 'Email SOS Broadcast Service' },
                  { done: contacts.length >= 2, label: 'Multi-Contact Network' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2.5 text-xs">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? 'text-tichi-success' : 'text-white/30'}`} />
                    <span className={item.done ? 'text-white font-medium' : 'text-rose-muted'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/profile"
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs py-3 rounded-xl transition-all text-center block"
            >
              RUN SAFETY DIAGNOSTICS
            </Link>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
