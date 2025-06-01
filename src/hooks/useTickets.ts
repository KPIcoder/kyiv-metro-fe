import { useQuery } from '@tanstack/react-query'
import { Ticket } from '../interfaces/Ticket'

const fallbackTickets: Ticket[] = [
  {
    id: 1,
    name: 'All zones daily',
    description: 'All zones daily',
    daysLeft: 1,
    zones: '1-5',
    usagesLeft: 9999,
    price: 25,
  },
  {
    id: 2,
    name: 'Zone 1-2 weekly',
    description: 'Zone 1-2 weekly',
    daysLeft: 7,
    zones: '1-2',
    usagesLeft: 10,
    price: 100,
  },
]

async function fetchTickets(): Promise<Ticket[]> {
  try {
    const response = await fetch('http://localhost:3002/api/tickets', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch tickets: ${response.status}`)
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return fallbackTickets
  }
}

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: fetchTickets,
    placeholderData: fallbackTickets,
    retry: false,
  })
} 