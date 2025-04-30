import type { GetStudentByCodeResponse } from '@ecokids/types'
import type { ReactNode } from 'react'

export interface StepperProviderProps {
  children: ReactNode
}

export interface StepperContextType {
  step: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  canPrevStep: boolean
  canNextStep: boolean
  student: GetStudentByCodeResponse['student'] | null
  setStudent: (student: GetStudentByCodeResponse['student'] | null) => void
  points: number | null
  setPoints: (points: number | null) => void
}
