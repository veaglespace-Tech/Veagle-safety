'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Users, 
  BellRing, 
  HeartPulse, 
  CreditCard, 
  GraduationCap, 
  AlertTriangle, 
  Smartphone, 
  BookOpen, 
  WifiOff, 
  PhoneCall, 
  CheckSquare, 
  Square,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

export const USER_CONSENT_ITEMS = [
  {
    id: 'live_gps',
    title: '1. Real-Time GPS Location Tracking Consent',
    badge: 'Live GPS Consent',
    icon: MapPin,
    summary: 'Granting permission for the app to access background, high-accuracy GPS coordinates during emergency SOS and "Safe Journey" tracking.',
    usage: 'This location is strictly accessed for user safety and only displayed on secure live maps to linked parents/guardians, trusted contacts, and emergency command centers.'
  },
  {
    id: 'guardian_sharing',
    title: '2. Guardian, Parent & Organization Data Sharing Consent',
    badge: 'Guardian & Org Sharing',
    icon: Users,
    summary: 'Granting permission to securely share your profile details (Name, phone, profile photo, blood group) and live GPS coordinates during emergency incidents with your registered parents, trusted contacts, and institution/organization admin.',
    usage: 'Enables rapid rescue coordination between your family, college/workplace authorities, and local safety response teams.'
  },
  {
    id: 'emergency_broadcast',
    title: '3. Emergency Alerts, Siren & Notification Broadcast Consent',
    badge: 'Emergency Broadcast',
    icon: BellRing,
    summary: 'Consent for automated transmission of high-decibel audible siren pushes, instant WhatsApp alerts, priority emails, and SMS tracking notifications to your guardians when an SOS trigger is activated.',
    usage: 'Guarantees that your guardians are alerted immediately even when their phone is locked or in background mode.'
  },
  {
    id: 'medical_disclosure',
    title: '4. Medical & Emergency Information Disclosure Consent',
    badge: 'Medical Disclosure',
    icon: HeartPulse,
    summary: 'Permission to disclose your recorded Blood Group and optional medical notes to first responders, emergency medical professionals, and police during an active rescue operation.',
    usage: 'Helps medical teams provide timely first-aid and critical medical support without unnecessary delays.'
  },
  {
    id: 'payment_billing',
    title: '5. Payment, Subscription & Statutory Billing Consent',
    badge: 'Payment & Billing',
    icon: CreditCard,
    summary: 'Consent to securely process subscription transactions through RBI-compliant payment gateways (Razorpay) and maintain encrypted transaction & GST tax invoice records as mandated by Indian financial regulations.',
    usage: 'Ensures lawful GST invoice generation and instant activation of digital safety protection plans.'
  },
  {
    id: 'minor_consent',
    title: '6. Minor / Student Parental Consent Declaration',
    badge: 'Minor / Student Consent',
    icon: GraduationCap,
    summary: 'If the member is under 18 years of age (school/college student), parental/legal guardian consent has been obtained to create this account and allow parental tracking for personal safety.',
    usage: 'Complies with Digital Personal Data Protection (DPDP) Act provisions for minor and student users.'
  }
];

export const SAFETY_GUIDELINES = [
  {
    title: 'Strictly No Prank or False SOS Alerts',
    icon: AlertTriangle,
    desc: 'The SOS emergency trigger must ONLY be activated during genuine personal safety crises. Repeated intentional false or prank alarms can result in immediate account termination.'
  },
  {
    title: 'Mandatory Device Settings for 100% Reliability',
    icon: Smartphone,
    desc: 'For seamless functioning, ensure Location is set to "Allow all the time", push notifications and sirens are enabled, and battery optimization for the app is set to "Unrestricted".'
  },
  {
    title: 'Keep Guardian & Contact Records Current',
    icon: BookOpen,
    desc: 'It is the user’s responsibility to maintain accurate 10-digit phone numbers and active email addresses for all linked parents and trusted emergency contacts.'
  },
  {
    title: 'Network & Cellular Signal Dependency',
    icon: WifiOff,
    desc: 'Real-time live streaming depends on mobile cellular data (4G/5G/Wi-Fi) and satellite GPS signals. Alert transmissions may face latency in remote zero-network zones.'
  },
  {
    title: 'Supplement to National Helpline 112',
    icon: PhoneCall,
    desc: 'Sakhi Suraksha acts as your rapid family-and-community response shield. In life-threatening criminal situations, always dial National Emergency 112 or Women Helpline 1091 immediately.'
  }
];

export function UserConsentModal({ isOpen, onClose, onAcceptAll }) {
  const [checkedConsents, setCheckedConsents] = useState(
    USER_CONSENT_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
  );
  const [showGuidelines, setShowGuidelines] = useState(false);

  if (!isOpen) return null;

  const allChecked = USER_CONSENT_ITEMS.every((item) => checkedConsents[item.id]);

  const toggleConsent = (id) => {
    setCheckedConsents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    const nextState = !allChecked;
    const updated = {};
    USER_CONSENT_ITEMS.forEach((item) => {
      updated[item.id] = nextState;
    });
    setCheckedConsents(updated);
  };

  const handleConfirm = () => {
    if (!allChecked) {
      alert('Please review and check all statutory consent points to proceed to payment.');
      return;
    }
    onAcceptAll();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2A0826]/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 space-y-6 border-2 border-[#FF2A6D] shadow-[0_25px_70px_rgba(255,42,109,0.30)] my-auto max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="text-center space-y-2 border-b border-[#FFCCE1] pb-4">
          <div className="inline-flex items-center space-x-2 bg-[#FFF0F3] border border-[#FFCCE1] px-4 py-1.5 rounded-full text-[#FF2A6D] text-xs font-black tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-[#FF2A6D]" />
            <span>DPDP Act 2023 Compliant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2A0826]">
            User Safety Consent &amp; Guidelines Agreement
          </h2>
          <p className="text-xs text-[#684E67] font-bold max-w-lg mx-auto">
            Before proceeding to payment &amp; subscription activation, statutory compliance requires your explicit consent for emergency location tracking and alert broadcasts.
          </p>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-left custom-scrollbar">
          {/* SECTION 1: CONSENT CHECKBOXES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF2A6D]">
                Part 1: Statutory User Consent Points (6 Items)
              </span>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs font-black text-[#FF2A6D] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>{allChecked ? 'Deselect All' : 'Accept All'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {USER_CONSENT_ITEMS.map((item) => {
                const Icon = item.icon;
                const isChecked = !!checkedConsents[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleConsent(item.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      isChecked 
                        ? 'bg-[#FFF0F3]/80 border-[#FF2A6D]/50 shadow-xs' 
                        : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}
                  >
                    <div className="mt-0.5 text-[#FF2A6D]">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-[#FF2A6D]" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-3.5 h-3.5 text-[#FF2A6D]" />
                        <h4 className="text-xs font-black text-[#2A0826]">{item.title}</h4>
                      </div>
                      <p className="text-[11px] text-[#553254] font-medium leading-relaxed">
                        {item.summary}
                      </p>
                      <p className="text-[10px] text-[#8C6B8B] font-semibold italic">
                        <strong>Intended Use:</strong> {item.usage}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: SAFETY & USAGE GUIDELINES ACCORDION */}
          <div className="border border-[#FFCCE1] rounded-2xl p-4 bg-[#FFF0F3]/40 space-y-3">
            <button
              type="button"
              onClick={() => setShowGuidelines(!showGuidelines)}
              className="w-full flex items-center justify-between text-left font-black text-xs text-[#2A0826] cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#FF2A6D]" />
                <span>Part 2: Safety &amp; Operational Usage Guidelines (Important)</span>
              </div>
              {showGuidelines ? <ChevronUp className="w-4 h-4 text-[#FF2A6D]" /> : <ChevronDown className="w-4 h-4 text-[#FF2A6D]" />}
            </button>

            {showGuidelines && (
              <div className="space-y-2.5 pt-2 border-t border-[#FFCCE1]/60">
                {SAFETY_GUIDELINES.map((g, idx) => {
                  const GIcon = g.icon;
                  return (
                    <div key={idx} className="flex items-start space-x-2.5 bg-white p-2.5 rounded-xl border border-[#FFCCE1]/70">
                      <GIcon className="w-4 h-4 text-[#FF2A6D] shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-[11px] font-black text-[#2A0826]">{g.title}</h5>
                        <p className="text-[10px] text-[#684E67] font-medium leading-normal">{g.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="border-t border-[#FFCCE1] pt-4 space-y-3">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#684E67]">
            <input
              type="checkbox"
              id="confirmAllCheck"
              checked={allChecked}
              onChange={toggleAll}
              className="accent-[#FF2A6D] w-4 h-4 cursor-pointer rounded"
            />
            <label htmlFor="confirmAllCheck" className="cursor-pointer select-none">
              I have read, understood, and give full legal consent to all 6 statutory clauses and safety guidelines.
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-2xl border border-gray-300 text-xs font-black uppercase text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!allChecked}
              className="w-2/3 btn-3d-rose-pop py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>I CONSENT &amp; PROCEED TO PAYMENT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
