import { Ticket } from '../../interfaces/Ticket'
import { ReactNode } from 'react'

interface TicketListProps {
  tickets: Ticket[]
  renderTicket: (ticket: Ticket) => ReactNode
}

export function TicketList({ tickets, renderTicket }: TicketListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickets.map(ticket => renderTicket(ticket))}
    </div>
  )
} 