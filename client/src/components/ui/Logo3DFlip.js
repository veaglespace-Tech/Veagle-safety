'use client';

import React from 'react';
import Image from 'next/image';

export const Logo3DFlip = ({ size = 42, className = '' }) => {
  return (
    <div 
      className={`logo-3d-coin ${className}`}
      style={{ width: `${size}px`, height: `${size}px`, perspective: '1000px' }}
    >
      <div 
        className="logo-3d-inner"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* FRONT FACE (MARATHI/HINDI LOGO) */}
        <div className="logo-3d-front">
          <img 
            src="/images/logo-front.jpeg" 
            alt="Sakhi Suraksha SOS Front Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* BACK FACE (ENGLISH LOGO) */}
        <div className="logo-3d-back">
          <img 
            src="/images/logo-back.jpeg" 
            alt="Sakhi Suraksha SOS Back Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Logo3DFlip;
