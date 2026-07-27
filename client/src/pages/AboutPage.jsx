import React from 'react';
import { PublicNavbar } from '../components/layout/PublicNavbar.jsx';
import { Shield, Heart, Lock, Award, Users, Globe } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden">
      <PublicNavbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white text-rose border border-rose/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-rose" />
            <span>OUR MISSION & PURPOSE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-tichi-text">
            Built to Protect Every Girl and Woman
          </h1>
          <p className="text-tichi-muted text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Sakhi Suraksha SOS was engineered with one primary goal: extremely fast access to emergency help, trusted contacts, and secure live location sharing without complexity or delay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card rounded-3xl p-8 border border-blush-border space-y-4 hover:border-rose transition-all shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose/10 text-rose flex items-center justify-center border border-rose/30">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-tichi-text">Privacy-First Architecture</h3>
            <p className="text-xs text-tichi-muted leading-relaxed font-medium">
              Your location is private and shared ONLY during active SOS triggers or explicitly authorized journey tracking sessions. We never sell or share user data.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-blush-border space-y-4 hover:border-gold transition-all shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold-dark flex items-center justify-center border border-gold/30">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-tichi-text">Production-Grade Reliability</h3>
            <p className="text-xs text-tichi-muted leading-relaxed font-medium">
              Built on Node.js, Express, Socket.IO, and MySQL for ultra-fast, sub-second websocket broadcasting during critical emergencies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
