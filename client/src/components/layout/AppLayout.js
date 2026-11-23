'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Header } from './Header.js';
import { BottomNavigation } from './BottomNavigation.js';
import { DesktopSidebar } from './DesktopSidebar.js';

import { GeoLocationTracker } from '../common/GeoLocationTracker.js';


export const AppLayout = ({ children, fullScreen = false }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { token, user } = useSelector((state) => state?.auth || {});

  useEffect(() => {
    setMounted(true);
  }, []);

  const protectedPaths = [
    '/dashboard',
    '/active-sos',
    '/contacts',
    '/track-journey',
    '/subscription',
    '/settings',
    '/profile',
    '/admin',
    '/organization',
    '/parent',
  ];

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  const hasAuthToken =
    Boolean(token) ||
    (typeof window !== 'undefined' &&
      (Boolean(localStorage.getItem('tichi_token')) || Boolean(localStorage.getItem('token'))));

  useEffect(() => {
    if (!mounted) return;

    // 1. Unauthenticated check for all protected routes
    if (isProtected && !hasAuthToken) {
      if (typeof window !== 'undefined') {
        window.location.replace('/auth?mode=login');
      } else {
        router.push('/auth?mode=login');
      }
      return;
    }

    if (!hasAuthToken) return;

    // Resolve current user info and role
    let activeUser = user;
    if (!activeUser?.id && typeof window !== 'undefined') {
      try {
        activeUser = JSON.parse(localStorage.getItem('tichi_user') || '{}');
      } catch (e) {}
    }

    const role = activeUser?.role || 'USER';

    // 2. Strict Role-Based Route Guards:

    // SUPER_ADMIN: only allowed in /admin routes, profile, settings
    if (role === 'SUPER_ADMIN') {
      const nonAdminAllowed = ['/settings', '/profile'];
      if (!pathname.startsWith('/admin') && !nonAdminAllowed.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
        router.replace('/admin');
        return;
      }
    }

    // ORGANIZATION: only allowed in /organization routes, settings, profile
    if (role === 'ORGANIZATION') {
      const orgAllowed = ['/organization', '/settings', '/profile'];
      const isAllowed = orgAllowed.some((p) => pathname === p || pathname.startsWith(p + '/'));
      if (isProtected && !isAllowed) {
        router.replace('/organization');
        return;
      }
    }

    // PARENT (Guardian): only allowed in /parent routes, settings, profile
    if (role === 'PARENT') {
      const parentAllowed = ['/parent', '/settings', '/profile'];
      const isAllowed = parentAllowed.some((p) => pathname === p || pathname.startsWith(p + '/'));
      if (isProtected && !isAllowed) {
        router.replace('/parent');
        return;
      }
    }

    // USER (Standard Safety Member): CANNOT access /admin, /organization, /parent
    if (role === 'USER') {
      if (pathname.startsWith('/admin') || pathname.startsWith('/organization') || pathname.startsWith('/parent')) {
        router.replace('/dashboard');
        return;
      }

      // Check for subscription expiry for safety-critical routes
      const safetyRoutes = ['/active-sos', '/track-journey', '/contacts', '/dashboard'];
      const isSafetyRoute = safetyRoutes.some((p) => pathname === p || pathname.startsWith(p + '/'));

      const expDate = activeUser?.subscriptionExpiresAt ? new Date(activeUser.subscriptionExpiresAt) : null;
      const isSubExpired =
        activeUser?.subscriptionStatus !== 'ACTIVE' ||
        (expDate && expDate < new Date());

      if (isSafetyRoute && isSubExpired && !pathname.startsWith('/subscription') && !pathname.startsWith('/payment') && !pathname.startsWith('/auth')) {
        router.replace('/pricing');
        return;
      }
    }
  }, [mounted, pathname, hasAuthToken, isProtected, user, router]);

  let currentUser = user;
  if (!currentUser?.id && typeof window !== 'undefined') {
    try {
      currentUser = JSON.parse(localStorage.getItem('tichi_user') || '{}');
    } catch (e) {}
  }

  const isUserExpired =
    currentUser?.role === 'USER' &&
    (currentUser.subscriptionStatus !== 'ACTIVE' ||
      (currentUser.subscriptionExpiresAt && new Date(currentUser.subscriptionExpiresAt) < new Date()));

  if (mounted && isProtected && !hasAuthToken) {
    return (
      <div className="min-h-screen bg-[#FFF0F3] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-3 border-[#FF2A6D] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (
    mounted &&
    isProtected &&
    hasAuthToken &&
    isUserExpired &&
    !pathname.startsWith('/subscription') &&
    !pathname.startsWith('/payment') &&
    !pathname.startsWith('/auth')
  ) {
    return (
      <div className="min-h-screen bg-[#FFF0F3] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-[#FF2A6D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-black text-[#2A0826] uppercase tracking-wider">Active Protection Plan Required</p>
        <p className="text-xs font-bold text-[#684E67] mt-1">Redirecting you to subscription plans...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush flex flex-col relative overflow-x-hidden">
      <GeoLocationTracker />
      {/* Desktop sidebar (hidden on mobile) */}
      <Suspense fallback={null}>
        <DesktopSidebar />
      </Suspense>

      {/* Main content area — offset by sidebar on desktop */}
      <div className="lg:ml-72 flex-1 flex flex-col min-w-0">
        {!fullScreen && <Header />}

        <main className={`flex-1 ${!fullScreen ? 'pb-24 lg:pb-6' : ''}`}>{children}</main>

        {!fullScreen && (
          <Suspense fallback={null}>
            <BottomNavigation />
          </Suspense>
        )}
      </div>
    </div>
  );
};
