import { type UpdateUserBody, updateUserBodySchema } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { FormInput } from '@/components/form/form-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { formatCPF } from '@/utils/format-cpf'

export function ProfileForm() {
  const {
    register,
    setValue,
    // handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateUserBody>({
    resolver: zodResolver(
      updateUserBodySchema.refine(
        (data) => data.confirmPassword === data.password,
        {
          message: 'Confirmação senha não coincide com senha',
          path: ['confirmPassword'],
        },
      ),
    ),
  })

  const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('cpf', formatCPF(event.target.value))
  }

  const isPending = false

  return (
    <form className="flex flex-col gap-8">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 space-y-1.5">
          <Label htmlFor="name">Nome completo</Label>
          <FormInput
            {...register('name')}
            id="name"
            placeholder="Seu nome completo"
            error={errors.name?.message}
          />
        </div>

        <div className="col-span-6 space-y-1.5">
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

        <div className="col-span-4 space-y-1.5">
          <Label htmlFor="oldPassword">Senha atual</Label>
          <FormInput
            {...register('oldPassword')}
            id="oldPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Sua senha atual"
            error={errors.oldPassword?.message}
          />
        </div>

        <div className="col-span-4 space-y-1.5">
          <Label htmlFor="password">Nova senha</Label>
          <FormInput
            {...register('password')}
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Sua nova senha"
            error={errors.password?.message}
          />
        </div>

        <div className="col-span-4 space-y-1.5">
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
