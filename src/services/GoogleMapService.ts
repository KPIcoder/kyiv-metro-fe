export class GoogleMapService {
  private static instance: GoogleMapService;
  private map: google.maps.Map | null = null;
  private markers: google.maps.Marker[] = [];
  private polygons: google.maps.Polygon[] = [];
  private polylines: google.maps.Polyline[] = [];

  private constructor() {}

  public static getInstance(): GoogleMapService {
    if (!GoogleMapService.instance) {
      GoogleMapService.instance = new GoogleMapService();
    }
    return GoogleMapService.instance;
  }

  public setMap(map: google.maps.Map) {
    this.map = map;
  }

  public clearMap() {
    this.clearMarkers();
    this.clearPolygons();
    this.clearPolylines();
  }

  public setMarkers(markers: { position: google.maps.LatLngLiteral; color: string; title?: string; onClick?: () => void }[]) {
    this.clearMarkers();
    if (!this.map) return;
    this.markers = markers.map(markerData => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map: this.map!,
        title: markerData.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: markerData.color,
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
          strokeOpacity: 1,
          scale: 8,
        }
      });
      if (markerData.onClick) {
        marker.addListener('click', markerData.onClick);
      }
      return marker;
    });
  }

  public clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  public setPolygons(polygons: { paths: google.maps.LatLngLiteral[]; options?: google.maps.PolygonOptions }[]) {
    this.clearPolygons();
    if (!this.map) return;
    this.polygons = polygons.map(({ paths, options }) => {
      const polygon = new google.maps.Polygon({
        paths,
        map: this.map!,
        ...options,
      });
      return polygon;
    });
  }

  public clearPolygons() {
    this.polygons.forEach(polygon => polygon.setMap(null));
    this.polygons = [];
  }

  public setPolylines(polylines: { path: google.maps.LatLngLiteral[]; options?: google.maps.PolylineOptions }[]) {
    this.clearPolylines();
    if (!this.map) return;
    this.polylines = polylines.map(({ path, options }) => {
      const polyline = new google.maps.Polyline({
        path,
        map: this.map!,
        ...options,
      });
      return polyline;
    });
  }

  public clearPolylines() {
    this.polylines.forEach(polyline => polyline.setMap(null));
    this.polylines = [];
  }

  public setCenter(center: google.maps.LatLngLiteral) {
    if (this.map) {
      this.map.setCenter(center);
    }
  }

  public setZoom(zoom: number) {
    if (this.map) {
      this.map.setZoom(zoom);
    }
  }
} 