'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, Volume2, VolumeX, MapPin, ExternalLink, PhoneCall, X } from 'lucide-react';
import { startEmergencySiren, stopEmergencySiren } from '../../utils/sirenAudio.js';

export const EmergencyAlarmListener = () => {
  const [alarmData, setAlarmData] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Only run on client - dynamically import socket.io-client
    let socket = null;

    const connectSocket = async () => {
      try {
        const { io } = await import('socket.io-client');
        socket = io('http://localhost:5000', {
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 5,
          timeout: 10000,
        });

        socket.on('connect', () => {
          console.log('[EmergencyAlarmListener] Connected to emergency server');
        });

        socket.on('connect_error', (err) => {
          console.warn('[EmergencyAlarmListener] Connection error:', err.message);
        });

        socket.on('SOS_ALARM_BROADCAST', (data) => {
          console.log('[EmergencyAlarmListener] SOS ALARM BROADCAST received:', data);
          setAlarmData(data);
          setIsMuted(false);
          startEmergencySiren();
        });

        socket.on('SOS_ALARM_STOP', () => {
          setAlarmData(null);
          stopEmergencySiren();
        });
      } catch (err) {
        console.warn('[EmergencyAlarmListener] Socket init error:', err.message);
      }
    };

    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
      stopEmergencySiren();
    };
  }, []);

  const handleMuteToggle = () => {
    if (isMuted) {
      startEmergencySiren();
      setIsMuted(false);
    } else {
      stopEmergencySiren();
      setIsMuted(true);
    }
  };

  const handleDismiss = () => {
    stopEmergencySiren();
    setAlarmData(null);
  };

  if (!alarmData) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#FFF0F3] border-4 border-[#FF2A6D] rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_80px_20px_rgba(255,42,109,0.5)] relative text-tichi-text">
        
        {/* CLOSE */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-tichi-muted hover:text-[#FF2A6D] p-2 rounded-full hover:bg-rose/10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* ICON */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-[#FF2A6D] text-white flex items-center justify-center mx-auto shadow-lg border-4 border-white animate-pulse">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <span className="bg-[#FF2A6D] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              CRITICAL EMERGENCY SOS ALARM
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#FF2A6D] pt-1">
              🚨 EMERGENCY SIREN TRIGGERED!
            </h2>
            <p className="text-xs font-black text-tichi-muted">
              {alarmData.victimName} has triggered an emergency SOS alert!
            </p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="bg-white p-5 rounded-2xl border border-[#FFCCE1] space-y-3 shadow-sm text-xs font-bold">
          <div className="flex items-center justify-between border-b border-[#FFCCE1] pb-2">
            <span className="text-tichi-muted">Victim Name:</span>
            <span className="text-sm font-black text-tichi-text">{alarmData.victimName}</span>
          </div>
          {alarmData.victimPhone && (
            <div className="flex items-center justify-between border-b border-[#FFCCE1] pb-2">
              <span className="text-tichi-muted">Phone:</span>
              <a href={`tel:${alarmData.victimPhone}`} className="text-[#FF2A6D] font-mono font-black flex items-center space-x-1">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{alarmData.victimPhone}</span>
              </a>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-tichi-muted">GPS:</span>
            <span className="font-mono text-tichi-text">
              {alarmData.latitude?.toFixed(4)}, {alarmData.longitude?.toFixed(4)}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="space-y-3">
          {alarmData.trackingUrl && (
            <a
              href={alarmData.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-baby-pink py-4 text-xs uppercase tracking-wider shadow-coral-glow flex items-center justify-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>TRACK LIVE GPS LOCATION ON MAP</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button
            type="button"
            onClick={handleMuteToggle}
            className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 border-2 ${
              isMuted
                ? 'bg-tichi-success text-white border-tichi-success'
                : 'bg-white text-[#FF2A6D] border-[#FF2A6D] hover:bg-rose/10'
            }`}
          >
            {isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{isMuted ? 'UNMUTE EMERGENCY SIREN' : 'MUTE SIREN SOUND'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
