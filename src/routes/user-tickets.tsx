import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { useUserTickets } from '../hooks/useUserTickets'
import { TicketList } from '../components/tickets/TicketList'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { SignInPage } from '../components/auth/SignInPage'
import { TicketCard } from '../components/tickets/TicketCard'
import { useUser } from '@clerk/clerk-react'
export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'user-tickets',
  component: UserTicketsPage,
})

function UserTicketsPage() {
  const { data: tickets, isLoading, error } = useUserTickets()
  const { user } = useUser()

  if (isLoading) {
    return <div className="p-8 text-center">Loading your tickets...</div>
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">Error loading your tickets: {error.message}</div>
  }
  if (!tickets || tickets.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">You have no tickets yet.</div>
  }
  return (
    <div className="container mx-auto p-4">
      <SignedIn>
        
        <h1 className="text-2xl font-bold mb-6">Your Tickets</h1>
        <TicketList
          tickets={tickets}
          renderTicket={ticket => (
            <TicketCard key={ticket.id} qrValue={JSON.stringify({ ticketId: ticket.id, userId: user?.id })}>
              <TicketCard.Title title={ticket.name} />
              <TicketCard.Description description={ticket.description} />
              <div className="flex  gap-2">
              <TicketCard.Tag>Zones: {ticket.zones}</TicketCard.Tag>
              <TicketCard.Tag>Valid {ticket.daysLeft} days</TicketCard.Tag>
              <TicketCard.Tag>Usages: {ticket.usagesLeft}</TicketCard.Tag>
              </div>
              <span className="flex-1"><TicketCard.QRButton /></span>
              
            </TicketCard>
          )}
        />
      </SignedIn>
      <SignedOut>
        <SignInPage />
      </SignedOut>
    </div>
  )
} 