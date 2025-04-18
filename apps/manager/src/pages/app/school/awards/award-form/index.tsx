import { type SaveAwardBody, saveAwardBodySchema } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { FormInput } from '@/components/form/form-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAction } from '@/hooks/use-actions'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { queryClient } from '@/lib/react-query'

import { createAwardAction, updateAwardAction } from '../actions'

interface AwardFormProps {
  isUpdating?: boolean
  initialData?: SaveAwardBody
  awardId?: string
}

export function AwardForm({
  isUpdating,
  initialData,
  awardId,
}: AwardFormProps) {
  const currentSchool = useCurrentSchool()

  const defaultValues: SaveAwardBody = initialData || {
    name: '',
    description: null,
    value: 0,
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SaveAwardBody>({
    resolver: zodResolver(saveAwardBodySchema),
    defaultValues,
  })

  const [, handleAction, isPending] = useAction()

  async function onSubmit(data: SaveAwardBody) {
    const formAction =
      isUpdating && awardId
        ? () =>
          updateAwardAction({
            params: {
              schoolSlug: currentSchool!,
              awardId,
            },
            body: data,
          })
        : () =>
          createAwardAction({
            params: { schoolSlug: currentSchool! },
            body: data,
          })

    handleAction(formAction, (data) => {
      if (data.success) {
        if (!isUpdating || !awardId) reset()

        queryClient.invalidateQueries({
          queryKey: ['schools', currentSchool, 'awards'],
        })
      }
    })
  }

  return (
    <form className="flex flex-col space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full grid-cols-12 gap-4">
        <div className="col-span-6 space-y-1.5">
          <Label htmlFor="name">Nome do prêmio</Label>
          <FormInput
            {...register('name')}
            id="name"
            placeholder="Camiseta"
            error={errors.name?.message}
          />
        </div>

        <div className="col-span-6 space-y-1.5">
          <Label htmlFor="description">Descrição</Label>
          <FormInput
            {...register('description')}
            id="description"
            placeholder="Camiseta manga curta"
            error={errors.description?.message}
          />
        </div>

        <div className="col-span-12 space-y-1.5">
          <Label htmlFor="value">Preço</Label>
          <FormInput
            {...register('value', { valueAsNumber: true })}
            id="value"
            placeholder="200"
            error={errors.value?.message}
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
