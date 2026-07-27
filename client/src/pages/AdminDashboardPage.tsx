import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Shield, AlertTriangle, Users, Navigation, Activity, CheckCircle, RefreshCw } from 'lucide-react';
import { LiveLocationMap } from '../components/location/LiveLocationMap';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
    const interval = setInterval(fetchOverview, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await api.get('/admin/overview');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch admin overview');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blush flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-plum border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-plum mt-3">Loading Operations Portal...</p>
      </div>
    );
  }

  const { metrics, activeSos } = data;

  return (
    <div className="min-h-screen bg-blush p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-blush-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-plum" />
            <h1 className="font-extrabold text-2xl text-plum tracking-tight">Tichi Suraksha Operations Portal</h1>
          </div>
          <p className="text-xs text-tichi-muted mt-0.5">Real-time Emergency Response & Alert Delivery Monitoring</p>
        </div>

        <button
          onClick={fetchOverview}
          className="bg-white border border-blush-border px-3 py-1.5 rounded-xl text-xs font-bold text-plum flex items-center space-x-1.5 hover:bg-plum-50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Feed</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blush-card p-4 rounded-card border border-blush-border shadow-plum-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-tichi-muted uppercase">Active SOS Alerts</span>
            <AlertTriangle className="w-5 h-5 text-tichi-emergency animate-pulse" />
          </div>
          <p className="text-2xl font-black text-tichi-emergency mt-2">{metrics.activeSosCount}</p>
        </div>

        <div className="bg-blush-card p-4 rounded-card border border-blush-border shadow-plum-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-tichi-muted uppercase">Total Protected Users</span>
            <Users className="w-5 h-5 text-plum" />
          </div>
          <p className="text-2xl font-black text-plum mt-2">{metrics.totalUsers}</p>
        </div>

        <div className="bg-blush-card p-4 rounded-card border border-blush-border shadow-plum-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-tichi-muted uppercase">Active Journeys</span>
            <Navigation className="w-5 h-5 text-plum" />
          </div>
          <p className="text-2xl font-black text-plum mt-2">{metrics.activeJourneysCount}</p>
        </div>

        <div className="bg-blush-card p-4 rounded-card border border-blush-border shadow-plum-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-tichi-muted uppercase">System Health</span>
            <Activity className="w-5 h-5 text-tichi-success" />
          </div>
          <p className="text-sm font-black text-tichi-success mt-3 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" /> 100% Operational
          </p>
        </div>
      </div>

      <div className="bg-blush-card border border-blush-border rounded-container p-6 space-y-4 shadow-plum-subtle">
        <h3 className="font-extrabold text-base text-plum">Live Emergency Incidents ({activeSos.length})</h3>

        {activeSos.length === 0 ? (
          <div className="p-8 text-center text-tichi-muted text-xs font-medium">
            ✓ No active emergency SOS incidents reported right now.
          </div>
        ) : (
          <div className="space-y-4">
            {activeSos.map((sos: any) => {
              const latestLoc = sos.locations[0];
              return (
                <div key={sos.id} className="bg-rose-soft border border-tichi-emergency/40 rounded-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-tichi-text">{sos.user?.fullName}</h4>
                      <p className="text-xs text-tichi-muted">{sos.user?.email} • {sos.user?.phone}</p>
                    </div>

                    <span className="bg-tichi-emergency text-white font-bold text-xs px-3 py-1 rounded-full animate-pulse">
                      🚨 SOS ACTIVE
                    </span>
                  </div>

                  {latestLoc && (
                    <LiveLocationMap
                      lat={latestLoc.latitude}
                      lng={latestLoc.longitude}
                      accuracy={latestLoc.accuracy || 10}
                      userName={sos.user?.fullName}
                      isEmergency={true}
                    />
                  )}

                  <div className="flex items-center justify-between text-xs text-tichi-muted pt-1">
                    <span>Started: {new Date(sos.startedAt).toLocaleTimeString()}</span>
                    <span>Alert Channel: Nodemailer SMTP Emergency Broadcast</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
