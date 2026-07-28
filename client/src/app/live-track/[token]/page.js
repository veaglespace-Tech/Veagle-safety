'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../utils/api.js';
import { LiveLocationMap } from '../../../components/location/DynamicLiveLocationMap.js';
import { ShieldAlert, MapPin, PhoneCall, Clock, CheckCircle, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import { io } from 'socket.io-client';
import { startEmergencySiren, stopEmergencySiren } from '../../../utils/sirenAudio.js';

export const dynamic = 'force-dynamic';

export default function LivePublicTrackingPage() {
  const { token } = useParams();
  const [session, setSession] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);

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

    socket.on('SOS_ALARM_STOP', () => {
      stopEmergencySiren();
      setIsSirenPlaying(false);
    });

    return () => {
      socket.disconnect();
      stopEmergencySiren();
    };
  }, [token]);

  const loadPublicSos = async () => {
    try {
      const res = await api.get(`/sos/public-track/${token}`);
      const sosData = res.data.sosSession || res.data.session;
      setSession(sosData);
      if (sosData?.locations?.length > 0) {
        setLocation(sosData.locations[0]);
      }
    } catch (err) {
      setError('Emergency link invalid, expired, or has ended.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSiren = () => {
    if (isSirenPlaying) {
      stopEmergencySiren();
      setIsSirenPlaying(false);
    } else {
      startEmergencySiren();
      setIsSirenPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF0F3] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#FFF0F3] p-4 flex items-center justify-center text-center">
        <div className="bg-white border-2 border-[#FFCCE1] rounded-3xl p-8 max-w-sm space-y-4 shadow-xl">
          <CheckCircle className="w-16 h-16 text-tichi-success mx-auto" />
          <h2 className="font-black text-xl text-tichi-text">Tracking Link Resolved</h2>
          <p className="text-xs text-tichi-muted font-bold leading-relaxed">
            {error || 'This emergency live tracking session is no longer active or the user has confirmed safety.'}
          </p>
        </div>
      </div>
    );
  }

  const isEmergency = session.status === 'ACTIVE';

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans p-4 max-w-2xl mx-auto space-y-4 pb-12">
      
      {/* HEADER BANNER */}
      <div className={`p-5 rounded-3xl text-white flex items-center justify-between shadow-xl ${isEmergency ? 'bg-gradient-to-r from-[#FF2A6D] via-rose to-[#FF2A6D] animate-pulse border-2 border-white' : 'bg-tichi-text'}`}>
        <div className="flex items-center space-x-3">
          <ShieldAlert className="w-8 h-8 shrink-0 animate-bounce" />
          <div>
            <h1 className="font-black text-lg">{session.user?.fullName || 'Sakhi Member'} — Emergency GPS Stream</h1>
            <p className="text-xs text-white/90 font-bold">24/7 Live Encrypted Guardian Location Map</p>
          </div>
        </div>
        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
          ● {session.status}
        </span>
      </div>

      {/* SIREN TRIGGER / UNMUTE BUTTON FOR GUARDIAN */}
      {isEmergency && (
        <div className="bg-white border-2 border-[#FF2A6D] rounded-2xl p-4 shadow-coral-glow flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#FF2A6D]/15 text-[#FF2A6D] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-black text-[#FF2A6D]">GUARDIAN EMERGENCY ALARM</p>
              <p className="text-[11px] font-bold text-tichi-muted">Tap button to play high-decibel siren on your device</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSiren}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 border-2 ${
              isSirenPlaying
                ? 'bg-tichi-success text-white border-tichi-success shadow-lg animate-pulse'
                : 'bg-[#FF2A6D] text-white border-[#FF2A6D] shadow-coral-glow hover:brightness-110'
            }`}
          >
            {isSirenPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-bounce" />}
            <span>{isSirenPlaying ? 'MUTE SIREN SOUND' : '🔊 PLAY EMERGENCY SIREN ON MY DEVICE'}</span>
          </button>
        </div>
      )}

      {/* GPS LIVE MAP */}
      <div className="h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl border-2 border-[#FFCCE1]">
        {location ? (
          <LiveLocationMap
            lat={location.latitude}
            lng={location.longitude}
            accuracy={location.accuracy || 15}
            userName={`${session.user?.fullName || 'User'} (EMERGENCY)`}
            isEmergency={isEmergency}
          />
        ) : (
          <div className="h-full bg-white flex items-center justify-center text-xs text-tichi-muted font-black">
            Connecting to live GPS satellite stream...
          </div>
        )}
      </div>

      {/* VICTIM DETAILS & DIRECT PHONE CALL */}
      <div className="bg-white border-2 border-[#FFCCE1] rounded-3xl p-5 space-y-3 shadow-md">
        <div className="flex items-center justify-between text-xs border-b border-[#FFCCE1] pb-3 font-bold">
          <span className="text-tichi-muted">Emergency User Phone:</span>
          {session.user?.phone ? (
            <a href={`tel:${session.user?.phone}`} className="font-black text-rose hover:underline text-sm font-mono flex items-center space-x-1">
              <PhoneCall className="w-4 h-4" />
              <span>{session.user?.phone}</span>
            </a>
          ) : (
            <span className="font-mono text-tichi-text">Available in SOS Dispatch</span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-tichi-muted">Last GPS Timestamp:</span>
          <span className="font-mono text-tichi-text">
            {location?.recordedAt ? new Date(location.recordedAt).toLocaleTimeString() : 'Just now'}
          </span>
        </div>
      </div>

      {/* DIRECT EMERGENCY HELPLINE CALL */}
      <a
        href="tel:112"
        className="w-full btn-baby-pink py-4 rounded-2xl text-center shadow-coral-glow flex items-center justify-center space-x-2 text-xs uppercase tracking-wider font-black"
      >
        <PhoneCall className="w-5 h-5" />
        <span>CALL 112 NATIONAL EMERGENCY POLICE DISPATCH</span>
      </a>
    </div>
  );
}
