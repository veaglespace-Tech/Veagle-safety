import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useNavigate, Link } from 'react-router-dom';
import { Crown, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Terminal } from 'lucide-react';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    const success = await login(email, password);
    if (success) {
      const user = useAuthStore.getState().user;
      if (user?.role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else {
        useAuthStore.getState().logout();
        setLocalError('Access Denied: Only Super Admin Command Center personnel are authorized to log in via this URL.');
      }
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@sakhisuraksha.org');
    setPassword('Admin123!');
    setLocalError(null);
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text flex items-center justify-center p-4 relative overflow-hidden selection:bg-gold selection:text-white">
      {/* Background Ambient Mesh Glows */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gold/15 blur-[120px] top-[-200px] left-[-200px] pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-rose/15 blur-[120px] bottom-[-200px] right-[-200px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-up">

        {/* TOP BRANDING & GOLD CROWN HEADER */}
        <div className="text-center space-y-3">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-gold/40 animate-ping" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-gold-dark text-white flex items-center justify-center shadow-gold-glow border border-gold">
              <Crown className="w-9 h-9" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 bg-gold/15 text-gold-dark border border-gold/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-1.5 shadow-sm">
              <Terminal className="w-3 h-3" />
              <span>COMPANY SUPER ADMIN PORTAL</span>
            </div>
            <h1 className="font-black text-2xl tracking-tight text-tichi-text">Sakhi Suraksha SOS</h1>
            <p className="text-xs text-tichi-muted font-bold mt-1">
              Authorized HQ Personnel & Dispatch Officers Only
            </p>
          </div>
        </div>

        {/* ONE-CLICK DEMO FILL BUTTON FOR COMPANY SUPER ADMIN */}
        <button
          type="button"
          onClick={fillAdminCredentials}
          className="w-full bg-white border border-gold/50 text-gold-dark p-3 rounded-2xl text-xs font-black transition-all hover:bg-gold/10 active:scale-98 shadow-sm flex items-center justify-center space-x-2"
        >
          <Crown className="w-4 h-4" />
          <span>FILL COMPANY SUPER ADMIN CREDENTIALS</span>
        </button>

        {/* ADMIN LOGIN GLASS CARD */}
        <div className="glass-card rounded-3xl p-6 shadow-xl border border-gold/40 space-y-5 relative bg-white">

          {/* ERROR ALERT */}
          {(localError || error) && (
            <div className="bg-emergency-bg border border-emergency text-emergency-dark text-xs font-bold p-3.5 rounded-xl flex items-center space-x-2 animate-bounce">
              <span>🚨</span>
              <span>{localError || error}</span>
            </div>
          )}

          <form onSubmit={handleAdminSubmit} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="block text-xs font-extrabold text-gold-dark uppercase tracking-wider mb-1.5">
                Super Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gold-dark absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="admin@sakhisuraksha.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gold/30 text-xs font-mono text-tichi-text placeholder-tichi-faint focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none bg-blush-subtle transition-all"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-extrabold text-gold-dark uppercase tracking-wider mb-1.5">
                Master HQ Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gold-dark absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gold/30 text-xs font-mono text-tichi-text placeholder-tichi-faint focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none bg-blush-subtle transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gold-dark hover:text-tichi-text transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gold via-gold-dark to-gold text-white font-black py-3.5 rounded-xl text-xs shadow-gold-glow hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 mt-2 uppercase tracking-wider"
            >
              <span>{isLoading ? 'AUTHENTICATING COMMAND CENTER...' : 'AUTHENTICATE SUPER ADMIN HQ'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* PRIVACY & SYSTEM NOTICE */}
          <div className="pt-2 text-center border-t border-blush-border space-y-1">
            <p className="text-[10px] text-tichi-muted">
              🔒 Dedicated Company URL: <span className="font-mono text-gold-dark font-bold">/admin/login</span>
            </p>
            <p className="text-[10px] text-tichi-muted">
              Strictly restricted to Sakhi Suraksha SOS Command Officers.
            </p>
          </div>
        </div>

        {/* PUBLIC APP LINK */}
        <div className="text-center">
          <Link to="/auth" className="text-xs text-rose hover:text-tichi-text font-bold transition-colors">
            ← Switch to Public User Login Page
          </Link>
        </div>

      </div>
    </div>
  );
};
