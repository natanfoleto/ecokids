import { StepperProvider } from '@/contexts/stepper'

import { Stepper } from './stepper'

export function School() {
  return (
    <StepperProvider>
      <Stepper />
    </StepperProvider>
  )
}
