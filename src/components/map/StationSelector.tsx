// src/components/map/StationSelector.tsx
import { Station } from '@/interfaces/Station';

interface StationSelectorProps {
  id: string;
  label: string;
  stations: Station[];
  selectedStation: Station | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  disabledStationId?: number | null;
  getLineName: (lineId: number) => string;
}

export const StationSelector = ({
  id,
  label,
  stations,
  selectedStation,
  onChange,
  disabled = false,
  disabledStationId,
  getLineName
}: StationSelectorProps) => {
  return (
    <div className="flex-1">
      <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
      <select
        id={id}
        className="w-full rounded-md border border-input bg-background h-10 px-3 text-sm"
        value={selectedStation?.id || ""}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="">{`Select ${label.toLowerCase()}`}</option>
        {stations.map(station => (
          <option 
            key={`${id}-${station.id}`} 
            value={station.id}
            disabled={station.id === disabledStationId}
          >
            {station.name} ({getLineName(station.lineId)})
          </option>
        ))}
      </select>
    </div>
  );
};