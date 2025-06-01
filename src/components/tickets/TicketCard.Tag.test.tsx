import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TicketCard } from '.'
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

describe('TicketCard.Tag', () => {
  it('renders a custom tag', () => {
    render(
      <TicketCard>
        <TicketCard.Tag>Zones: {ticket.zones}</TicketCard.Tag>
        <TicketCard.Tag>Valid {ticket.daysLeft} days</TicketCard.Tag>
        <TicketCard.Tag>Usages: {ticket.usagesLeft}</TicketCard.Tag>
      </TicketCard>
    )
    expect(screen.getByText(/Zones: 1-2/)).toBeInTheDocument()
    expect(screen.getByText(/Valid 2 days/)).toBeInTheDocument()
    expect(screen.getByText(/Usages: 5/)).toBeInTheDocument()
  })
})  