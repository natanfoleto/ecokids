import { type SaveClassBody, saveClassBodySchema } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { FormInput } from '@/components/form/form-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAction } from '@/hooks/use-actions'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { queryClient } from '@/lib/react-query'

import { createClassAction, updateClassAction } from '../actions'

interface ClassFormProps {
  isUpdating?: boolean
  initialData?: SaveClassBody
  classId?: string
}

export function ClassForm({
  isUpdating,
  initialData,
  classId,
}: ClassFormProps) {
  const currentSchool = useCurrentSchool()

  const defaultValues: SaveClassBody = initialData || {
    name: '',
    year: '',
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SaveClassBody>({
    resolver: zodResolver(saveClassBodySchema),
    defaultValues,
  })

  const [, handleAction, isPending] = useAction()

  async function onSubmit(data: SaveClassBody) {
    const formAction =
      isUpdating && classId
        ? () =>
          updateClassAction({
            params: {
              schoolSlug: currentSchool!,
              classId,
            },
            body: data,
          })
        : () =>
          createClassAction({
            params: { schoolSlug: currentSchool! },
            body: data,
          })

    handleAction(formAction, ({ success }) => {
      if (success) {
        if (!isUpdating || !classId) reset()
        else reset(data)

        queryClient.invalidateQueries({
          queryKey: ['schools', currentSchool, 'classes'],
        })
      }
    })
  }

  return (
    <form className="flex flex-col space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome da turma</Label>
          <FormInput
            id="name"
            {...register('name')}
            placeholder="1A"
            error={errors.name?.message}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="year">Ano</Label>
          <FormInput
            id="year"
            {...register('year')}
            placeholder="2025"
            error={errors.year?.message}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="cursor-pointer self-end bg-emerald-500 hover:bg-emerald-600"
        disabled={isPending || !isDirty}
      >
        {isPending ? (
          <Loader2 className="text-muted-foreground size-4 animate-spin" />
        ) : (
          'Salvar'
        )}
      </Button>
    </form>
  )
}
