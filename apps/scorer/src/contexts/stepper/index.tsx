import type { CreatePointBody, GetStudentByCodeResponse } from '@ecokids/types'
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
  const [items, setItems] = useState<CreatePointBody['items']>([])

  const increment = (itemId: string, value: number) => {
    setItems((prev) =>
      prev.some((item) => item.itemId === itemId)
        ? prev.map((item) =>
            item.itemId === itemId ? { ...item, amount: item.amount++ } : item,
          )
        : [...prev, { itemId, value, amount: 1 }],
    )
  }

  const decrement = (itemId: string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.itemId === itemId ? { ...item, amount: item.amount - 1 } : item,
        )
        .filter((item) => item.amount > 0),
    )
  }

  const manual = (itemId: string, value: number, amount: number) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.itemId === itemId)

      if (index !== -1) {
        const updated = [...prev]

        updated[index] = { ...updated[index], amount }

        return updated
      }

      return [...prev, { itemId, value, amount }]
    })
  }

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
        items,
        setItems,
        manual,
        increment,
        decrement,
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
