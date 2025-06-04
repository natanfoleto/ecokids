import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { isAuthenticated } from '@/auth'

export function AppLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) navigate('/sign-in')
  }, [navigate])

  useEffect(() => {
    const goFullscreen = async () => {
      const el = document.documentElement

      if (el.requestFullscreen) {
        try {
          await el.requestFullscreen()
        } catch (error) {
          console.error('Erro ao tentar entrar em fullscreen:', error)
        }
      }
    }

    goFullscreen()
  }, [])

  return (
    <main className="min-h-screen">
      <Outlet />
    </main>
  )
}
