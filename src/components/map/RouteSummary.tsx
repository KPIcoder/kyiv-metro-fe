// src/components/map/RouteSummary.tsx
import { Station } from '@/interfaces/Station';
import { getLineColor } from '@/services/MapUtils';
import { getLineName } from '@/services/MapUtils';

interface RouteSummaryProps {
  routeStations: Station[];
  onHide: () => void;
}

export const RouteSummary = ({
  routeStations,
  onHide
}: RouteSummaryProps) => {
  if (routeStations.length === 0) return null;
  
  return (
    <div className="absolute top-4 right-4 w-[300px] bg-card shadow-lg p-4 rounded-lg border">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm">Trip Summary</h3>
        <button 
          className="text-muted-foreground hover:text-foreground text-xs" 
          onClick={onHide}
        >
          Hide
        </button>
      </div>
      <div className="mt-2 text-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Total stations:</span>
          <span>{routeStations.length}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium">Stops:</span>
          <span>{routeStations.length - 1}</span>
        </div>
        
        <div className="space-y-2">
          <div className="font-medium text-xs uppercase text-muted-foreground">Lines Used</div>
          {Array.from(new Set(routeStations.map(s => s.lineId))).map(lineId => (
            <div 
              key={`line-${lineId}`}
              className="flex items-center gap-2 text-xs"
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getLineColor(lineId) }}
              ></div>
              <span>{getLineName(lineId)}</span>
            </div>
          ))}
        </div>
        
        {/* Show transfers if they exist */}
        {routeStations.some((station, i) => i > 0 && station.lineId !== routeStations[i-1].lineId) && (
          <div className="mt-3 space-y-2">
            <div className="font-medium text-xs uppercase text-muted-foreground">Transfers</div>
            {routeStations.map((station, i) => {
              if (i > 0 && station.lineId !== routeStations[i-1].lineId) {
                return (
                  <div key={`transfer-${i}`} className="flex items-center text-xs">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2"></div>
                    <span>
                      {getLineName(routeStations[i-1].lineId)} → {getLineName(station.lineId)} at {station.name}
                    </span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};