import {
  type AuthenticateUserWithPasswordBody,
  authenticateUserWithPasswordBodySchema,
} from '@ecokids/types'
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

import { authenticateUserWithPasswordAction } from './actions'

export function SignIn() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthenticateUserWithPasswordBody>({
    resolver: zodResolver(authenticateUserWithPasswordBodySchema),
  })

  const [{ success, message }, handleAction, isPending] = useAction()

  async function onSubmit(data: AuthenticateUserWithPasswordBody) {
    await handleAction(
      () => authenticateUserWithPasswordAction({ body: data }),
      () => {
        navigate('/dashboard')
        toast(message)
      },
    )
  }

  return (
    <div className="animate-in slide-in-from-left flex w-1/3 flex-col items-center space-y-8 duration-500">
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
            <Label className="text-xs">E-mail</Label>
            <FormInput
              {...register('email')}
              placeholder="Seu e-mail"
              error={errors.email?.message}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Senha</Label>
            <FormInput
              type="password"
              {...register('password')}
              placeholder="Sua senha secreta"
              error={errors.password?.message}
            />
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
              'Entrar com e-mail'
            )}
          </Button>

          <Button variant="link" className="cursor-pointer" asChild>
            <Link to="/sign-up">Não tenho conta - Cadastrar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
