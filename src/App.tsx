import { SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react"
import { SignInPage } from "./components/auth/SignInPage"
import { StationsMapView } from "./components/map/StationsMapView"
import { useStations } from './hooks/useStations'
import { Link } from '@tanstack/react-router'
import { MetroMapProvider } from "./components/map/MetroMapContext"

function App() {
  const { data: stations, isLoading, error } = useStations()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading stations...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we fetch the data</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-destructive">Error loading stations</h2>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SignedIn>
        <div className="container mx-auto p-4">
          <header className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold">Kyiv Metro Map</h1>
              <Link to="/tickets" className="text-blue-600 hover:underline font-medium">Browse tickets</Link>
              <Link to="/user-tickets" className="text-blue-600 hover:underline font-medium">Your tickets</Link>
            </div>
            <SignOutButton />
          </header>
          
          <div className="space-y-6">
            <MetroMapProvider>
              <StationsMapView 
                className="rounded-xl border shadow-md"
              />
            </MetroMapProvider>
            
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold">Stations List</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(stations ?? []).map((station) => (
                  <div key={station.id} className="p-4 border rounded-lg bg-card">
                    <h3 className="font-medium">{station.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Line: {station.lineId} · Coords: {station.position.lat.toFixed(4)}, {station.position.lng.toFixed(4)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <SignInPage />
      </SignedOut>
    </>
  )
}

export default App
