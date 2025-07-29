import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { isAuthenticated } from '@/auth'
import { BottomNavigation } from '@/components/bottom-navigation'
import { AuthProvider } from '@/contexts/auth'

export function AppLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) navigate('/sign-in')
  }, [navigate])

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <BottomNavigation />

        <main className="mb-16 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  )
}
