import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldAlert, Radio, Navigation } from 'lucide-react';

// Fix default Leaflet icon URLs for React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Emergency SOS Red Pulsing Marker
const emergencyIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [28, 45],
  iconAnchor: [14, 45],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom Live User Violet Marker
const liveUserIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [28, 45],
  iconAnchor: [14, 45],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Map View Smooth Recenter Controller
const RecenterController = ({ center }) => {
  const map = useMap();
  const lat = center?.[0];
  const lng = center?.[1];

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], map.getZoom() || 16, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [lat, lng, map]);
  return null;
};

export const LiveLocationMap = ({
  lat,
  lng,
  accuracy = 15,
  userName = 'User Location',
  isEmergency = false,
  speed = null,
}) => {
  const [trail, setTrail] = useState([]);

  // Store trajectory path trail as coordinates update in real-time
  useEffect(() => {
    if (lat && lng) {
      setTrail((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last[0] !== lat || last[1] !== lng) {
          return [...prev, [lat, lng]];
        }
        return prev;
      });
    }
  }, [lat, lng]);

  const numLat = parseFloat(lat) || 28.6139;
  const numLng = parseFloat(lng) || 77.209;
  const currentPosition = [numLat, numLng];

  return (
    <div className="w-full h-full relative rounded-card overflow-hidden shadow-plum-subtle group">
      <MapContainer
        center={currentPosition}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <RecenterController center={currentPosition} />

        {/* Leaflet OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Live Breadcrumb Trajectory Trail */}
        {trail.length > 1 && (
          <Polyline
            positions={trail}
            pathOptions={{
              color: isEmergency ? '#E62E5C' : '#6366f1',
              weight: 4,
              opacity: 0.85,
              dashArray: isEmergency ? '6, 6' : undefined,
            }}
          />
        )}

        {/* GPS Precision Accuracy Circle */}
        <Circle
          center={currentPosition}
          radius={accuracy}
          pathOptions={{
            color: isEmergency ? '#E62E5C' : '#4f46e5',
            fillColor: isEmergency ? '#E62E5C' : '#818cf8',
            fillOpacity: 0.25,
            weight: 2,
          }}
        />

        {/* Real-time Marker */}
        <Marker position={currentPosition} icon={isEmergency ? emergencyIcon : liveUserIcon}>
          <Popup>
            <div className="text-xs space-y-1.5 p-1 min-w-[160px]">
              <div className="flex items-center space-x-1.5">
                <Radio
                  className={`w-3.5 h-3.5 ${isEmergency ? 'text-red-500 animate-pulse' : 'text-indigo-600'}`}
                />
                <p className="font-extrabold text-gray-900">{userName}</p>
              </div>
              <p className="text-gray-500 font-mono text-[11px]">
                Lat: {lat?.toFixed(5)}, Lng: {lng?.toFixed(5)}
              </p>
              <p className="text-gray-600 text-[11px]">
                GPS Precision: <span className="font-bold text-gray-800">±{accuracy}m</span>
              </p>
              {speed !== null && (
                <p className="text-gray-600 text-[11px]">
                  Speed:{' '}
                  <span className="font-bold text-gray-800">{Math.round(speed * 3.6)} km/h</span>
                </p>
              )}
              {isEmergency && (
                <div className="bg-red-50 text-red-600 font-black text-[10px] px-2 py-1 rounded border border-red-200 mt-1 flex items-center space-x-1">
                  <ShieldAlert className="w-3 h-3 text-red-500" />
                  <span>EMERGENCY SOS BROADCAST</span>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Leaflet Live Overlay Badge */}
      <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md border border-gray-200 shadow-md px-3 py-1.5 rounded-full flex items-center space-x-2">
        <span
          className={`w-2 h-2 rounded-full ${isEmergency ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}
        />
        <span className="text-[11px] font-black text-gray-800 tracking-wide uppercase">
          Leaflet Live GPS
        </span>
      </div>
    </div>
  );
};
