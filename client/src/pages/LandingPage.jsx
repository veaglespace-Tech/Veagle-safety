import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar.jsx';
import { Shield, Sparkles, PhoneCall, Radio, Eye, Lock, Zap, ArrowRight, HeartHandshake, MapPin, BellRing, Award, Users } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-plum-dark text-white selection:bg-rose selection:text-white font-sans relative overflow-hidden">
      <PublicNavbar />

      {/* BACKGROUND AMBIENT GLOW MESHES */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-rose/10 blur-[150px] top-[-100px] left-[-200px] pointer-events-none" />
      <div className="absolute w-[700px] h-[700px] rounded-full bg-gold/10 blur-[150px] bottom-[100px] right-[-200px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center space-y-10">

        {/* HERO BADGE */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose/20 via-plum-light/30 to-gold/20 border border-rose/40 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest animate-fade-up shadow-coral-glow">
          <Sparkles className="w-4 h-4 text-gold animate-pulse" />
          <span className="text-white">INDIA'S MOST TRUSTED PERSONAL SAFETY PLATFORM</span>
        </div>

        {/* HERO TITLE */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
            Empowering Women & Girls with <br />
            <span className="bg-gradient-to-r from-rose via-gold to-rose-muted bg-clip-text text-transparent">
              Instant 3-Second SOS Protection
            </span>
          </h1>
          <p className="text-base sm:text-xl text-rose-muted max-w-2xl mx-auto font-medium leading-relaxed">
            A modern, calm, and trustworthy personal safety companion designed specifically for girls and women. Fast emergency alerts, live GPS location sharing, and 24/7 command dispatch.
          </p>
        </div>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/auth?mode=register"
            className="w-full sm:w-auto bg-gradient-to-r from-rose via-plum-light to-rose text-white text-base font-black px-8 py-4 rounded-2xl shadow-coral-glow hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-3"
          >
            <span>PROTECT YOURSELF NOW</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/pricing"
            className="w-full sm:w-auto glass-card-dark border border-gold/40 text-gold hover:text-white text-base font-black px-8 py-4 rounded-2xl hover:bg-gold/10 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <Zap className="w-5 h-5" />
            <span>VIEW SAFETY PLANS</span>
          </Link>
        </div>

        {/* RADAR SOS PULSE HERO MOCKUP */}
        <div className="pt-10 max-w-3xl mx-auto relative">
          <div className="glass-card-dark rounded-3xl p-8 border border-rose/30 shadow-2xl relative overflow-hidden group">
            
            {/* Animated Radar Scanning Line */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose/10 via-transparent to-transparent opacity-50 animate-pulse pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              
              {/* Left Column: Interactive SOS Button Preview */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-rose animate-ping" />
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose to-emergency-dark border-4 border-white text-white flex flex-col items-center justify-center shadow-coral-glow">
                    <Radio className="w-8 h-8 animate-pulse" />
                    <span className="text-[11px] font-black uppercase mt-1">PRESS SOS</span>
                  </div>
                </div>
                <span className="text-xs font-black text-rose uppercase tracking-wider">3-Sec Hold Trigger</span>
              </div>

              {/* Right Column: Live Status Highlights */}
              <div className="text-left space-y-3 flex-1">
                <div className="flex items-center space-x-2 bg-plum-dark/80 p-3 rounded-xl border border-rose/20">
                  <MapPin className="w-5 h-5 text-rose shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Encrypted Live GPS Tracking</div>
                    <div className="text-[11px] text-rose-muted">Shares exact coordinates with trusted contacts</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-plum-dark/80 p-3 rounded-xl border border-gold/20">
                  <BellRing className="w-5 h-5 text-gold shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-gold">Instant Email & SMS Alerting</div>
                    <div className="text-[11px] text-rose-muted">Instant broadcast to family & emergency response</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* METRICS & STATS BAR */}
      <section className="border-y border-rose/20 bg-plum-dark/60 py-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-rose">100%</div>
            <div className="text-xs text-rose-muted font-bold uppercase tracking-wider">Encrypted Privacy</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-gold">&lt; 3 Sec</div>
            <div className="text-xs text-rose-muted font-bold uppercase tracking-wider">Emergency Response</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-rose">24 / 7</div>
            <div className="text-xs text-rose-muted font-bold uppercase tracking-wider">HQ Dispatch Monitoring</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-gold">5 Contacts</div>
            <div className="text-xs text-rose-muted font-bold uppercase tracking-wider">Instant Broadcast</div>
          </div>
        </div>
      </section>

      {/* KEY FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Designed For Real Safety in Any Situation
          </h2>
          <p className="text-rose-muted text-sm sm:text-base max-w-xl mx-auto font-medium">
            From night commutes to solitary journeys, Tichi Suraksha delivers peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="glass-card-dark rounded-3xl p-8 border border-rose/30 space-y-4 hover:border-rose transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-rose/20 border border-rose/40 text-rose flex items-center justify-center group-hover:scale-110 transition-transform">
              <Radio className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">One-Touch SOS Broadcast</h3>
            <p className="text-xs text-rose-muted leading-relaxed">
              Press and hold the SOS button for 3 seconds to instantly send your live coordinates, battery level, and emergency link to all trusted contacts.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card-dark rounded-3xl p-8 border border-gold/30 space-y-4 hover:border-gold transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-gold/20 border border-gold/40 text-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Live Journey Companion</h3>
            <p className="text-xs text-rose-muted leading-relaxed">
              Share a protected journey link with family before taking a cab or walking alone at night. Auto-alerts triggers if you fail to reach safely.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card-dark rounded-3xl p-8 border border-rose/30 space-y-4 hover:border-rose transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-rose/20 border border-rose/40 text-rose flex items-center justify-center group-hover:scale-110 transition-transform">
              <BellRing className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Loud Panic Alarm & Fake Call</h3>
            <p className="text-xs text-rose-muted leading-relaxed">
              Deter harassers with a high-decibel piercing alarm siren or escape uncomfortable situations using realistic automated fake incoming calls.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-rose/20 bg-plum-dark py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-6 h-6 text-rose" />
            <span className="font-black text-lg text-white">Tichi Suraksha</span>
          </div>
          <p className="text-xs text-rose-muted">
            © 2026 Tichi Suraksha Safety Network. Built with care for Women & Girls everywhere.
          </p>
        </div>
      </footer>

    </div>
  );
};
