import {
  type UpdateUserBody,
  updateUserBodySchema,
  type UpdateUserResponse,
} from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { FormInput } from '@/components/form/form-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAction } from '@/hooks/use-actions'
import { queryClient } from '@/lib/react-query'
import { formatCPF } from '@/utils/format-cpf'

import { updateUserAction } from '../actions'

interface ProfileFormProps {
  initialData: UpdateUserBody
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateUserBody>({
    resolver: zodResolver(updateUserBodySchema),
    defaultValues: initialData,
  })

  const [, handleAction, isPending] = useAction<UpdateUserResponse>()

  async function onSubmit(data: UpdateUserBody) {
    await handleAction(
      () => updateUserAction({ body: data }),
      (data) => {
        if (data.success)
          queryClient.invalidateQueries({
            queryKey: ['profile', 'users'],
          })
      },
    )
  }

  const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('cpf', formatCPF(event.target.value))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome completo</Label>
          <FormInput
            {...register('name')}
            id="name"
            placeholder="Seu nome completo"
            error={errors.name?.message}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cpf">CPF</Label>
          <FormInput
            {...register('cpf')}
            id="cpf"
            placeholder="Seu CPF"
            maxLength={14}
            onChange={handleCpfChange}
            error={errors.cpf?.message}
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
