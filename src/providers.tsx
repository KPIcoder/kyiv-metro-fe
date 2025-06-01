import { ClerkProvider } from "@clerk/clerk-react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Since stations won't change
      gcTime: Infinity,
      refetchOnWindowFocus: false, // Disable refetch on window focus
      refetchOnMount: true, // Ensure we refetch on mount
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
          {children}
        </ClerkProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
