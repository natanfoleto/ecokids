import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { isAuthenticated } from '@/auth'

export function AuthLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) navigate('/')
  }, [navigate])

  return (
    <div className="overflow-hidden">
      <main className="flex h-screen w-full items-center justify-center">
        <Outlet />
      </main>
    </div>
  )
}
