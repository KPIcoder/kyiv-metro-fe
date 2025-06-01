import { useQuery } from '@tanstack/react-query'
import { useUser } from '@clerk/clerk-react'
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



export function useUserTickets() {
  const { user } = useUser()
  const userId = user?.id

  return useQuery({
    queryKey: ['userTickets', userId],
    queryFn: async () => {
      if (!userId) return []
      const res = await fetch(`http://localhost:3002/api/tickets/${userId}`)
      if (!res.ok) throw new Error('Failed to fetch user tickets')
      return res.json() as Promise<Ticket[]>
    },
    placeholderData: fallbackTickets,
    enabled: !!userId,
    staleTime: 60 * 1000,
  })
} 