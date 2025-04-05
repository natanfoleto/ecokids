import { type CreateUserBody, createUserBodySchema } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserRoundX } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import logo from '@/assets/logo.svg'
import { FormInput } from '@/components/form/form-input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAction } from '@/hooks/use-actions'
import { formatCPF } from '@/utils/format-cpf'

import { createUserAction } from './actions'

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserBody>({
    resolver: zodResolver(
      createUserBodySchema.refine(
        (data) => data.confirm_password === data.password,
        {
          message: 'Confirmação senha não coincide com senha',
          path: ['confirm_password'],
        },
      ),
    ),
  })

  const [{ success, message }, handleAction, isPending] = useAction()

  async function onSubmit(data: CreateUserBody) {
    await handleAction(
      () => createUserAction({ body: data }),
      () => {
        navigate('/sign-in')
        toast(message)
      },
    )
  }

  const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('cpf', formatCPF(event.target.value))
  }

  return (
    <div className="animate-in slide-in-from-right flex w-2/5 flex-col items-center space-y-8 duration-500">
      <img src={logo} alt="Ecokids" className="w-64" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-8 rounded-md border p-12"
      >
        {!success && (
          <Alert variant="destructive">
            <UserRoundX className="size-4" />
            <AlertTitle>Oooops!!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="w-full space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Nome completo</Label>
            <FormInput
              {...register('name')}
              placeholder="Seu nome completo"
              error={errors.name?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">E-mail</Label>
              <FormInput
                {...register('email')}
                placeholder="Seu e-mail"
                error={errors.email?.message}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">CPF</Label>
              <FormInput
                {...register('cpf')}
                placeholder="Seu CPF"
                maxLength={14}
                onChange={handleCpfChange}
                error={errors.cpf?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Senha</Label>
              <FormInput
                type="password"
                {...register('password')}
                placeholder="Sua senha secreta"
                error={errors.password?.message}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Confirmar senha</Label>
              <FormInput
                type="password"
                {...register('confirm_password')}
                placeholder="Confirme sua senha secreta"
                error={errors.confirm_password?.message}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-2">
          <Button
            type="submit"
            className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-600"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Criar conta'
            )}
          </Button>

          <Button variant="link" className="cursor-pointer" asChild>
            <Link to="/sign-in">Ja tenho conta - Entrar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
