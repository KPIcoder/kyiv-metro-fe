import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { useUserTickets } from '../hooks/useUserTickets'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { SignInPage } from '../components/auth/SignInPage'
import { TicketCard } from '../components/tickets/TicketCard'
import { useUser } from '@clerk/clerk-react'
import { Ticket } from '@/interfaces/Ticket'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'user-tickets',
  component: UserTicketsPage,
})

function UserTicketsPage() {
  const { data: tickets, isLoading, error } = useUserTickets()
  const { user } = useUser()

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-lg font-semibold text-yellow-900">Loading your tickets...</div>
  }
  if (error) {
    return <div className="min-h-[60vh] flex items-center justify-center text-lg font-semibold text-red-700">Error loading your tickets: {error.message}</div>
  }

  const activeTickets = tickets?.filter(ticket => 
    ticket.daysLeft > 0 && ticket.usagesLeft > 0
  ) ?? []
  
  const expiredTickets = tickets?.filter(ticket => 
    ticket.daysLeft <= 0 || ticket.usagesLeft <= 0
  ) ?? []

  const renderTicket = (ticket: Ticket) => (
    <TicketCard key={ticket.id} qrValue={JSON.stringify({ ticketId: ticket.id, userId: user?.id })}>
      <TicketCard.Title title={ticket.name} />
      <TicketCard.Description description={ticket.description} />
      <div className="flex flex-wrap gap-2 mb-2">
        <TicketCard.Tag>Zones: {ticket.zones}</TicketCard.Tag>
        <TicketCard.Tag>Valid {ticket.daysLeft} days</TicketCard.Tag>
        <TicketCard.Tag>Usages: {ticket.usagesLeft}</TicketCard.Tag>
      </div>
      <span className="flex-1"><TicketCard.QRButton /></span>
    </TicketCard>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-50 pb-16">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <SignedIn>
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block bg-yellow-400 rounded-full p-2 shadow-md">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-900">
                  <rect x="2" y="7" width="20" height="10" rx="3" />
                  <path d="M16 3v4" />
                  <path d="M8 3v4" />
                  <path d="M2 17v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2" />
                </svg>
              </span>
              <h1 className="text-3xl font-extrabold text-yellow-900 tracking-tight">Your Tickets</h1>
            </div>
            <p className="text-yellow-800 text-base text-center max-w-md">View and manage your Kyiv Metro tickets. Show QR codes to enter the metro. 🚇</p>
          </div>

          {/* Active Tickets Section */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-yellow-200 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-block bg-green-400 rounded-full p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-900">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </span>
              <h2 className="text-2xl font-bold text-yellow-900">Active Tickets</h2>
            </div>
            {activeTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTickets.map(renderTicket)}
              </div>
            ) : (
              <div className="text-center py-8 text-yellow-800">
                <p className="text-lg">You don't have any active tickets.</p>
                <a href="/tickets" className="text-yellow-600 hover:text-yellow-700 underline mt-2 inline-block">
                  Browse available tickets
                </a>
              </div>
            )}
          </div>

          {/* Expired/Used Tickets Section */}
          {expiredTickets.length > 0 && (
            <div className="bg-white/90 rounded-2xl shadow-xl p-6 border border-yellow-200">
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-block bg-gray-400 rounded-full p-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-900">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </span>
                <h2 className="text-2xl font-bold text-yellow-900">Expired & Used Tickets</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expiredTickets.map(renderTicket)}
              </div>
            </div>
          )}
        </SignedIn>

        <SignedOut>
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <SignInPage />
          </div>
        </SignedOut>
      </div>
    </div>
  )
} 