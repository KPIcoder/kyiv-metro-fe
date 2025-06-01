import { useMutation } from '@tanstack/react-query'

interface BuyTicketBody {
  name: string;
  description: string;
  cost: number;
  userId: string;
  validZonesRange: string;
  usagesLimit: number;
  validForDays: number;
}

export function useBuyTicket() {
  return useMutation({
    mutationFn: async (body: BuyTicketBody) => {
      const res = await fetch('http://localhost:3002/api/tickets/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Failed to buy ticket: ${res.status}`)
      return res.json()
    },
  })
} 