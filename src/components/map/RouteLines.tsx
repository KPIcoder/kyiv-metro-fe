// src/components/map/RouteLines.tsx
import { useState, useEffect } from 'react';
import { Station } from '@/interfaces/Station';

interface RouteLinesProps {
  routeStations: Station[];
  getLineColor: (lineId: number) => string;
  map?: google.maps.Map;
}

export const RouteLines = ({ routeStations, getLineColor, map }: RouteLinesProps) => {
  const [polylines, setPolylines] = useState<google.maps.Polyline[]>([]);
  
  useEffect(() => {
    return () => {
      polylines.forEach(line => line.setMap(null));
    };
  }, [polylines]);
  
  // Draw polylines when route or map changes
  useEffect(() => {
    if (!map) return; // Don't proceed if map isn't available
    
    // Clear any existing polylines
    polylines.forEach(line => line.setMap(null));
    const newPolylines: google.maps.Polyline[] = [];
    
    // Create new polylines for each segment
    for (let i = 1; i < routeStations.length; i++) {
      const current = routeStations[i];
      const previous = routeStations[i-1];
      const sameLineAsPrev = current.lineId === previous.lineId;
      
      const line = new google.maps.Polyline({
        path: [
          { lat: previous.position.lat, lng: previous.position.lng },
          { lat: current.position.lat, lng: current.position.lng }
        ],
        geodesic: true,
        strokeColor: getLineColor(current.lineId),
        strokeOpacity: 1.0,
        strokeWeight: 6,
        zIndex: 9, // Ensure lines are drawn under markers but above map
        icons: !sameLineAsPrev ? [
          {
            icon: {
              path: 'M 0,-1 0,1',
              strokeOpacity: 1,
              scale: 4,
            },
            offset: '0',
            repeat: '10px'
          }
        ] : undefined
      });
      
      line.setMap(map);
      newPolylines.push(line);
    }
    
    setPolylines(newPolylines);
  }, [routeStations, map, getLineColor]);
  
  return null;
};