'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './Header.js';
import { BottomNavigation } from './BottomNavigation.js';
import { DesktopSidebar } from './DesktopSidebar.js';
import { Footer } from './Footer.js';
import { SuperAdminQuickJump } from '../common/SuperAdminQuickJump.jsx';

export const AppLayout = ({ children, fullScreen = false }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-blush flex flex-col relative">
      {/* Desktop sidebar (hidden on mobile) */}
      <DesktopSidebar />

      {/* Main content area — offset by sidebar on desktop */}
      <div className="lg:ml-64 flex-1 flex flex-col">
        {!fullScreen && <Header />}

        <main className={`flex-1 ${!fullScreen ? 'pb-28 lg:pb-8' : ''}`}>
          {children}
        </main>

        {!fullScreen && <Footer />}
        {!fullScreen && <BottomNavigation />}
      </div>

      {/* Super Admin Quick Jump Floating Dock */}
      <SuperAdminQuickJump />
    </div>
  );
};
