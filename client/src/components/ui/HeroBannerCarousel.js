'use client';

import React, { useState, useEffect, useCallback } from 'react';

const BANNERS = [
  {
    id: 1,
    src: '/images/banner-1.jpg',
    alt: 'Sakhi Suraksha SOS App Banner 1',
  },
  {
    id: 2,
    src: '/images/banner-2.jpg',
    alt: 'Sakhi Suraksha SOS App Banner 2',
  },
];

export const HeroBannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNERS.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
      {/* DIRECT IMAGE BANNER SPREAD FILLING THE EXACT OPEN SPACE */}
      <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[450px] flex items-center justify-center">
        {BANNERS.map((banner, index) => (
          <img
            key={banner.id}
            src={banner.src}
            alt={banner.alt}
            className={`absolute inset-0 w-full h-full object-contain object-center transition-all duration-700 ease-in-out ${
              index === currentIndex
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-95 z-0'
            }`}
          />
        ))}

        {/* MINIMAL DOT INDICATORS */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#FFCCE1]">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-[#FF2A6D]'
                  : 'w-2 bg-[#FFCCE1]'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
