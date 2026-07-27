import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar.jsx';
import {
  registerUser,
  loginUser,
  verifyEmailOtp,
  resendOtpCode,
  clearAuthMessages,
  setShowOtpModal,
} from '../store/slices/authSlice.js';
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

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? false : true;
  const [isLogin, setIsLogin] = useState(initialMode);

  // Comprehensive Registration Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('https://ik.imagekit.io/m5ei0wbuw/avatar-woman-1.png');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [pincode, setPincode] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // OTP State
  const [otpCode, setOtpCode] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, isLoading, error, successMessage, showOtpModal, pendingVerificationEmail } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (token && user) {
      if (user.role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else if (user.subscriptionStatus !== 'ACTIVE') {
        navigate('/pricing');
      } else {
        navigate('/');
      }
    }
  }, [token, user, navigate]);

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
          address,
          city,
          state,
          country,
          pincode,
          emergencyContactName,
          emergencyContactPhone,
          medicalNotes,
          password,
          role: 'USER',
        })
      );
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    dispatch(verifyEmailOtp({ email: pendingVerificationEmail || email, otp: otpCode }));
  };

  const handleResendOtp = () => {
    dispatch(resendOtpCode(pendingVerificationEmail || email));
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden">
      <PublicNavbar />

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10 space-y-6">

        {/* TOP BRANDING & INTERACTIVE SAFETY SHIELD MASCOT */}
        <div className="text-center space-y-3">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full border-2 border-rose/30 ${isLoading ? 'animate-ping' : 'animate-pulse'}`} />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose via-rose-light to-gold p-0.5 shadow-coral-glow flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Shield className="w-8 h-8 text-rose" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center space-x-2">
              <h1 className="font-black text-2xl tracking-tight text-tichi-text">Sakhi Suraksha SOS</h1>
              <span className="bg-rose/10 text-rose border border-rose/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">v2.0</span>
            </div>
            <p className="text-xs text-tichi-muted font-bold mt-0.5">
              Personal Safety & Emergency Companion
            </p>
          </div>
        </div>

        {/* MAIN CARD (CARD-ANTIQUE-PINK PORCELAIN CARD) */}
        <div className="card-antique-pink p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
          
          {/* TAB SWITCHER */}
          <div className="flex bg-blush-subtle p-1.5 rounded-2xl border border-[#FFCCE1] relative">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                dispatch(clearAuthMessages());
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                isLogin ? 'btn-baby-pink' : 'text-tichi-muted hover:text-tichi-text'
              }`}
            >
              SIGN IN
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                dispatch(clearAuthMessages());
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                !isLogin ? 'btn-baby-pink' : 'text-tichi-muted hover:text-tichi-text'
              }`}
            >
              CREATE ACCOUNT (SIGN UP)
            </button>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="bg-emergency-bg border border-emergency text-emergency-dark text-xs font-bold p-3.5 rounded-xl flex items-center space-x-2 animate-bounce">
              <span>🚨</span>
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS ALERT */}
          {successMessage && (
            <div className="bg-rose/10 border border-rose text-rose text-xs font-bold p-3.5 rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-rose shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {!isLogin ? (
              // COMPREHENSIVE SAFETY REGISTRATION FIELDS
              <div className="space-y-6 text-xs">
                
                {/* SECTION 1: PERSONAL IDENTITY & SECURITY */}
                <div className="space-y-3 bg-blush-subtle p-4 rounded-2xl border border-[#FFCCE1]">
                  <div className="flex items-center space-x-2 text-rose font-black uppercase text-[11px]">
                    <UserIcon className="w-4 h-4 text-rose" />
                    <span>Section 1: Personal Identity & Security</span>
                  </div>

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
                      <label className="block text-tichi-muted font-bold mb-1">Mobile Phone *</label>
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
                  </div>

                  <div>
                    <label className="block text-tichi-muted font-bold mb-1">Account Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 input-antique-pink"
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

                {/* SECTION 2: EMERGENCY PROFILE & HEALTH DATA */}
                <div className="space-y-3 bg-blush-subtle p-4 rounded-2xl border border-[#FFCCE1]">
                  <div className="flex items-center space-x-2 text-rose font-black uppercase text-[11px]">
                    <Heart className="w-4 h-4 text-rose" />
                    <span>Section 2: Emergency Guardian & Health Data</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-tichi-muted font-bold mb-1">Blood Group *</label>
                      <div className="relative">
                        <Heart className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <select
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 input-antique-pink"
                        >
                          <option value="O+">O Positive (O+)</option>
                          <option value="O-">O Negative (O-)</option>
                          <option value="A+">A Positive (A+)</option>
                          <option value="A-">A Negative (A-)</option>
                          <option value="B+">B Positive (B+)</option>
                          <option value="B-">B Negative (B-)</option>
                          <option value="AB+">AB Positive (AB+)</option>
                          <option value="AB-">AB Negative (AB-)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-tichi-muted font-bold mb-1">Profile Photo URL *</label>
                      <div className="relative">
                        <ImageIcon className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          required
                          placeholder="https://ik.imagekit.io/avatar.png"
                          value={profilePhoto}
                          onChange={(e) => setProfilePhoto(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 input-antique-pink"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PRIMARY GUARDIAN EMERGENCY CONTACT */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-rose font-bold mb-1">Primary Guardian / Contact Name</label>
                      <div className="relative">
                        <Users className="w-4 h-4 text-rose absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Mother / Father / Spouse Name"
                          value={emergencyContactName}
                          onChange={(e) => setEmergencyContactName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 input-antique-pink"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-rose font-bold mb-1">Guardian Emergency Phone</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-rose absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          placeholder="+91 98765 00000"
                          value={emergencyContactPhone}
                          onChange={(e) => setEmergencyContactPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 input-antique-pink"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-tichi-muted font-bold mb-1">Emergency Medical Notes / Allergies (Optional)</label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-tichi-muted absolute left-3.5 top-3" />
                      <textarea
                        rows={2}
                        placeholder="e.g. Asthma patient, Diabetic, Penicillin allergy (Optional for first responders)"
                        value={medicalNotes}
                        onChange={(e) => setMedicalNotes(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 input-antique-pink"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: RESIDENTIAL ADDRESS & LOCATION */}
                <div className="space-y-3 bg-blush-subtle p-4 rounded-2xl border border-[#FFCCE1]">
                  <div className="flex items-center space-x-2 text-rose font-black uppercase text-[11px]">
                    <MapPin className="w-4 h-4 text-rose" />
                    <span>Section 3: Location & Residential Dispatch Address</span>
                  </div>

                  <div>
                    <label className="block text-tichi-muted font-bold mb-1">Residential Address *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Flat No 402, Lotus Heights, MG Road"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 input-antique-pink"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-tichi-muted font-bold mb-1">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="Pune"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-2.5 input-antique-pink"
                      />
                    </div>

                    <div>
                      <label className="block text-tichi-muted font-bold mb-1">State *</label>
                      <input
                        type="text"
                        required
                        placeholder="Maharashtra"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full p-2.5 input-antique-pink"
                      />
                    </div>

                    <div>
                      <label className="block text-tichi-muted font-bold mb-1">Country *</label>
                      <input
                        type="text"
                        required
                        placeholder="India"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full p-2.5 input-antique-pink"
                      />
                    </div>

                    <div>
                      <label className="block text-rose font-bold mb-1">Pincode</label>
                      <input
                        type="text"
                        placeholder="411001"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full p-2.5 input-antique-pink"
                      />
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              // LOGIN FORM
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-tichi-muted font-bold mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 input-antique-pink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-tichi-muted font-bold mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3.5 input-antique-pink"
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
              disabled={isLoading}
              className="w-full btn-baby-pink py-4 text-xs uppercase tracking-wider shadow-coral-glow flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? 'PROCESSING FORMALITIES...' : isLogin ? 'SIGN IN' : 'REGISTER & PROCEED TO PLAN FORMALITIES'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

        </div>

      </div>

      {/* STEP 2: EMAIL OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="card-antique-pink p-6 sm:p-8 max-w-md w-full space-y-5 text-center shadow-2xl relative bg-white">
            
            <div className="w-16 h-16 rounded-2xl bg-rose/10 border border-rose/30 text-rose flex items-center justify-center mx-auto shadow-coral-glow">
              <KeyRound className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-tichi-text">Enter Email Verification OTP</h3>
              <p className="text-xs text-tichi-muted">
                A 6-digit OTP code has been sent to <span className="text-rose font-bold">{pendingVerificationEmail || email}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
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
};
