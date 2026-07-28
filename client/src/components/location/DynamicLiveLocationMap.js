'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const DynamicMap = dynamic(
  () => import('./LiveLocationMap.js').then((mod) => mod.LiveLocationMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-blush-subtle flex items-center justify-center text-xs font-bold text-tichi-muted animate-pulse">
        📍 Loading Interactive Leaflet Map...
      </div>
    ),
  }
);

export const LiveLocationMap = (props) => {
  return <DynamicMap {...props} />;
};
