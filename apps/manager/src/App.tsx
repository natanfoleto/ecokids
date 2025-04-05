import { RouterProvider } from 'react-router-dom'

import { Toaster } from './components/ui/sonner'
import { router } from './routes'

function App() {
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
      <Toaster />
    </div>
  )
}

export default App
