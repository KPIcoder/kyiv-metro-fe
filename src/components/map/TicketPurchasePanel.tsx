import { Zone } from '@/interfaces/Zone';
import { useBuyTicket } from '@/hooks/useBuyTicket';
import { useUser } from '@clerk/clerk-react';

interface TicketPurchasePanelProps {
  crossedZones: Zone[];
  tripCost: string;
}

export const TicketPurchasePanel = ({ crossedZones, tripCost }: TicketPurchasePanelProps) => {
  const { user } = useUser();
  const { mutate: buyTicket, isPending, isSuccess, isError, error, data } = useBuyTicket();

  return (
    <div className="absolute bottom-4 right-4 z-20 bg-white border border-yellow-300 shadow-lg rounded-xl px-6 py-4 flex flex-col items-center gap-2 animate-fade-in">
      <div className="text-lg font-bold text-yellow-900 mb-1">Single Ride Ticket</div>
      <div className="text-sm text-yellow-800 mb-2">Zones crossed: {crossedZones.map(z => z.name).join(', ') || 'N/A'}</div>
      <div className="text-2xl font-extrabold text-yellow-700 mb-2">{tripCost} ₴</div>
      <button
        className="px-5 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-lg shadow hover:bg-yellow-500 transition disabled:opacity-50"
        onClick={() => {
          buyTicket({
            userId: user?.id || '',
            name: 'Single Ride',
            description: `Single ride ticket for ${crossedZones.length} zone(s)`,
            validZonesRange: `${crossedZones.sort((a, b) => a.range - b.range)[0].range} - ${crossedZones.sort((a, b) => a.range - b.range)[crossedZones.length - 1].range}`,
            usagesLimit: 1,
            validForDays: 1,
            cost: parseFloat(tripCost),
          }, {
            onSuccess: (data) => {
              if (data?.url) {
                window.location.href = data.url
              }
            }
          });
        }}
        disabled={isPending}
      >
        {isPending ? 'Processing...' : 'Buy Single Ticket'}
      </button>
      {isSuccess && !data?.url && <div className="text-green-600 text-xs">Ticket purchased!</div>}
      {isError && <div className="text-red-600 text-xs">{(error as Error).message}</div>}
    </div>
  );
};