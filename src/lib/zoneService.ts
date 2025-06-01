import { Zone } from '../interfaces/Zone'
import { Station } from '../interfaces/Station'

export function isPointInPolygon(point: { lat: number; lng: number }, polygon: { lat: number; lng: number }[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;
    const intersect = ((yi > point.lat) !== (yj > point.lat)) &&
      (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi + 0.0000001) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function getZonesForStation(station: Station, zones: Zone[]): Zone[] {
  return zones.filter(zone =>
    zone.coords && isPointInPolygon(station.position, zone.coords)
  )
}

// Get the innermost zone for a station (lowest range or id)
export function getInnermostZoneForStation(station: Station, zones: Zone[]): Zone | undefined {
  const inZones = getZonesForStation(station, zones)
  if (inZones.length === 0) return undefined
  // Prefer lowest range, fallback to lowest id
  return inZones.reduce((min, z) => (z.range < min.range ? z : min), inZones[0])
}

// Only count unique innermost zones for the route
export function getUniqueZonesForRoute(route: Station[], zones: Zone[]): Zone[] {
  const zoneSet = new Set<number>()
  for (const station of route) {
    const zone = getInnermostZoneForStation(station, zones)
    if (zone) zoneSet.add(zone.id)
  }
  return zones.filter(z => zoneSet.has(z.id))
} 