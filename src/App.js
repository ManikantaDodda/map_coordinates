import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ship from './assets/cargo-ship2.png';
import destIcon from './assets/dest.png';

// Coordinates
const StartCoordinates = [19.0760, 72.8777];
const EndCoordinates = [40.7128, -74.0060];
const InitialCurrentCoordinates = [-36.802237, 12.913736];

// Customize marker icons (optional)
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const ShipIcon = new L.Icon({
  iconUrl: ship,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const destinationIcon = new L.Icon({
  iconUrl: destIcon,
  iconSize: [28, 41],
  iconAnchor: [12, 41],
});

const App = ({ currentLoc = InitialCurrentCoordinates }) => {
  const [currentCoordinates, setCurrentCoordinates] = useState(currentLoc);

  const shipRouteCoordinates = [
    StartCoordinates,
    [-27.204054, 47.080745],
    [-36.694415, 25.283397],
    currentCoordinates,
    [-6.784086, -30.615036],
    EndCoordinates,
  ];

  // Function to calculate route from Start to Current Location
  const ShipSpecifiedRouteStartToCurrentLoc = () => {
    const startIndex = shipRouteCoordinates.findIndex(coord => 
      coord[0] === StartCoordinates[0] && coord[1] === StartCoordinates[1]);
    const currentIndex = shipRouteCoordinates.findIndex(coord => 
      coord[0] === currentCoordinates[0] && coord[1] === currentCoordinates[1]);

    // Return the segment of the route from Start to Current
    return shipRouteCoordinates.slice(startIndex, currentIndex + 1);
  };

  // Function to calculate route from Current Location to Destination
  const ShipSpecifiedRouteCurrentLocToDestination = () => {
    const currentIndex = shipRouteCoordinates.findIndex(coord => 
      coord[0] === currentCoordinates[0] && coord[1] === currentCoordinates[1]);
    const endIndex = shipRouteCoordinates.findIndex(coord => 
      coord[0] === EndCoordinates[0] && coord[1] === EndCoordinates[1]);

    // Return the segment of the route from Current to Destination
    return shipRouteCoordinates.slice(currentIndex, endIndex + 1);
  };

  const routeToCurrent = ShipSpecifiedRouteStartToCurrentLoc();
  const routeToDestination = ShipSpecifiedRouteCurrentLocToDestination();

  // Effect to update current coordinates
  useEffect(() => {
    setCurrentCoordinates(currentLoc);
  }, [currentLoc]);

  return (
    <MapContainer center={currentCoordinates} zoom={2} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Start point marker */}
      <Marker position={StartCoordinates} icon={markerIcon}>
        <Popup>Start Point</Popup>
      </Marker>

      {/* Current location marker */}
      <Marker position={currentCoordinates} icon={ShipIcon}>
        <Popup><span>Current Coordinates <br></br>{currentCoordinates.join(" ,")}</span></Popup>
      </Marker>

      {/* Destination marker */}
      <Marker position={EndCoordinates} icon={destinationIcon}>
        <Popup>Destination</Popup>
      </Marker>

      {/* Thick line from Start to Current Location */}
      <Polyline positions={routeToCurrent} color="blue" weight={5} />

      {/* Dotted line from Current Location to Destination */}
      <Polyline positions={routeToDestination} color="blue" weight={3} dashArray="5, 10" />
      <Circle 
        center={currentCoordinates} 
        radius={100000}
        color="red" 
        fillColor="red" 
        fillOpacity={0.3} 
      />
    </MapContainer>
  );
};

export default App;
