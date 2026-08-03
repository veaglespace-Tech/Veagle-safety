'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { startEmergencySos } from '../../redux/slices/sosSlice.js';
import { Crown, RefreshCw, Zap } from 'lucide-react';

export const AdminHeaderNav = ({ metrics, onRefresh, toast }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { activeSession } = useSelector((state) => state?.sos || {});
  const { latitude = 18.5204, longitude = 73.8567 } = useSelector((state) => state?.location || {});

  const handleAdminTriggerSos = async () => {
    if (activeSession) {
      router.push('/active-sos');
      return;
    }
    if (confirm('🚨 ACTIVATE SUPERADMIN EMERGENCY SOS BROADCAST?\nThis will alert your guardian network with real-time GPS location.')) {
      try {
        await dispatch(startEmergencySos({
          isSilent: false,
          latitude,
          longitude,
          emergencyMessage: 'SUPERADMIN EMERGENCY SOS BROADCAST! URGENT ASSISTANCE REQUIRED!'
        })).unwrap();
        router.push('/active-sos');
      } catch (err) {
        alert(err || 'Failed to dispatch SuperAdmin SOS');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* SUPERADMIN HQ HERO HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#2A0826] via-[#4A154B] to-[#2A0826] rounded-[36px] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#FFCCE1]/30">
        <div className="flex items-center space-x-4 z-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] flex items-center justify-center shadow-lg shadow-[#FF2A6D]/40 border-2 border-white/20 shrink-0">
            <Crown className="w-9 h-9 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">SuperAdmin Command HQ</h1>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-[#2A0826] uppercase tracking-wider">
                SUPERUSER
              </span>
            </div>
            <p className="text-xs text-[#FFCCE1] font-bold mt-0.5">
              Central Operations & System Control Portal
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0 z-10 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleAdminTriggerSos}
            className="flex-1 sm:flex-initial bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white text-xs font-black px-5 py-3.5 rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center justify-center space-x-2 border border-white/20 uppercase tracking-wider cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{activeSession ? 'VIEW ACTIVE SOS' : 'TRIGGER EMERGENCY SOS'}</span>
          </button>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="bg-white/10 hover:bg-white/20 text-white p-3.5 rounded-2xl border border-white/20 backdrop-blur-md transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* TOAST MESSAGE */}
      {toast && (
        <div className={`p-4 rounded-2xl text-xs font-black text-center shadow-sm animate-fade-in ${
          toast.type === 'error'
            ? 'bg-rose-50 text-[#FF2A6D] border border-[#FF2A6D]/60'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
        }`}>
          {toast.text}
        </div>
      )}
    </div>
  );
};
