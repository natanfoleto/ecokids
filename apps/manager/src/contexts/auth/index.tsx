import { createContext, useContext, useState } from 'react'

// import { useStorage } from '@/hooks/use-storage'
import type { AuthContextType, AuthProviderProps } from './types'

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<[] | null>(null)

  const signOut = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextType {
  return useContext(AuthContext)
}

export { AuthProvider, useAuth }
