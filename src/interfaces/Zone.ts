export interface Zone {
  id: number;
  name: string;
  range: number;
  coords: { lat: number; lng: number }[];
} 