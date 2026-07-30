'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PublicNavbar } from '../../components/layout/PublicNavbar.js';
import {
  registerUser,
  loginUser,
  verifyEmailOtp,
  resendOtpCode,
  clearAuthMessages,
  setShowOtpModal,
} from '../../redux/slices/authSlice.js';
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  MapPin,
  Heart,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Building,
  Map,
} from 'lucide-react';

function UserAuthForm() {
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (searchParams && searchParams.get('mode') === 'register') {
      setIsLogin(false);
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

  const dispatch = useDispatch();
  const router = useRouter();
  const { token, user, registrationToken, pendingToken, isLoading, error, successMessage, showOtpModal, pendingVerificationEmail } = useSelector(
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

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden flex flex-col">
      <PublicNavbar />

      {/* BACKGROUND AMBIENT GLOW MESHES */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-rose/15 blur-[150px] top-[-100px] left-[-200px] pointer-events-none" />
      <div className="absolute w-[700px] h-[700px] rounded-full bg-gold/15 blur-[150px] bottom-[100px] right-[-200px] pointer-events-none" />

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-xl card-antique-pink p-8 sm:p-10 space-y-6">
          
          {/* HEADER EMBLEM & BRAND */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose via-rose-light to-gold p-0.5 mx-auto shadow-coral-glow">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Shield className="w-7 h-7 text-rose" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-tichi-text">Sakhi Suraksha SOS</h1>
            <p className="text-xs font-bold text-tichi-muted">
              {isLogin ? 'Welcome back! Sign in to access your safety dashboard.' : 'Create your account & unlock 365-day safety protection.'}
            </p>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex bg-blush-subtle p-1.5 rounded-2xl border border-[#FFCCE1]">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setValidationError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                isLogin ? 'btn-baby-pink shadow-coral-glow' : 'text-tichi-muted hover:text-tichi-text'
              }`}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setValidationError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                !isLogin ? 'btn-baby-pink shadow-coral-glow' : 'text-tichi-muted hover:text-tichi-text'
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>

          {/* ERROR / VALIDATION / SUCCESS NOTIFICATIONS */}
          {(validationError || error) && (
            <div className="bg-rose/10 border border-rose text-rose p-4 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError || error}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-tichi-success/10 border border-tichi-success text-tichi-success p-4 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-up">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* AUTH FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
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

          </form>

        </div>
      </div>

      {/* EMAIL OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md card-antique-pink p-8 space-y-5 border-2 border-rose shadow-coral-glow animate-fade-up">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose/15 text-rose flex items-center justify-center mx-auto border border-rose/30">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-tichi-text">Verify Email Address</h3>
              <p className="text-xs text-tichi-muted font-bold">
                Enter the 6-digit OTP code sent to <span className="font-mono text-rose">{pendingVerificationEmail || email}</span>.
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
                style={{
                  userSelect: 'text',
                  WebkitUserSelect: 'text',
                  pointerEvents: 'auto',
                  cursor: 'text',
                }}
                className="w-full px-4 py-5 text-center font-mono text-3xl font-black tracking-[0.4em] input-antique-pink focus:border-rose"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-baby-pink py-3.5 text-xs uppercase tracking-wider"
              >
                {isLoading ? 'VERIFYING CODE...' : 'VERIFY & PROCEED TO PRICING PLAN'}
              </button>
            </form>

            <div className="pt-2 flex justify-between text-xs">
              <button onClick={handleResendOtp} className="text-rose hover:underline font-bold">
                Resend OTP Code
              </button>

              <button onClick={() => dispatch(setShowOtpModal(false))} className="text-tichi-muted hover:text-tichi-text">
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
    <Suspense fallback={<div className="min-h-screen bg-[#FFF0F3] flex items-center justify-center font-bold text-rose">Loading Sakhi Suraksha Auth...</div>}>
      <UserAuthForm />
    </Suspense>
  );
}
