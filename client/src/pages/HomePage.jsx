import React, { useEffect, useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout.jsx';
import { SOSHeroButton } from '../components/sos/SOSHeroButton.jsx';
import { TrustedContactCard } from '../components/contacts/TrustedContactCard.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
import { useSOSStore } from '../store/useSOSStore.js';
import { useLocationStore } from '../store/useLocationStore.js';
import { api } from '../utils/api.js';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';

export const HomePage = () => {
  const { user } = useAuthStore();
  const { activeSession, fetchActiveSos } = useSOSStore();
  const { status, startTracking, accuracy } = useLocationStore();
  const [contacts, setContacts] = useState([]);
  const [activeJourney, setActiveJourney] = useState(null);

  useEffect(() => {
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

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto px-4 pt-5 pb-6 space-y-5 lg:max-w-2xl animate-fade-up">

        {/* SUPER ADMIN HQ BANNER (If logged in as Super Admin) */}
        {isSuperAdmin && (
          <div className="bg-gradient-to-r from-plum to-plum-dark border border-gold/40 text-gold p-4 rounded-card shadow-gold-glow flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6 text-gold" />
              <div>
                <p className="font-black text-sm text-white">Super Admin Command Center</p>
                <p className="text-xs text-gold/80 mt-0.5">Live emergency dispatch & user role management</p>
              </div>
            </div>
            <Link
              to="/admin"
              className="shrink-0 bg-gold text-plum font-black text-xs px-3.5 py-2 rounded-xl shadow hover:brightness-110 transition-all"
            >
              HQ PANEL
            </Link>
          </div>
        )}

        {/* GREETING ROW */}
        <div className="fade-up-1 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-tichi-muted uppercase tracking-widest">{getGreeting()}</p>
            <h1 className="text-xl font-extrabold text-tichi-text mt-0.5 tracking-tight">{firstName} 👋</h1>
            <p className="text-xs text-tichi-muted font-medium mt-0.5">Your safety companion is active</p>
          </div>

          <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl border ${
            status === 'LIVE'
              ? 'bg-success-bg border-success-border text-tichi-success'
              : 'bg-blush-subtle border-blush-border text-tichi-muted'
          }`}>
            <span className={`w-2 h-2 rounded-full ${locInfo.dot} ${status === 'LIVE' ? 'animate-pulse' : ''}`}></span>
            <span className="text-xs font-bold uppercase tracking-wide">
              {status === 'LIVE' ? 'Protected' : locInfo.label}
            </span>
          </div>
        </div>

        {/* ACTIVE SOS ALERT BANNER */}
        {activeSession && (
          <div className="fade-up-1 bg-tichi-emergency text-white p-4 rounded-card shadow-sos-glow flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-3">
              <AlertOctagon className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-extrabold text-sm">EMERGENCY SOS ACTIVE</p>
                <p className="text-xs text-white/80 mt-0.5">Live GPS broadcast in progress</p>
              </div>
            </div>
            <Link
              to="/sos/active"
              className="shrink-0 bg-white text-tichi-emergency font-bold text-xs px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
            >
              VIEW
            </Link>
          </div>
        )}

        {/* HERO SOS BUTTON SECTION */}
        <div className="fade-up-2 bg-white border border-blush-border rounded-2xl shadow-plum-subtle overflow-hidden">
          <div className="px-5 pt-5 pb-2 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-sm text-tichi-text">Emergency SOS</h2>
              <p className="text-xs text-tichi-muted mt-0.5">Press & hold 3 seconds to trigger</p>
            </div>
            <div className={`flex items-center space-x-1.5 text-xs font-semibold ${locInfo.color}`}>
              <LocIcon className="w-3.5 h-3.5" />
              <span>±{accuracy || '--'}m</span>
            </div>
          </div>
          <SOSHeroButton />
        </div>

        {/* 2×2 QUICK ACTION GRID */}
        <div className="fade-up-3 grid grid-cols-2 gap-3">
          {[
            {
              to: '/track',
              icon: Share2,
              label: 'Share Live Location',
              desc: 'Send secure tracking link',
            },
            {
              to: '/track',
              icon: Navigation,
              label: 'Track My Journey',
              desc: 'Protected trip monitoring',
            },
            {
              to: '/track',
              icon: Clock,
              label: 'Check On Me',
              desc: 'Timed safety check-ins',
            },
            {
              to: '/help',
              icon: PhoneCall,
              label: 'Emergency Help',
              desc: 'Call 112 & helplines',
              emergency: true,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`group bg-white border rounded-card p-4 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between space-y-3 active:scale-[0.98] ${
                  item.emergency ? 'border-emergency-border hover:border-tichi-emergency' : 'border-blush-border hover:border-plum/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  item.emergency
                    ? 'bg-emergency-bg text-tichi-emergency group-hover:bg-tichi-emergency group-hover:text-white'
                    : 'bg-plum-50 text-plum group-hover:bg-plum group-hover:text-white'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className={`font-bold text-sm leading-tight transition-colors ${
                    item.emergency ? 'text-tichi-text group-hover:text-tichi-emergency' : 'text-tichi-text group-hover:text-plum'
                  }`}>
                    {item.label}
                  </p>
                  <p className="text-[11px] text-tichi-muted mt-0.5">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ACTIVE JOURNEY BANNER */}
        {activeJourney && (
          <div className="fade-up-3 bg-plum text-white p-4 rounded-card shadow-plum-lg flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4 text-rose" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-sm">Protected Journey Active</p>
                <p className="text-xs text-rose/80 truncate mt-0.5">To: {activeJourney.destinationName}</p>
              </div>
            </div>
            <Link
              to="/track"
              className="shrink-0 ml-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors border border-white/20"
            >
              MANAGE
            </Link>
          </div>
        )}

        {/* TRUSTED CONTACTS PREVIEW */}
        <div className="fade-up-4 bg-white border border-blush-border rounded-card shadow-card">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-blush-border">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-plum" />
              <h3 className="font-bold text-sm text-tichi-text">Trusted Contacts</h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-tichi-muted font-medium">
                {contacts.length > 0 ? `${contacts.length} connected` : 'None added'}
              </span>
              <Link
                to="/contacts"
                className="flex items-center text-xs font-bold text-plum hover:underline"
              >
                Manage <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
          </div>

          <div className="p-3 space-y-2">
            {contacts.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <Users className="w-8 h-8 text-blush-border mx-auto" />
                <p className="text-xs text-tichi-muted font-medium">
                  No trusted contacts added yet
                </p>
                <Link
                  to="/contacts"
                  className="inline-block text-xs font-bold text-plum border border-plum/30 px-3 py-1.5 rounded-xl hover:bg-plum-50 transition-colors"
                >
                  + Add First Contact
                </Link>
              </div>
            ) : (
              contacts.slice(0, 2).map((contact) => (
                <TrustedContactCard key={contact.id} contact={contact} />
              ))
            )}
          </div>
        </div>

        {/* SAFETY READINESS SCORE */}
        <div className="fade-up-4 bg-white border border-blush-border rounded-card p-4 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-tichi-success" />
              <h3 className="font-bold text-sm text-tichi-text">Safety Readiness</h3>
            </div>
            <span className="text-sm font-extrabold text-plum">
              {contacts.length >= 3 && status === 'LIVE' ? '100%' : contacts.length > 0 ? '80%' : '40%'}
            </span>
          </div>

          <div className="w-full bg-blush-subtle h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-plum to-plum-light h-full rounded-full transition-all duration-700"
              style={{ width: contacts.length >= 3 && status === 'LIVE' ? '100%' : contacts.length > 0 ? '80%' : '40%' }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { done: status === 'LIVE', label: 'GPS Location Enabled' },
              { done: contacts.length > 0, label: `${contacts.length || 0} Trusted Contacts` },
              { done: true, label: 'Email Notifications Ready' },
              { done: contacts.length >= 1, label: 'Emergency Network Active' },
            ].map((item) => (
              <div key={item.label} className={`flex items-center space-x-1.5 text-xs font-medium ${item.done ? 'text-tichi-success' : 'text-tichi-muted'}`}>
                <span>{item.done ? '✓' : '○'}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
};
