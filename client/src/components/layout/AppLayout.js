'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Header } from './Header.js';
import { BottomNavigation } from './BottomNavigation.js';
import { DesktopSidebar } from './DesktopSidebar.js';
import { Footer } from './Footer.js';
import { SuperAdminQuickJump } from '../common/SuperAdminQuickJump.jsx';

export const AppLayout = ({ children, fullScreen = false }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { token, user } = useSelector((state) => state?.auth || {});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const protectedPaths = [
      '/dashboard',
      '/active-sos',
      '/contacts',
      '/track-journey',
      '/subscription',
      '/settings',
      '/profile',
      '/admin',
    ];

    const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(path + '/'));

    const hasAuthToken =
      Boolean(token) ||
      Boolean(user?.email) ||
      (typeof window !== 'undefined' &&
        (Boolean(localStorage.getItem('tichi_token')) ||
          Boolean(localStorage.getItem('token')) ||
          Boolean(localStorage.getItem('tichi_user'))));

    if (isProtected && !hasAuthToken) {
      router.push('/auth?mode=login');
      return;
    }

    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    // Non-admin trying to access /admin -> redirect to /dashboard
    if (hasAuthToken && pathname.startsWith('/admin') && !isSuperAdmin) {
      router.push('/dashboard');
      return;
    }

    // SuperAdmin trying to access member workspace pages -> redirect to /admin
    const memberOnlyPaths = ['/subscription', '/contacts', '/track-journey'];
    if (hasAuthToken && isSuperAdmin && memberOnlyPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
      router.push('/admin');
      return;
    }
  }, [mounted, pathname, token, user, router]);

  return (
    <div className="min-h-screen bg-blush flex flex-col relative">
      {/* Desktop sidebar (hidden on mobile) */}
      <Suspense fallback={null}>
        <DesktopSidebar />
      </Suspense>

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
