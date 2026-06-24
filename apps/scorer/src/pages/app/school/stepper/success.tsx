import { Leaf, RefreshCw, Trophy, UserRound } from 'lucide-react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

import { useStepper } from '@/contexts/stepper'
import { useMetadata } from '@/hooks/use-metadata'

export function Success() {
  useMetadata('Pontuador - Sucesso')

  const { width, height } = useWindowSize()

  const { goToStep, student, setStudent, items, setItems } = useStepper()

  if (!student) {
    goToStep(1)

    return null
  }

  function handleScoreSameStudent() {
    setItems([])
    goToStep(2)
  }

  function handleScoreAnotherStudent() {
    setStudent(null)
    setItems([])
    goToStep(1)
  }

  const points = items.reduce((acc, item) => acc + item.value * item.amount, 0)

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        colors={[
          '#10b981',
          '#f59e0b',
          '#3b82f6',
          '#8b5cf6',
          '#ef4444',
          '#06b6d4',
        ]}
        numberOfPieces={800}
      />

      <div className="flex w-full max-w-lg flex-col items-center gap-8 text-center">
        {/* Trophy icon */}
        <div className="relative">
          <div className="flex size-28 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-xl shadow-yellow-200">
            <Trophy className="size-14 text-white" />
          </div>
          <div className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-emerald-500 shadow-md">
            <Leaf className="size-4 text-white" />
          </div>
        </div>

        {/* Congratulations text */}
        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-gray-800">Parabéns!</h1>
          <p className="text-xl font-medium text-gray-600">
            O aluno{' '}
            <span className="font-bold text-emerald-600">{student.name}</span>{' '}
            acabou de reciclar!
          </p>
        </div>

        {/* Points highlight */}
        <div className="flex flex-col items-center gap-1 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 px-12 py-6 shadow-lg shadow-emerald-200">
          <span className="text-5xl font-bold text-white">{points}</span>
          <span className="text-lg font-medium text-emerald-100">
            pontos ganhos
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex w-full flex-col gap-4">
          <button
            type="button"
            onClick={handleScoreSameStudent}
            className="flex min-h-[4rem] w-full items-center justify-center gap-1.5 whitespace-normal rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-xl font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:from-emerald-600 hover:to-teal-600 active:scale-95"
          >
            <RefreshCw className="size-5 shrink-0" />
            Pontuar <span className="text-yellow-300">{student.name}</span>
            novamente
          </button>

          <button
            type="button"
            onClick={handleScoreAnotherStudent}
            className="flex h-16 w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-emerald-300 bg-white text-xl font-semibold text-emerald-700 shadow-sm transition-all hover:border-emerald-500 hover:bg-emerald-50 active:scale-95"
          >
            <UserRound className="size-5" />
            Pontuar outro aluno
          </button>
        </div>
      </div>
    </div>
  )
}
