// src/services/MapUtils.ts
import { Station } from '@/interfaces/Station';

export const DEFAULT_CENTER = { lat: 50.4019191, lng: 30.3678871 };
export const DEFAULT_ZOOM = 12;

export const LINE_COLORS = {
  1: '#4285F4',
  2: '#DB4437',
  3: '#0F9D58',
  4: '#F4B400',
} as const; 

export const getLineColor = (lineId: number): string => {
  return LINE_COLORS[lineId as keyof typeof LINE_COLORS] || '#888888';
};

export const getLineName = (lineId: number): string => {
  const lines: Record<number, string> = {
    1: 'Blue Line',
    2: 'Red Line',
    3: 'Green Line',
    4: 'Yellow Line'
  };
  
  return lines[lineId] || `Line ${lineId}`;
};

export const getStationColor = (station: Station): string => {
    return LINE_COLORS[station.lineId as keyof typeof LINE_COLORS] || '#888888';
}

export const calculateMapCenter = (stations: Station[]): google.maps.LatLngLiteral => {
  if (stations.length === 0) {
    return { lat: 50.4019191, lng: 30.3678871 }; // Default center
  }
  
  const sumLat = stations.reduce((sum: number, station: Station) => sum + station.position.lat, 0);
  const sumLng = stations.reduce((sum: number, station: Station) => sum + station.position.lng, 0);
  
  return {
    lat: sumLat / stations.length,
    lng: sumLng / stations.length
  };
};

export const isStationInRoute = (stationId: number, routeStations: Station[]): boolean => {
  return routeStations.some(station => station.id === stationId);
};

export const generateRoutePolylines = (route: Station[]): { path: google.maps.LatLngLiteral[]; options: google.maps.PolylineOptions }[] => {
  if (route.length <= 1) return [];

  return route.reduce<{ path: google.maps.LatLngLiteral[]; options: google.maps.PolylineOptions }[]>((acc, station, index) => {
    if (index === 0) return acc;
    
    const prevStation = route[index - 1];
    const currentLineId = station.lineId;
    const prevLineId = prevStation.lineId;
    
    // If we're on the same line, extend the current polyline
    if (currentLineId === prevLineId) {
      const lastPolyline = acc[acc.length - 1];
      if (lastPolyline) {
        lastPolyline.path.push(station.position);
      } else {
        acc.push({
          path: [prevStation.position, station.position],
          options: {
            strokeColor: getLineColor(currentLineId),
            strokeOpacity: 1.0,
            strokeWeight: 6,
            zIndex: 9,
          },
        });
      }
    } else {
      // If we're changing lines, create a new polyline
      acc.push({
        path: [prevStation.position, station.position],
        options: {
          strokeColor: getLineColor(currentLineId),
          strokeOpacity: 1.0,
          strokeWeight: 6,
          zIndex: 9,
        },
      });
    }
    
    return acc;
  }, []);
};