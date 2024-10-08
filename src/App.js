import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Coordinates
const StartCoordinates = [19.0760, 72.8777]; // Mumbai
const EndCoordinates = [40.7128, -74.0060]; // New York
const CurrentCoordinates = [-36.802237, 12.913736]; // Control Point

// Customize marker icons (optional)
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Function to generate points for a quadratic Bezier curve
const generateCurve = (start, end, control, numPoints = 50) => {
  const points = [];
  for (let t = 0; t <= 1; t += 1 / numPoints) {
    const x = (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * control[1] + t ** 2 * end[1]; // longitude
    const y = (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * control[0] + t ** 2 * end[0]; // latitude
    points.push([y, x]); // Leaflet uses [latitude, longitude]
  }
  return points;
};

const MapComponent = () => {
  // First curve from Start to Current location
  const firstCurvePoints = generateCurve(StartCoordinates, CurrentCoordinates, CurrentCoordinates, 100);
  // Second curve from Current location to End
  const secondCurvePoints = generateCurve(CurrentCoordinates, EndCoordinates, CurrentCoordinates, 100);

  return (
    <MapContainer center={CurrentCoordinates} zoom={2} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Start point marker */}
      <Marker position={StartCoordinates} icon={markerIcon}>
        <Popup>Start Point</Popup>
      </Marker>

      {/* Current location marker */}
      <Marker position={CurrentCoordinates} icon={markerIcon}>
        <Popup>Current Location</Popup>
      </Marker>

      {/* Destination marker */}
      <Marker position={EndCoordinates} icon={markerIcon}>
        <Popup>Destination</Popup>
      </Marker>

      {/* Bold line from Start to Current Location */}
      <Polyline positions={firstCurvePoints} color="blue" weight={5} /> {/* weight prop increases the thickness */}
      
      {/* Dotted line from Current Location to End */}
      <Polyline 
        positions={secondCurvePoints} 
        color="blue" 
        weight={3} 
        dashArray="5, 10" // Dotted line style
      />
    </MapContainer>
  );
};

export default MapComponent;
