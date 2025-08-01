import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
    <div className="flex h-full w-full items-center justify-center gap-4">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        colors={['#00bc7d']}
        numberOfPieces={1000}
      />

      <div className="flex w-full flex-col items-center justify-center gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-5xl">Parabéns!</h1>
          <p className="text-muted-foreground">
            O aluno <strong>{student.name}</strong> recebeu{' '}
            <strong>{points}</strong> pontos.
          </p>
        </div>

        <Separator />

        <div className="flex w-full flex-col items-center gap-4">
          <Button
            type="submit"
            onClick={handleScoreSameStudent}
            className="h-16 w-1/2 cursor-pointer bg-emerald-500 py-5 text-xl hover:bg-emerald-600"
          >
            Pontuar <span className="text-yellow-300">{student.name}</span>{' '}
            novamente
          </Button>

          <Button
            type="submit"
            onClick={handleScoreAnotherStudent}
            className="h-16 w-1/2 cursor-pointer bg-emerald-500 py-5 text-xl hover:bg-emerald-600"
          >
            Pontuar outro aluno
          </Button>
        </div>
      </div>
    </div>
  )
}
