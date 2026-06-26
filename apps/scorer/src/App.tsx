import { AudioProvider, Toaster } from '@ecokids/ui'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { scorerSounds } from '@/audio'
import { queryClient } from '@/lib/react-query'

import { router } from './routes'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioProvider sounds={scorerSounds}>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" theme="light" richColors />
      </AudioProvider>
    </QueryClientProvider>
  )
}

export default App
