import { type CreatePointBody, createPointBodySchema } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Leaf, Star } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useStepper } from '@/contexts/stepper'
import { useAction } from '@/hooks/use-actions'
import { useCurrentSchoolSlug } from '@/hooks/use-current-school'
import { useMetadata } from '@/hooks/use-metadata'
import { getInitialsName } from '@/utils/get-initials-name'

import { createPointAction } from '../../actions'
import { ItemList } from './item-list'

export function PointCapture() {
  useMetadata('Pontuador - Itens')

  const currentSchool = useCurrentSchoolSlug()

  const { nextStep, goToStep, student, items } = useStepper()

  const { handleSubmit, setValue } = useForm<CreatePointBody>({
    resolver: zodResolver(createPointBodySchema),
  })

  const [, handleAction, isLoading] = useAction()

  async function onSubmit(data: CreatePointBody) {
    if (!student) return

    handleAction(
      () =>
        createPointAction({
          params: {
            schoolSlug: currentSchool!,
            studentId: student.id,
          },
          body: data,
        }),
      () => {
        nextStep()
      },
    )
  }

  const totalPoints = items.reduce(
    (acc, item) => acc + item.value * item.amount,
    0,
  )

  if (!student) {
    goToStep(1)

    return null
  }

  return (
    <div className="flex h-full w-full flex-col items-center gap-5 py-2">
      {/* Student card */}
      <div className="flex w-full max-w-2xl items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 shadow-lg shadow-emerald-200">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 ring-4 ring-white/40">
            {student.name && (
              <AvatarFallback className="bg-white/20 text-lg font-bold text-white">
                {getInitialsName(student.name)}
              </AvatarFallback>
            )}
          </Avatar>

          <div>
            <h2 className="text-lg font-bold text-white">{student.name}</h2>
            <p className="text-sm font-medium text-emerald-100">
              {student.class.name} — {student.class.year}
            </p>
          </div>
        </div>

        {/* Points badge */}
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/20 px-5 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <Star className="size-4 fill-yellow-300 text-yellow-300" />
            <span className="text-2xl font-bold text-white">{totalPoints}</span>
          </div>
          <span className="text-xs font-medium text-emerald-100">pontos</span>
        </div>
      </div>

      {/* Items form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-1 flex-col items-center gap-5"
      >
        <div className="flex w-full flex-1 items-center justify-center">
          <ItemList setValue={setValue} />
        </div>

        <Button
          type="submit"
          disabled={isLoading || totalPoints === 0}
          className="h-16 w-full max-w-2xl cursor-pointer rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xl font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:from-emerald-600 hover:to-teal-600 hover:shadow-emerald-300 active:scale-95 disabled:opacity-60"
        >
          <Leaf className="size-5" />
          Pontuar <span className="text-yellow-300">
            {student.name}
          </span> com <span className="text-yellow-300">{totalPoints}</span>{' '}
          pontos
        </Button>
      </form>
    </div>
  )
}
