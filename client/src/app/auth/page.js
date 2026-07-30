'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { PublicNavbar } from '../../components/layout/PublicNavbar.js';
import { Logo3DFlip } from '../../components/ui/Logo3DFlip.js';
import {
  registerUser,
  loginUser,
  verifyEmailOtp,
  resendOtpCode,
  clearAuthMessages,
  setShowOtpModal,
} from '../../redux/slices/authSlice.js';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  UserPlus,
  Heart,
  ArrowRight,
<<<<<<< HEAD
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Building,
  Map,
=======
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Zap,
>>>>>>> ede48e2d317563faf48fc363e9034fc305157350
} from 'lucide-react';

function UserAuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (searchParams && searchParams.get('mode') === 'register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

  // Clean Registration Fields State (No pre-filled defaults)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Client validation error state
  const [validationError, setValidationError] = useState('');

  // OTP State
  const [otpCode, setOtpCode] = useState('');

<<<<<<< HEAD
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, user, registrationToken, pendingToken, isLoading, error, successMessage, showOtpModal, pendingVerificationEmail } = useSelector(
=======
  const { token, user, isLoading, error, successMessage, showOtpModal, pendingVerificationEmail } = useSelector(
>>>>>>> ede48e2d317563faf48fc363e9034fc305157350
    (state) => state?.auth || {}
  );

  const [wasOtpModalOpened, setWasOtpModalOpened] = useState(false);

  useEffect(() => {
    if (showOtpModal) {
      setWasOtpModalOpened(true);
    }
  }, [showOtpModal]);

  useEffect(() => {
    if (wasOtpModalOpened && !showOtpModal && registrationToken) {
      router.push('/pricing');
    }
  }, [wasOtpModalOpened, showOtpModal, registrationToken, router]);

  useEffect(() => {
    if (token && user) {
      if (user.role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else if (user.subscriptionStatus === 'ACTIVE') {
        router.push('/dashboard');
      }
    }
  }, [token, user, router]);

<<<<<<< HEAD
  const validateForm = () => {
    setValidationError('');

    if (isLogin) {
      if (!email || !password) {
        setValidationError('Email and Password are required.');
        return false;
      }
      return true;
    }

    // Comprehensive Registration Validation
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !bloodGroup ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim() ||
      !emergencyContactName.trim() ||
      !emergencyContactPhone.trim()
    ) {
      setValidationError('Please fill in all required fields marked with *.');
      return false;
    }

    // Email Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setValidationError('Please enter a valid email address.');
      return false;
    }

    // Indian 10-Digit Phone Regex
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setValidationError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return false;
    }

    const cleanGuardianPhone = emergencyContactPhone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanGuardianPhone)) {
      setValidationError('Please enter a valid 10-digit mobile number for Guardian Emergency Contact.');
      return false;
    }

    // 6-Digit Pincode Regex
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode.trim())) {
      setValidationError('Please enter a valid 6-digit Pincode.');
      return false;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return false;
    }

    return true;
=======
  const toggleMode = (loginMode) => {
    setIsLogin(loginMode);
    dispatch(clearAuthMessages());
    router.push(loginMode ? '/auth?mode=login' : '/auth?mode=register', { scroll: false });
>>>>>>> ede48e2d317563faf48fc363e9034fc305157350
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthMessages());

    if (!validateForm()) return;

    if (isLogin) {
      dispatch(loginUser({ email: email.trim(), password }));
    } else {
      dispatch(
        registerUser({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.replace(/\D/g, ''),
          bloodGroup,
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          country: 'India',
          pincode: pincode.trim(),
          emergencyContactName: emergencyContactName.trim(),
          emergencyContactPhone: emergencyContactPhone.replace(/\D/g, ''),
          password,
        })
      );
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setValidationError('Please enter full 6-digit OTP code.');
      return;
    }
    const currentPendingToken = pendingToken || (typeof window !== 'undefined' ? localStorage.getItem('tichi_pending_token') : null);
    dispatch(verifyEmailOtp({ email: pendingVerificationEmail || email, otp: otpCode, pendingToken: currentPendingToken }));
  };

  const handleResendOtp = () => {
    dispatch(resendOtpCode({ email: pendingVerificationEmail || email }));
  };

  const handleQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsLogin(true);
    dispatch(clearAuthMessages());
    dispatch(loginUser({ email: demoEmail, password: demoPass }));
  };

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#FFF0F3] text-[#2A0826] font-sans relative overflow-hidden flex flex-col">
      <PublicNavbar />

      {/* BACKGROUND ANIMATED AMBIENT GLOW MESHES */}
      <div className="absolute w-[800px] h-[800px] rounded-full bg-[#FF5C8A]/15 blur-[170px] top-[-120px] left-[-220px] pointer-events-none animate-pulse" />
      <div className="absolute w-[750px] h-[750px] rounded-full bg-[#FFCCE1]/30 blur-[160px] bottom-[40px] right-[-200px] pointer-events-none animate-pulse" />

      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-14 relative z-10">
        <div className="w-full max-w-xl bg-white/95 backdrop-blur-2xl border-1.5 border-[#FFCCE1] rounded-3xl p-6 sm:p-10 space-y-6 shadow-[0_20px_60px_rgba(255,92,138,0.20)] hover:shadow-[0_24px_70px_rgba(255,42,109,0.28)] transition-all duration-500 relative overflow-hidden">
          
          {/* TOP DECORATIVE ACCENT STRIP */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] rounded-t-3xl" />

          {/* ANIMATED TOP HEADER LUCIDE ICON EMBLEM & BRAND - PERFECTLY CENTERED */}
          <div className="flex flex-col items-center justify-center text-center space-y-3 pt-2">
            {/* ROTATING LOGO EMBLEM CENTERED */}
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-3 rounded-2xl bg-[#FF5C8A]/20 animate-pulse blur-lg" />
              <div className="relative z-10 p-3 rounded-2xl bg-gradient-to-br from-[#FFF0F3] via-[#FFE6EE] to-[#FFCCE1] border-1.5 border-[#FFCCE1] shadow-md flex items-center justify-center">
                <Logo3DFlip size={52} />
              </div>
            </div>

            {/* DYNAMIC BADGE — LOCK FOR SIGN IN, USERPLUS FOR REGISTER */}
            <div className="inline-flex items-center space-x-1.5 bg-[#FFF0F3] border border-[#FFCCE1] px-4 py-1.5 rounded-full text-[10px] font-black text-[#FF2A6D] uppercase tracking-widest shadow-sm mt-1">
              {isLogin
                ? <Lock className="w-3.5 h-3.5 text-[#FF5C8A]" />
                : <UserPlus className="w-3.5 h-3.5 text-[#FF5C8A]" />
              }
              <span>24/7 Encrypted Sakhi Safety</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#2A0826] tracking-tight pt-1">
              Sakhi Suraksha <span className="text-[#FF2A6D]">SOS</span>
            </h1>
            <p className="text-xs font-bold text-[#684E67] max-w-md mx-auto leading-relaxed">
              {isLogin
                ? 'Welcome back! Sign in to access your live protection dashboard & guardian emergency alerts.'
                : 'Create your account & unlock instant 365-day women safety dispatch.'}
            </p>
          </div>

          {/* SLIDING ANIMATED TAB SWITCHER */}
          <div className="flex bg-[#FFF0F3] p-1.5 rounded-2xl border-1.5 border-[#FFCCE1] shadow-inner relative">
            <button
              type="button"
<<<<<<< HEAD
              onClick={() => { setIsLogin(true); setValidationError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                isLogin ? 'btn-baby-pink shadow-coral-glow' : 'text-tichi-muted hover:text-tichi-text'
=======
              onClick={() => toggleMode(true)}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center space-x-2 ${
                isLogin
                  ? 'bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white shadow-[0_4px_16px_rgba(255,42,109,0.35)] scale-[1.02]'
                  : 'text-[#684E67] hover:text-[#2A0826]'
>>>>>>> ede48e2d317563faf48fc363e9034fc305157350
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>SIGN IN</span>
            </button>
            <button
              type="button"
<<<<<<< HEAD
              onClick={() => { setIsLogin(false); setValidationError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                !isLogin ? 'btn-baby-pink shadow-coral-glow' : 'text-tichi-muted hover:text-tichi-text'
=======
              onClick={() => toggleMode(false)}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center space-x-2 ${
                !isLogin
                  ? 'bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white shadow-[0_4px_16px_rgba(255,42,109,0.35)] scale-[1.02]'
                  : 'text-[#684E67] hover:text-[#2A0826]'
>>>>>>> ede48e2d317563faf48fc363e9034fc305157350
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>CREATE ACCOUNT</span>
            </button>
          </div>

<<<<<<< HEAD
          {/* ERROR / VALIDATION / SUCCESS NOTIFICATIONS */}
          {(validationError || error) && (
            <div className="bg-rose/10 border border-rose text-rose p-4 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError || error}</span>
=======
          {/* ERROR / SUCCESS NOTIFICATIONS */}
          {error && (
            <div className="bg-[#FFF0F3] border-1.5 border-[#FF2A6D] text-[#FF2A6D] p-4 rounded-2xl text-xs font-black flex items-center space-x-2 animate-bounce shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#FF2A6D]" />
              <span>{error}</span>
>>>>>>> ede48e2d317563faf48fc363e9034fc305157350
            </div>
          )}

          {successMessage && (
            <div className="bg-[#E8F8F0] border-1.5 border-[#00C853] text-[#00C853] p-4 rounded-2xl text-xs font-black flex items-center space-x-2 shadow-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00C853]" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* AUTH FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
<<<<<<< HEAD
            {!isLogin ? (
              <div className="space-y-4">
                
                {/* FULL NAME */}
                <div>
                  <label className="block text-tichi-muted font-bold mb-1">Full Name *</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 input-antique-pink"
                    />
                  </div>
                </div>

                {/* EMAIL & MOBILE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-tichi-muted font-bold mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
=======
            {!isLogin && (
              <>
                {/* SECTION 1: PERSONAL DETAILS */}
                <div className="space-y-3 pt-2 border-t border-[#FFCCE1]">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#FF2A6D]" />
                    <span className="text-[11px] font-black text-[#FF2A6D] uppercase tracking-wider">
                      Section 1: Personal Profile
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-[#684E67] font-extrabold mb-1">Full Name *</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-[#684E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
>>>>>>> ede48e2d317563faf48fc363e9034fc305157350
                      <input
                        type="email"
                        required
<<<<<<< HEAD
                        placeholder="priya@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 input-antique-pink"
=======
                        placeholder="Priya Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-[#2A0826] font-bold focus:border-[#FF2A6D] focus:bg-white transition-all outline-none"
>>>>>>> ede48e2d317563faf48fc363e9034fc305157350
                      />
                    </div>
                  </div>

<<<<<<< HEAD
                  <div>
                    <label className="block text-tichi-muted font-bold mb-1">Mobile Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-10 pr-4 py-3 input-antique-pink font-mono"
=======
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#684E67] font-extrabold mb-1">Mobile Number *</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#684E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-[#2A0826] font-bold focus:border-[#FF2A6D] focus:bg-white transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#684E67] font-extrabold mb-1">Blood Group</label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-[#2A0826] font-bold focus:border-[#FF2A6D] focus:bg-white transition-all outline-none"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: ADDRESS & EMERGENCY CONTACT */}
                <div className="space-y-3 pt-2 border-t border-[#FFCCE1]">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-[#FF2A6D]" />
                    <span className="text-[11px] font-black text-[#FF2A6D] uppercase tracking-wider">
                      Section 2: Emergency Contacts
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#684E67] font-extrabold mb-1">City / Region</label>
                      <input
                        type="text"
                        placeholder="Pune"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-[#2A0826] font-bold focus:border-[#FF2A6D] focus:bg-white transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#684E67] font-extrabold mb-1">Pincode</label>
                      <input
                        type="text"
                        placeholder="411001"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-[#2A0826] font-mono font-bold focus:border-[#FF2A6D] focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#684E67] font-extrabold mb-1">Guardian Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="Rajesh Sharma (Father)"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-[#2A0826] font-bold focus:border-[#FF2A6D] focus:bg-white transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#684E67] font-extrabold mb-1">Guardian Phone (Optional)</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 00000"
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-xl text-[#2A0826] font-mono font-bold focus:border-[#FF2A6D] focus:bg-white transition-all outline-none"
>>>>>>> ede48e2d317563faf48fc363e9034fc305157350
                      />
                    </div>
                  </div>
                </div>

                {/* BLOOD GROUP & PASSWORD */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-tichi-muted font-bold mb-1">Blood Group *</label>
                    <select
                      required
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-4 py-3 input-antique-pink font-bold"
                    >
                      <option value="" disabled>Select Blood Group</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-tichi-muted font-bold mb-1">Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 input-antique-pink"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-tichi-muted hover:text-rose"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ADDRESS & CITY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-tichi-muted font-bold mb-1">Full Address *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="House no, Street area"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 input-antique-pink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-tichi-muted font-bold mb-1">City *</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pune"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 input-antique-pink"
                      />
                    </div>
                  </div>
                </div>

                {/* STATE & PINCODE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-tichi-muted font-bold mb-1">State *</label>
                    <div className="relative">
                      <Map className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maharashtra"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 input-antique-pink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-tichi-muted font-bold mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 411001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 input-antique-pink font-mono"
                    />
                  </div>
                </div>

                {/* EMERGENCY GUARDIAN CONTACT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-tichi-muted font-bold mb-1">Guardian Name *</label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Sharma"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 input-antique-pink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-tichi-muted font-bold mb-1">Guardian Mobile Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit number"
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-10 pr-4 py-3 input-antique-pink font-mono"
                      />
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* LOGIN FORM */
              <div className="space-y-4">
                <div>
                  <label className="block text-tichi-muted font-bold mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="priya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 input-antique-pink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-tichi-muted font-bold mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 input-antique-pink"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-tichi-muted hover:text-rose"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={mounted && isLoading}
              className="w-full btn-baby-pink py-4 text-xs font-black uppercase tracking-wider shadow-coral-glow flex items-center justify-center space-x-2 mt-6"
            >
              <span>{(mounted && isLoading) ? 'PROCESSING...' : isLogin ? 'SIGN IN TO DASHBOARD' : 'REGISTER & PROCEED TO OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            </button>

          </form>


        </div>
      </div>

      {/* EMAIL OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-[#2A0826]/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 space-y-5 border-2 border-[#FF2A6D] shadow-[0_20px_60px_rgba(255,42,109,0.35)] animate-fade-up relative">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF0F3] text-[#FF2A6D] flex items-center justify-center mx-auto border border-[#FFCCE1]">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-[#2A0826]">Verify Email Address</h3>
              <p className="text-xs text-[#684E67] font-bold">
                Enter the 6-digit OTP code sent to <span className="font-mono text-[#FF2A6D] font-black">{pendingVerificationEmail || email}</span>.
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                autoFocus
                autoComplete="one-time-code"
                placeholder="• • • • • •"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-4 text-center font-mono text-3xl font-black tracking-[0.4em] bg-[#FFF0F3] border-2 border-[#FFCCE1] focus:border-[#FF2A6D] rounded-2xl outline-none"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-3d-rose-pop py-3.5 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                {isLoading ? 'VERIFYING CODE...' : 'VERIFY & PROCEED TO PRICING PLAN'}
              </button>
            </form>

            <div className="pt-2 flex justify-between text-xs font-extrabold">
              <button onClick={handleResendOtp} className="text-[#FF2A6D] hover:underline cursor-pointer">
                Resend OTP Code
              </button>

              <button onClick={() => dispatch(setShowOtpModal(false))} className="text-[#684E67] hover:text-[#2A0826] cursor-pointer">
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function UserAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF0F3] flex items-center justify-center font-black text-[#FF2A6D]">Loading Sakhi Suraksha Auth...</div>}>
      <UserAuthForm />
    </Suspense>
  );
}
