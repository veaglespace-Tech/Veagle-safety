import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, Mail, Phone, User as UserIcon, ArrowRight, ShieldCheck, Crown } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [inputFocused, setInputFocused] = useState('NONE');

  const { login, register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    if (isLogin) {
      success = await login(email, password);
    } else {
      success = await register(fullName, email, phone, password, 'USER');
    }
    if (success) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen auth-mesh-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animated Glow Meshes */}
      <div className="auth-mesh-glow-1" />
      <div className="auth-mesh-glow-2" />

      <div className="w-full max-w-md relative z-10 space-y-5 animate-fade-up">

        {/* TOP BRANDING & INTERACTIVE SAFETY SHIELD MASCOT */}
        <div className="text-center space-y-3">
          {/* ANIMATED INTERACTIVE MASCOT SHIELD */}
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            {/* Outer radar pulse rings */}
            <div className={`absolute inset-0 rounded-full border-2 border-rose/30 ${isLoading ? 'animate-ping' : 'animate-pulse'}`} />
            <div className="absolute -inset-3 rounded-full border border-gold/20 animate-spin-slow" style={{ animationDuration: '15s' }} />

            {/* Glowing Shield Base */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-plum to-plum-dark border-2 transition-all duration-300 shadow-coral-glow flex flex-col items-center justify-center relative ${
              inputFocused === 'PASS'
                ? 'border-gold scale-95 shadow-gold-glow'
                : inputFocused === 'EMAIL' || inputFocused === 'NAME'
                ? 'border-rose scale-105'
                : 'border-rose/50'
            }`}>
              <Shield className={`w-9 h-9 transition-all duration-300 ${
                inputFocused === 'PASS' ? 'text-gold fill-gold/20' : 'text-rose fill-rose/20 animate-pulse'
              }`} />

              {/* Eye/Visor Micro Animations inside Shield */}
              <div className="flex items-center space-x-2 mt-1">
                {inputFocused === 'PASS' && !showPass ? (
                  <div className="text-[10px] font-bold text-gold tracking-widest animate-pulse">🔒 LOCKED</div>
                ) : (
                  <div className="flex space-x-1.5 items-center">
                    <span className={`w-1.5 h-1.5 rounded-full ${inputFocused === 'EMAIL' ? 'bg-gold translate-x-0.5' : 'bg-white'} transition-transform`} />
                    <span className={`w-1.5 h-1.5 rounded-full ${inputFocused === 'EMAIL' ? 'bg-gold translate-x-0.5' : 'bg-white'} transition-transform`} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center space-x-2">
              <h1 className="font-black text-2xl tracking-tight text-white">Tichi Suraksha</h1>
              <span className="bg-rose/20 text-rose border border-rose/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">v2.0</span>
            </div>
            <p className="text-xs text-rose-muted font-medium mt-0.5">
              Personal Safety & Emergency Companion
            </p>
          </div>
        </div>

        {/* MAIN AUTH GLASS CARD WITH TAB SLIDER */}
        <div className="glass-card-dark rounded-3xl p-6 shadow-modal border border-rose/30 space-y-5 relative">

          {/* TAB SWITCHER */}
          <div className="flex bg-plum-dark p-1.5 rounded-2xl border border-rose/20 relative">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all relative z-10 ${
                isLogin ? 'text-white shadow-coral-glow' : 'text-tichi-faint hover:text-white'
              }`}
            >
              {isLogin && (
                <div className="absolute inset-0 bg-gradient-to-r from-rose to-plum-light rounded-xl -z-10 animate-scale-in" />
              )}
              SIGN IN
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all relative z-10 ${
                !isLogin ? 'text-white shadow-coral-glow' : 'text-tichi-faint hover:text-white'
              }`}
            >
              {!isLogin && (
                <div className="absolute inset-0 bg-gradient-to-r from-rose to-plum-light rounded-xl -z-10 animate-scale-in" />
              )}
              CREATE ACCOUNT
            </button>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="bg-emergency-dark/80 border border-emergency text-white text-xs font-bold p-3 rounded-xl flex items-center space-x-2 animate-bounce">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* FORM FIELDS */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* FULL NAME */}
            {!isLogin && (
              <div className="animate-fade-up">
                <label className="block text-xs font-bold text-white mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-rose/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onFocus={() => setInputFocused('NAME')}
                    onBlur={() => setInputFocused('NONE')}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-rose/30 text-xs font-medium text-white placeholder-rose-muted/40 focus:ring-2 focus:ring-rose focus:border-rose focus:outline-none bg-plum-dark/70 transition-all"
                  />
                </div>
              </div>
            )}

            {/* EMAIL ADDRESS */}
            <div>
              <label className="block text-xs font-bold text-white mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-rose/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onFocus={() => setInputFocused('EMAIL')}
                  onBlur={() => setInputFocused('NONE')}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-rose/30 text-xs font-medium text-white placeholder-rose-muted/40 focus:ring-2 focus:ring-rose focus:border-rose focus:outline-none bg-plum-dark/70 transition-all"
                />
              </div>
            </div>

            {/* MOBILE NUMBER */}
            {!isLogin && (
              <div className="animate-fade-up">
                <label className="block text-xs font-bold text-white mb-1">Mobile Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-rose/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onFocus={() => setInputFocused('PHONE')}
                    onBlur={() => setInputFocused('NONE')}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-rose/30 text-xs font-medium text-white placeholder-rose-muted/40 focus:ring-2 focus:ring-rose focus:border-rose focus:outline-none bg-plum-dark/70 transition-all"
                  />
                </div>
              </div>
            )}

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-bold text-white mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-rose/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onFocus={() => setInputFocused('PASS')}
                  onBlur={() => setInputFocused('NONE')}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-rose/30 text-xs font-medium text-white placeholder-rose-muted/40 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none bg-plum-dark/70 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-rose/70 hover:text-gold transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON WITH NEON GLOW */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose to-plum-light text-white font-extrabold py-3.5 rounded-xl text-xs shadow-coral-glow hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 mt-2"
            >
              <span>{isLoading ? 'VERIFYING SECURITY...' : isLogin ? 'SIGN IN TO DASHBOARD' : 'CREATE PROTECTED ACCOUNT'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* FOOTER & DEDICATED SUPER ADMIN PORTAL LINK */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-plum-dark/60 border border-rose/20 px-3 py-1 rounded-full text-[10px] text-rose-muted font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-rose" />
            <span>256-Bit Encrypted Safety Network • Strict Privacy</span>
          </div>

          <div>
            <Link
              to="/admin/login"
              className="inline-flex items-center space-x-1 text-[11px] text-gold/80 hover:text-gold font-bold transition-colors"
            >
              <Crown className="w-3 h-3 text-gold" />
              <span>Company Super Admin Portal →</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
