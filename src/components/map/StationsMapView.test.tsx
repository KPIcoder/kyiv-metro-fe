import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StationsMapView } from './StationsMapView'
import { MetroMapProvider } from './MetroMapContext'
import { Station } from '@/interfaces/Station'
import * as useZonesModule from '@/hooks/useZones'
import * as useStationsModule from '@/hooks/useStations'
import * as useBuyTicketModule from '@/hooks/useBuyTicket'
import * as clerk from '@clerk/clerk-react'
import '@testing-library/jest-dom'
import { UseQueryResult } from '@tanstack/react-query'
import { UseMutationResult } from '@tanstack/react-query'
import * as zoneService from '@/lib/zoneService'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('./Map', () => ({
  MapView: (props: any) => <div data-testid="map">{props.children}</div>,
}))

vi.mock('@/hooks/useZones')
vi.mock('@/hooks/useStations')
vi.mock('@/hooks/useBuyTicket')
vi.mock('@clerk/clerk-react')

const stations: Station[] = [
  { id: 1, name: 'A', lineId: 1, position: { lat: 1, lng: 1 } },
  { id: 2, name: 'B', lineId: 1, position: { lat: 2, lng: 2 } },
  { id: 3, name: 'C', lineId: 2, position: { lat: 3, lng: 3 } },
]

const zones = [
  { id: 1, name: 'Zone 1', range: 1, coords: [{ lat: 0, lng: 0 }] },
  { id: 2, name: 'Zone 2', range: 2, coords: [{ lat: 0, lng: 0 }] },
]

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={testQueryClient}>
      <MetroMapProvider>
        {ui}
      </MetroMapProvider>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.resetAllMocks()
  
  const mockUseStations: UseQueryResult<Station[], Error> = {
    data: stations,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    isFetching: false,
    isSuccess: true,
    status: 'success',
    isPending: false,
    isLoadingError: false,
    isRefetchError: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    errorUpdateCount: 0,
    isFetched: true,
    isFetchedAfterMount: true,
    isInitialLoading: false,
    isPaused: false,
    failureReason: null,
    fetchStatus: 'idle',
    promise: Promise.resolve(stations),
  }
  vi.spyOn(useStationsModule, 'useStations').mockReturnValue(mockUseStations)

  const mockUseZones: UseQueryResult<typeof zones, Error> = {
    data: zones,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    isFetching: false,
    isSuccess: true,
    status: 'success',
    isPending: false,
    isLoadingError: false,
    isRefetchError: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    errorUpdateCount: 0,
    isFetched: true,
    isFetchedAfterMount: true,
    isInitialLoading: false,
    isPaused: false,
    failureReason: null,
    fetchStatus: 'idle',
    promise: Promise.resolve(zones),
  }
  vi.spyOn(useZonesModule, 'useZones').mockReturnValue(mockUseZones)

  const mockUseBuyTicket: UseMutationResult<any, Error, any, unknown> = {
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: undefined,
    reset: vi.fn(),
    variables: undefined,
    status: 'idle',
    isIdle: true,
    context: undefined,
    failureCount: 0,
    failureReason: null,
    mutateAsync: vi.fn(),
    isPaused: false,
    submittedAt: 0,
  }
  vi.spyOn(useBuyTicketModule, 'useBuyTicket').mockReturnValue(mockUseBuyTicket)
  vi.spyOn(clerk, 'useUser').mockReturnValue({ user: { id: 'user-123' } } as any)
  vi.spyOn(zoneService, 'getUniqueZonesForRoute').mockImplementation((route) => {
    if (!route || route.length === 0) return [];
    const unique = Array.from(new Set(route.map(s => s.lineId)));
    return unique.map((lineId, idx) => ({
      id: idx + 1,
      name: `Zone ${idx + 1}`,
      range: idx + 1,
      coords: [{ lat: 0, lng: 0 }],
    }));
  })
})

describe('StationsMapView', () => {
  it('renders station selects and map', () => {
    renderWithProviders(<StationsMapView />)
    expect(screen.getByTestId('map')).toBeInTheDocument()
    expect(screen.getByLabelText(/From Station/)).toBeInTheDocument()
    expect(screen.getByLabelText(/To Station/)).toBeInTheDocument()
    expect(screen.getAllByText('A (Blue Line)').length).toBeGreaterThan(0)
    expect(screen.getAllByText('B (Blue Line)').length).toBeGreaterThan(0)
    expect(screen.getAllByText('C (Red Line)').length).toBeGreaterThan(0)
  })

  it('selects a station using the dropdown', () => {
    renderWithProviders(<StationsMapView />)
    fireEvent.change(screen.getByLabelText(/From Station/), { target: { value: '1' } })
    expect(screen.getByLabelText(/From Station/)).toHaveValue('1')
  })

  it('can set from and to stations and fetch route', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ stations: [stations[0], stations[1]] }),
    }) as any

    renderWithProviders(<StationsMapView />)
    fireEvent.change(screen.getByLabelText(/From Station/), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/To Station/), { target: { value: '2' } })
    fireEvent.click(screen.getByText('Get Directions'))
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Trip Summary' })).toBeInTheDocument())
    expect(screen.getByText('Total stations:')).toBeInTheDocument()
  })

  it('hides overlays if route fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 }) as any
    renderWithProviders(<StationsMapView />)
    fireEvent.change(screen.getByLabelText(/From Station/), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/To Station/), { target: { value: '2' } })
    fireEvent.click(screen.getByText('Get Directions'))
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Trip Summary' })).not.toBeInTheDocument()
      expect(screen.queryByText(/Single Ride Ticket/i)).not.toBeInTheDocument()
    })
  })

  it('shows and hides trip summary overlay', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ stations: [stations[0], stations[1]] }),
    }) as any
    renderWithProviders(<StationsMapView />)
    fireEvent.change(screen.getByLabelText(/From Station/), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/To Station/), { target: { value: '2' } })
    fireEvent.click(screen.getByText('Get Directions'))
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Trip Summary' })).toBeInTheDocument())
    fireEvent.click(screen.getByText('Hide'))
    expect(screen.queryByRole('heading', { name: 'Trip Summary' })).not.toBeInTheDocument()
  })

  it('shows single ride ticket tooltip and can buy ticket', async () => {
    const mutate = vi.fn()
    const mockUseBuyTicket: UseMutationResult<any, Error, any, unknown> = {
      mutate,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      reset: vi.fn(),
      variables: undefined,
      status: 'idle',
      isIdle: true,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      mutateAsync: vi.fn(),
      isPaused: false,
      submittedAt: 0,
    }
    vi.spyOn(useBuyTicketModule, 'useBuyTicket').mockReturnValue(mockUseBuyTicket)

    const routeStations = [
      { ...stations[0], position: { lat: 0.5, lng: 0.5 } },
      { ...stations[1], position: { lat: 1.5, lng: 1.5 } },
    ]
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ stations: routeStations }),
    }) as any

    renderWithProviders(<StationsMapView />)
    fireEvent.change(screen.getByLabelText(/From Station/), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/To Station/), { target: { value: '2' } })
    fireEvent.click(screen.getByText('Get Directions'))
    
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Trip Summary' })).toBeInTheDocument())
    
    await waitFor(() => expect(screen.getByText(/Single Ride Ticket/i)).toBeInTheDocument())
    expect(screen.getByText(/Buy Single Ticket/i)).toBeInTheDocument()
    
    fireEvent.click(screen.getByText(/Buy Single Ticket/i))
    expect(mutate).toHaveBeenCalled()
  })

  it('clears route and resets state', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ stations: [stations[0], stations[1]] }),
    }) as any
    renderWithProviders(<StationsMapView />)
    fireEvent.change(screen.getByLabelText(/From Station/), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/To Station/), { target: { value: '2' } })
    fireEvent.click(screen.getByText('Get Directions'))
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Trip Summary' })).toBeInTheDocument())

    fireEvent.click(screen.getByText('Clear'))
    expect(screen.queryByRole('heading', { name: 'Trip Summary' })).not.toBeInTheDocument()
    expect(screen.getByLabelText(/From Station/)).toHaveValue("")
    expect(screen.getByLabelText(/To Station/)).toHaveValue("")
  })
}) 