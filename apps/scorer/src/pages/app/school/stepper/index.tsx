import { ArrowLeft, ArrowRight } from 'lucide-react'
import { type JSX } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useStepper } from '@/contexts/stepper'

import { CodeEntry } from './code-entry'
import { PointCapture } from './point-capture'
import { Success } from './success'

export function Stepper() {
  const {
    step,
    totalSteps,
    canPrevStep,
    canNextStep,
    prevStep,
    nextStep,
    student,
  } = useStepper()

  const steps: Record<number, JSX.Element> = {
    1: <CodeEntry />,
    2: <PointCapture />,
    3: <Success />,
  }

  return (
    <div className="relative flex h-screen flex-col items-center justify-between gap-4 p-4">
      {canPrevStep && step !== totalSteps && (
        <Button
          variant="outline"
          size="icon"
          onClick={prevStep}
          className="absolute left-4 top-4 cursor-pointer self-start rounded-full bg-emerald-500 hover:bg-emerald-600"
        >
          <ArrowLeft className="text-muted size-4" />
        </Button>
      )}

      {canNextStep && student && step !== totalSteps - 1 && (
        <Button
          variant="outline"
          size="icon"
          onClick={nextStep}
          className="absolute right-4 top-4 cursor-pointer self-start rounded-full bg-emerald-500 hover:bg-emerald-600"
        >
          <ArrowRight className="text-muted size-4" />
        </Button>
      )}

      {steps[step] ?? (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-sm text-red-600">Passo inválido.</p>
        </div>
      )}

      <Link to="/">
        <Button
          variant="link"
          className="text-muted-foreground cursor-pointer self-center"
        >
          Voltar para o início
        </Button>
      </Link>
    </div>
  )
}
