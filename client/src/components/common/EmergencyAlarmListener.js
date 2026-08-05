'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ShieldAlert, Volume2, VolumeX, MapPin, ExternalLink, PhoneCall, X, BellRing, MessageSquare } from 'lucide-react';
import { startEmergencySiren, stopEmergencySiren } from '../../utils/sirenAudio.js';

export const EmergencyAlarmListener = () => {
  const { user } = useSelector((state) => state?.auth || {});
  const [alarmData, setAlarmData] = useState(null);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const dismissedSosIdsRef = useRef(new Set());
  const socketRef = useRef(null);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const registerUserRooms = (socketInstance, u) => {
    if (!socketInstance || !u) return;
    const cleanPhone = u.phone ? u.phone.replace(/\D/g, '') : null;
    const userEmail = u.email ? u.email.trim().toLowerCase() : null;

    socketInstance.emit('register-user', {
      email: userEmail,
      phone: cleanPhone,
      role: u.role,
    });

    if (userEmail) socketInstance.emit('join-room', `user:${userEmail}`);
    if (cleanPhone) socketInstance.emit('join-room', `user:${cleanPhone}`);
    if (u.role === 'SUPER_ADMIN' || u.role === 'ADMIN') {
      socketInstance.emit('join-room', 'admin-ops');
    }
  };

  useEffect(() => {
    let socket = null;

    const connectSocket = async () => {
      try {
        const { io } = await import('socket.io-client');
        const { SERVER_URL } = await import('../../utils/api.js');
        socket = io(SERVER_URL, {
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 5,
          timeout: 10000,
        });
        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('[EmergencyAlarmListener] Connected to emergency server');
          if (userRef.current) {
            registerUserRooms(socket, userRef.current);
          }
        });

        socket.on('SOS_ALARM_BROADCAST', (data) => {
          const sosId = data?.sosId || data?.id || data?.sosSessionId;
          if (sosId && dismissedSosIdsRef.current.has(String(sosId))) {
            return; // Ignore recurring broadcast for explicitly dismissed session
          }
          console.log('[EmergencyAlarmListener] SOS ALARM BROADCAST received:', data);
          setAlarmData(data);
          try {
            startEmergencySiren();
            setIsSirenActive(true);
          } catch (e) {
            console.warn('Audio requires user click gesture');
          }
        });

        socket.on('SOS_ALARM_STOP', () => {
          setAlarmData(null);
          stopEmergencySiren();
          setIsSirenActive(false);
        });
      } catch (err) {
        console.warn('[EmergencyAlarmListener] Socket error:', err.message);
      }
    };

    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
      socketRef.current = null;
      stopEmergencySiren();
    };
  }, []);

  useEffect(() => {
    if (socketRef.current && user) {
      registerUserRooms(socketRef.current, user);
    }
  }, [user]);

  const handleStartAudioSiren = () => {
    if (isSirenActive) {
      stopEmergencySiren();
      setIsSirenActive(false);
    } else {
      startEmergencySiren();
      setIsSirenActive(true);
    }
  };

  const handleDismiss = (e) => {
    if (e) e.stopPropagation();
    stopEmergencySiren();
    setIsSirenActive(false);
    if (alarmData) {
      const sosId = alarmData.sosId || alarmData.id || alarmData.sosSessionId;
      if (sosId) {
        dismissedSosIdsRef.current.add(String(sosId));
      }
    }
    setAlarmData(null);
  };

  const { user } = useSelector((state) => state?.auth || {});
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  if (!alarmData || isSuperAdmin) return null;

  const hasVictimPhoto = alarmData.victimPhoto && typeof alarmData.victimPhoto === 'string';

  return (
    <div className="fixed inset-0 z-[9999] bg-[#2A0826]/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[40px] p-6 sm:p-8 space-y-6 shadow-[0_30px_90px_rgba(255,42,109,0.35)] border-3 border-[#FF2A6D] relative text-[#2A0826] overflow-hidden my-auto animate-scale-up">
        
        {/* GLOWING AMBIENT ACCENT BAR */}
        <div className="bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] h-3 w-full absolute top-0 left-0 right-0 animate-pulse pointer-events-none" />

        {/* CLOSE (X) DISMISS BUTTON */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#FF2A6D] p-2.5 rounded-2xl hover:bg-[#FFF0F3] transition-all cursor-pointer z-30 flex items-center justify-center active:scale-90"
          title="Dismiss Alert"
          aria-label="Close Emergency Alert"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* 3D SIREN ICON DOCK & TITLE */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative w-22 h-22 mx-auto">
            <div className="absolute inset-0 rounded-3xl bg-[#FF2A6D]/25 animate-ping pointer-events-none" />
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-tr from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white flex items-center justify-center mx-auto shadow-2xl shadow-[#FF2A6D]/40 border-4 border-white relative z-10 animate-bounce">
              <ShieldAlert className="w-10 h-10 text-white stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-[#FF2A6D] to-[#E01A4F] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md border border-white/20">
              <BellRing className="w-3.5 h-3.5 animate-spin" />
              <span>CRITICAL EMERGENCY GUARDIAN BROADCAST</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#FF2A6D] tracking-tight">
              🚨 EMERGENCY SIREN ALERT!
            </h2>

            <p className="text-xs font-bold text-[#684E67] max-w-sm mx-auto leading-relaxed">
              <strong className="text-[#2A0826] font-black">{alarmData.victimName}</strong> has triggered an emergency SOS broadcast alert!
            </p>
          </div>
        </div>

        {/* GUARDIAN SIREN SOUND CONTROL BUTTON */}
        <button
          type="button"
          onClick={handleStartAudioSiren}
          className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5 border-2 cursor-pointer shadow-lg active:scale-95 ${
            isSirenActive
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-emerald-500/30 animate-pulse'
              : 'bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white border-[#FF2A6D] shadow-[#FF2A6D]/30 hover:scale-[1.02]'
          }`}
        >
          {isSirenActive ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-bounce" />}
          <span>{isSirenActive ? 'MUTE SIREN SOUND' : '🔊 TAP HERE TO PLAY EMERGENCY SIREN ON YOUR DEVICE'}</span>
        </button>

        {/* DETAILS GLASS CARD */}
        <div className="bg-gradient-to-br from-[#FFF0F3]/80 via-white to-[#FFF0F3]/80 p-5 rounded-3xl border-2 border-[#FFCCE1] space-y-3.5 text-xs font-bold shadow-xs">
          
          <div className="flex items-center justify-between border-b border-[#FFCCE1] pb-3">
            <span className="text-[#684E67]">Victim Name:</span>
            <div className="flex items-center space-x-2">
              {hasVictimPhoto && (
                <img
                  src={alarmData.victimPhoto}
                  alt={alarmData.victimName}
                  className="w-7 h-7 rounded-full object-cover border-2 border-[#FF2A6D]"
                />
              )}
              <span className="text-sm font-black text-[#2A0826]">{alarmData.victimName}</span>
            </div>
          </div>

          {alarmData.victimPhone && (
            <div className="flex items-center justify-between border-b border-[#FFCCE1] pb-3">
              <span className="text-[#684E67]">Phone Number:</span>
              <a
                href={`tel:${alarmData.victimPhone}`}
                className="font-mono text-[#FF2A6D] bg-white px-3 py-1.5 rounded-xl border border-[#FFCCE1] hover:border-[#FF2A6D] font-black flex items-center space-x-1.5 transition-all shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{alarmData.victimPhone}</span>
              </a>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-[#684E67]">GPS Coordinates:</span>
            <span className="font-mono text-[#2A0826] bg-white px-3 py-1.5 rounded-xl border border-[#FFCCE1] font-black">
              {alarmData.latitude?.toFixed(4)}, {alarmData.longitude?.toFixed(4)}
            </span>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTONS */}
        <div className="space-y-3">
          {alarmData.trackingUrl && (
            <a
              href={alarmData.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#FF2A6D]/25 flex items-center justify-center space-x-2 border border-white/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span>OPEN LIVE GPS MAP & SIREN CONTROLS</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {alarmData.victimPhone && (
            <a
              href={`https://api.whatsapp.com/send?phone=${alarmData.victimPhone.replace(/\D/g, '')}&text=${encodeURIComponent(`🚨 SAKHI EMERGENCY ALERT!\n\nVictim: ${alarmData.victimName}\nPhone: ${alarmData.victimPhone}\n\n📍 GPS Coordinates:\nLat: ${alarmData.latitude}, Lng: ${alarmData.longitude}\n\n👉 Live Map:\n${alarmData.trackingUrl || ''}\n\n🌐 Google Maps:\n${alarmData.googleMapsUrl || `https://www.google.com/maps?q=${alarmData.latitude},${alarmData.longitude}`}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95 border border-white/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span>DISPATCH WHATSAPP EMERGENCY ALERT</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

      </div>
    </div>
  );
};
