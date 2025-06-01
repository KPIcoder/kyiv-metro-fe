export interface Station {
  id: number;
  lineId: number;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
}
