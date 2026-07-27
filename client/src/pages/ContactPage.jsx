import React, { useState } from 'react';
import { PublicNavbar } from '../components/layout/PublicNavbar.jsx';
import { PhoneCall, Mail, MapPin, Send, ShieldCheck, Heart } from 'lucide-react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden">
      <PublicNavbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white text-rose border border-rose/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>24/7 HELPLINE & HQ COMMAND SUPPORT</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-tichi-text">
            We Are Always Here For You
          </h1>
          <p className="text-tichi-muted text-base font-medium">
            Reach out to our safety team or access national emergency helplines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* HELPLINES & HQ DETAILS */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-8 border border-blush-border space-y-4 shadow-sm">
              <h3 className="text-xl font-black text-rose">🚨 National Emergency Helplines</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center bg-blush-subtle p-3 rounded-xl border border-blush-border">
                  <span className="font-bold text-tichi-text">National Emergency Number</span>
                  <a href="tel:112" className="bg-rose text-white font-black px-3 py-1 rounded-lg text-xs shadow-sm hover:brightness-110">112</a>
                </li>
                <li className="flex justify-between items-center bg-blush-subtle p-3 rounded-xl border border-blush-border">
                  <span className="font-bold text-tichi-text">Women Helpline (All India)</span>
                  <a href="tel:1091" className="bg-rose text-white font-black px-3 py-1 rounded-lg text-xs shadow-sm hover:brightness-110">1091</a>
                </li>
                <li className="flex justify-between items-center bg-blush-subtle p-3 rounded-xl border border-blush-border">
                  <span className="font-bold text-tichi-text">Domestic Abuse Helpline</span>
                  <a href="tel:181" className="bg-rose text-white font-black px-3 py-1 rounded-lg text-xs shadow-sm hover:brightness-110">181</a>
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-3xl p-8 border border-gold/40 space-y-3 shadow-sm">
              <h3 className="text-xl font-black text-gold-dark">🏢 Sakhi Suraksha SOS HQ Command</h3>
              <p className="text-xs text-tichi-muted leading-relaxed font-medium">
                Veagle Safety Network Operations HQ, Pune & Mumbai Data Centers, Maharashtra, India.
              </p>
              <p className="text-xs text-gold-dark font-mono font-bold">Email: support@sakhisuraksha.org</p>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="glass-card rounded-3xl p-8 border border-blush-border space-y-6 shadow-sm">
            <h3 className="text-xl font-bold text-tichi-text">Send Message to Support</h3>

            {submitted ? (
              <div className="bg-rose/10 border border-rose text-rose p-6 rounded-2xl text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-rose mx-auto" />
                <h4 className="font-bold">Message Received</h4>
                <p className="text-xs text-tichi-muted font-medium">Our safety command team will respond to your inquiry shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-tichi-muted font-bold mb-1">Your Name</label>
                  <input type="text" required placeholder="Full Name" className="w-full p-3 rounded-xl bg-blush-subtle border border-blush-border text-tichi-text placeholder-tichi-faint" />
                </div>

                <div>
                  <label className="block text-tichi-muted font-bold mb-1">Email Address</label>
                  <input type="email" required placeholder="name@example.com" className="w-full p-3 rounded-xl bg-blush-subtle border border-blush-border text-tichi-text placeholder-tichi-faint" />
                </div>

                <div>
                  <label className="block text-tichi-muted font-bold mb-1">Message</label>
                  <textarea rows="4" required placeholder="How can we assist you?" className="w-full p-3 rounded-xl bg-blush-subtle border border-blush-border text-tichi-text placeholder-tichi-faint" />
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-rose via-rose-light to-rose text-white font-black py-3.5 rounded-xl shadow-coral-glow uppercase tracking-wider flex items-center justify-center space-x-2 hover:brightness-110 active:scale-98 transition-all">
                  <span>SEND INQUIRY</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};
