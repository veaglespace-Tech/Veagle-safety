'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    src: '/images/banner-1.jpg',
    alt: 'Sakhi Suraksha SOS App - English Banner',
    title: 'SAKHI SURAKSHA SOS',
    subtitle: 'Be Alert. Be Safe. Be Strong.',
    tag: 'OFFICIAL SAFETY PLATFORM',
  },
  {
    id: 2,
    src: '/images/banner-2.jpg',
    alt: 'Sakhi Suraksha SOS App - Hindi Banner',
    title: 'सखी सुरक्षा SOS',
    subtitle: 'आपकी सुरक्षा, हमारी प्राथमिकता',
    tag: 'राष्ट्रीय महिला सुरक्षा',
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
    const interval = setInterval(nextSlide, 3800);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered]);

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto my-6 px-2 sm:px-4 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 4K ULTRA-WIDE RECTANGULAR BANNER CONTAINER */}
      <div className="relative w-full rounded-3xl bg-white/95 backdrop-blur-2xl border-2 border-[#FFCCE1] p-2.5 sm:p-4 shadow-[0_16px_50px_rgba(255,92,138,0.22)] hover:shadow-[0_22px_60px_rgba(255,42,109,0.32)] transition-all duration-500 overflow-hidden">
        
        {/* TOP ACCENT GLOW STRIP */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF5C8A] via-[#FF2A6D] to-[#E01A4F] z-30" />

        {/* WIDE LANDSCAPE IMAGE SLIDER STRETCHED HORIZONTALLY */}
        <div className="relative w-full h-[260px] sm:h-[380px] md:h-[460px] lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFF0F3] via-[#FFE6EE] to-[#FFCCE1]">
          {BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentIndex
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-105 z-0 pointer-events-none'
              }`}
            >
              {/* HORIZONTALLY SPREAD 4K COVER IMAGE */}
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover object-center w-full h-full hover:scale-105 transition-transform duration-700 ease-out"
                priority={index === 0}
                quality={100}
              />

              {/* OVERLAY GRADIENT FOR TEXT VIBRANCY */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A0826]/70 via-transparent to-transparent pointer-events-none z-10" />

              {/* CAPTION BADGE INSIDE BANNER */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 text-left space-y-1">
                <div className="inline-flex items-center space-x-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-[#FF2A6D] uppercase tracking-widest shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF2A6D]" />
                  <span>{banner.tag}</span>
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-white drop-shadow-md tracking-tight">
                  {banner.title}
                </h3>
                <p className="text-xs sm:text-base font-extrabold text-[#FFF0F3] drop-shadow-sm">
                  {banner.subtitle}
                </p>
              </div>
            </div>
          ))}

          {/* LEFT & RIGHT NAVIGATION ARROWS */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border-1.5 border-[#FFCCE1] text-[#FF2A6D] flex items-center justify-center shadow-lg hover:bg-[#FF2A6D] hover:text-white transition-all opacity-80 hover:opacity-100 group-hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border-1.5 border-[#FFCCE1] text-[#FF2A6D] flex items-center justify-center shadow-lg hover:bg-[#FF2A6D] hover:text-white transition-all opacity-80 hover:opacity-100 group-hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* TOP RIGHT AUTO SCROLL SPOTLIGHT BADGE */}
          <div className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-md border-1.5 border-[#FFCCE1] px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-black text-[#FF2A6D] flex items-center space-x-2 shadow-md uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5C8A] animate-pulse" />
            <span>4K Live Banner</span>
          </div>
        </div>

        {/* BOTTOM PAGINATION INDICATOR STRIP */}
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
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-8 bg-gradient-to-r from-[#FF5C8A] to-[#FF2A6D]'
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
