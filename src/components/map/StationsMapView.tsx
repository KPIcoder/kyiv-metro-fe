import { useState } from 'react';
import { useMetroMap } from './MetroMapContext';
import { MapView } from './Map';
import { RouteSummary } from './RouteSummary';
import { StationInfoPanel } from './StationInfoPanel';
import { TicketPurchasePanel } from './TicketPurchasePanel';
import { RouteControls } from './RouteControls';
import { Station } from '@/interfaces/Station';
import { getStationColor, generateRoutePolylines } from '@/services/MapUtils';

export function StationsMapView({ className = '' }: { className?: string }) {

  const { stations, zones, generateTicket, getRoute } = useMetroMap();

  const [fromStation, setFromStation] = useState<Station | undefined>();
  const [toStation, setToStation] = useState<Station | undefined>();
  const [route, setRoute] = useState<Station[]>([]);
  const [showRouteSummary, setShowRouteSummary] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | undefined>();
  const [showTicket, setShowTicket] = useState(false);


  const handleGetDirections = async () => {
    if (!fromStation || !toStation) return;
    setShowRouteSummary(false);
    setShowTicket(false);

    const data = await getRoute(fromStation, toStation);

    if (data) {
      setRoute(data);
      setShowRouteSummary(true);
      setShowTicket(true);
    } else {
      setRoute([]);
      setShowRouteSummary(false);
      setShowTicket(false);
    }
  };

  const handleClearRoute = () => {
    setFromStation(undefined);
    setToStation(undefined);
    setRoute([]);
    setShowRouteSummary(false);
    setShowTicket(false);
    setSelectedStation(undefined);
  };

  const polygons = zones.map(z => ({
    paths: z.coords,
    options: {
      fillColor: '#FFD600',
      strokeColor: '#FFD600',
      fillOpacity: 0.18,
      strokeOpacity: 0.7,
      strokeWeight: 2,
    },
  }));

  const markers = stations.map(s => ({
    position: s.position,
    color: getStationColor(s),
    title: s.name,
    onClick: () => setSelectedStation(s),
  }));

  const polylines = generateRoutePolylines(route);

  return (
    <div className="relative">
      <RouteControls
        fromStation={fromStation || null}
        toStation={toStation || null}
        onFromStationChange={e => {
          const id = parseInt(e.target.value);
          setFromStation(stations.find(s => s.id === id));
        }}
        onToStationChange={e => {
          const id = parseInt(e.target.value);
          setToStation(stations.find(s => s.id === id));
        }}
        onGetDirections={handleGetDirections}
        onClearRoute={handleClearRoute}
      />
      <div className={`relative w-full h-[700px] ${className}`}>
        <MapView
          polygons={polygons}
          markers={markers}
          polylines={polylines}
        />
        {showRouteSummary && route.length > 0 && (
          <RouteSummary
            routeStations={route}
            onHide={() => setShowRouteSummary(false)}
          />
        )}
        {selectedStation && (
          <StationInfoPanel
            station={selectedStation}
            onSetAsStart={setFromStation}
            onSetAsDestination={setToStation}
            fromStation={fromStation || null}
          />
        )}
        {showTicket && route.length > 1 && (
          <TicketPurchasePanel
            crossedZones={generateTicket(route).zones}
            tripCost={generateTicket(route).cost.toFixed(2)}
          />
        )}
      </div>
    </div>
  );
}