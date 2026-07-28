'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './Header.js';
import { BottomNavigation } from './BottomNavigation.js';
import { DesktopSidebar } from './DesktopSidebar.js';

export const AppLayout = ({ children, fullScreen = false }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-blush">
      {/* Desktop sidebar (hidden on mobile) */}
      <DesktopSidebar />

      {/* Main content area — offset by sidebar on desktop */}
      <div className="lg:ml-64">
        {!fullScreen && <Header />}

        <main className={`${!fullScreen ? 'pb-28 lg:pb-8' : ''}`}>
          {children}
        </main>

        {!fullScreen && <BottomNavigation />}
      </div>
    </div>
  );
};
