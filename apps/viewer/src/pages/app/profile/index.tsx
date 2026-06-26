import {
  type UpdateStudentPasswordBody,
  updateStudentPasswordBodySchema,
} from '@ecokids/types'
import { useClickSound } from '@ecokids/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Power } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import mascoteSvg from '@/assets/mascote.svg'
import { signOut } from '@/auth'
import { FormError } from '@/components/form/form-error'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth'
import { useAction } from '@/hooks/use-actions'
import { useMetadata } from '@/hooks/use-metadata'
import { cn } from '@/lib/utils'

import { updateStudentPasswordAction } from './actions'
import { ProfileLoading } from './loading'

interface PasswordInputProps extends React.ComponentProps<'input'> {
  error?: string
}

function PasswordInput({ error, className, ...rest }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { onClick: playClick } = useClickSound()

  return (
    <div className="flex-1 space-y-1">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs flex h-12 w-full min-w-0 rounded-2xl border bg-transparent px-4 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-emerald-300 focus-visible:ring-[3px] focus-visible:ring-emerald-100/50',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            error ? 'disabled:opacity-1 border-red-400' : '',
            'pr-12',
            className,
          )}
          {...rest}
        />
        <button
          type="button"
          onClick={() => {
            playClick()
            setShowPassword((prev) => !prev)
          }}
          className="absolute right-4 top-1/2 flex h-8 -translate-y-1/2 cursor-pointer items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          {showPassword ? (
            <EyeOff className="size-5" />
          ) : (
            <Eye className="size-5" />
          )}
        </button>
      </div>

      {error && <FormError error={error} />}
    </div>
  )
}

export function Profile() {
  useMetadata('Ecokids - Perfil')

  const { student } = useAuth()

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateStudentPasswordBody>({
    resolver: zodResolver(updateStudentPasswordBodySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const [, handleAction, isPending] = useAction()

  async function onSubmit(data: UpdateStudentPasswordBody) {
    await handleAction(
      () => updateStudentPasswordAction({ body: data }),
      () => {
        reset()
      },
    )
  }

  if (!student) return <ProfileLoading />

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-4">
      <div className="flex w-full flex-col items-center gap-4 rounded-3xl border-2 border-emerald-100 bg-white p-6 text-center shadow-sm shadow-emerald-50">
        <div className="flex size-24 items-center justify-center rounded-full border-4 border-emerald-100 bg-emerald-50 p-1 shadow-sm">
          <img
            src={mascoteSvg}
            alt="Mascote"
            className="size-full object-contain"
          />
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-800">{student.name}</h1>
          <p className="text-xs font-medium text-gray-400">
            {student.email || 'Estudante Ecokids'}
          </p>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="w-full space-y-4 rounded-3xl border-2 border-emerald-100 bg-white p-5 text-xs font-semibold text-gray-700 shadow-sm shadow-emerald-50">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400">Código do Aluno</span>
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-0.5 text-sm font-bold text-emerald-700">
              #{student.code}
            </span>
          </div>

          {student.cpf && (
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-400">CPF</span>
              <span className="text-sm text-gray-700">{student.cpf}</span>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400">Escola</span>
            <span className="max-w-[200px] truncate text-right text-sm text-gray-700">
              {student.school.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Turma</span>
            <span className="text-sm text-gray-700">
              {student.class.name} - {student.class.year}
            </span>
          </div>
        </div>

        <div className="w-full space-y-4 rounded-3xl border-2 border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-50">
          <h2 className="text-sm font-bold text-gray-800">Alterar senha</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400">
                  Senha atual
                </span>
                <PasswordInput
                  id="currentPassword"
                  {...register('currentPassword')}
                  placeholder="Sua senha atual"
                  className="border-emerald-100 font-semibold text-gray-800 transition-all placeholder:text-gray-300"
                  error={errors.currentPassword?.message}
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400">
                  Nova senha
                </span>
                <PasswordInput
                  id="newPassword"
                  {...register('newPassword')}
                  placeholder="Sua nova senha"
                  className="border-emerald-100 font-semibold text-gray-800 transition-all placeholder:text-gray-300"
                  error={errors.newPassword?.message}
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400">
                  Confirmar nova senha
                </span>
                <PasswordInput
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  placeholder="Confirme sua nova senha"
                  className="border-emerald-100 font-semibold text-gray-800 transition-all placeholder:text-gray-300"
                  error={errors.confirmPassword?.message}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-extrabold text-white shadow-md shadow-emerald-100 transition-all hover:from-emerald-600 hover:to-teal-600 active:scale-95"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                'Salvar nova senha'
              )}
            </Button>
          </form>
        </div>

        <Button
          onClick={() => signOut(navigate)}
          variant="outline"
          className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-red-100 font-bold text-red-600 transition-all hover:bg-red-50 hover:text-red-700 active:scale-95"
        >
          <Power className="size-5" />
          Sair do Aplicativo
        </Button>
      </div>
    </div>
  )
}
