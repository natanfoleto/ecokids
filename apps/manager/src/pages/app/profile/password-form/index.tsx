import {
  type UpdateUserPasswordBody,
  updateUserPasswordBodySchema,
  type UpdateUserPasswordResponse,
} from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { FormInput } from '@/components/form/form-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAction } from '@/hooks/use-actions'

import { updateUserPasswordAction } from '../actions'

export function PasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateUserPasswordBody>({
    resolver: zodResolver(updateUserPasswordBodySchema),
  })

  const [, handleAction, isPending] = useAction<UpdateUserPasswordResponse>()

  async function onSubmit(data: UpdateUserPasswordBody) {
    await handleAction(() => updateUserPasswordAction({ body: data }))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword">Senha atual</Label>
          <FormInput
            {...register('currentPassword')}
            id="currentPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Sua senha atual"
            error={errors.currentPassword?.message}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="newPassword">Nova senha</Label>
          <FormInput
            {...register('newPassword')}
            id="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Sua nova senha"
            error={errors.newPassword?.message}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <FormInput
            {...register('confirmPassword')}
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirme sua senha secreta"
            error={errors.confirmPassword?.message}
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
