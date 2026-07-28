'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { apiClient } from '../redux/api/apiClient.js';

/**
 * Registers Service Worker and subscribes to Web Push Notifications.
 * Called from Providers so every logged-in user is auto-subscribed.
 * Trusted contacts visiting the site with their email will also be subscribed.
 */
export function usePushNotification() {
  const { token, user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('[PushNotification] Not supported in this browser');
      return;
    }

    async function registerAndSubscribe() {
      try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('[PushNotification] Service Worker registered:', registration.scope);

        // Get VAPID public key from server
        const keyRes = await apiClient.get('/push/vapid-key');
        const vapidPublicKey = keyRes.data?.publicKey;
        if (!vapidPublicKey) return;

        // Convert VAPID key to Uint8Array
        const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('[PushNotification] Permission denied');
          return;
        }

        // Subscribe to push
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });

        // Save subscription to server (authenticated user)
        if (token) {
          await apiClient.post('/push/subscribe', { subscription });
          console.log('[PushNotification] Push subscription saved for user:', user?.email);
        }
      } catch (error) {
        console.warn('[PushNotification] Subscription failed:', error.message);
      }
    }

    registerAndSubscribe();
  }, [token, user?.email]);
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
