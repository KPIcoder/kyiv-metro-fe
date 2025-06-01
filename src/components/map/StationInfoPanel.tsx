// src/components/map/StationInfoPanel.tsx
import { Station } from '@/interfaces/Station';
import { getLineName } from '@/services/MapUtils';

interface StationInfoPanelProps {
  station: Station | null;
  onSetAsStart: (station: Station) => void;
  onSetAsDestination: (station: Station) => void;
  fromStation: Station | null;
}

export const StationInfoPanel = ({
  station,
  onSetAsStart,
  onSetAsDestination,
  fromStation
}: StationInfoPanelProps) => {
  if (!station) return null;
  
  return (
    <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[360px] bg-card shadow-md p-4 rounded-lg border">
      <h3 className="font-semibold">{station.name}</h3>
      <p className="text-sm text-muted-foreground">
        {getLineName(station.lineId)}
      </p>
      <div className="mt-2 flex gap-2">
        <button
          className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          onClick={() => onSetAsStart(station)}
        >
          Set as Starting Point
        </button>
        <button
          className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          onClick={() => onSetAsDestination(station)}
          disabled={!fromStation || fromStation.id === station.id}
        >
          Set as Destination
        </button>
      </div>
    </div>
  );
};