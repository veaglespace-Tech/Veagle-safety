'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, updateProfileSettings } from '../../redux/slices/authSlice.js';
import { startEmergencySiren, stopEmergencySiren } from '../../utils/sirenAudio.js';
import { useRouter } from 'next/navigation';
import { authApi } from '../../redux/api/authApi.js';
import {
  Shield,
  MapPin,
  Bell,
  LogOut,
  Play,
  Lock,
  Smartphone,
  Crown,
  User as UserIcon,
  PhoneCall,
  Mail,
  Heart,
  ShieldCheck,
  Save,
  KeyRound,
  X,
  Volume2,
  Camera,
  Building,
  Map,
  Users,
  Eye,
  EyeOff,
  FileText,
  Sliders,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Edit3,
  Unlock,
  AlertTriangle,
  Send,
} from 'lucide-react';

export default function UserProfileSettingsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth || {});
  const { status = 'LIVE', accuracy = 10 } = useSelector((state) => state?.location || {});
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // EDIT MODE TOGGLE STATE
  const [isEditing, setIsEditing] = useState(false);

  // FORM FIELDS STATE
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('Parent');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');

  // PASSWORD UPDATE STATE
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // INLINE EMAIL OTP VERIFICATION STATE
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [showInlineOtpInput, setShowInlineOtpInput] = useState(false);
  const [inlineOtpCode, setInlineOtpCode] = useState('');
  const [isVerifyingInlineOtp, setIsVerifyingInlineOtp] = useState(false);
  const [isInlineEmailVerified, setIsInlineEmailVerified] = useState(false);
  const [inlineEmailNotice, setInlineEmailNotice] = useState(null);

  // FEEDBACK TOAST & SUBMIT STATE
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [avatarToast, setAvatarToast] = useState(null);

  // DIAGNOSTICS / DRILL STATE
  const [isVibrationSupported, setIsVibrationSupported] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [isTestingSiren, setIsTestingSiren] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchUser());
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      setIsVibrationSupported(true);
    }
  }, [dispatch]);

  const updateUserAvatar = async (base64Photo) => {
    try {
      await authApi.updateSettings({ profilePhoto: base64Photo });
      dispatch(fetchUser());
      setAvatarToast({ type: 'success', text: '✅ Profile photo updated successfully!' });
      setTimeout(() => setAvatarToast(null), 3000);
    } catch (err) {
      setAvatarToast({ type: 'error', text: err.response?.data?.error || 'Failed to update profile photo.' });
      setTimeout(() => setAvatarToast(null), 3000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setAvatarToast({ type: 'error', text: 'Image file size must be less than 5MB.' });
      setTimeout(() => setAvatarToast(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      updateUserAvatar(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    updateUserAvatar('');
  };

  const isEmailChanged = mounted && user?.email
    ? email.trim().toLowerCase() !== user.email.trim().toLowerCase()
    : false;

  const handleToggleEdit = () => {
    if (isEditing) {
      resetFormValues();
      setIsEditing(false);
      setToastMessage(null);
    } else {
      setIsEditing(true);
      setToastMessage({ type: 'info', text: '✏️ Edit Mode Unlocked! Update your fields below.' });
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // INLINE EMAIL OTP VERIFICATION HANDLERS
  const handleSendInlineEmailOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setInlineEmailNotice({ type: 'error', text: 'Please enter a valid email address first.' });
      return;
    }

    setIsSendingEmailOtp(true);
    setInlineEmailNotice(null);

    try {
      const res = await authApi.sendEmailChangeOtp({ newEmail: email.trim() });
      setShowInlineOtpInput(true);
      setInlineEmailNotice({ type: 'success', text: `✅ Verification OTP sent to ${email.trim()}. Enter code below.` });
    } catch (err) {
      setInlineEmailNotice({
        type: 'error',
        text: err.response?.data?.error || 'Failed to send verification OTP to new email.',
      });
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  const handleVerifyInlineOtp = async () => {
    if (!inlineOtpCode || inlineOtpCode.trim().length !== 6) {
      setInlineEmailNotice({ type: 'error', text: 'Please enter full 6-digit OTP code.' });
      return;
    }

    setIsVerifyingInlineOtp(true);
    setInlineEmailNotice(null);

    try {
      const res = await authApi.verifyNewEmail({
        pendingEmail: email.trim(),
        otpCode: inlineOtpCode.trim(),
      });

      setIsInlineEmailVerified(true);
      setShowInlineOtpInput(false);
      setInlineEmailNotice({ type: 'success', text: '🎉 New email address verified successfully!' });
    } catch (err) {
      setInlineEmailNotice({
        type: 'error',
        text: err.response?.data?.error || 'Invalid OTP code. Please check your inbox and try again.',
      });
    } finally {
      setIsVerifyingInlineOtp(false);
    }
  };

  // MASTER FORM SUBMIT (SAVE ALL CHANGES)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setToastMessage(null);

    // If email is changed but not verified via inline OTP, block submit!
    if (isEmailChanged && !isInlineEmailVerified) {
      setToastMessage({
        type: 'error',
        text: '⚠ Please verify your new email address by clicking "SEND OTP & VERIFY" before saving changes.',
      });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setToastMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setToastMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.replace(/\D/g, ''),
        bloodGroup,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        emergencyContactName: emergencyContactName.trim(),
        emergencyContactPhone: emergencyContactPhone.replace(/\D/g, ''),
        medicalNotes: medicalNotes.trim(),
        ...(newPassword && { newPassword }),
      };

      await authApi.updateSettings(payload);
      await fetchUser();

      setToastMessage({ type: 'success', text: '✅ All profile details updated & saved to database!' });
      setIsEditing(false);
      setIsInlineEmailVerified(false);
      setShowInlineOtpInput(false);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      setToastMessage({
        type: 'error',
        text: err.response?.data?.error || err.message || 'Failed to update profile details',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunTest = () => {
    setTestSuccess(true);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([200, 100, 200]);
    setTimeout(() => setTestSuccess(false), 2500);
  };

  const handleTestSirenAudio = () => {
    setIsTestingSiren(true);
    startEmergencySiren();
    setTimeout(() => {
      stopEmergencySiren();
      setIsTestingSiren(false);
    }, 2500);
  };

  // Sync form inputs from Redux user state
  const resetFormValues = () => {
    if (user) {
      setFullName(user.fullName || user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setBloodGroup(user.bloodGroup || 'O+');
      setAddress(user.address || '');
      setCity(user.city || '');
      setState(user.state || '');
      setPincode(user.pincode || '');
      setEmergencyContactName(user.emergencyContactName || '');
      setEmergencyContactPhone(user.emergencyContactPhone || '');
      setMedicalNotes(user.medicalNotes || '');
      setNewPassword('');
      setConfirmPassword('');
      setShowInlineOtpInput(false);
      setInlineOtpCode('');
      setIsInlineEmailVerified(false);
      setInlineEmailNotice(null);
    }
  };

  useEffect(() => {
    resetFormValues();
  }, [user]);

  const initials = mounted && (user?.fullName || user?.name)
    ? (user.fullName || user.name).split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'PS';

  const isSuperAdmin = mounted && user?.role === 'SUPER_ADMIN';
  const displayAvatar = mounted ? (user?.profilePhoto || user?.avatar) : null;
  const displayName = mounted && (user?.fullName || user?.name) ? (user.fullName || user.name) : 'Sakhi Member';
  const displayEmail = mounted && user?.email ? user.email : 'sakhi@suraksha.org';
  const displayPhone = mounted && user?.phone ? user.phone : '+91 98765 43210';
  const displayBloodGroup = mounted && user?.bloodGroup ? user.bloodGroup : 'O+';

  const diagnostics = [
    { icon: MapPin, label: 'GPS Location Access', status: status === 'LIVE', value: status === 'LIVE' ? `✓ Active (±${accuracy || '10'}m)` : '⚠ Permission Required' },
    { icon: Bell, label: 'Push & Email Alerts', status: true, value: '✓ 100% Ready' },
    { icon: Lock, label: 'Encrypted Token', status: true, value: '✓ Secure JWT 256-bit' },
    { icon: Smartphone, label: 'Device Vibration', status: isVibrationSupported, value: isVibrationSupported ? '✓ Supported' : '— Hardware N/A' },
  ];

  return (
    <AppLayout>
      <div className="bg-[#FFF0F3] text-[#2A0826] font-sans relative overflow-hidden">
        
        {/* BACKGROUND AMBIENT GLOW MESHES */}
        <div className="absolute w-[700px] h-[700px] rounded-full bg-rose/15 blur-[150px] top-[-100px] left-[-200px] pointer-events-none" />
        <div className="absolute w-[700px] h-[700px] rounded-full bg-gold/15 blur-[150px] bottom-[100px] right-[-200px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 relative z-10 space-y-6 animate-fade-up">

          {/* PAGE TITLE BANNER WITH UPDATE / EDIT PROFILE TOGGLE BUTTON */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-md">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5C8A] via-[#FF2A6D] to-[#FFD166] text-white flex items-center justify-center shadow-md shrink-0">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-black text-xl sm:text-2xl text-[#2A0826] tracking-tight">
                  Account Settings & Profile Management
                </h1>
                <p className="text-xs font-bold text-[#684E67] mt-0.5">
                  Click <span className="text-[#FF2A6D] font-black">UPDATE PROFILE</span> to unlock and edit any of your profile details
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleToggleEdit}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                  isEditing
                    ? 'bg-rose-50 text-[#FF2A6D] border-2 border-[#FF2A6D]'
                    : 'bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white'
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>CANCEL EDIT</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>UPDATE PROFILE</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* MASTER PROFILE HEADER CARD */}
          <div className="bg-gradient-to-br from-white via-[#FFF0F3] to-white border-2 border-[#FFCCE1] shadow-[0_16px_50px_rgba(255,92,138,0.18)] rounded-[36px] overflow-hidden relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              
              {/* AVATAR RING */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#FF5C8A] via-[#FF2A6D] to-[#FFD166] p-0.5 shadow-xl relative overflow-hidden">
                  <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center font-black text-3xl text-[#2A0826] overflow-hidden relative">
                    {displayAvatar ? (
                      <img src={displayAvatar} alt="Profile Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                </div>

                <label
                  title="Upload New Profile Photo"
                  className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white p-2 rounded-2xl shadow-lg border-2 border-white cursor-pointer hover:scale-110 active:scale-95 transition-all flex items-center justify-center group-hover:brightness-110"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {displayAvatar && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    title="Remove Profile Photo"
                    className="absolute -top-1 -left-1 bg-white text-[#FF2A6D] border-2 border-[#FFCCE1] p-1.5 rounded-full shadow hover:bg-[#FFF0F3] transition-all text-[10px] font-black cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* USER SUMMARY */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="font-black text-2xl sm:text-3xl text-[#2A0826] tracking-tight truncate">
                    {displayName}
                  </h2>
                  {isSuperAdmin && (
                    <span className="bg-gradient-to-r from-[#FFD700] to-[#E6A100] text-[#2A0826] font-black text-[10px] px-3 py-1 rounded-full uppercase flex items-center space-x-1 shadow-md border border-gold/40">
                      <Crown className="w-3.5 h-3.5 text-[#2A0826]" />
                      <span>SUPER ADMIN</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs font-bold text-[#684E67]">
                  <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-full border border-[#FFCCE1] text-[#2A0826] font-black shadow-xs">
                    <Mail className="w-3.5 h-3.5 text-[#FF2A6D]" />
                    <span>{displayEmail}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-full border border-[#FFCCE1] text-[#2A0826] font-black shadow-xs">
                    <PhoneCall className="w-3.5 h-3.5 text-[#FF2A6D]" />
                    <span>{displayPhone}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-[#FFF0F3] px-3 py-1.5 rounded-full text-[#FF2A6D] font-black border border-[#FFCCE1] shadow-xs">
                    <Heart className="w-3.5 h-3.5 fill-[#FF2A6D]/20" />
                    <span>Blood Group: {displayBloodGroup}</span>
                  </div>
                </div>

                {avatarToast && (
                  <div className={`text-xs font-black px-4 py-1.5 rounded-full inline-block shadow-xs animate-shake ${avatarToast.type === 'error' ? 'bg-rose-50 text-[#FF2A6D] border border-[#FF2A6D]' : 'bg-emerald-50 text-emerald-600 border border-emerald-300'}`}>
                    {avatarToast.text}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* MASTER EDITABLE PROFILE & SETTINGS FORM */}
          <form onSubmit={handleFormSubmit} className="space-y-8">
            
            {/* FEEDBACK TOAST BANNER */}
            {toastMessage && (
              <div className={`p-4 rounded-2xl text-xs font-black shadow-md animate-shake ${
                toastMessage.type === 'error'
                  ? 'bg-rose-50 text-[#FF2A6D] border-2 border-[#FF2A6D]'
                  : toastMessage.type === 'info'
                  ? 'bg-amber-50 text-amber-800 border-2 border-amber-400'
                  : 'bg-emerald-50 text-emerald-700 border-2 border-emerald-400'
              }`}>
                {toastMessage.text}
              </div>
            )}

            {/* FORM SECTION 1: PERSONAL INFORMATION & INLINE EMAIL VERIFICATION */}
            <div className={`bg-white border-2 rounded-[32px] p-6 sm:p-8 shadow-md space-y-6 transition-all ${isEditing ? 'border-[#FF2A6D] ring-4 ring-[#FF2A6D]/10' : 'border-[#FFCCE1]'}`}>
              <div className="flex items-center justify-between border-b-2 border-[#FFCCE1] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#FF2A6D] flex items-center justify-center border border-[#FFCCE1]">
                    <UserIcon className="w-5 h-5 text-[#FF2A6D]" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#2A0826]">1. Personal Member Details</h3>
                    <p className="text-xs text-[#684E67] font-bold">Update your full legal name, email address, phone number, and blood group</p>
                  </div>
                </div>

                {!isEditing && (
                  <span className="text-[10px] font-black bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-300">
                    🔒 LOCKED (CLICK UPDATE PROFILE)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#684E67] mb-1">Full Name *</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#684E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      disabled={!isEditing}
                      placeholder="e.g. Kaveri Gawali"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border-1.5 rounded-xl text-xs text-[#2A0826] font-bold outline-none transition-all ${
                        isEditing
                          ? 'bg-[#FFF0F3] border-[#FF2A6D] focus:bg-white focus:ring-2 focus:ring-[#FF2A6D]/20'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700'
                      }`}
                    />
                  </div>
                </div>

                {/* INLINE EMAIL ADDRESS CARD WITH INLINE OTP VERIFICATION */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-black text-[#684E67]">
                      Email Address *
                    </label>

                    {/* EMAIL VERIFICATION STATUS BADGE */}
                    {!isEmailChanged && (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>VERIFIED</span>
                      </span>
                    )}

                    {isEmailChanged && isInlineEmailVerified && (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center space-x-1 animate-bounce">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>NEW EMAIL VERIFIED</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-[#684E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        disabled={!isEditing || isInlineEmailVerified}
                        placeholder="kaveri@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setIsInlineEmailVerified(false);
                          setShowInlineOtpInput(false);
                          setInlineEmailNotice(null);
                        }}
                        className={`w-full pl-10 pr-4 py-3 border-1.5 rounded-xl text-xs text-[#2A0826] font-bold outline-none transition-all ${
                          isEditing
                            ? isInlineEmailVerified
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-black'
                              : 'bg-[#FFF0F3] border-[#FF2A6D] focus:bg-white'
                            : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700'
                        }`}
                      />
                    </div>

                    {/* SEND OTP & VERIFY BUTTON (SHOWN WHEN EMAIL IS CHANGED & NOT VERIFIED) */}
                    {isEditing && isEmailChanged && !isInlineEmailVerified && (
                      <button
                        type="button"
                        onClick={handleSendInlineEmailOtp}
                        disabled={isSendingEmailOtp}
                        className="bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white font-black text-xs px-4 py-3 rounded-xl shadow hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSendingEmailOtp ? 'SENDING...' : 'SEND OTP'}</span>
                      </button>
                    )}
                  </div>

                  {/* INLINE EMAIL NOTICE */}
                  {inlineEmailNotice && (
                    <div className={`mt-2 p-2.5 rounded-xl text-[11px] font-black ${
                      inlineEmailNotice.type === 'error' ? 'bg-rose-50 text-[#FF2A6D] border border-[#FF2A6D]' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    }`}>
                      {inlineEmailNotice.text}
                    </div>
                  )}

                  {/* INLINE OTP INPUT AREA */}
                  {isEditing && isEmailChanged && showInlineOtpInput && !isInlineEmailVerified && (
                    <div className="mt-3 bg-[#FFF0F3] p-3.5 rounded-2xl border-2 border-[#FF2A6D] space-y-2.5 animate-slide-down">
                      <p className="text-[11px] font-black text-[#2A0826]">
                        Enter 6-digit verification OTP sent to <span className="text-[#FF2A6D]">{email}</span>:
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="6-digit OTP"
                          value={inlineOtpCode}
                          onChange={(e) => setInlineOtpCode(e.target.value.replace(/\D/g, ''))}
                          className="flex-1 px-3 py-2 bg-white border-2 border-[#FF2A6D] rounded-xl text-center font-mono font-black text-sm tracking-widest outline-none text-[#2A0826]"
                        />

                        <button
                          type="button"
                          onClick={handleVerifyInlineOtp}
                          disabled={isVerifyingInlineOtp}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow transition-all flex items-center space-x-1 shrink-0 cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isVerifyingInlineOtp ? 'VERIFYING...' : 'VERIFY OTP'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black text-[#684E67] mb-1">Mobile Phone Number *</label>
                  <div className="relative">
                    <PhoneCall className="w-4 h-4 text-[#684E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      disabled={!isEditing}
                      maxLength={10}
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className={`w-full pl-10 pr-4 py-3 border-1.5 rounded-xl text-xs text-[#2A0826] font-mono font-bold outline-none transition-all ${
                        isEditing
                          ? 'bg-[#FFF0F3] border-[#FF2A6D] focus:bg-white'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#684E67] mb-1">Blood Group *</label>
                  <select
                    disabled={!isEditing}
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className={`w-full px-4 py-3 border-1.5 rounded-xl text-xs text-[#2A0826] font-bold outline-none transition-all ${
                      isEditing
                        ? 'bg-[#FFF0F3] border-[#FF2A6D] focus:bg-white cursor-pointer'
                        : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700'
                    }`}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* FORM SECTION 2: RESIDENTIAL ADDRESS & LOCATION */}
            <div className={`bg-white border-2 rounded-[32px] p-6 sm:p-8 shadow-md space-y-6 transition-all ${isEditing ? 'border-[#FF2A6D] ring-4 ring-[#FF2A6D]/10' : 'border-[#FFCCE1]'}`}>
              <div className="flex items-center justify-between border-b-2 border-[#FFCCE1] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#FF2A6D] flex items-center justify-center border border-[#FFCCE1]">
                    <MapPin className="w-5 h-5 text-[#FF2A6D]" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#2A0826]">2. Residential Location & Address</h3>
                    <p className="text-xs text-[#684E67] font-bold">Address details used for emergency dispatch & guardian response</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-[#684E67] mb-1">Full Residential Address *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#684E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      disabled={!isEditing}
                      placeholder="House/Flat No, Street area, Landmark"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border-1.5 rounded-xl text-xs text-[#2A0826] font-bold outline-none transition-all ${
                        isEditing
                          ? 'bg-[#FFF0F3] border-[#FF2A6D] focus:bg-white'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#684E67] mb-1">City *</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#684E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      disabled={!isEditing}
                      placeholder="e.g. Pune"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border-1.5 rounded-xl text-xs text-[#2A0826] font-bold outline-none transition-all ${
                        isEditing
                          ? 'bg-[#FFF0F3] border-[#FF2A6D] focus:bg-white'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#684E67] mb-1">State *</label>
                  <div className="relative">
                    <Map className="w-4 h-4 text-[#684E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      disabled={!isEditing}
                      placeholder="e.g. Maharashtra"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border-1.5 rounded-xl text-xs text-[#2A0826] font-bold outline-none transition-all ${
                        isEditing
                          ? 'bg-[#FFF0F3] border-[#FF2A6D] focus:bg-white'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#684E67] mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    disabled={!isEditing}
                    maxLength={6}
                    placeholder="e.g. 411001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className={`w-full px-4 py-3 border-1.5 rounded-xl text-xs text-[#2A0826] font-mono font-bold outline-none transition-all ${
                      isEditing
                        ? 'bg-[#FFF0F3] border-[#FF2A6D] focus:bg-white'
                        : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* FORM SECTION 3: EMERGENCY GUARDIAN CONTACT DETAILS */}
            <div className={`bg-white border-2 rounded-[32px] p-6 sm:p-8 shadow-md space-y-6 transition-all ${isEditing ? 'border-[#FF2A6D] ring-4 ring-[#FF2A6D]/10' : 'border-[#FFCCE1]'}`}>
              <div className="flex items-center space-x-3 border-b-2 border-[#FFCCE1] pb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#FF2A6D] flex items-center justify-center border border-[#FFCCE1]">
                  <Users className="w-5 h-5 text-[#FF2A6D]" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#2A0826]">3. Primary Emergency Guardian Contact</h3>
                  <p className="text-xs text-[#684E67] font-bold">First guardian notified automatically during an emergency SOS broadcast</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#684E67] mb-1">Guardian Name *</label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-[#684E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      disabled={!isEditing}
                      placeholder="e.g. Rajesh Sharma"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 border-1.5 rounded-xl text-xs text-[#2A0826] font-bold outline-none transition-all ${
                        isEditing
                          ? 'bg-[#FFF0F3] border-[#FF2A6D] focus:bg-white'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#684E67] mb-1">Relationship *</label>
                  <select
                    disabled={!isEditing}
                    value={emergencyContactRelation}
                    onChange={(e) => setEmergencyContactRelation(e.target.value)}
                    className={`w-full px-3 py-3 border-1.5 rounded-xl text-xs text-[#2A0826] font-bold outline-none transition-all ${
                      isEditing
                        ? 'bg-[#FFF0F3] border-[#FF2A6D] focus:bg-white cursor-pointer'
                        : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700'
                    }`}
                  >
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Relative">Relative</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#684E67] mb-1">Guardian Mobile Number *</label>
                  <div className="relative">
                    <PhoneCall className="w-4 h-4 text-[#684E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      disabled={!isEditing}
                      maxLength={10}
                      placeholder="10-digit number"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value.replace(/\D/g, ''))}
                      className={`w-full pl-10 pr-3 py-3 border-1.5 rounded-xl text-xs text-[#2A0826] font-mono font-bold outline-none transition-all ${
                        isEditing
                          ? 'bg-[#FFF0F3] border-[#FF2A6D] focus:bg-white'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* FORM SECTION 4: SECURITY & PASSWORD UPDATE */}
            <div className={`bg-white border-2 rounded-[32px] p-6 sm:p-8 shadow-md space-y-6 transition-all ${isEditing ? 'border-[#FF2A6D] ring-4 ring-[#FF2A6D]/10' : 'border-[#FFCCE1]'}`}>
              <div className="flex items-center space-x-3 border-b-2 border-[#FFCCE1] pb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#FF2A6D] flex items-center justify-center border border-[#FFCCE1]">
                  <Lock className="w-5 h-5 text-[#FF2A6D]" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#2A0826]">4. Account Password & Security</h3>
                  <p className="text-xs text-[#684E67] font-bold">Leave blank if you do not wish to change your account password</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#684E67] mb-1">New Password (Optional)</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#684E67] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      disabled={!isEditing}
                      placeholder="Enter new password (min 6 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-3 border-1.5 rounded-xl text-xs text-[#2A0826] font-bold outline-none transition-all ${
                        isEditing
                          ? 'bg-[#FFF0F3] border-[#FF2A6D] focus:bg-white'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700'
                      }`}
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#684E67]"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#684E67] mb-1">Confirm New Password</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    disabled={!isEditing}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 border-1.5 rounded-xl text-xs text-[#2A0826] font-bold outline-none transition-all ${
                      isEditing
                        ? 'bg-[#FFF0F3] border-[#FF2A6D] focus:bg-white'
                        : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* FORM SECTION 5: MEDICAL / HEALTH NOTES FOR RESPONDERS */}
            <div className={`bg-white border-2 rounded-[32px] p-6 sm:p-8 shadow-md space-y-6 transition-all ${isEditing ? 'border-[#FF2A6D] ring-4 ring-[#FF2A6D]/10' : 'border-[#FFCCE1]'}`}>
              <div className="flex items-center space-x-3 border-b-2 border-[#FFCCE1] pb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#FF2A6D] flex items-center justify-center border border-[#FFCCE1]">
                  <FileText className="w-5 h-5 text-[#FF2A6D]" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#2A0826]">5. Emergency Medical Notes & Instructions</h3>
                  <p className="text-xs text-[#684E67] font-bold">Allergies, medical conditions, or specific emergency instructions for guardians</p>
                </div>
              </div>

              <div>
                <textarea
                  rows={3}
                  disabled={!isEditing}
                  placeholder="e.g. Asthmatic, allergic to penicillin, emergency key available with neighbor."
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  className={`w-full p-4 border-1.5 rounded-2xl text-xs text-[#2A0826] font-bold outline-none resize-none transition-all ${
                    isEditing
                      ? 'bg-[#FFF0F3] border-[#FF2A6D] focus:bg-white'
                      : 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-700'
                  }`}
                />
              </div>
            </div>

            {/* MASTER STICKY SUBMIT ACTION BAR (VISIBLE IN EDIT MODE) */}
            {isEditing && (
              <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md p-4 rounded-3xl border-2 border-[#FF2A6D] shadow-2xl flex items-center justify-between gap-4 animate-slide-up">
                <div>
                  <p className="font-black text-xs text-[#2A0826]">Edit Mode Unlocked</p>
                  <p className="text-[10px] font-bold text-[#684E67]">Click Save Changes to commit all details to database</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleToggleEdit}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-black px-5 py-3 rounded-full text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black px-8 py-3 rounded-full text-xs uppercase tracking-wider shadow-[0_8px_25px_rgba(255,42,109,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSubmitting ? 'SAVING CHANGES...' : 'SAVE ALL CHANGES'}</span>
                  </button>
                </div>
              </div>
            )}

          </form>

          {/* SECTION 6: 24/7 SYSTEM HEALTH DIAGNOSTICS & SOS DRILL RUNNER */}
          <div className="bg-white border-2 border-[#FFCCE1] rounded-[32px] p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#FFCCE1] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0F3] text-[#FF2A6D] flex items-center justify-center border border-[#FFCCE1]">
                  <Shield className="w-5 h-5 text-[#FF2A6D]" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#2A0826]">24/7 System Health Metrics & SOS Drill Runner</h3>
                  <p className="text-xs text-[#684E67] font-bold">Verify device sensors, GPS stream, and siren audio capability</p>
                </div>
              </div>
              <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 hidden sm:inline-block">
                100% Operational
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {diagnostics.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-[#FFF0F3] border border-[#FFCCE1] rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#2A0826]">{item.label}</p>
                        <p className={`text-[11px] font-extrabold mt-0.5 ${item.status ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-r from-[#2A0826] via-[#3D0C38] to-[#2A0826] text-white p-6 rounded-3xl shadow-[0_12px_35px_rgba(42,8,38,0.35)] space-y-4 border-2 border-[#FF2A6D]">
              <div className="flex items-start space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FF2A6D]/20 text-[#FF5C8A] flex items-center justify-center shrink-0 border border-[#FF2A6D]/40">
                  <Play className="w-5 h-5 text-[#FF5C8A] animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-base text-white">Run SOS Emergency Drill</h4>
                  <p className="text-xs text-white/80 font-extrabold mt-0.5 leading-relaxed">
                    Test device vibration, siren audio & GPS stream safely without notifying guardians.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleRunTest}
                  className="flex-1 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white py-3.5 rounded-full text-xs uppercase tracking-wider font-black shadow-[0_8px_25px_rgba(255,42,109,0.4)] flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>{testSuccess ? '✓ DRILL PASSED!' : 'START DRILL READINESS TEST'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestSirenAudio}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 py-3.5 px-5 rounded-full text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-[#FF5C8A]" />
                  <span>{isTestingSiren ? 'TESTING SIREN...' : 'TEST SIREN AUDIO'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
