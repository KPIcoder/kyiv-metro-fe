import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TicketCard } from './'
import { Ticket } from '../../interfaces/Ticket'

vi.mock('../../hooks/useBuyTicket', () => ({
  useBuyTicket: () => ({ mutate: vi.fn(), isPending: false, isSuccess: false, isError: false, error: null, data: null })
}))
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ user: { id: 'user-123' } })
}))

const ticket: Ticket = {
  id: 1,
  name: 'Test Ticket',
  description: 'Test Description',
  daysLeft: 2,
  zones: '1-2',
  usagesLeft: 5,
  price: 42,
}

describe('TicketCard.BuyButton', () => {
  it('renders the Buy button', () => {
    render(
      <TicketCard>
        <TicketCard.BuyButton onClick={() => {}} />
      </TicketCard>
    )
    expect(screen.getByText('Buy')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(
      <TicketCard>
        <TicketCard.BuyButton onClick={onClick} />
      </TicketCard>
    )
    fireEvent.click(screen.getByText('Buy'))
    expect(onClick).toHaveBeenCalled()
  })

  it('is disabled when disabled prop is true', () => {
    render(
      <TicketCard>
        <TicketCard.BuyButton onClick={() => {}} disabled />
      </TicketCard>
    )
    expect(screen.getByText('Buy')).toBeDisabled()
  })
}) 