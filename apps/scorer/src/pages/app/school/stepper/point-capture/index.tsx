import { type CreatePointBody, createPointBodySchema } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useStepper } from '@/contexts/stepper'
import { useAction } from '@/hooks/use-actions'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { getInitialsName } from '@/utils/get-initials-name'

import { createPointAction } from '../../actions'
import { ItemList } from './item-list'

export function PointCapture() {
  const currentSchool = useCurrentSchool()

  const { nextStep, goToStep, student, items } = useStepper()

  const { handleSubmit, setValue } = useForm<CreatePointBody>({
    resolver: zodResolver(createPointBodySchema),
  })

  const [, handleAction, isLoading] = useAction()

  async function onSubmit(data: CreatePointBody) {
    if (!student) return

    console.log({ data })

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
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full items-end justify-between">
        <div className="flex w-full items-center gap-2">
          <Avatar className="size-14">
            {student.name && (
              <AvatarFallback className="text-muted-foreground">
                {getInitialsName(student.name)}
              </AvatarFallback>
            )}
          </Avatar>

          <div>
            <h1 className="text-sm">{student.name}</h1>
            <p className="text-muted-foreground text-xs">
              {student.class.name} - {student.class.year}
            </p>
          </div>
        </div>

        <p className="text-muted-foreground w-full text-end">
          Total de <span className="font-semibold">{totalPoints}</span> pontos
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-8"
      >
        <ItemList setValue={setValue} />

        <Button
          type="submit"
          className="h-12 cursor-pointer bg-emerald-400 text-lg hover:bg-emerald-600"
          disabled={isLoading}
        >
          <p>
            Pontuar <span className="text-yellow-300">{student.name}</span> com{' '}
            <span className="text-yellow-300">{totalPoints}</span> pontos
          </p>
        </Button>
      </form>
    </div>
  )
}
