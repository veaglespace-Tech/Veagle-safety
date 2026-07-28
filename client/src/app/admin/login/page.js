'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../../redux/useAuthStore.js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Activity, Terminal, Shield, Radio, KeyRound, Sparkles } from 'lucide-react';

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { login, isLoading, error } = useAuthStore();
  const router = useRouter();

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please enter Super Admin credentials.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* HIGH-TECH DYNAMIC FLOATING AMBIENT LIGHT MESHES */}
      <div className="absolute w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-rose/25 via-rose-light/20 to-gold/20 blur-[150px] top-[-150px] right-[-150px] animate-pulse pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-gold/25 via-amber-400/20 to-rose/20 blur-[150px] bottom-[-150px] left-[-150px] animate-pulse pointer-events-none" style={{ animationDuration: '7s' }} />

      {/* BACKGROUND CYBER GRID OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#FF5C8A0D_1px,transparent_1px),linear-gradient(to_bottom,#FF5C8A0D_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-up">

        {/* LOGO & BRANDING HEADER */}
        <div className="text-center space-y-4">
          
          {/* PORCELAIN ROSE-GOLD COMMAND SHIELD EMBLEM */}
          <div className="relative inline-block group">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-rose via-rose-light to-gold opacity-50 blur-lg group-hover:opacity-80 transition duration-500 animate-pulse" />
            <div className="relative w-20 h-20 rounded-3xl bg-white/95 border-2 border-rose p-1 shadow-coral-glow flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-[#FFF0F3] via-white to-[#FFE4EC] flex items-center justify-center border border-rose/30 relative">
                <ShieldCheck className="w-10 h-10 text-rose stroke-[2.2px] drop-shadow-sm" />
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-gold to-amber-500 text-white rounded-full p-1 shadow-sm border border-white">
                  <Crown className="w-3.5 h-3.5 fill-white" />
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-white/95 border-2 border-[#FFCCE1] text-tichi-text px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-md">
              <Activity className="w-3.5 h-3.5 text-rose animate-pulse" />
              <span>COMMAND CENTER AUTHORIZATION REQUIRED</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-tichi-text drop-shadow-sm">
              Super Admin HQ Portal
            </h1>

            <p className="text-xs text-tichi-muted font-bold max-w-sm mx-auto leading-relaxed">
              Restricted high-priority access for operations & emergency dispatch
            </p>
          </div>

          {/* LIVE SYSTEM STATUS MINI INDICATOR */}
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-[#FFCCE1] text-[10px] font-extrabold text-tichi-muted shadow-sm">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-tichi-success animate-ping"></span>
              <span>HQ SYSTEM: 100% ONLINE</span>
            </div>
            <span className="text-rose font-black">•</span>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-rose" />
              <span>SECURITY LEVEL 5</span>
            </div>
          </div>

        </div>

        {/* LOGIN FORM CARD */}
        <div className="card-antique-pink rounded-3xl p-6 sm:p-8 border-2 border-rose shadow-coral-glow space-y-6 relative overflow-hidden">
          
          {/* TOP DECORATIVE ACCENT GRADIENT LINE */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose via-gold to-rose animate-pulse" />

          {(error || localError) && (
            <div className="bg-rose/10 border-2 border-rose text-rose text-xs font-black p-4 rounded-2xl text-center animate-shake flex items-center justify-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error || localError}</span>
            </div>
          )}

          <form onSubmit={handleAdminSubmit} className="space-y-5">
            
            {/* EMAIL FIELD */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-tichi-text flex items-center justify-between">
                <span>SUPER ADMIN EMAIL</span>
                <Terminal className="w-3.5 h-3.5 text-rose" />
              </label>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@veaglesafety.org"
                  required
                  className="w-full bg-white border-2 border-[#FFCCE1] rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-tichi-text placeholder-tichi-muted/60 focus:outline-none focus:border-rose focus:ring-4 focus:ring-rose/15 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-tichi-text flex items-center justify-between">
                <span>SECRET ACCESS KEY</span>
                <KeyRound className="w-3.5 h-3.5 text-rose" />
              </label>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-white border-2 border-[#FFCCE1] rounded-2xl py-3.5 pl-11 pr-11 text-xs font-bold text-tichi-text placeholder-tichi-muted/60 focus:outline-none focus:border-rose focus:ring-4 focus:ring-rose/15 transition-all shadow-sm font-mono"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-tichi-muted hover:text-rose transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-baby-pink py-4 rounded-2xl text-xs uppercase tracking-wider font-black shadow-coral-glow flex items-center justify-center space-x-2 disabled:opacity-60 transition-all hover:scale-[1.01]"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>VERIFYING CLEARANCE...</span>
                </div>
              ) : (
                <>
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>AUTHORIZE SUPER ADMIN ACCESS</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          {/* BACK TO MAIN WEBSITE LINK */}
          <div className="pt-2 text-center border-t border-[#FFCCE1]">
            <Link
              href="/"
              className="text-xs font-bold text-tichi-muted hover:text-rose transition-colors inline-flex items-center space-x-1.5"
            >
              <span>← Back to Public Website</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
