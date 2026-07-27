import React from 'react';
import { PublicNavbar } from '../components/layout/PublicNavbar.jsx';
import { Image as ImageIcon, Shield, Smartphone, Heart } from 'lucide-react';

export const GalleryPage = () => {
  const images = [
    { title: 'Emergency SOS Radar Button', subtitle: '3-Second Instant Alert' },
    { title: 'Live GPS Location Map', subtitle: 'Real-Time Web Tracking Link' },
    { title: 'Trusted Contacts Broadcast', subtitle: 'Instant Email & SMS Dispatch' },
    { title: 'Safety Check-in Timer', subtitle: 'Automated Overdue Escalation' },
    { title: 'Super Admin HQ Command Portal', subtitle: '24/7 Operations Monitoring' },
    { title: 'Loud Panic Alarm Siren', subtitle: 'High Decibel Deterrent' },
  ];

  return (
    <div className="min-h-screen bg-plum-dark text-white font-sans relative overflow-hidden">
      <PublicNavbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-rose/20 text-rose border border-rose/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>PLATFORM VISUAL SHOWCASE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            Designed for Simplicity & Speed
          </h1>
          <p className="text-rose-muted text-base font-medium">
            Explore previews of Tichi Suraksha’s emergency response interfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item, idx) => (
            <div key={idx} className="glass-card-dark rounded-3xl p-6 border border-rose/20 space-y-4 hover:border-rose transition-all group">
              <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-plum via-plum-dark to-rose/30 border border-rose/30 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                <Shield className="w-12 h-12 text-rose animate-pulse mb-2" />
                <span className="text-xs font-black text-white">{item.title}</span>
                <span className="text-[10px] text-rose-muted mt-1 font-mono">{item.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
