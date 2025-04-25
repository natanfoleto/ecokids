import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { isAuthenticated } from '@/auth'

export function NotFound() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) navigate('/')
    else navigate('/sign-in')
  }, [navigate])

  return null
}
