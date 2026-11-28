'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PublicNavbar } from '../../components/layout/PublicNavbar.js';
import { Footer } from '../../components/layout/Footer.js';
import {
  ShieldCheck,
  Heart,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  Mail,
  Phone,
  User,
  MapPin,
  Clock,
  Briefcase,
  AlertCircle,
  KeyRound,
  ShieldAlert,
  HandHeart,
  Check,
  Award,
  Radio,
  FileCheck2,
} from 'lucide-react';
import { volunteerApi } from '../../redux/api/volunteerApi.js';

export default function JoinVolunteerPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Female',
    dateOfBirth: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    country: 'India',
    occupation: 'Student',
    availability: 'Flexible / Whenever Needed',
    emergencyContactName: '',
    emergencyContactPhone: '',
    motivation: '',
  });

  const [selectedSkills, setSelectedSkills] = useState([]);

  // Email verification state
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Form submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const skillOptions = [
    'First Aid & Medical Support',
    'Emergency Vehicle / Transport',
    'Self-Defense Trainer',
    'Crisis Counseling & Mental Support',
    'Community Patrol & Safety Walking',
    'Legal Aid & Women Rights Advice',
    'College / Workplace Awareness',
    'Social Media & Digital Outreach',
  ];

  const occupationOptions = [
    'Student',
    'Working Professional / Corporate',
    'Healthcare / Doctor / Nurse',
    'Social Worker / NGO Volunteer',
    'Police / Defense / Security Forces',
    'Teacher / Educator / Professor',
    'Advocate / Legal Professional',
    'Self-Employed / Business Owner',
    'Homemaker',
    'Other',
  ];

  const availabilityOptions = [
    'Flexible / Whenever Needed',
    'Weekends Only (Sat-Sun)',
    'Evening Hours (6 PM - 11 PM)',
    '24/7 Rapid Emergency Dispatch',
    'Daytime (10 AM - 5 PM)',
  ];

  // OTP Countdown timer
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Step 1: Send OTP to verify email
  const handleSendOtp = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address first.');
      return;
    }
    setErrorMessage('');
    setIsSendingOtp(true);
    try {
      const res = await volunteerApi.sendOtp({
        email: formData.email,
        fullName: formData.fullName || 'Volunteer',
      });
      if (res.success) {
        setOtpSent(true);
        setOtpCountdown(60); // 60s cooldown for resend
        setSuccessMessage('Verification code sent! Please check your email inbox.');
      } else {
        setErrorMessage(res.message || 'Failed to send verification code.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to send OTP code. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setErrorMessage('Please enter the 6-digit code received on your email.');
      return;
    }
    setErrorMessage('');
    setIsVerifyingOtp(true);
    try {
      const res = await volunteerApi.verifyOtp({
        email: formData.email,
        otp,
      });
      if (res.success) {
        setIsEmailVerified(true);
        setSuccessMessage('Email verified successfully! You can now complete the form.');
      } else {
        setErrorMessage(res.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Invalid OTP code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Step 3: Submit final application
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isEmailVerified) {
      setErrorMessage('Please verify your email address using the 6-digit OTP code before submitting.');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      setErrorMessage('Please fill in all required fields (Full Name, Phone, Address, City, Pincode).');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        skills: selectedSkills.join(', '),
      };

      const res = await volunteerApi.applyVolunteer(payload);
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(res.message || 'Failed to submit application. Please review your details.');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit application. Please check your internet connection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F3] via-white to-[#FFF0F3] flex flex-col font-sans selection:bg-[#FF2A6D] selection:text-white">
      <PublicNavbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        {/* HERO BANNER */}
        <section className="text-center space-y-5 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-[#FFCCE1] shadow-xs text-xs font-black text-[#FF2A6D] uppercase tracking-wider">
            <HandHeart className="w-4 h-4 text-[#FF2A6D]" />
            <span>Sakhi Suraksha Volunteer Force (स्वयंसेवक दल)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2A0826] tracking-tight leading-[1.15]">
            Be the Shield. <span className="text-[#FF2A6D]">Join as a Volunteer</span> &amp; Protect Our Community
          </h1>

          <p className="text-sm sm:text-base font-bold text-[#684E67] leading-relaxed">
            Stand up as an official Sakhi Suraksha Volunteer. Support rapid emergency assistance, first aid, safety escort,
            and awareness for women across colleges, neighborhoods, and cities. <strong>Registration is 100% Free.</strong>
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Free Registration</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-pink-50 text-[#FF2A6D] border border-[#FFCCE1]">
              <Award className="w-4 h-4 text-[#FF2A6D]" />
              <span>Official Volunteer ID Badge</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-purple-50 text-purple-800 border border-purple-200">
              <Radio className="w-4 h-4 text-purple-600" />
              <span>Rapid Community SOS Network</span>
            </span>
          </div>
        </section>

        {/* APPLICATION FORM CONTAINER */}
        <section className="max-w-4xl mx-auto">
          {submitted ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="bg-white rounded-[36px] border-2 border-emerald-300 shadow-xl p-8 sm:p-14 text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Application Submitted
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#2A0826]">
                  Namaste {formData.fullName}, Thank You for Stepping Forward!
                </h2>
                <p className="text-xs sm:text-sm text-[#684E67] font-bold max-w-xl mx-auto leading-relaxed">
                  Your volunteer registration for <strong>{formData.city}, {formData.state}</strong> has been received successfully.
                  Our SuperAdmin team is reviewing your profile.
                </p>
              </div>

              <div className="p-5 bg-[#FFF0F3]/60 rounded-2xl border border-[#FFCCE1] max-w-lg mx-auto text-left space-y-2 text-xs">
                <div className="font-black text-[#2A0826] text-sm flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#FF2A6D]" />
                  <span>Next Steps:</span>
                </div>
                <p className="text-[#684E67] font-bold">
                  1. A confirmation email has been dispatched to <strong>{formData.email}</strong>.
                </p>
                <p className="text-[#684E67] font-bold">
                  2. Upon SuperAdmin approval, you will receive your <strong>Official Sakhi Suraksha Volunteer ID Code</strong> and local guardian guidelines.
                </p>
                <p className="text-[#684E67] font-bold">
                  3. You will be connected to volunteer groups for community safety support.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black text-xs rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer uppercase tracking-wider"
                >
                  Return to Home
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#2A0826] border border-[#FFCCE1] font-bold text-xs rounded-2xl hover:bg-[#FFF0F3] transition-all cursor-pointer"
                >
                  Learn About Our Mission
                </Link>
              </div>
            </div>
          ) : (
            /* APPLICATION FORM */
            <div className="bg-white rounded-[36px] border-2 border-[#FFCCE1] shadow-xl overflow-hidden">
              {/* Form Header */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-[#FFF0F3] to-[#FFF5F8] border-b border-[#FFCCE1]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF2A6D] to-[#FF5E8E] text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                    <HandHeart className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#2A0826]">
                      Volunteer Enrolment Form
                    </h2>
                    <p className="text-xs font-bold text-[#684E67]">
                      Fill out your details to join our community emergency and women safety network.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && !errorMessage && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* SECTION 1: PERSONAL & CONTACT WITH EMAIL VERIFICATION */}
                <div className="space-y-4">
                  <div className="border-b border-[#FFCCE1]/60 pb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#FF2A6D]" />
                    <h3 className="text-sm font-black text-[#2A0826] uppercase tracking-wider">
                      1. Personal &amp; Verified Contact Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Anjali Deshmukh"
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        Contact Mobile Number *
                      </label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* EMAIL INPUT WITH OTP VERIFICATION DESK */}
                  <div className="p-4 bg-[#FFF0F3]/40 rounded-2xl border border-[#FFCCE1] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#FF2A6D]" />
                        <span>Email Address (With Verification) *</span>
                      </label>

                      {isEmailVerified && (
                        <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        required
                        type="email"
                        name="email"
                        disabled={isEmailVerified}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@gmail.com"
                        className="flex-1 px-4 py-3 bg-white border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all disabled:bg-gray-100 disabled:text-gray-500"
                      />

                      {!isEmailVerified && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={isSendingOtp || otpCountdown > 0}
                          className="px-5 py-3 bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D] text-white font-black text-xs rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap disabled:opacity-60"
                        >
                          {isSendingOtp
                            ? 'Sending...'
                            : otpCountdown > 0
                              ? `Resend in ${otpCountdown}s`
                              : otpSent
                                ? 'Resend OTP'
                                : 'Send Verification OTP'}
                        </button>
                      )}
                    </div>

                    {/* OTP INPUT ROW (Appears when OTP is sent and not yet verified) */}
                    {otpSent && !isEmailVerified && (
                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="relative flex-1">
                          <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 6-digit OTP from email"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-[#FFCCE1] rounded-2xl text-sm font-black text-[#2A0826] outline-none focus:border-[#FF2A6D] font-mono tracking-widest"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isVerifyingOtp || otp.length < 6}
                          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
                        >
                          {isVerifyingOtp ? 'Verifying...' : 'Verify Email Code'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] cursor-pointer"
                      >
                        <option value="Female">Female (महिला / युवती)</option>
                        <option value="Male">Male (पुरुष / युवक)</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        Date of Birth (Optional)
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D]"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: RESIDENTIAL ADDRESS */}
                <div className="space-y-4">
                  <div className="border-b border-[#FFCCE1]/60 pb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF2A6D]" />
                    <h3 className="text-sm font-black text-[#2A0826] uppercase tracking-wider">
                      2. Residential Address &amp; Deployment Region
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                      Full Street Address / Landmark *
                    </label>
                    <textarea
                      required
                      rows={2}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Flat/House No., Building, Street, Area/Colony, Landmark"
                      className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        City *
                      </label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Pune"
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        State *
                      </label>
                      <input
                        required
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Maharashtra"
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        Pincode *
                      </label>
                      <input
                        required
                        type="text"
                        maxLength={6}
                        name="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                        placeholder="e.g. 411001"
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        Country
                      </label>
                      <input
                        readOnly
                        type="text"
                        name="country"
                        value={formData.country}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: SKILLS, OCCUPATION & AVAILABILITY */}
                <div className="space-y-4">
                  <div className="border-b border-[#FFCCE1]/60 pb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#FF2A6D]" />
                    <h3 className="text-sm font-black text-[#2A0826] uppercase tracking-wider">
                      3. Occupation, Skills &amp; Availability
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        Current Occupation / Profession
                      </label>
                      <select
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] cursor-pointer"
                      >
                        {occupationOptions.map((occ) => (
                          <option key={occ} value={occ}>
                            {occ}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        Volunteer Availability
                      </label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] cursor-pointer"
                      >
                        {availabilityOptions.map((av) => (
                          <option key={av} value={av}>
                            {av}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Skills Selectable Pills */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider block">
                      Select Your Skills &amp; Contribution Areas (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                              isSelected
                                ? 'bg-[#FF2A6D] text-white border-[#FF2A6D] shadow-xs'
                                : 'bg-[#FFF0F3]/50 text-[#684E67] border-[#FFCCE1] hover:bg-[#FFF0F3]'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Emergency Family Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        Emergency Contact Person (Family/Guardian)
                      </label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleChange}
                        placeholder="e.g. Parent / Spouse Name"
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleChange}
                        placeholder="e.g. +91 9876543210"
                        className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D]"
                      />
                    </div>
                  </div>

                  {/* Motivation Statement */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                      Why do you want to volunteer with Sakhi Suraksha? (Brief Note)
                    </label>
                    <textarea
                      rows={2}
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleChange}
                      placeholder="Share what inspires you to support women safety and community protection..."
                      className="w-full px-4 py-3 bg-[#FFF0F3]/30 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* TERMS & PLEDGE */}
                <div className="p-4 bg-[#FFF0F3]/60 rounded-2xl border border-[#FFCCE1] text-xs font-bold text-[#684E67] space-y-1">
                  <p className="text-[#2A0826] font-black">Sakhi Suraksha Volunteer Pledge:</p>
                  <p className="leading-relaxed">
                    By submitting this form, I solemnly pledge to uphold the dignity, safety, and confidentiality of every
                    woman, child, and community member in need. I agree to comply with Sakhi Suraksha&apos;s ethical safety
                    protocols upon SuperAdmin approval.
                  </p>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isEmailVerified}
                    className="w-full py-4.5 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? 'SUBMITTING VOLUNTEER ENROLMENT...'
                        : !isEmailVerified
                          ? 'VERIFY EMAIL TO SUBMIT APPLICATION'
                          : 'SUBMIT VOLUNTEER REGISTRATION (FREE)'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
