import { Station } from '@/interfaces/Station';

export const mockStations: Station[] = [
  { id: 1, name: 'A', lineId: 1, position: { lat: 50.4501, lng: 30.5234 } },
  { id: 2, name: 'B', lineId: 1, position: { lat: 50.4547, lng: 30.5238 } },
  { id: 3, name: 'C', lineId: 2, position: { lat: 50.4580, lng: 30.5300 } },
  { id: 4, name: 'D', lineId: 2, position: { lat: 50.4600, lng: 30.5400 } },
];

export function findMockRoute(fromId: number, toId: number): Station[] {
  const from = mockStations.find(s => s.id === fromId);
  const to = mockStations.find(s => s.id === toId);
  if (!from || !to) return [];
  return [from, to];
} 