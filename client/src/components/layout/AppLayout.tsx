import React from 'react';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { DesktopSidebar } from './DesktopSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  /** Hide bottom nav and header for full-screen pages like active SOS */
  fullScreen?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, fullScreen = false }) => {
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
