import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTrackingState } from '../redux/slices/locationSlice.js';
import { sosApi } from '../redux/api/sosApi.js';

export const useBrowserLocation = (activeSosId = null) => {
  const dispatch = useDispatch();
  const { latitude, longitude, accuracy } = useSelector((state) => state?.location || {});
  const lastSentCoordRef = useRef({ lat: null, lng: null, time: 0 });
  const isTrackingRef = useRef(false);

  // Calculate rough distance between two coordinates in meters
  const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371e3;
    const p1 = (lat1 * Math.PI) / 180;
    const p2 = (lat2 * Math.PI) / 180;
    const deltaP = p2 - p1;
    const deltaLon = lon2 - lon1;
    const deltaLambda = (deltaLon * Math.PI) / 180;
    const a =
      Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
      Math.cos(p1) * Math.cos(p2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const startLocationTracking = () => {
    isTrackingRef.current = true;
    dispatch(setTrackingState(true));
  };

  const stopLocationTracking = () => {
    isTrackingRef.current = false;
    dispatch(setTrackingState(false));
  };

  // Sync to backend whenever Redux location updates
  useEffect(() => {
    if (!isTrackingRef.current || !activeSosId || !latitude || !longitude) return;

    const { lat: lastLat, lng: lastLng, time } = lastSentCoordRef.current;
    const distance = getDistanceInMeters(lastLat, lastLng, latitude, longitude);
    const timeSinceLastSync = Date.now() - time;

    // Throttle updates: send if moved at least 1 meter OR 3 seconds have passed OR haven't sent yet
    if (distance > 1 || timeSinceLastSync > 3000 || lastLat === null) {
      // Optimistically update ref to prevent duplicate concurrent calls
      lastSentCoordRef.current = { lat: latitude, lng: longitude, time: Date.now() };
      
      sosApi
        .updateSosLocation({
          sosSessionId: activeSosId,
          latitude,
          longitude,
          accuracy: accuracy || 15,
        })
        .catch((err) => {
          console.error('[useBrowserLocation] Failed to sync GPS to backend:', err);
          // Rollback ref on failure so it tries again
          lastSentCoordRef.current = { lat: lastLat, lng: lastLng, time };
        });
    }
  }, [latitude, longitude, accuracy, activeSosId]);

  return {
    startLocationTracking,
    stopLocationTracking,
  };
};
