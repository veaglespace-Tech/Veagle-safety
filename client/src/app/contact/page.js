'use client';

import React, { useState } from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar.js';
import { PhoneCall, Mail, MapPin, Send, ShieldCheck, Heart, Clock, User, MessageSquare, CheckCircle2, Phone } from 'lucide-react';
import { AnimatedHeading } from '../../components/common/AnimatedHeading.jsx';

export const dynamic = 'force-dynamic';

export default function ContactSupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Safety Inquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden">
      <PublicNavbar />

      {/* BACKGROUND AMBIENT GLOW MESHES */}
      <div className="absolute w-[750px] h-[750px] rounded-full bg-rose/15 blur-[160px] top-[-120px] left-[-220px] pointer-events-none" />
      <div className="absolute w-[750px] h-[750px] rounded-full bg-gold/15 blur-[160px] bottom-[80px] right-[-220px] pointer-events-none" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 relative z-10">
        
        {/* TOP HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white text-rose border border-rose/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <PhoneCall className="w-4 h-4 text-rose animate-pulse" />
            <span className="text-shimmer-animated">24/7 HELPLINE & HQ COMMAND SUPPORT</span>
          </div>

          <AnimatedHeading as="h1" variant="shimmer" className="text-4xl sm:text-6xl font-black tracking-tight">
            We Are Always Here For You
          </AnimatedHeading>
          <p className="text-tichi-muted text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Reach out to our safety command team, access 24/7 national emergency helplines, or send us a support message.
          </p>
        </div>

        {/* 2-COLUMN MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          
          {/* LEFT COLUMN: EMERGENCY HELPLINES & HQ DETAILS */}
          <div className="space-y-8">
            
            {/* NATIONAL EMERGENCY HELPLINES */}
            <div className="card-antique-pink p-8 space-y-5 border-2 border-rose/40 shadow-coral-glow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose/15 text-rose flex items-center justify-center border border-rose/30">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-tichi-text">🚨 National Helplines</h3>
                    <p className="text-xs text-tichi-muted font-extrabold">Instant Toll-Free Emergency Numbers</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-emergency bg-emergency-bg px-3 py-1 rounded-full border border-emergency-border uppercase tracking-wider">
                  24/7 ACTIVE
                </span>
              </div>

              <ul className="space-y-3.5 text-xs">
                <li className="flex justify-between items-center bg-blush-subtle p-3.5 rounded-2xl border border-[#FFCCE1]">
                  <div>
                    <span className="font-black text-tichi-text block">National Emergency Number</span>
                    <span className="text-[10px] text-tichi-muted font-bold">Police, Ambulance, Fire Dispatch</span>
                  </div>
                  <a
                    href="tel:112"
                    className="btn-baby-pink text-xs px-4 py-2 shadow-coral-glow flex items-center space-x-1.5"
                  >
                    <span>CALL 112</span>
                  </a>
                </li>

                <li className="flex justify-between items-center bg-blush-subtle p-3.5 rounded-2xl border border-[#FFCCE1]">
                  <div>
                    <span className="font-black text-tichi-text block">Women Helpline (All India)</span>
                    <span className="text-[10px] text-tichi-muted font-bold">24/7 Women Safety Support</span>
                  </div>
                  <a
                    href="tel:1091"
                    className="btn-baby-pink text-xs px-4 py-2 shadow-coral-glow flex items-center space-x-1.5"
                  >
                    <span>CALL 1091</span>
                  </a>
                </li>

                <li className="flex justify-between items-center bg-blush-subtle p-3.5 rounded-2xl border border-[#FFCCE1]">
                  <div>
                    <span className="font-black text-tichi-text block">Domestic Abuse & Violence</span>
                    <span className="text-[10px] text-tichi-muted font-bold">NCW Women Helpline</span>
                  </div>
                  <a
                    href="tel:181"
                    className="btn-baby-pink text-xs px-4 py-2 shadow-coral-glow flex items-center space-x-1.5"
                  >
                    <span>CALL 181</span>
                  </a>
                </li>

                <li className="flex justify-between items-center bg-blush-subtle p-3.5 rounded-2xl border border-[#FFCCE1]">
                  <div>
                    <span className="font-black text-tichi-text block">Police Control Room</span>
                    <span className="text-[10px] text-tichi-muted font-bold">Local City Police Dispatch</span>
                  </div>
                  <a
                    href="tel:100"
                    className="btn-baby-pink-outline text-xs px-4 py-2 flex items-center space-x-1.5"
                  >
                    <span>CALL 100</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* HQ COMMAND CENTER DETAILS */}
            <div className="card-antique-pink p-8 space-y-4 border border-gold/40">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold-dark flex items-center justify-center border border-gold/30">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-tichi-text">🏢 Sakhi Suraksha SOS HQ Command</h3>
                  <p className="text-xs text-tichi-muted font-bold">Veagle Safety Network Data Centers</p>
                </div>
              </div>

              <p className="text-xs text-tichi-muted leading-relaxed font-semibold">
                Veagle Safety Network Operations HQ, Pune & Mumbai Data Centers, Maharashtra, India.
              </p>

              <div className="pt-2 border-t border-blush-border space-y-2 text-xs font-mono font-bold">
                <div className="flex items-center space-x-2 text-tichi-text">
                  <Mail className="w-4 h-4 text-gold-dark shrink-0" />
                  <span>Email: support@sakhisuraksha.org</span>
                </div>
                <div className="flex items-center space-x-2 text-tichi-text">
                  <Clock className="w-4 h-4 text-gold-dark shrink-0" />
                  <span>Hours: 24/7 / 365 Days Non-Stop Monitoring</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <div className="card-antique-pink p-8 sm:p-10 space-y-6">
            
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-tichi-text">Send Message to Support</h3>
              <p className="text-xs text-tichi-muted font-bold">
                Fill out the form below and our safety response team will get back to you shortly.
              </p>
            </div>

            {submitted ? (
              <div className="bg-rose/10 border-2 border-rose text-rose p-8 rounded-3xl text-center space-y-3 animate-fade-up">
                <div className="w-16 h-16 rounded-2xl bg-rose/20 text-rose flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-black">Message Received Successfully!</h4>
                <p className="text-xs text-tichi-muted font-semibold max-w-sm mx-auto">
                  Thank you for reaching out, <span className="font-bold text-tichi-text">{name || 'valued user'}</span>. Our safety command team will review your inquiry and respond within 2 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn-baby-pink text-xs px-6 py-2.5 uppercase tracking-wider"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                
                <div>
                  <label className="block text-tichi-muted font-bold mb-1.5">Your Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 input-antique-pink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-tichi-muted font-bold mb-1.5">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="priya@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 input-antique-pink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-tichi-muted font-bold mb-1.5">Phone Number (Optional)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-tichi-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 input-antique-pink"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-tichi-muted font-bold mb-1.5">Inquiry Topic</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3.5 input-antique-pink font-bold"
                  >
                    <option value="General Safety Inquiry">General Safety Inquiry</option>
                    <option value="Technical Support">Technical Support / App Issue</option>
                    <option value="Billing / Plan Assistance">Billing / Plan Formalities Assistance</option>
                    <option value="Emergency Escalation">Emergency Escalation Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-tichi-muted font-bold mb-1.5">Your Message *</label>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-tichi-muted absolute left-3.5 top-3.5" />
                    <textarea
                      rows={4}
                      required
                      placeholder="How can our safety team assist you today?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 input-antique-pink"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-baby-pink py-4 text-xs uppercase tracking-wider shadow-coral-glow flex items-center justify-center space-x-2"
                >
                  <span>SEND INQUIRY TO SAFETY HQ</span>
                  <Send className="w-4 h-4" />
                </button>

              </form>
            )}

          </div>

        </div>
      </section>
    </div>
  );
}
