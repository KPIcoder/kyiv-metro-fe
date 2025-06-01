import { useQuery } from '@tanstack/react-query'
import { Zone } from '../interfaces/Zone'

const fallbackZones: Zone[] = []

async function fetchZones(): Promise<Zone[]> {
  try {
    const response = await fetch('/zones.geojson', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch zones.geojson: ${response.status}`)
    }
    const geojson = await response.json()
    // Convert GeoJSON features to Zone[]
    if (!geojson.features) return fallbackZones
    return geojson.features.map((feature: any, idx: number) => {
      const coords = feature.geometry.coordinates[0].map(([lng, lat]: [number, number]) => ({ lat, lng }))
      return {
        id: feature.properties.id ?? idx + 1,
        name: feature.properties.name ?? `Zone ${idx + 1}`,
        range: feature.properties.range ?? idx + 1,
        coords,
      }
    })
  } catch (error) {
    console.error('Error fetching zones:', error)
    return fallbackZones
  }
}

export function useZones() {
  return useQuery({
    queryKey: ['zones'],
    queryFn: fetchZones,
    placeholderData: fallbackZones,
    retry: false,
    staleTime: Infinity,
  })
} 