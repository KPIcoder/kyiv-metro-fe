import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { useTickets } from '../hooks/useTickets'
import { useBuyTicket } from '../hooks/useBuyTicket'
import { TicketCarousel } from '../components/tickets/TicketCarousel'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { TicketCard } from '../components/tickets/TicketCard'
import { Ticket } from '@/interfaces/Ticket'
import { useUser } from '@clerk/clerk-react'
import { toast } from 'sonner'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'tickets',
  component: TicketsPage,
})

function TicketsPage() {
  const { data: tickets, isLoading, error } = useTickets()
  const { user } = useUser()
  const buyTicket = useBuyTicket()

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-lg font-semibold text-yellow-900">Loading tickets...</div>
  }
  if (error) {
    return <div className="min-h-[60vh] flex items-center justify-center text-lg font-semibold text-red-700">Error loading tickets: {error.message}</div>
  }

  const exclusiveTickets = tickets?.slice(0, 3) ?? []
  const moreTickets = tickets?.slice(3) ?? []

  const handleBuyTicket = async (ticket: Ticket) => {
    if (!user) {
      toast.error('Please sign in to buy tickets')
      return
    }

    try {
      const { url } = await buyTicket.mutateAsync({
        name: ticket.name,
        description: ticket.description,
        cost: ticket.price ?? 0,
        userId: user.id,
        validZonesRange: ticket.zones,
        usagesLimit: ticket.usagesLeft,
        validForDays: ticket.daysLeft,
      })
      window.location.href = url
    } catch (error) {
      console.error('Failed to buy ticket:', error)
      toast.error('Failed to purchase ticket. Please try again.')
    }
  }

  const renderTicket = (ticket: Ticket) => (
    <TicketCard key={ticket.id}>
      <TicketCard.Title title={ticket.name} />
      <TicketCard.Description description={ticket.description} />
      <div className="flex flex-wrap gap-2 mb-2">
        <TicketCard.Tag>Zones: {ticket.zones}</TicketCard.Tag>
        <TicketCard.Tag>Valid {ticket.daysLeft} days</TicketCard.Tag>
        <TicketCard.Tag>Usages: {ticket.usagesLeft}</TicketCard.Tag>
      </div>
      {ticket.price && (
        <div className="text-lg font-bold text-yellow-800 mb-2">₴{ticket.price}</div>
      )}
      <span className="flex-1">
        <TicketCard.BuyButton 
          onClick={() => handleBuyTicket(ticket)} 
          disabled={buyTicket.isPending}
        />
      </span>
    </TicketCard>
  )

  return (
    <>
    <SignedIn>
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-50 pb-16">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block bg-yellow-400 rounded-full p-2 shadow-md">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-900"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
              </span>
              <h1 className="text-3xl font-extrabold text-yellow-900 tracking-tight">Kyiv Metro Tickets</h1>
            </div>
            <p className="text-yellow-800 text-base text-center max-w-md">Buy official Kyiv Metro tickets instantly. Choose your ticket, pay securely, and ride with ease. 🚇</p>
          </div>

          {/* Exclusive Offers Section */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-yellow-200 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-block bg-yellow-400 rounded-full p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-900">
                  <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
                </svg>
              </span>
              <h2 className="text-2xl font-bold text-yellow-900">Exclusive Offers</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exclusiveTickets.map(renderTicket)}
            </div>
          </div>

          {/* More Tickets Section */}
          {moreTickets.length > 0 && (
            <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-yellow-200">
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-block bg-yellow-400 rounded-full p-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-900">
                    <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9" />
                  </svg>
                </span>
                <h2 className="text-2xl font-bold text-yellow-900">More Tickets</h2>
              </div>
              <TicketCarousel tickets={moreTickets} renderTicket={renderTicket} />
            </div>
          )}

          <div className="mt-8 text-center text-xs text-yellow-700 opacity-80">
            <span className="inline-flex items-center gap-1">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline-block text-yellow-600">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
              Secure purchase • Official Kyiv Metro tickets • Instant delivery
            </span>
          </div>
        </div>
      </div>
    </SignedIn>

    <SignedOut>
      <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-6">Please sign in to view your tickets</h1>
      </div>
    </SignedOut>
    </>
  )
} 