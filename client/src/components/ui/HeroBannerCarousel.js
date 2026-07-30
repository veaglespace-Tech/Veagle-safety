'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    src: '/images/banner-1.jpg',
    alt: 'Sakhi Suraksha SOS App - English Banner',
  },
  {
    id: 2,
    src: '/images/banner-2.jpg',
    alt: 'Sakhi Suraksha SOS App - Hindi Banner',
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
      className="relative w-full max-w-5xl mx-auto my-3 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* DIRECT IMAGE SLIDER WITHOUT OUTER CARD BORDER LAYOUT */}
      <div className="relative w-full h-[240px] sm:h-[360px] md:h-[440px] lg:h-[480px] rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(255,92,138,0.18)]">
        {BANNERS.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-105 z-0 pointer-events-none'
            }`}
          >
            {/* DIRECT 4K HORIZONTALLY SPREAD COVER IMAGE */}
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover object-center w-full h-full hover:scale-105 transition-transform duration-700 ease-out"
              priority={index === 0}
            />
          </div>
        ))}

        {/* LEFT & RIGHT NAVIGATION ARROWS */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-[#FF2A6D] flex items-center justify-center shadow-md hover:bg-[#FF2A6D] hover:text-white transition-all opacity-80 hover:opacity-100 active:scale-95 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-[#FF2A6D] flex items-center justify-center shadow-md hover:bg-[#FF2A6D] hover:text-white transition-all opacity-80 hover:opacity-100 active:scale-95 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* OVERLAY PAGINATION DOTS */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
