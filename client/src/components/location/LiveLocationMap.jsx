import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

export const LiveLocationMap = ({
  lat,
  lng,
  accuracy = 20,
  userName = 'User Location',
  isEmergency = false,
}) => {
  const position = [lat, lng];

  const emergencyIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const normalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="w-full h-full relative rounded-card overflow-hidden shadow-plum-subtle">
      <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="w-full h-full">
        <ChangeView center={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={position}
          radius={accuracy}
          pathOptions={{
            color: isEmergency ? '#E62E5C' : '#26123D',
            fillColor: isEmergency ? '#E62E5C' : '#FF3B70',
            fillOpacity: 0.2,
          }}
        />
        <Marker position={position} icon={isEmergency ? emergencyIcon : normalIcon}>
          <Popup>
            <div className="text-xs space-y-1">
              <p className="font-extrabold text-plum">{userName}</p>
              <p className="text-tichi-muted">Accuracy: ±{accuracy}m</p>
              {isEmergency && <p className="text-emergency font-bold">🚨 EMERGENCY BROADCAST</p>}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
