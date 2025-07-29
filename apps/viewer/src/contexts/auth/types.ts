import type { GetStudentProfileResponse } from '@ecokids/types'
import type { ReactNode } from 'react'

export interface AuthProviderProps {
  children: ReactNode
}

export interface AuthContextType {
  signed: boolean
  student: GetStudentProfileResponse['student'] | null
  setStudent(student: GetStudentProfileResponse['student'] | null): void
  signOut(): void
}
