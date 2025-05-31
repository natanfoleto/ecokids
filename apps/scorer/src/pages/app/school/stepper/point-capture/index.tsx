import { type CreatePointBody, createPointBodySchema } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
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

  const { nextStep, goToStep, student } = useStepper()

  const { handleSubmit, setValue } = useForm<CreatePointBody>({
    resolver: zodResolver(createPointBodySchema),
  })

  const [, handleAction, isPending] = useAction()

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

  if (!student) {
    goToStep(1)

    return null
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2 py-4">
        <Avatar className="size-20">
          {student.name && (
            <AvatarFallback className="text-muted-foreground text-xl">
              {getInitialsName(student.name)}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="text-center">
          <h1 className="text-xl">{student.name}</h1>
          <p className="text-muted-foreground text-xs">
            {student.class.name} - {student.class.year}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-8"
      >
        <ItemList setValue={setValue} />

        <Button
          type="submit"
          className="h-16 min-w-48 cursor-pointer bg-emerald-500 py-5 text-xl hover:bg-emerald-600"
        >
          {isPending ? <Loader2 className="size-4" /> : 'Pontuar'}
        </Button>
      </form>
    </div>
  )
}
