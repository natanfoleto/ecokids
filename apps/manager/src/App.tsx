import { ErrorBoundary, Toaster } from '@ecokids/ui'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { queryClient } from '@/lib/react-query'

import { router } from './routes'

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" theme="light" richColors />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
