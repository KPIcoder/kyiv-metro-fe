import { render, screen } from '@testing-library/react'
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

describe('TicketCard.Description', () => {
  it('renders the ticket description', () => {
    render(
      <TicketCard>
        <TicketCard.Description description={ticket.description} />
      </TicketCard>
    )
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })
}) 