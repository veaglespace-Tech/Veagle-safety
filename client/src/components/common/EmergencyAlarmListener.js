'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, Volume2, VolumeX, MapPin, ExternalLink, PhoneCall, X, Bell } from 'lucide-react';
import { startEmergencySiren, stopEmergencySiren } from '../../utils/sirenAudio.js';

export const EmergencyAlarmListener = () => {
  const [alarmData, setAlarmData] = useState(null);
  const [isSirenActive, setIsSirenActive] = useState(false);

  useEffect(() => {
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

        socket.on('SOS_ALARM_BROADCAST', (data) => {
          console.log('[EmergencyAlarmListener] SOS ALARM BROADCAST received:', data);
          setAlarmData(data);
          // Try auto-starting siren audio
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
      stopEmergencySiren();
    };
  }, []);

  const handleStartAudioSiren = () => {
    if (isSirenActive) {
      stopEmergencySiren();
      setIsSirenActive(false);
    } else {
      startEmergencySiren();
      setIsSirenActive(true);
    }
  };

  const handleDismiss = () => {
    stopEmergencySiren();
    setIsSirenActive(false);
    setAlarmData(null);
  };

  if (!alarmData) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#FFF0F3] border-4 border-[#FF2A6D] rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_90px_30px_rgba(255,42,109,0.6)] relative text-tichi-text animate-pulse">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-tichi-muted hover:text-[#FF2A6D] p-2 rounded-full hover:bg-rose/10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* EMBLEM & ALERT TITLE */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-[#FF2A6D] text-white flex items-center justify-center mx-auto shadow-coral-glow border-4 border-white animate-bounce">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <span className="bg-[#FF2A6D] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
              CRITICAL EMERGENCY GUARDIAN BROADCAST
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#FF2A6D] pt-1">
              🚨 EMERGENCY SIREN ALERT!
            </h2>
            <p className="text-xs font-black text-tichi-muted">
              {alarmData.victimName} has triggered an emergency SOS broadcast alert!
            </p>
          </div>
        </div>

        {/* GUARDIAN SIREN ACTIVATION BUTTON */}
        <button
          type="button"
          onClick={handleStartAudioSiren}
          className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 border-2 shadow-coral-glow ${
            isSirenActive
              ? 'bg-tichi-success text-white border-tichi-success animate-pulse'
              : 'bg-[#FF2A6D] text-white border-[#FF2A6D] hover:brightness-110'
          }`}
        >
          {isSirenActive ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-bounce" />}
          <span>{isSirenActive ? 'MUTE SIREN SOUND' : '🔊 TAP HERE TO PLAY EMERGENCY SIREN ON YOUR DEVICE'}</span>
        </button>

        {/* DETAILS CARD */}
        <div className="bg-white p-5 rounded-2xl border-2 border-[#FFCCE1] space-y-3 shadow-sm text-xs font-bold">
          <div className="flex items-center justify-between border-b border-[#FFCCE1] pb-2">
            <span className="text-tichi-muted">Victim Name:</span>
            <span className="text-sm font-black text-tichi-text">{alarmData.victimName}</span>
          </div>
          {alarmData.victimPhone && (
            <div className="flex items-center justify-between border-b border-[#FFCCE1] pb-2">
              <span className="text-tichi-muted">Phone Number:</span>
              <a href={`tel:${alarmData.victimPhone}`} className="text-[#FF2A6D] font-mono font-black flex items-center space-x-1">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{alarmData.victimPhone}</span>
              </a>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-tichi-muted">GPS Coordinates:</span>
            <span className="font-mono text-tichi-text">
              {alarmData.latitude?.toFixed(4)}, {alarmData.longitude?.toFixed(4)}
            </span>
          </div>
        </div>

        {/* LIVE TRACKING MAP LINK */}
        {alarmData.trackingUrl && (
          <a
            href={alarmData.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full btn-baby-pink py-4 text-xs uppercase tracking-wider shadow-coral-glow flex items-center justify-center space-x-2 font-black"
          >
            <MapPin className="w-4 h-4" />
            <span>OPEN LIVE GPS MAP & SIREN CONTROLS</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

      </div>
    </div>
  );
};
