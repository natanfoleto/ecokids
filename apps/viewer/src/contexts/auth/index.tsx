import type { GetStudentProfileResponse } from '@ecokids/types'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'

import { getStudentProfile } from '@/http/students/get-student-profile'

import type { AuthContextType, AuthProviderProps } from './types'

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [student, setStudent] = useState<
    GetStudentProfileResponse['student'] | null
  >(null)

  const { data, isSuccess } = useQuery({
    queryKey: ['student', 'profile'],
    queryFn: getStudentProfile,
  })

  useEffect(() => {
    if (isSuccess && data) setStudent(data.student)
  }, [isSuccess, data, setStudent])

  const signOut = () => {
    setStudent(null)
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!student,
        student,
        setStudent,
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
