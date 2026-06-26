import { useAudio, useClickSound } from '@ecokids/ui'
import { useQuery } from '@tanstack/react-query'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Leaf,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react'
import { type JSX, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useStepper } from '@/contexts/stepper'
import { useCurrentSchoolSlug } from '@/hooks/use-current-school'
import { getSchool } from '@/http/schools/get-school'

import { CodeEntry } from './code-entry'
import { PointCapture } from './point-capture'
import { Success } from './success'

const STEP_LABELS = ['Aluno', 'Materiais', 'Concluído']

export function Stepper() {
  const currentSchool = useCurrentSchoolSlug()

  const {
    step,
    totalSteps,
    canPrevStep,
    canNextStep,
    prevStep,
    nextStep,
    student,
  } = useStepper()

  const { playMusic, pauseMusic } = useAudio()
  const { onClick: playClick } = useClickSound()

  // Control music based on current step:
  // Steps 1 & 2 → background music plays (without restarting on step switch)
  // Step 3 (success) → pause music (success.tsx handles the success sound)
  useEffect(() => {
    if (step < totalSteps) {
      playMusic('background')
    } else {
      pauseMusic('background')
    }
  }, [step, totalSteps, playMusic, pauseMusic])

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
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500">
          <Loader2 className="size-8 animate-spin text-white" />
        </div>
        <p className="font-medium text-emerald-700">Carregando...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
        <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-red-200 bg-white p-8 text-center shadow-lg">
          <div className="flex size-14 items-center justify-center rounded-full bg-red-100">
            <X className="size-7 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Erro ao carregar
          </h2>
          <p className="text-sm text-gray-500">
            Houve um erro ao carregar os dados da escola.
          </p>
        </div>

        <Link to="/">
          <Button variant="outline" className="cursor-pointer gap-2">
            <ArrowLeft className="size-4" />
            Voltar para o menu
          </Button>
        </Link>
      </div>
    )
  }

  if (!data?.activeSchoolSeason) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 text-center">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-amber-200 bg-white p-8 shadow-lg">
          <div className="flex size-14 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="size-7 text-amber-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Sem Ciclo Ativo
          </h2>
          <p className="text-sm leading-relaxed text-gray-500">
            A escola{' '}
            <strong className="text-gray-700">{data?.school.name}</strong> não
            possui nenhum ciclo de pontuação ativo no momento. Não é possível
            registrar materiais sem um ciclo de pontuação ativo.
          </p>
        </div>

        <Link to="/">
          <Button className="cursor-pointer bg-emerald-500 hover:bg-emerald-600">
            Voltar para o menu
          </Button>
        </Link>
      </div>
    )
  }

  const isLastStep = step === totalSteps

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* ===== HEADER ===== */}
      {!isLastStep && (
        <header className="flex-shrink-0 bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-4 shadow-md">
          <div className="flex items-center justify-between">
            {/* Left — back to home */}
            <Link to="/" onClick={playClick}>
              <button className="flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30">
                <ChevronLeft className="size-4" />
                Início
              </button>
            </Link>

            {/* Center — school name + logo */}
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-2">
                <Leaf className="size-4 text-emerald-200" />
                <span className="text-xs font-medium uppercase tracking-widest text-emerald-200">
                  Ecokids
                </span>
              </div>
              <span className="text-base font-bold text-white">
                {data?.school.name}
              </span>
            </div>

            {/* Right — reset button */}
            <Link to="/" onClick={playClick}>
              <button className="flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30">
                <RefreshCw className="size-4" />
                Resetar
              </button>
            </Link>
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-2">
            {STEP_LABELS.map((label, idx) => {
              const stepNum = idx + 1
              const isVisited = step >= stepNum

              return (
                <div
                  key={label}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className={`h-1 w-full transition-all duration-300 ${
                      isVisited ? 'bg-yellow-300' : 'bg-white/30'
                    }`}
                  />
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isVisited ? 'text-yellow-300' : 'text-white/50'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </header>
      )}

      {/* ===== CONTENT AREA ===== */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 pb-6">
        {/* Navigation prev */}
        {canPrevStep && !isLastStep && (
          <button
            onClick={() => {
              playClick()
              prevStep()
            }}
            className="absolute left-4 top-4 flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-all hover:scale-110 hover:bg-emerald-600 active:scale-95"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}

        {/* Navigation next */}
        {canNextStep && student && step !== totalSteps - 1 && (
          <button
            onClick={() => {
              playClick()
              nextStep()
            }}
            className="absolute right-4 top-4 flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-all hover:scale-110 hover:bg-emerald-600 active:scale-95"
          >
            <ArrowRight className="size-5" />
          </button>
        )}

        {steps[step] ?? (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-sm text-red-600">Passo inválido.</p>
          </div>
        )}

        {!isLastStep && (
          <Link to="/" className="mt-4">
            <Button
              variant="ghost"
              className="text-muted-foreground cursor-pointer text-sm hover:text-emerald-700"
            >
              Voltar para o início
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
