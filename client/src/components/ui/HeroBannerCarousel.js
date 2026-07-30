'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    src: '/images/banner-1.jpg',
    alt: 'Sakhi Suraksha SOS App - English Banner',
    title: 'SAKHI SURAKSHA SOS',
    subtitle: 'Be Alert. Be Safe. Be Strong.',
  },
  {
    id: 2,
    src: '/images/banner-2.jpg',
    alt: 'Sakhi Suraksha SOS App - Hindi Banner',
    title: 'सखी सुरक्षा SOS',
    subtitle: 'आपकी सुरक्षा, हमारी प्राथमिकता',
  },
];

export const HeroBannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNERS.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + BANNERS.length) % BANNERS.length);
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered]);

  return (
    <div 
      className="relative max-w-4xl mx-auto px-4 sm:px-6 my-6 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* GLASSMORPHIC CONTAINER CARD */}
      <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl border-1.5 border-[#FFCCE1] p-3 sm:p-5 shadow-[0_12px_36px_rgba(255,92,138,0.16)] hover:shadow-[0_18px_50px_rgba(255,42,109,0.25)] transition-all duration-500 overflow-hidden">
        
        {/* TOP ACCENT GLOW BAR */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F]" />

        {/* IMAGE SLIDER */}
        <div className="relative w-full h-[240px] sm:h-[340px] md:h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFF0F3] to-[#FFCCE1] flex items-center justify-center">
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center justify-center p-2 ${
                index === currentIndex
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-95 z-0 pointer-events-none'
              }`}
            >
              <div className="relative w-full h-full max-w-md sm:max-w-lg md:max-w-xl mx-auto flex items-center justify-center">
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-contain drop-shadow-md hover:scale-[1.02] transition-transform duration-500"
                  priority={index === 0}
                />
              </div>
            </div>
          ))}

          {/* LEFT & RIGHT NAVIGATION BUTTONS */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-[#FFCCE1] text-[#FF2A6D] flex items-center justify-center shadow-md hover:bg-[#FF5C8A] hover:text-white transition-all opacity-80 hover:opacity-100 group-hover:scale-105 active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-[#FFCCE1] text-[#FF2A6D] flex items-center justify-center shadow-md hover:bg-[#FF5C8A] hover:text-white transition-all opacity-80 hover:opacity-100 group-hover:scale-105 active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* LIVE AUTO SCROLL BADGE */}
          <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-md border border-[#FFCCE1] px-3 py-1 rounded-full text-[10px] font-black text-[#FF2A6D] flex items-center space-x-1.5 shadow-sm uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#FF5C8A] animate-pulse" />
            <span>Sakhi Safety Spotlight</span>
          </div>
        </div>

        {/* PAGINATION DOTS & CAPTION */}
        <div className="flex items-center justify-between pt-3 px-2">
          <div className="text-xs font-black text-[#2A0826] tracking-wide">
            <span className="text-[#FF2A6D]">{BANNERS[currentIndex].title}</span>
            <span className="text-[#684E67] font-bold text-[11px] ml-2 hidden sm:inline">
              · {BANNERS[currentIndex].subtitle}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-7 bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D]'
                    : 'w-2.5 bg-[#FFCCE1] hover:bg-[#FF5C8A]/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
