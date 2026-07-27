import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { io, Socket } from 'socket.io-client';
import { LiveLocationMap } from '../components/location/LiveLocationMap';
import { Phone, Navigation, AlertTriangle, Shield } from 'lucide-react';

export const LiveViewerPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [session, setSession] = useState<any>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number; lastUpdated: string } | null>(null);
  const [status, setStatus] = useState<'LIVE' | 'STALE' | 'OFFLINE'>('LIVE');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSession();

    const socket: Socket = io('http://localhost:5000');
    socket.emit('join-room', `track:${token}`);

    socket.on('location-updated', (data: any) => {
      setLocation({
        lat: data.latitude,
        lng: data.longitude,
        accuracy: data.accuracy || 10,
        lastUpdated: data.timestamp,
      });
      setStatus('LIVE');
    });

    const interval = setInterval(fetchSession, 10000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [token]);

  const fetchSession = async () => {
    try {
      const res = await api.get(`/sos/public-track/${token}`);
      const sess = res.data.session;
      setSession(sess);

      if (sess.locations && sess.locations.length > 0) {
        const latest = sess.locations[0];
        setLocation({
          lat: latest.latitude,
          lng: latest.longitude,
          accuracy: latest.accuracy || 12,
          lastUpdated: latest.recordedAt,
        });

        const diffSecs = (Date.now() - new Date(latest.recordedAt).getTime()) / 1000;
        if (diffSecs > 120) {
          setStatus('OFFLINE');
        } else if (diffSecs > 30) {
          setStatus('STALE');
        } else {
          setStatus('LIVE');
        }
      }
    } catch (err: any) {
      setError('This tracking session is invalid, expired, or safe resolution was completed.');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-blush p-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-rose/30 text-plum rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-plum">Tracking Ended or Expired</h2>
        <p className="text-xs text-tichi-muted mt-2">{error}</p>
        <a href="/" className="mt-6 bg-plum text-white font-bold px-6 py-2.5 rounded-card text-xs shadow">
          Go to Tichi Suraksha Home
        </a>
      </div>
    );
  }

  if (!session || !location) {
    return (
      <div className="min-h-screen bg-blush p-6 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-plum border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-plum mt-3">Connecting to emergency live tracking...</p>
      </div>
    );
  }

  const userName = session.user?.fullName || 'User';

  return (
    <div className="min-h-screen bg-blush p-4 max-w-xl mx-auto space-y-4">
      <header className="bg-tichi-emergency text-white p-4 rounded-card shadow-sos-glow flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-7 h-7 fill-white/20 animate-pulse" />
          <div>
            <h1 className="font-extrabold text-base">🚨 EMERGENCY LOCATION</h1>
            <p className="text-xs text-white/90">{userName} requested emergency tracking assistance</p>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold">
          {status === 'LIVE' ? '● LIVE' : status === 'STALE' ? '⚠ DELAYED' : '⚠ LAST KNOWN'}
        </div>
      </header>

      <LiveLocationMap
        lat={location.lat}
        lng={location.lng}
        accuracy={location.accuracy}
        userName={`${userName} (Emergency Location)`}
        isEmergency={true}
      />

      <div className="bg-blush-card border border-blush-border rounded-card p-4 space-y-2 shadow-plum-subtle text-xs">
        <div className="flex justify-between border-b border-blush-border pb-1.5">
          <span className="text-tichi-muted">Live Tracking Status:</span>
          <span className="font-bold text-plum">{status === 'LIVE' ? 'Connected (Updating)' : 'Last Known Location'}</span>
        </div>

        <div className="flex justify-between border-b border-blush-border pb-1.5">
          <span className="text-tichi-muted">GPS Accuracy:</span>
          <span className="font-bold text-tichi-text">±{location.accuracy} metres</span>
        </div>

        <div className="flex justify-between">
          <span className="text-tichi-muted">Last Received:</span>
          <span className="font-bold text-tichi-text">{new Date(location.lastUpdated).toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <a
          href={`tel:${session.user?.phone || ''}`}
          className="bg-plum text-white font-bold p-3.5 rounded-card text-center flex items-center justify-center space-x-2 shadow hover:bg-plum-dark transition-colors"
        >
          <Phone className="w-4 h-4 text-rose" />
          <span className="text-xs">CALL {userName.toUpperCase()}</span>
        </a>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-blush-border text-plum font-bold p-3.5 rounded-card text-center flex items-center justify-center space-x-2 shadow-sm hover:bg-plum-50 transition-colors"
        >
          <Navigation className="w-4 h-4 text-plum" />
          <span className="text-xs">OPEN NAVIGATION</span>
        </a>
      </div>

      <a
        href="tel:112"
        className="block w-full bg-tichi-emergency text-white font-extrabold p-3.5 rounded-card text-center shadow-lg hover:brightness-110 transition-all text-xs tracking-wider"
      >
        CALL EMERGENCY SERVICES (112)
      </a>
    </div>
  );
};
