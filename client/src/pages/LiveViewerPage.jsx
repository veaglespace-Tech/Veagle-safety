import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api.js';
import { LiveLocationMap } from '../components/location/LiveLocationMap.jsx';
import { ShieldAlert, MapPin, PhoneCall, Clock, CheckCircle } from 'lucide-react';
import { io } from 'socket.io-client';

export const LiveViewerPage = () => {
  const { token } = useParams();
  const [session, setSession] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPublicSos();
    const socket = io('http://localhost:5000');

    if (token) {
      socket.emit('join-room', `track:${token}`);
    }

    socket.on('location-updated', (data) => {
      setLocation({
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy,
        recordedAt: data.timestamp,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const loadPublicSos = async () => {
    try {
      const res = await api.get(`/sos/public-track/${token}`);
      setSession(res.data.sosSession);
      if (res.data.sosSession?.locations?.length > 0) {
        setLocation(res.data.sosSession.locations[0]);
      }
    } catch (err) {
      setError('Emergency link invalid, expired, or has ended.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blush flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-plum border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-blush p-4 flex items-center justify-center text-center">
        <div className="bg-white border border-blush-border rounded-2xl p-8 max-w-sm space-y-4 shadow-card">
          <CheckCircle className="w-14 h-14 text-tichi-success mx-auto" />
          <h2 className="font-extrabold text-lg text-tichi-text">Tracking Link Inactive</h2>
          <p className="text-xs text-tichi-muted leading-relaxed">
            {error || 'This emergency live tracking link is no longer active or the user has confirmed safety.'}
          </p>
        </div>
      </div>
    );
  }

  const isEmergency = session.status === 'ACTIVE';

  return (
    <div className="min-h-screen bg-blush p-4 max-w-xl mx-auto space-y-4 pb-8">
      <div className={`p-4 rounded-card text-white flex items-center justify-between shadow-plum-lg ${isEmergency ? 'bg-tichi-emergency animate-pulse' : 'bg-plum'}`}>
        <div className="flex items-center space-x-3">
          <ShieldAlert className="w-7 h-7 shrink-0" />
          <div>
            <h1 className="font-extrabold text-base">{session.user?.fullName} — Live SOS Location</h1>
            <p className="text-xs text-white/80">Real-time emergency GPS tracking stream</p>
          </div>
        </div>
        <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
          ● {session.status}
        </span>
      </div>

      <div className="h-80 rounded-2xl overflow-hidden shadow-card border border-blush-border">
        {location ? (
          <LiveLocationMap
            lat={location.latitude}
            lng={location.longitude}
            accuracy={location.accuracy || 15}
            userName={`${session.user?.fullName} (Live)`}
            isEmergency={isEmergency}
          />
        ) : (
          <div className="h-full bg-blush-subtle flex items-center justify-center text-xs text-tichi-muted font-bold">
            Waiting for initial GPS signal...
          </div>
        )}
      </div>

      <div className="bg-white border border-blush-border rounded-card p-4 space-y-2.5 shadow-card">
        <div className="flex items-center justify-between text-xs border-b border-blush-border pb-2">
          <span className="text-tichi-muted">Emergency Caller Phone:</span>
          <a href={`tel:${session.user?.phone}`} className="font-bold text-plum hover:underline">
            {session.user?.phone}
          </a>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-tichi-muted">Last Signal Update:</span>
          <span className="font-mono text-xs text-tichi-text">
            {location?.recordedAt ? new Date(location.recordedAt).toLocaleTimeString() : 'Just now'}
          </span>
        </div>
      </div>

      <a
        href="tel:112"
        className="bg-tichi-emergency text-white font-extrabold p-4 rounded-card text-center shadow-sos-glow flex items-center justify-center space-x-2 text-sm hover:brightness-110 active:scale-95 transition-all"
      >
        <PhoneCall className="w-5 h-5" />
        <span>CALL 112 EMERGENCY POLICE</span>
      </a>
    </div>
  );
};
