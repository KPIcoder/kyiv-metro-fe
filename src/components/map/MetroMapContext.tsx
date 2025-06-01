import { createContext, useContext, ReactNode } from 'react';
import { Station } from '@/interfaces/Station';
import { Zone } from '@/interfaces/Zone';
import { BASE_RATE, ZONE_CROSSING_MULTIPLIER } from '@/constants';
import { useStations } from '@/hooks/useStations';
import { useZones } from '@/hooks/useZones';
import { findMockRoute } from '@/mocks/stations';
import { getUniqueZonesForRoute } from '@/lib/zoneService';

interface MetroMapContextValue {
  stations: Station[];
  zones: Zone[];
  generateTicket: (route: Station[]) => TicketInfo;
  getRoute: (from: Station, to: Station) => Promise<Station[]>;
}

interface TicketInfo {
  name: string;
  description: string;
  cost: number;
  zones: Zone[];
}

const MetroMapContext = createContext<MetroMapContextValue | undefined>(undefined);

export const MetroMapProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: stations = [],
    error: stationsError,
  } = useStations();

  const {
    data: zones = [],
    error: zonesError,
  } = useZones();

  if(stationsError || zonesError) {
    throw new Error('Error fetching stations or zones');
  }

  const getRoute = async (from: Station, to: Station) => {
    const response = await fetch(`http://localhost:3002/api/transit/${from.id}/${to.id}`);
    if(!response.ok) {
      console.error('Error fetching transit', response.statusText);
      return findMockRoute(from.id, to.id);
    }
    const { stations } = await response.json();
    return stations;
  }


  const generateTicket = (route: Station[]): TicketInfo => {
    const crossedZones = zones.length && route.length
      ? getUniqueZonesForRoute(route, zones)
      : [];

    const cost = BASE_RATE * Math.pow(ZONE_CROSSING_MULTIPLIER, crossedZones.length);

    return {
      name: 'Single Ride Ticket',
      description: `Valid for ${crossedZones.length} zone(s)`,
      cost,
      zones: crossedZones,
    };
  };

  return (
    <MetroMapContext.Provider value={{ stations, zones, generateTicket, getRoute }}>
      {children}
    </MetroMapContext.Provider>
  );
};

export const useMetroMap = () => {
  const ctx = useContext(MetroMapContext);
  if (!ctx) throw new Error('useMetroMap must be used within a MetroMapProvider');
  return ctx;
}; 