import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ship from './assets/cargo-ship2.png';
import destIcon from './assets/dest.png';

// Coordinates
const StartCoordinates = [19.0760, 72.8777];
const EndCoordinates = [40.7128, -74.0060];
const InitialCurrentCoordinates = [-36.802237, 12.913736];

// Customize marker icons 
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

const generateCurve = (start, end, control, numPoints = 50) => {
  const points = [];
  for (let t = 0; t <= 1; t += 1 / numPoints) {
    const x = (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * control[1] + t ** 2 * end[1]; // longitude
    const y = (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * control[0] + t ** 2 * end[0]; // latitude
    points.push([y, x]); // Leaflet uses [latitude, longitude]
  }
  return points;
};

function generateCoordinates(Arr) {
  console.log(Arr, "arrayy");
  const curves = [];
  let last = null; // Store the last point of the previous curve

  for (let i = 0; i < Arr.length - 1; i += 2) {
    const start = last || Arr[i];
    const end = Arr[i + 2] || Arr[Arr.length - 1];
    const control = Arr[i + 1];

    const curvePoints = generateCurve(start, end, control);
    last = curvePoints[curvePoints.length - 1];
    if(Arr.length === 3)
    {
      curvePoints.push(end);
    }
    curves.push(curvePoints);
  }

  return curves;
}





const App = ({ currentLoc = InitialCurrentCoordinates, index = 5 }) => {
  const [currentCoordinates, setCurrentCoordinates] = useState(currentLoc);
  const [leftCordinates, setLeftCordinates] = useState([]);
  const [rightCordinates, setRightCordinates] = useState([]);
  const [trackCoordinates, setTrackCoordinates] = useState([currentCoordinates]);
  const shipRouteCoordinates = [
    StartCoordinates,
    [-2.273964, 65.597540],
    [-26.517021, 49.477049],
    [-36.694415, 25.283397],
    ...trackCoordinates,
    EndCoordinates,
  ];
  if(index !==5)
  {
  }
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

  const generateCurveByCoordinates = () => {

  const routeToCurrent = ShipSpecifiedRouteStartToCurrentLoc();
  const routeToDestination = ShipSpecifiedRouteCurrentLocToDestination();
  const left = generateCoordinates(routeToCurrent);
  const right = generateCoordinates(routeToDestination);
  setLeftCordinates(left);
  setRightCordinates(right);

}

  const calculateDistance = useMemo(() => {
    let coords1 = currentCoordinates;
    let coords2 = EndCoordinates;
    const R = 6371;
    const lat1 = coords1[0] * (Math.PI / 180);
    const lon1 = coords1[1] * (Math.PI / 180);
    const lat2 = coords2[0] * (Math.PI / 180);
    const lon2 = coords2[1] * (Math.PI / 180);
  
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
  
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c; // Distance in kilometers
  console.log("cd", distance);
    return distance;
  }, [currentCoordinates]);

  useEffect(()=>{
    generateCurveByCoordinates();
  }, [currentCoordinates])
  useEffect(() => {
    setCurrentCoordinates(currentLoc);
    setTrackCoordinates((prev)=>[...prev, currentLoc])
  }, [currentLoc]);

  return (
    <MapContainer center={currentCoordinates} zoom={1} style={{ height: '500px', width: '100%' }}>
      <div className="estimated-distance"><h4 style={{fontWeight:"bold"}}> Estimated Distance : {calculateDistance.toFixed(2)}</h4></div>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
      {leftCordinates.map((item, index)=>(
        <Polyline key={index} positions={item} color="blue" weight={5} />
      ))}

      {/* Dotted line from Current Location to Destination */}
      {rightCordinates.map((item, index)=>(
         <>
        {console.log(item)}
        <Polyline key={index} positions={item} color="blue" weight={3} dashArray="5, 10" />
        </>
      ))}
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

export default React.memo(App);
