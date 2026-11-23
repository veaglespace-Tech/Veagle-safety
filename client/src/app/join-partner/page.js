'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicNavbar } from '../../components/layout/PublicNavbar.js';
import { Footer } from '../../components/layout/Footer.js';
import {
  Network,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  Building2,
  Mail,
  Phone,
  User,
  MapPin,
  TrendingUp,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { referralApi } from '../../redux/api/referralApi.js';

export default function JoinPartnerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    partnerType: 'College / University',
    organizationName: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const partnerTypes = [
    'College / University',
    'School / Educational Institute',
    'Coaching Class / Private Hostel',
    'NGO / Trust / Social Foundation',
    'Social Media Influencer / Creator',
    'Corporate / Enterprise / Workplace',
    'Community Leader / Safety Advocate',
    'Other Partner Category',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await referralApi.applyPartner(formData);
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(res.message || 'Failed to submit application. Please check your inputs.');
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
        {/* HERO SECTION */}
        <section className="text-center space-y-5 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-[#FFCCE1] shadow-xs text-xs font-black text-[#FF2A6D] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#FF2A6D]" />
            <span>Sakhi Suraksha Partner Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2A0826] tracking-tight leading-[1.15]">
            Join as a <span className="text-[#FF2A6D]">Referral Partner</span> &amp; Empower Women&apos;s Safety
          </h1>

          <p className="text-sm sm:text-base font-bold text-[#684E67] leading-relaxed">
            Partner with India&apos;s leading 24/7 personal safety command platform. Bring life-saving emergency SOS
            protection to your college, workplace, community, or audience while offering exclusive discounts.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#apply-form"
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#FF2A6D] to-[#FF5E8E] text-white font-bold rounded-2xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply for Partnership</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/partner"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-pink-50 text-gray-800 font-bold rounded-2xl border-2 border-pink-200 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4 text-[#FF2A6D]" />
              <span>Already a Partner? Login to Portal</span>
            </Link>
          </div>
        </section>

        {/* 4 VALUE PILLARS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-3 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 text-[#FF2A6D] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-[#2A0826]">Save Lives &amp; Protect</h3>
            <p className="text-xs font-bold text-[#684E67] leading-relaxed">
              Equip your students, employees, and community members with instant 3-second emergency SOS and encrypted GPS broadcasts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-3 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-[#2A0826]">Exclusive Member Discounts</h3>
            <p className="text-xs font-bold text-[#684E67] leading-relaxed">
              Receive a customized Referral Code and promo coupon so your members get special discounted safety subscriptions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-3 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-[#2A0826]">Rewarding Partnership</h3>
            <p className="text-xs font-bold text-[#684E67] leading-relaxed">
              Earn transparent partner incentives and institutional recognition for every member who enrolls via your code.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-[#FFCCE1] shadow-sm space-y-3 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-[#2A0826]">Direct Sharable Links</h3>
            <p className="text-xs font-bold text-[#684E67] leading-relaxed">
              Share your direct 1-click registration URL via WhatsApp, social channels, college notice boards, and newsletters.
            </p>
          </div>
        </section>

        {/* APPLICATION FORM & PROCESS CONTAINER */}
        <section id="apply-form" className="bg-white rounded-[36px] border-2 border-[#FFCCE1] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT: PARTNERSHIP PROCESS & TESTIMONIAL */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#2A0826] to-[#450A36] p-8 sm:p-12 text-white flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider text-pink-300 border border-white/10">
                <Award className="w-3.5 h-3.5 text-[#FF5C8A]" />
                <span>Simple 3-Step Process</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                How It Works
              </h2>

              <div className="space-y-5">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#FF2A6D] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                    1
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-pink-200">Submit Application</h4>
                    <p className="text-xs text-white/80 font-semibold leading-relaxed mt-0.5">
                      Fill out the form with your details and organization or channel reach.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#FF5C8A] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                    2
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-pink-200">Admin Review &amp; Code Generation</h4>
                    <p className="text-xs text-white/80 font-semibold leading-relaxed mt-0.5">
                      Our safety team verifies your application and assigns your custom referral code and discount tier.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                    3
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-pink-200">Start Protecting &amp; Earning</h4>
                    <p className="text-xs text-white/80 font-semibold leading-relaxed mt-0.5">
                      Receive your approval email with your unique code and link. Start onboarding users immediately!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2">
              <p className="text-xs text-pink-200 font-black uppercase tracking-widest flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#FF2A6D]" />
                <span>Need Assistance?</span>
              </p>
              <p className="text-xs text-white/80 font-semibold leading-relaxed">
                Have specific institutional tie-up requirements? Email our partnerships desk directly at{' '}
                <a
                  href="mailto:support@sakhisuraksha.veaglespace.com"
                  className="text-pink-300 font-bold underline hover:text-white"
                >
                  support@sakhisuraksha.veaglespace.com
                </a>
              </p>
            </div>
          </div>

          {/* RIGHT: THE APPLICATION FORM */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            {submitted ? (
              <div className="text-center py-10 space-y-5 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-[#2A0826]">Application Submitted!</h3>
                <p className="text-sm font-bold text-[#684E67] max-w-md mx-auto leading-relaxed">
                  Thank you for applying to be a Sakhi Suraksha Referral Partner. We have sent a confirmation email to{' '}
                  <span className="text-[#FF2A6D] font-black">{formData.email}</span>. Our team will review your application and send your customized partner code within 24–48 hours.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        mobile: '',
                        city: '',
                        partnerType: 'College / University',
                        organizationName: '',
                        message: '',
                      });
                    }}
                    className="px-6 py-3 bg-[#FFF0F3] border border-[#FFCCE1] hover:border-[#FF2A6D] text-[#2A0826] font-black text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-[#2A0826]">Partner Application Form</h3>
                  <p className="text-xs font-bold text-[#684E67] mt-1">
                    Fill in your contact and organization details below. All verified submissions receive approval via email.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-black text-rose-600">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* FULL NAME */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-[#FF2A6D]" />
                        <span>Full Name *</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Dr. Rajesh Sharma"
                        className="w-full px-4 py-3 bg-[#FFF0F3]/40 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all"
                      />
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider flex items-center space-x-1">
                        <Mail className="w-3.5 h-3.5 text-[#FF2A6D]" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rajesh@college.edu"
                        className="w-full px-4 py-3 bg-[#FFF0F3]/40 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* MOBILE */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-[#FF2A6D]" />
                        <span>Mobile Number *</span>
                      </label>
                      <input
                        required
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-3 bg-[#FFF0F3]/40 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all"
                      />
                    </div>

                    {/* CITY */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-[#FF2A6D]" />
                        <span>City / District</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Pune, Mumbai, Delhi"
                        className="w-full px-4 py-3 bg-[#FFF0F3]/40 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* PARTNER TYPE */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider flex items-center space-x-1">
                        <Network className="w-3.5 h-3.5 text-[#FF2A6D]" />
                        <span>Partner Category *</span>
                      </label>
                      <select
                        name="partnerType"
                        value={formData.partnerType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FFF0F3]/40 border border-[#FFCCE1] rounded-2xl text-xs font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all"
                      >
                        {partnerTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* ORGANIZATION NAME */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-[#FF2A6D]" />
                        <span>Organization / Channel Name</span>
                      </label>
                      <input
                        type="text"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        placeholder="Institute or brand name"
                        className="w-full px-4 py-3 bg-[#FFF0F3]/40 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* MESSAGE / NOTE */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-[#2A0826] uppercase tracking-wider">
                      Tell us about your audience or why you want to partner
                    </label>
                    <textarea
                      rows={3}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="e.g. We have 1,200 girl students across 3 campus hostels interested in emergency SOS..."
                      className="w-full px-4 py-3 bg-[#FFF0F3]/40 border border-[#FFCCE1] rounded-2xl text-sm font-bold text-[#2A0826] outline-none focus:border-[#FF2A6D] focus:ring-2 focus:ring-[#FF2A6D]/20 transition-all resize-none"
                    />
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>SUBMITTING APPLICATION...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SUBMIT PARTNER APPLICATION</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
