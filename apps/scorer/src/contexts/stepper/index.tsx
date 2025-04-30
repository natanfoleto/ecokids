import type { GetStudentByCodeResponse } from '@ecokids/types'
import { createContext, useContext, useState } from 'react'

import type { StepperContextType, StepperProviderProps } from './types'

const StepperContext = createContext<StepperContextType>(
  {} as StepperContextType,
)

const StepperProvider = ({ children }: StepperProviderProps) => {
  const [step, setStep] = useState(1)
  const [student, setStudent] = useState<
    GetStudentByCodeResponse['student'] | null
  >(null)
  const [points, setPoints] = useState<number | null>(null)

  const totalSteps = 3

  const canPrevStep = step > 1
  const canNextStep = step < totalSteps

  const nextStep = () => {
    if (canNextStep) setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    if (canPrevStep) setStep((prev) => prev - 1)
  }

  const goToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= totalSteps) setStep(stepNumber)
  }

  return (
    <StepperContext.Provider
      value={{
        step,
        totalSteps,
        nextStep,
        prevStep,
        goToStep,
        canPrevStep,
        canNextStep,
        student,
        setStudent,
        points,
        setPoints,
      }}
    >
      {children}
    </StepperContext.Provider>
  )
}

function useStepper(): StepperContextType {
  return useContext(StepperContext)
}

export { StepperProvider, useStepper }
