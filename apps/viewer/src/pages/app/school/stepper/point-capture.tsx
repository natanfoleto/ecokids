import { type CreatePointBody, createPointBodySchema } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { FormError } from '@/components/form/form-error'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStepper } from '@/contexts/stepper'
import { useAction } from '@/hooks/use-actions'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { cn } from '@/lib/utils'
import { getInitialsName } from '@/utils/get-initials-name'

import { createPointAction } from '../actions'

export function PointCapture() {
  const currentSchool = useCurrentSchool()

  const { nextStep, goToStep, student, setPoints } = useStepper()

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<CreatePointBody>({
    resolver: zodResolver(createPointBodySchema),
  })

  useEffect(() => {
    setFocus('amount')
  }, [setFocus])

  const [, handleAction, isPending] = useAction()

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
        setPoints(data.amount)
        nextStep()
      },
    )
  }

  if (!student) {
    goToStep(1)

    return null
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
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
        className="flex w-full flex-col items-center gap-4"
      >
        <div className="flex w-full flex-col items-center gap-2">
          <Input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            min={1}
            placeholder="Quantidade de pontos"
            className={cn(
              errors.amount?.message ? 'disabled:opacity-1 border-red-400' : '',
              'h-20 w-1/2 text-center !text-2xl',
            )}
          />

          <FormError error={errors.amount?.message} />
        </div>

        <Button
          type="submit"
          className="h-16 w-1/2 cursor-pointer bg-emerald-500 py-5 text-xl hover:bg-emerald-600"
        >
          {isPending ? <Loader2 className="size-4" /> : 'Pontuar'}
        </Button>
      </form>
    </div>
  )
}
