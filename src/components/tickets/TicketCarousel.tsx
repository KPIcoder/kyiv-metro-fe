import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Ticket } from '@/interfaces/Ticket'

interface TicketCarouselProps {
  tickets: Ticket[]
  renderTicket: (ticket: Ticket) => React.ReactNode
}

export function TicketCarousel({ tickets, renderTicket }: TicketCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    dragFree: false,
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
              {renderTicket(ticket)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white text-yellow-900 rounded-full p-2 shadow-lg border border-yellow-200 transition-all hover:scale-110 z-10"
        onClick={scrollPrev}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white text-yellow-900 rounded-full p-2 shadow-lg border border-yellow-200 transition-all hover:scale-110 z-10"
        onClick={scrollNext}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  )
} 