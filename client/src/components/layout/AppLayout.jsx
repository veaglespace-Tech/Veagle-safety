import React from 'react';
import { Header } from './Header.jsx';
import { BottomNavigation } from './BottomNavigation.jsx';
import { DesktopSidebar } from './DesktopSidebar.jsx';

export const AppLayout = ({ children, fullScreen = false }) => {
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
