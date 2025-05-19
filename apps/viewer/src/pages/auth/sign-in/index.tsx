import {
  type AuthenticateUserWithPasswordBody,
  authenticateUserWithPasswordBodySchema,
} from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, LogIn, UserRoundX } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { FormInput } from '@/components/form/form-input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-actions'

import { authenticateUserWithPasswordAction } from './actions'

export function SignIn() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<AuthenticateUserWithPasswordBody>({
    resolver: zodResolver(authenticateUserWithPasswordBodySchema),
  })

  useEffect(() => {
    const email = searchParams.get('email')

    if (email) {
      setValue('email', email)

      const params = new URLSearchParams(searchParams)
      params.delete('email')

      navigate({ search: params.toString() }, { replace: true })

      setFocus('password')
    }
  }, [navigate, searchParams, setValue, setFocus])

  const [{ success, message }, handleAction, isPending] = useAction()

  async function onSubmit(data: AuthenticateUserWithPasswordBody) {
    await handleAction(
      () => authenticateUserWithPasswordAction({ body: data }),
      () => {
        toast(message)
        navigate('/')
      },
    )
  }

  return (
    <div className="flex w-1/3 flex-col items-center space-y-6">
      <div className="flex items-center gap-2">
        <LogIn />
        <h1 className="text-2xl">Fazer login</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-6"
      >
        {!success && message && (
          <Alert variant="destructive">
            <UserRoundX className="size-4" />
            <AlertTitle>Oooops!!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="w-full space-y-4">
          <FormInput
            id="email"
            {...register('email')}
            placeholder="Seu e-mail"
            className="py-5 text-center"
            error={errors.email?.message}
          />

          <FormInput
            id="password"
            type="password"
            {...register('password')}
            placeholder="Sua senha secreta"
            className="py-5 text-center"
            error={errors.password?.message}
          />

          <Button
            type="submit"
            className="w-full cursor-pointer bg-emerald-500 py-5 hover:bg-emerald-600"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Entrar'}
          </Button>
        </div>
      </form>
    </div>
  )
}
