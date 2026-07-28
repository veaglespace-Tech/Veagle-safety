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
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Crown,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

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

  // Comprehensive Registration Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('https://ik.imagekit.io/m5ei0wbuw/avatar-woman-1.png');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('Not Specified');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [country, setCountry] = useState('India');
  const [pincode, setPincode] = useState('411001');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // OTP State
  const [otpCode, setOtpCode] = useState('');

  const dispatch = useDispatch();
  const router = useRouter();
  const { token, user, isLoading, error, successMessage, showOtpModal, pendingVerificationEmail } = useSelector(
    (state) => state?.auth || {}
  );

  useEffect(() => {
    if (token && user) {
      if (user.role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else if (user.subscriptionStatus !== 'ACTIVE') {
        router.push('/pricing');
      } else {
        router.push('/dashboard');
      }
    }
  }, [token, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthMessages());

    if (isLogin) {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(
        registerUser({
          fullName,
          email,
          phone,
          profilePhoto,
          bloodGroup,
          address: address || 'Not Specified',
          city: city || 'Pune',
          state: state || 'Maharashtra',
          country: country || 'India',
          pincode: pincode || '411001',
          emergencyContactName,
          emergencyContactPhone,
          medicalNotes,
          password,
        })
      );
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyEmailOtp({ email: pendingVerificationEmail || email, otp: otpCode }));
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
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                isLogin ? 'btn-baby-pink shadow-coral-glow' : 'text-tichi-muted hover:text-tichi-text'
              }`}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                !isLogin ? 'btn-baby-pink shadow-coral-glow' : 'text-tichi-muted hover:text-tichi-text'
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>

          {/* ERROR / SUCCESS NOTIFICATIONS */}
          {error && (
            <div className="bg-rose/10 border border-rose text-rose p-4 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
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
            
            {!isLogin && (
              <>
                {/* SECTION 1: PERSONAL DETAILS */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-black text-rose uppercase tracking-wider block">Section 1: Personal Details</span>
                  
                  <div>
                    <label className="block text-tichi-muted font-bold mb-1">Full Name *</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Priya Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 input-antique-pink"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-tichi-muted font-bold mb-1">Mobile Number *</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 input-antique-pink"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-tichi-muted font-bold mb-1">Blood Group</label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-4 py-3 input-antique-pink font-bold"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: ADDRESS & EMERGENCY CONTACT */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-black text-rose uppercase tracking-wider block">Section 2: City & Emergency Contact</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-tichi-muted font-bold mb-1">City / Region</label>
                      <input
                        type="text"
                        placeholder="Pune"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 input-antique-pink"
                      />
                    </div>

                    <div>
                      <label className="block text-tichi-muted font-bold mb-1">Pincode</label>
                      <input
                        type="text"
                        placeholder="411001"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-4 py-3 input-antique-pink font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-tichi-muted font-bold mb-1">Guardian Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="Rajesh Sharma (Father)"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        className="w-full px-4 py-3 input-antique-pink"
                      />
                    </div>

                    <div>
                      <label className="block text-tichi-muted font-bold mb-1">Guardian Phone (Optional)</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 00000"
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        className="w-full px-4 py-3 input-antique-pink font-mono"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ACCOUNT CREDENTIALS */}
            <div className="space-y-3 pt-2">
              {!isLogin && (
                <span className="text-[10px] font-black text-rose uppercase tracking-wider block">Section 3: Login Credentials</span>
              )}

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

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-baby-pink py-4 text-xs font-black uppercase tracking-wider shadow-coral-glow flex items-center justify-center space-x-2 mt-4"
            >
              <span>{isLoading ? 'PROCESSING...' : isLogin ? 'SIGN IN TO DASHBOARD' : 'REGISTER & PROCEED'}</span>
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
                maxLength={6}
                required
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full py-4 text-center font-mono text-2xl font-black tracking-[0.5em] input-antique-pink focus:border-rose"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-baby-pink py-3.5 text-xs uppercase tracking-wider"
              >
                {isLoading ? 'VERIFYING CODE...' : 'VERIFY & PROCEED TO PLAN FORMALITIES'}
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
