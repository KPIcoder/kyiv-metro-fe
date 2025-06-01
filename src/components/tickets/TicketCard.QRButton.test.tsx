import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TicketCard } from './'
import { Ticket } from '../../interfaces/Ticket'

const ticket: Ticket = {
  id: 1,
  name: 'Test Ticket',
  description: 'Test Description',
  daysLeft: 2,
  zones: '1-2',
  usagesLeft: 5,
  price: 42,
}

describe('TicketCard.QRButton', () => {
  it('shows QR code when clicked', () => {
    render(
      <TicketCard qrValue={JSON.stringify({ ticketId: ticket.id, userId: 'user-123' })}>
        <TicketCard.QRButton />
      </TicketCard>
    )
    fireEvent.click(screen.getByText('View QR code'))
    expect(screen.getByText('Hide QR code')).toBeInTheDocument()
    expect(screen.getByText('Hide QR code').parentElement?.querySelector('svg')).toBeInTheDocument()
  })
}) 