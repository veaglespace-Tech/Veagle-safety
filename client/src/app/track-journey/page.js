'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout.js';
import { useLocationStore } from '../../redux/useLocationStore.js';
import { api } from '../../utils/api.js';
import { Navigation, Clock, ShieldCheck, Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function UserTrackJourneyPage() {
  const { latitude, longitude } = useLocationStore();
  const [activeTab, setActiveTab] = useState('JOURNEY');
  const [destination, setDestination] = useState('');
  const [minutes, setMinutes] = useState('30');
  const [journey, setJourney] = useState(null);
  const [checkinInterval, setCheckinInterval] = useState('15');
  const [checkin, setCheckin] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActiveJourney();
    loadActiveCheckin();
  }, []);

  const loadActiveJourney = async () => {
    try { const res = await api.get('/journey/active'); setJourney(res.data.journey); } catch (err) {}
  };
  const loadActiveCheckin = async () => {
    try { const res = await api.get('/checkin/active'); setCheckin(res.data.checkin); } catch (err) {}
  };

  const handleStartJourney = async (e) => {
    e.preventDefault();
    if (!destination) return;
    setLoading(true);
    try {
      const res = await api.post('/journey/start', {
        destinationName: destination,
        originLat: latitude || 28.6139,
        originLng: longitude || 77.2090,
        destLat: 28.5355,
        destLng: 77.3910,
        minutesToArrive: minutes,
      });
      setJourney(res.data.journey);
    } catch (err) { alert('Failed to start journey. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleCompleteJourney = async () => {
    if (!journey) return;
    try { await api.post('/journey/complete', { journeyId: journey.id }); setJourney(null); } catch (err) {}
  };

  const handleStartCheckin = async () => {
    setLoading(true);
    try { const res = await api.post('/checkin/start', { intervalMins: checkinInterval }); setCheckin(res.data.checkin); }
    catch (err) {} finally { setLoading(false); }
  };

  const handleConfirmSafeCheckin = async () => {
    if (!checkin) return;
    try { await api.post('/checkin/safe', { checkinId: checkin.id }); setCheckin(null); } catch (err) {}
  };

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto px-4 pt-5 pb-6 space-y-5 lg:max-w-2xl">
        <div className="animate-fade-up">
          <h1 className="text-xl font-extrabold text-tichi-text tracking-tight">Stay Protected</h1>
          <p className="text-xs text-tichi-muted mt-0.5">Journey tracking & safety check-ins</p>
        </div>

        <div className="flex bg-white p-1 rounded-card border border-blush-border shadow-card gap-1">
          {[
            { key: 'JOURNEY', label: 'Track Journey', icon: Navigation },
            { key: 'CHECKIN', label: 'Check On Me', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                  isActive ? 'bg-plum text-white shadow-sm' : 'text-tichi-muted hover:text-plum'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'JOURNEY' && (
          <div className="space-y-4 animate-fade-up">
            {journey ? (
              <div className="bg-white border border-blush-border rounded-2xl p-5 space-y-5 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tichi-success animate-pulse"></span>
                    <h3 className="font-extrabold text-sm text-plum">Protected Journey Active</h3>
                  </div>
                  <span className="text-xs font-semibold text-tichi-muted bg-blush-subtle px-2.5 py-1 rounded-full">
                    ETA {new Date(journey.expectedArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="bg-blush-subtle rounded-xl p-4 space-y-3 border border-blush-border">
                  <div className="flex items-start space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-plum mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-[10px] font-extrabold text-tichi-muted uppercase tracking-widest">Starting Point</p>
                      <p className="text-xs font-bold text-tichi-text mt-0.5">{journey.originName}</p>
                    </div>
                  </div>
                  <div className="w-px h-5 bg-plum/20 ml-1.5"></div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-tichi-emergency mt-1.5 shrink-0"></div>
                    <div>
                      <p className="text-[10px] font-extrabold text-tichi-muted uppercase tracking-widest">Destination</p>
                      <p className="text-xs font-bold text-tichi-text mt-0.5">{journey.destinationName}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCompleteJourney}
                  className="w-full bg-tichi-success text-white font-extrabold py-3.5 rounded-card text-sm flex items-center justify-center space-x-2 shadow hover:brightness-105 transition-all active:scale-[0.98]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>I'VE ARRIVED SAFELY</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleStartJourney} className="bg-white border border-blush-border rounded-2xl p-5 space-y-4 shadow-card">
                <div>
                  <h3 className="font-extrabold text-base text-tichi-text">Start Protected Journey</h3>
                  <p className="text-xs text-tichi-muted mt-1">
                    Your trusted contacts can track your live progress. An alert fires if you don't arrive on time.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-tichi-text mb-1.5">Where are you heading?</label>
                    <input
                      type="text"
                      placeholder="e.g. Home, Office, Metro Station"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-control border border-blush-border text-sm focus:ring-2 focus:ring-plum focus:border-transparent focus:outline-none bg-blush-subtle transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-tichi-text mb-1.5">How long will it take?</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['15', '30', '45', '60'].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMinutes(m)}
                          className={`py-2.5 rounded-control text-xs font-bold border transition-all ${
                            minutes === m
                              ? 'bg-plum text-white border-plum shadow-sm'
                              : 'bg-white text-tichi-text border-blush-border hover:bg-plum-50 hover:border-plum/30'
                          }`}
                        >
                          {m === '60' ? '1h' : `${m}m`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !destination}
                  className="w-full bg-plum text-white font-extrabold py-3.5 rounded-card text-sm shadow hover:bg-plum-dark transition-colors flex items-center justify-center space-x-2 disabled:opacity-60 active:scale-[0.98]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{loading ? 'STARTING...' : 'START PROTECTED JOURNEY'}</span>
                </button>
              </form>
            )}

            <div className="flex items-start space-x-3 bg-plum-50 p-4 rounded-card border border-plum-200">
              <Info className="w-4 h-4 text-plum shrink-0 mt-0.5" />
              <p className="text-xs text-plum font-medium">
                Journey tracking continuously updates your location every 30 seconds. Your trusted contacts can view live progress via the shared tracking link.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'CHECKIN' && (
          <div className="space-y-4 animate-fade-up">
            {checkin ? (
              <div className="bg-white border border-blush-border rounded-2xl p-6 space-y-5 shadow-card text-center">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full mx-auto flex items-center justify-center border border-amber-200">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-tichi-text">Safety Timer Running</h3>
                  <p className="text-xs text-tichi-muted mt-1">
                    You'll be asked to confirm safety at:
                  </p>
                  <p className="text-2xl font-black text-plum mt-1.5">
                    {new Date(checkin.triggerAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <p className="text-xs text-tichi-muted bg-blush-subtle p-3 rounded-xl border border-blush-border">
                  If you don't respond by the scheduled time, your trusted contacts will be automatically notified.
                </p>

                <button
                  onClick={handleConfirmSafeCheckin}
                  className="w-full bg-tichi-success text-white font-extrabold py-3.5 rounded-card text-sm shadow hover:brightness-105 transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>YES, I'M SAFE NOW</span>
                </button>
              </div>
            ) : (
              <div className="bg-white border border-blush-border rounded-2xl p-5 space-y-5 shadow-card">
                <div>
                  <h3 className="font-extrabold text-base text-tichi-text">Safety Check-In Timer</h3>
                  <p className="text-xs text-tichi-muted mt-1">
                    Set a timer. We'll ask if you're safe. No response triggers automatic escalation to your trusted contacts.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-tichi-text mb-2">Check-in Reminder</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: '15', label: '15 min' },
                      { val: '30', label: '30 min' },
                      { val: '60', label: '1 hour' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setCheckinInterval(opt.val)}
                        className={`py-3 rounded-control text-xs font-bold border transition-all ${
                          checkinInterval === opt.val
                            ? 'bg-plum text-white border-plum shadow-sm'
                            : 'bg-white text-tichi-text border-blush-border hover:bg-plum-50 hover:border-plum/30'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStartCheckin}
                  disabled={loading}
                  className="w-full bg-plum text-white font-extrabold py-3.5 rounded-card text-sm shadow hover:bg-plum-dark transition-colors flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  <Clock className="w-4 h-4" />
                  <span>{loading ? 'STARTING...' : 'START SAFETY CHECK'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
