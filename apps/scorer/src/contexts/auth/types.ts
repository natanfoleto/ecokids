import type { ReactNode } from 'react'

export interface AuthProviderProps {
  children: ReactNode
}

export interface AuthContextType {
  signed: boolean
  user: [] | null
  signOut(): void
}
