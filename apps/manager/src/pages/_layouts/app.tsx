import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { isAuthenticated } from '@/auth'
import { Header } from '@/components/header'

export function AppLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) navigate('/sign-in')
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#FBF4F4]">
      <Header />

      <main className="mx-[168px] mt-5 flex items-center">
        <Outlet />
      </main>
    </div>
  )
}
