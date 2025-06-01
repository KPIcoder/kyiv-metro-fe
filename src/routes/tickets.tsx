import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { useTickets } from '../hooks/useTickets'
import { TicketList } from '../components/tickets/TicketList'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { TicketCard } from '../components/tickets/TicketCard'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'tickets',
  component: TicketsPage,
})

function TicketsPage() {
  const { data: tickets, isLoading, error } = useTickets()

  if (isLoading) {
    return <div>Loading tickets...</div>
  }
  if (error) {
    return <div>Error loading tickets: {error.message}</div>
  }
  return (
    <>
    <SignedIn>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Browse available tickets</h1>
        <TicketList
          tickets={tickets ?? []}
          renderTicket={ticket => (
            <TicketCard key={ticket.id}>
              <TicketCard.Title title={ticket.name} />
              <TicketCard.Description description={ticket.description} />
              <div className="flex  gap-2">
                <TicketCard.Tag>Zones: {ticket.zones}</TicketCard.Tag>
                <TicketCard.Tag>Valid {ticket.daysLeft} days</TicketCard.Tag>
                <TicketCard.Tag>Usages: {ticket.usagesLeft}</TicketCard.Tag>
              </div>
                <span className="flex-1"><TicketCard.BuyButton onClick={() => {}} /></span>
            </TicketCard>
          )}
        />
      </div>
    </SignedIn>

    <SignedOut>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Please sign in to view your tickets</h1>
      </div>
    </SignedOut>
    </>
  )
} 