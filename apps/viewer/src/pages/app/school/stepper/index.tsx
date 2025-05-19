import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Loader2, RefreshCw, X } from 'lucide-react'
import { type JSX } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useStepper } from '@/contexts/stepper'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { getSchool } from '@/http/schools/get-school'

import { CodeEntry } from './code-entry'
import { PointCapture } from './point-capture'
import { Success } from './success'

export function Stepper() {
  const currentSchool = useCurrentSchool()

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['school', currentSchool],
    queryFn: () => getSchool({ params: { schoolSlug: currentSchool! } }),
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-2">
        <div className="flex flex-col items-center rounded-lg border border-red-500 bg-red-50 p-4 text-red-500">
          <X />
          <p className="font-medium">
            Houve um erro ao carregar os dados da escola.
          </p>
        </div>

        <Link to="/">
          <Button variant="link" className="cursor-pointer">
            <ArrowLeft />
            Voltar para o menu
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative flex h-screen flex-col items-center justify-between gap-4 px-4 pb-4">
      {step !== totalSteps && (
        <div className="flex flex-col items-center gap-0.5 rounded-b-lg border border-emerald-300 bg-emerald-50 px-4 py-2">
          <Link to="/">
            <Button
              size="icon"
              className="size-7 cursor-pointer bg-emerald-300 hover:bg-emerald-400"
            >
              <RefreshCw className="size-4" />
            </Button>
          </Link>

          <h1 className="text-muted-foreground">{data?.school.name}</h1>
        </div>
      )}

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
