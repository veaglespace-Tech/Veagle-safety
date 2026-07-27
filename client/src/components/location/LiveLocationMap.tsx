import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LiveLocationMapProps {
  lat: number;
  lng: number;
  accuracy?: number;
  userName?: string;
  isEmergency?: boolean;
}

export const LiveLocationMap: React.FC<LiveLocationMapProps> = ({
  lat,
  lng,
  accuracy = 15,
  userName = 'Current Location',
  isEmergency = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-gps-pin',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <div class="absolute w-8 h-8 rounded-full ${isEmergency ? 'bg-red-500/40 animate-ping' : 'bg-plum/30 animate-pulse'}"></div>
            <div class="w-5 h-5 rounded-full ${isEmergency ? 'bg-tichi-emergency' : 'bg-plum'} border-2 border-white shadow-md flex items-center justify-center text-white text-[9px] font-bold">
              📍
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`<b>${userName}</b><br/>GPS Accuracy ±${accuracy}m`).openPopup();

      const circle = L.circle([lat, lng], {
        radius: accuracy,
        color: isEmergency ? '#D92D20' : '#6D214F',
        fillColor: isEmergency ? '#D92D20' : '#E8A0BF',
        fillOpacity: 0.15,
        weight: 1.5,
      }).addTo(map);

      mapInstanceRef.current = map;
      markerRef.current = marker;
      circleRef.current = circle;
    } else {
      const map = mapInstanceRef.current;
      map.setView([lat, lng], map.getZoom());
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
      if (circleRef.current) {
        circleRef.current.setLatLng([lat, lng]);
        circleRef.current.setRadius(accuracy);
      }
    }
  }, [lat, lng, accuracy, isEmergency, userName]);

  return (
    <div className="relative w-full h-64 rounded-card overflow-hidden border border-blush-border shadow-plum-subtle">
      <div ref={mapContainerRef} className="w-full h-full"></div>
      
      <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-blush-border text-xs font-semibold text-tichi-text shadow-sm flex items-center space-x-1.5">
        <span className={`w-2 h-2 rounded-full ${isEmergency ? 'bg-tichi-emergency animate-pulse' : 'bg-tichi-success'}`}></span>
        <span>{isEmergency ? 'LIVE EMERGENCY GPS' : 'GPS ACTIVE'}</span>
      </div>
    </div>
  );
};
