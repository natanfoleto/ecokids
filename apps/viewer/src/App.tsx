import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { queryClient } from '@/lib/react-query'

import { Toaster } from './components/ui/sonner'
import { router } from './routes'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" theme="light" richColors />
    </QueryClientProvider>
  )
}

export default App
