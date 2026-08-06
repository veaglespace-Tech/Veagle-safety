'use client';

import Link from 'next/link';
import { Logo3DFlip } from '../../components/ui/Logo3DFlip.js';
import { Footer } from '../../components/layout/Footer.js';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FFF0F3] text-[#2A0826] font-sans">

      {/* HEADER */}
      <div className="bg-white/95 backdrop-blur-xl border-b-1.5 border-[#FFCCE1] py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <Logo3DFlip size={28} />
            <span className="text-sm font-black text-[#2A0826]">Sakhi Suraksha SOS</span>
          </Link>
          <Link href="/" className="text-xs font-black text-[#FF2A6D] hover:text-[#E01A4F] transition-colors">← Back to Home</Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            <span className="heading-gradient-hero">Privacy </span>
            <span className="heading-gradient-rose">Policy</span>
          </h1>
          <p className="text-xs text-[#684E67] font-bold">Last updated: July 2026</p>
        </div>

        {[
          {
            title: '1. Information We Collect',
            body: 'We collect information you provide during registration including name, email, phone number, and emergency contact details. We also collect location data when you trigger an SOS or enable live tracking, and device metadata for app functionality.',
          },
          {
            title: '2. How We Use Your Information',
            body: 'Your data is used solely to provide the safety services of the App — sending SOS alerts to your guardians, enabling live location sharing during emergencies, and sending you important account and safety notifications.',
          },
          {
            title: '3. Location Data',
            body: 'Location access is required for core SOS functionality. Location is only shared with your pre-approved guardian contacts when you initiate an SOS or enable journey tracking. We do not sell or share location data with third parties.',
          },
          {
            title: '4. Data Storage & Security',
            body: 'All data is stored on secured servers with industry-standard encryption. We use HTTPS for all data transmission. Passwords are stored as encrypted hashes and are never visible to anyone including our team.',
          },
          {
            title: '5. Data Sharing',
            body: 'We do not sell, trade, or share your personal data with third parties for marketing or commercial purposes. Data may only be shared with authorities if legally required by Indian law.',
          },
          {
            title: '6. Your Rights',
            body: 'You have the right to access, correct, or delete your personal data at any time from your profile settings. You may also request full data export or account deletion by contacting our support team.',
          },
          {
            title: '7. Cookies',
            body: 'The App uses essential session cookies for authentication purposes only. No tracking or advertising cookies are used.',
          },
          {
            title: '8. Children\'s Privacy',
            body: 'Sakhi Suraksha SOS is not intended for users under 13 years of age. We do not knowingly collect data from children.',
          },
          {
            title: '9. Changes to This Policy',
            body: 'We may update this Privacy Policy periodically. Any changes will be notified via email or in-app notification. Continued use of the App implies acceptance of the updated policy.',
          },
          {
            title: '10. Contact',
            body: 'For privacy concerns or data requests, contact us at privacy@veaglesafety.org or visit our Contact page.',
          },
        ].map((section) => (
          <div key={section.title} className="bg-white/90 border-1.5 border-[#FFCCE1] rounded-2xl p-6 space-y-2">
            <h2 className="text-sm font-black text-[#FF2A6D]">{section.title}</h2>
            <p className="text-xs text-[#684E67] font-bold leading-relaxed">{section.body}</p>
          </div>
        ))}

        <div className="text-center pt-4">
          <Link href="/terms" className="text-xs font-black text-[#FF2A6D] hover:underline">View Terms of Service →</Link>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
