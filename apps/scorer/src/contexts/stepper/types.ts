import type { CreatePointBody, GetStudentByCodeResponse } from '@ecokids/types'
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
  items: CreatePointBody['items']
  setItems: (items: CreatePointBody['items']) => void
  manual: (itemId: string, value: number, amount: number) => void
  increment: (itemId: string, value: number) => void
  decrement: (itemId: string) => void
}
