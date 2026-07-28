'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../../redux/useAuthStore.js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Activity, Terminal } from 'lucide-react';

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
    <div className="min-h-screen bg-plum-dark text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gold/10 blur-[140px] top-[-100px] right-[-100px] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-rose/10 blur-[140px] bottom-[-100px] left-[-100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">

        {/* LOGO & BRANDING HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-gold to-amber-500 text-plum shadow-gold-glow border border-gold/40 mx-auto">
            <Crown className="w-9 h-9" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 bg-gold/20 text-gold border border-gold/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
              <Activity className="w-3 h-3 text-gold animate-pulse" />
              <span>COMMAND CENTER AUTHORIZATION REQUIRED</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Super Admin HQ Portal</h1>
            <p className="text-xs text-rose-muted font-medium mt-1">
              Restricted high-priority access for operations & emergency dispatch
            </p>
          </div>
        </div>

        {/* LOGIN FORM CARD */}
        <div className="glass-card-dark rounded-3xl p-6 sm:p-8 border border-gold/30 space-y-6 shadow-plum-lg">
          {(error || localError) && (
            <div className="bg-tichi-emergency/20 border border-tichi-emergency text-rose text-xs font-bold p-3.5 rounded-xl text-center animate-shake">
              ⚠️ {error || localError}
            </div>
          )}

          <form onSubmit={handleAdminSubmit} className="space-y-4">
            {/* EMAIL FIELD */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-rose-muted flex items-center justify-between">
                <span>SUPER ADMIN EMAIL</span>
                <Terminal className="w-3 h-3 text-gold" />
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@veaglesafety.org"
                  required
                  className="w-full bg-white/5 border border-rose/20 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-white placeholder-rose-muted/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-rose-muted flex items-center justify-between">
                <span>SECRET ACCESS KEY</span>
                <Lock className="w-3 h-3 text-gold" />
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-white/5 border border-rose/20 rounded-xl py-3 pl-10 pr-10 text-xs font-bold text-white placeholder-rose-muted/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-rose-muted hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gold via-amber-400 to-amber-500 text-plum font-black text-xs py-3.5 rounded-xl shadow-gold-glow hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 border border-gold/50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-plum border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>AUTHORIZE SUPER ADMIN ACCESS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* BACK TO MAIN WEBSITE LINK */}
          <div className="pt-2 text-center border-t border-white/10">
            <Link
              href="/"
              className="text-xs font-bold text-rose-muted hover:text-white transition-colors inline-flex items-center space-x-1"
            >
              <span>← Back to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
