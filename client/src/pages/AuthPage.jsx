import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, Mail, Phone, User as UserIcon, ArrowRight, ShieldCheck, Crown } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('USER');
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
      success = await register(fullName, email, phone, password, selectedRole);
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

  const setDemoUser = (type) => {
    if (type === 'GIRL') {
      setEmail('priya@tichisuraksha.org');
      setPassword('Priya123!');
      setIsLogin(true);
    } else {
      setEmail('admin@tichisuraksha.org');
      setPassword('Admin123!');
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen auth-mesh-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="auth-mesh-glow-1" />
      <div className="auth-mesh-glow-2" />

      <div className="w-full max-w-md relative z-10 space-y-5 animate-fade-up">
        <div className="text-center space-y-3">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full border-2 border-rose/30 ${isLoading ? 'animate-ping' : 'animate-pulse'}`} />
            <div className="absolute -inset-3 rounded-full border border-gold/20 animate-spin-slow" style={{ animationDuration: '15s' }} />

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
              <span className="bg-gold/20 text-gold border border-gold/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">v2.0</span>
            </div>
            <p className="text-xs text-rose-muted font-medium mt-0.5">
              Modern & Antique Personal Safety Platform
            </p>
          </div>
        </div>

        <div className="bg-plum-dark/80 backdrop-blur-md border border-rose/30 p-2 rounded-2xl grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setDemoUser('GIRL')}
            className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all active:scale-95 border border-white/10"
          >
            <span>👧</span>
            <span className="truncate">Demo User (Priya)</span>
          </button>

          <button
            type="button"
            onClick={() => setDemoUser('ADMIN')}
            className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-gradient-to-r from-gold/20 to-gold/40 border border-gold/50 text-gold font-extrabold transition-all active:scale-95 shadow-gold-glow"
          >
            <Crown className="w-3.5 h-3.5" />
            <span className="truncate">Super Admin HQ</span>
          </button>
        </div>

        <div className="glass-card-dark rounded-3xl p-6 shadow-modal border border-gold/30 space-y-5 relative">
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

          {error && (
            <div className="bg-emergency-dark/80 border border-emergency text-white text-xs font-bold p-3 rounded-xl flex items-center space-x-2 animate-bounce">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5 animate-fade-up">
                <label className="block text-[11px] font-extrabold text-gold uppercase tracking-wider">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('USER')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedRole === 'USER'
                        ? 'bg-rose text-white border-rose shadow-coral-glow'
                        : 'bg-plum-dark/60 text-tichi-faint border-rose/20 hover:text-white'
                    }`}
                  >
                    👧 User (Girl / Woman)
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('SUPER_ADMIN')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedRole === 'SUPER_ADMIN'
                        ? 'bg-gold text-plum border-gold shadow-gold-glow font-black'
                        : 'bg-plum-dark/60 text-tichi-faint border-gold/20 hover:text-gold'
                    }`}
                  >
                    👑 Super Admin
                  </button>
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="animate-fade-up">
                <label className="block text-xs font-bold text-white mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-rose/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Priya Sharma"
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

            <div>
              <label className="block text-xs font-bold text-white mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-rose/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="priya@tichisuraksha.org"
                  value={email}
                  onFocus={() => setInputFocused('EMAIL')}
                  onBlur={() => setInputFocused('NONE')}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-rose/30 text-xs font-medium text-white placeholder-rose-muted/40 focus:ring-2 focus:ring-rose focus:border-rose focus:outline-none bg-plum-dark/70 transition-all"
                />
              </div>
            </div>

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

        <div className="text-center space-y-1">
          <div className="inline-flex items-center space-x-1.5 bg-plum-dark/60 border border-gold/20 px-3 py-1 rounded-full text-[10px] text-gold font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-Bit Encrypted Safety Network • Strict Privacy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
