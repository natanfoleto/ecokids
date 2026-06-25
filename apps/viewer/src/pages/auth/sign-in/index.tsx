import {
  type AuthenticateStudentWithPasswordBody,
  authenticateStudentWithPasswordBodySchema,
} from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserRoundX } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import mascoteSvg from '@/assets/mascote.svg'
import { FormInput } from '@/components/form/form-input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-actions'
import { useMetadata } from '@/hooks/use-metadata'

import { authenticateStudentWithPasswordAction } from './actions'

export function SignIn() {
  useMetadata('Entrar - Ecokids')

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthenticateStudentWithPasswordBody>({
    resolver: zodResolver(authenticateStudentWithPasswordBodySchema),
  })

  const [{ success, message }, handleAction, isPending] = useAction()

  async function onSubmit(data: AuthenticateStudentWithPasswordBody) {
    await handleAction(
      () => authenticateStudentWithPasswordAction({ body: data }),
      () => navigate('/ranking'),
    )
  }

  return (
    <div className="flex w-[calc(100%-2rem)] max-w-[440px] flex-col items-center gap-6 rounded-3xl border-2 border-emerald-100 bg-white p-8 text-center shadow-lg shadow-emerald-100/40">
      <div className="flex size-24 items-center justify-center rounded-full border-4 border-emerald-100 bg-emerald-50 p-1 shadow-sm">
        <img
          src={mascoteSvg}
          alt="Mascote"
          className="size-full object-contain"
        />
      </div>

      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-gray-800">Entrar no Ecokids</h1>
        <p className="text-xs font-semibold leading-relaxed text-gray-400">
          Acesse sua conta para ver seus pontos e trocar por prêmios!
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-4"
      >
        {!success && message && (
          <Alert variant="destructive" className="text-left">
            <UserRoundX className="size-4" />
            <AlertTitle>Erro no login</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="w-full space-y-4">
          <FormInput
            id="email"
            {...register('email')}
            placeholder="Seu e-mail"
            className="h-12 rounded-2xl border-2 border-emerald-100 px-4 text-center font-semibold text-gray-800 transition-all placeholder:text-gray-300 focus-visible:border-emerald-300 focus-visible:ring-emerald-100/50"
            error={errors.email?.message}
          />

          <FormInput
            id="password"
            type="password"
            {...register('password')}
            placeholder="Sua senha secreta"
            className="h-12 rounded-2xl border-2 border-emerald-100 px-4 text-center font-semibold text-gray-800 transition-all placeholder:text-gray-300 focus-visible:border-emerald-300 focus-visible:ring-emerald-100/50"
            error={errors.password?.message}
          />

          <Button
            type="submit"
            className="h-14 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-extrabold text-white shadow-md shadow-emerald-100 transition-all hover:from-emerald-600 hover:to-teal-600 active:scale-95"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              'Entrar no Aplicativo'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
