import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, Mail, Phone, User, ArrowRight, CheckCircle } from 'lucide-react';

const SAFETY_FEATURES = [
  { icon: '🚨', text: 'One-tap emergency SOS' },
  { icon: '📍', text: 'Live GPS broadcasting' },
  { icon: '👥', text: 'Trusted contact alerts' },
  { icon: '🔔', text: 'Safety check-in timers' },
];

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const { login, register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    if (isLogin) {
      success = await login(email, password);
    } else {
      success = await register(fullName, email, phone, password);
    }
    if (success) navigate(isLogin ? '/' : '/onboarding');
  };

  return (
    <div className="min-h-screen bg-blush flex">

      {/* LEFT PANEL — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-plum flex-col justify-between p-10 relative overflow-hidden">
        {/* Abstract decorative background circles */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-40px] w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.03] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center space-x-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Shield className="w-5 h-5 text-rose" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-lg tracking-tight leading-none">Tichi Suraksha</h1>
            <p className="text-rose/70 text-[11px] font-semibold tracking-wide">Personal Safety Platform</p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="space-y-6 relative z-10">
          <div>
            <p className="text-rose/60 text-xs font-bold uppercase tracking-widest mb-2">Your safety. Your control.</p>
            <h2 className="font-extrabold text-4xl text-white leading-tight tracking-tight">
              Safety that<br />
              <span className="text-rose">never sleeps.</span>
            </h2>
            <p className="text-white/60 text-sm mt-4 leading-relaxed max-w-sm">
              A modern personal safety companion designed for every woman. Always on, always ready, always private.
            </p>
          </div>

          <div className="space-y-3">
            {SAFETY_FEATURES.map((f) => (
              <div key={f.text} className="flex items-center space-x-3">
                <span className="text-base">{f.icon}</span>
                <span className="text-white/80 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-white/30 text-xs font-medium relative z-10">
          Trusted by women across India • Privacy-first
        </p>
      </div>

      {/* RIGHT PANEL — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-sm space-y-6">

          {/* Mobile Brand Header */}
          <div className="lg:hidden text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-plum shadow-plum-lg flex items-center justify-center mx-auto">
              <Shield className="w-7 h-7 text-rose" />
            </div>
            <h1 className="font-extrabold text-2xl text-plum tracking-tight">Tichi Suraksha</h1>
            <p className="text-xs text-tichi-muted">Your personal safety companion</p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-blush-border rounded-2xl shadow-plum-md overflow-hidden">

            {/* Tab Switcher */}
            <div className="flex border-b border-blush-border">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3.5 text-xs font-extrabold transition-all border-b-2 ${
                  isLogin
                    ? 'border-plum text-plum bg-blush-subtle'
                    : 'border-transparent text-tichi-muted hover:text-plum hover:bg-blush-subtle/50'
                }`}
              >
                SIGN IN
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3.5 text-xs font-extrabold transition-all border-b-2 ${
                  !isLogin
                    ? 'border-plum text-plum bg-blush-subtle'
                    : 'border-transparent text-tichi-muted hover:text-plum hover:bg-blush-subtle/50'
                }`}
              >
                CREATE ACCOUNT
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              {/* Error Alert */}
              {error && (
                <div className="bg-emergency-bg border border-emergency-border text-tichi-emergency text-xs font-semibold p-3 rounded-xl">
                  ⚠ {error}
                </div>
              )}

              {/* Full Name */}
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-tichi-text mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-tichi-faint absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Priya Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-control border border-blush-border text-sm focus:ring-2 focus:ring-plum focus:border-transparent focus:outline-none bg-blush-subtle transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-tichi-text mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-tichi-faint absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="priya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-control border border-blush-border text-sm focus:ring-2 focus:ring-plum focus:border-transparent focus:outline-none bg-blush-subtle transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-tichi-text mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-tichi-faint absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-control border border-blush-border text-sm focus:ring-2 focus:ring-plum focus:border-transparent focus:outline-none bg-blush-subtle transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-tichi-text mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-tichi-faint absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-10 py-2.5 rounded-control border border-blush-border text-sm focus:ring-2 focus:ring-plum focus:border-transparent focus:outline-none bg-blush-subtle transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-tichi-faint hover:text-plum transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-plum text-white font-extrabold py-3.5 rounded-card text-sm shadow-plum-md hover:bg-plum-dark transition-all flex items-center justify-center space-x-2 disabled:opacity-60 active:scale-[0.98] mt-1"
              >
                <span>{isLoading ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>

          {/* Demo Credentials */}
          <div className="bg-plum/5 border border-plum/15 rounded-xl p-4 text-center space-y-1">
            <div className="flex items-center justify-center space-x-1.5 mb-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-plum" />
              <p className="text-xs font-extrabold text-plum uppercase tracking-wide">Demo Access Ready</p>
            </div>
            <p className="text-[11px] text-tichi-muted font-mono">priya@tichisuraksha.org</p>
            <p className="text-[11px] text-tichi-muted font-mono">Password: Priya123!</p>
          </div>

          {/* Privacy note */}
          <p className="text-center text-[10px] text-tichi-faint">
            🔒 Your data is encrypted and never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};
