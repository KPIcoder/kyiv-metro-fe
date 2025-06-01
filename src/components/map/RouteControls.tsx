// src/components/map/RouteControls.tsx
import { Station } from '@/interfaces/Station';
import { StationSelector } from './StationSelector';
import { useMetroMap } from './MetroMapContext';
import { getLineName } from '@/services/MapUtils';

interface RouteControlsProps {
  fromStation: Station | null;
  toStation: Station | null;
  onFromStationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onToStationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onGetDirections: () => void;
  onClearRoute: () => void;

}

export const RouteControls = ({
  fromStation,
  toStation,
  onFromStationChange,
  onToStationChange,
  onGetDirections,
  onClearRoute,
}: RouteControlsProps) => {
  const { stations } = useMetroMap();

  return (
    <div className="mb-4 bg-card p-4 rounded-lg border shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <StationSelector
          id="fromStation"
          label="From Station"
          stations={stations}
          selectedStation={fromStation}
          onChange={onFromStationChange}
          getLineName={getLineName}
        />
        
        <StationSelector
          id="toStation"
          label="To Station"
          stations={stations}
          selectedStation={toStation}
          onChange={onToStationChange}
          disabled={!fromStation}
          disabledStationId={fromStation?.id}
          getLineName={getLineName}
        />
        
        <div className="self-end flex gap-2">
          <button
            className="h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            onClick={onGetDirections}
            disabled={!fromStation || !toStation}
          >
            Get Directions
          </button>
          
          <button
            className="h-10 px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
            onClick={onClearRoute}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};