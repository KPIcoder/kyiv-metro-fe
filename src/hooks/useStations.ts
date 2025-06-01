import { mockStations } from '@/mocks/stations'
import { useQuery } from '@tanstack/react-query'

interface Station {
  id: number
  lineId: number
  name: string
  position: {
    lat: number
    lng: number
  }
}

const fallbackStations: Station[] = [
  { 
    id: 1, 
    lineId: 1, 
    name: "Akademmistechko", 
    position: { 
      lat: 50.464861, 
      lng: 30.355083 
    } 
  },
  { 
    id: 2, 
    lineId: 1, 
    name: "Zhytomyrska", 
    position: { 
      lat: 50.456172, 
      lng: 30.365628 
    } 
  },
  { 
    id: 3, 
    lineId: 2, 
    name: "Osokorky", 
    position: { 
      lat: 50.395423, 
      lng: 30.616365 
    } 
  },
  { 
    id: 4, 
    lineId: 3, 
    name: "Zoloti Vorota", 
    position: { 
      lat: 50.448853, 
      lng: 30.513346 
    } 
  },
]

async function fetchStations(): Promise<Station[]> {

  try {
    const response = await fetch('http://localhost:3002/api/stations', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stations: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching stations:', error)
    return mockStations
  }
}

export function useStations() {
  return useQuery({
    queryKey: ['stations'],
    queryFn: fetchStations,
    placeholderData: fallbackStations,
    retry: false,
  })
} 