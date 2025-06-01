import { createRoute, useNavigate } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'success',
  component: SuccessPage,
})

function SuccessPage() {
  const navigate = useNavigate()
  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h1>
      <p className="mb-8 text-lg text-center">Thank you for your purchase. Your ticket is now active and ready to use.</p>
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => navigate({ to: '/' })}
      >
        Go to Main Page
      </button>
    </div>
  )
} 