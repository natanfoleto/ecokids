import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStepper } from '@/contexts/stepper'

export function CaptureAmount() {
  const { nextStep, student } = useStepper()

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h1>{student?.name}</h1>

      <Input
        placeholder="Quantidade de pontos"
        className="h-20 w-1/2 text-center !text-2xl"
      />

      <Button
        onClick={nextStep}
        className="h-16 w-1/2 cursor-pointer bg-emerald-500 py-5 text-xl hover:bg-emerald-600"
      >
        Pontuar
      </Button>
    </div>
  )
}
