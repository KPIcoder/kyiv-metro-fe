import { useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { GoogleMapService } from '@/services/GoogleMapService';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/services/MapUtils';

interface MapViewProps {
  polygons: { paths: google.maps.LatLngLiteral[]; options?: google.maps.PolygonOptions }[];
  markers: { position: google.maps.LatLngLiteral; color: string; title?: string; onClick?: () => void }[];
  polylines: { path: google.maps.LatLngLiteral[]; options?: google.maps.PolylineOptions }[];
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  className?: string;
}

function Map({ polygons, markers, polylines, center, zoom, className = '' }: MapViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapService = GoogleMapService.getInstance();

  useEffect(() => {
    if (ref.current && !mapService['map']) {
      const map = new window.google.maps.Map(ref.current, {
        center: center || DEFAULT_CENTER,
        zoom: zoom || DEFAULT_ZOOM,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: true,
        mapId: 'kyiv-metro-map',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });
      mapService.setMap(map);
    }
  }, [mapService]);

  useEffect(() => {
    if (mapService) {
      mapService.setCenter(center || DEFAULT_CENTER);
      mapService.setZoom(zoom || DEFAULT_ZOOM);
    }
  }, [mapService, center, zoom]);

  useEffect(() => {
    mapService.setPolygons(polygons);
  }, [mapService, polygons]);

  useEffect(() => {
    mapService.setMarkers(markers);
  }, [mapService, markers]);

  useEffect(() => {
    mapService.setPolylines(polylines);
  }, [mapService, polylines]);

  useEffect(() => {
    return () => {
      mapService.clearMap();
    };
  }, [mapService]);

  return <div ref={ref} className={`w-full h-full overflow-hidden rounded-lg ${className}`} />;
}

function renderStatus(status: Status) {
  switch (status) {
    case Status.LOADING:
      return <div>Loading map...</div>;
    case Status.FAILURE:
      return <div>Error loading map</div>;
    default:
      return <></>;
  }
}

export function MapView(props: MapViewProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  return (
    <Wrapper apiKey={apiKey} render={renderStatus}>
      <Map {...props} />
    </Wrapper>
  );
}

