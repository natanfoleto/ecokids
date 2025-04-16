import {
  type GetClassesResponse,
  type SaveStudentBody,
  saveStudentBodySchema,
} from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'

import { FormInput } from '@/components/form/form-input'
import { FormSelect } from '@/components/form/form-select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SelectItem } from '@/components/ui/select'
import { useAction } from '@/hooks/use-actions'
import { useCurrentSchool } from '@/hooks/use-current-school'
import { getClasses } from '@/http/classes/get-classes'
import { queryClient } from '@/lib/react-query'
import { formatCPF } from '@/utils/format-cpf'

import { createStudentAction, updateStudentAction } from './actions'

interface StudentFormProps {
  isUpdating?: boolean
  initialData?: Omit<SaveStudentBody, 'password' | 'confirm_password'>
  studentId?: string
}

export function StudentForm({
  isUpdating,
  initialData,
  studentId,
}: StudentFormProps) {
  const currentSchool = useCurrentSchool()

  const { data } = useQuery<GetClassesResponse>({
    queryKey: ['schools', currentSchool, 'classes'],
    queryFn: async () => {
      const data = await getClasses({
        params: {
          schoolSlug: currentSchool!,
        },
      })

      return data
    },
  })

  const defaultValues: SaveStudentBody = {
    code: initialData?.code ?? 0,
    name: initialData?.name ?? '',
    email: initialData?.email ?? null,
    cpf: initialData?.cpf ?? null,
    password: '',
    confirm_password: '',
    classId: initialData?.classId ?? '',
  }

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm<SaveStudentBody>({
    resolver: zodResolver(saveStudentBodySchema),
    defaultValues,
  })

  const [, handleAction, isPending] = useAction()

  function verifyPassword(data: SaveStudentBody) {
    if (!isUpdating) {
      if (!data.password || !data.confirm_password) {
        if (!data.password) {
          setError('password', {
            type: 'required',
            message: 'A senha é obrigatória',
          })
        }

        if (!data.confirm_password) {
          setError('confirm_password', {
            type: 'required',
            message: 'A confirmação de senha é obrigatória',
          })
        }

        return false
      }

      if (data.password !== data.confirm_password) {
        setError('confirm_password', {
          type: 'validate',
          message: 'As senhas não coincidem',
        })

        return false
      }
    } else {
      if (data.password || data.confirm_password) {
        if (data.password !== data.confirm_password) {
          setError('confirm_password', {
            type: 'validate',
            message: 'As senhas não coincidem',
          })

          return false
        }
      }
    }

    return true
  }

  async function onSubmit(data: SaveStudentBody) {
    const passwordVerified = verifyPassword(data)

    if (!passwordVerified) return

    const formAction =
      isUpdating && studentId
        ? () =>
          updateStudentAction({
            params: {
              schoolSlug: currentSchool!,
              studentId,
            },
            body: data,
          })
        : () =>
          createStudentAction({
            params: { schoolSlug: currentSchool! },
            body: data,
          })

    handleAction(formAction, () => {
      if (!isUpdating || !studentId) reset()

      queryClient.invalidateQueries({
        queryKey: ['schools', currentSchool, 'students'],
      })
    })
  }

  const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('cpf', formatCPF(event.target.value))
  }

  return (
    <form className="flex flex-col space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 space-y-1.5">
          <Label htmlFor="code">Código</Label>
          <FormInput
            {...register('code', { valueAsNumber: true })}
            id="code"
            error={errors.code?.message}
          />
        </div>

        <div className="col-span-4 space-y-1.5">
          <Label>Turma atual</Label>
          <Controller
            name="classId"
            control={control}
            render={({ field }) => (
              <FormSelect
                {...field}
                onValueChange={field.onChange}
                value={field.value ?? undefined}
                className="w-full cursor-pointer"
                error={errors?.classId?.message}
              >
                {data?.classes?.map((item) => {
                  return (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - {item.year}
                    </SelectItem>
                  )
                })}
              </FormSelect>
            )}
          />
        </div>

        <div className="col-span-5 space-y-1.5">
          <Label htmlFor="name">Nome do aluno</Label>
          <FormInput
            {...register('name')}
            id="name"
            placeholder="John Doe"
            error={errors.name?.message}
          />
        </div>

        <div className="col-span-6 space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <FormInput
            id="email"
            placeholder="johndoe@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div className="col-span-6 space-y-1.5">
          <Label htmlFor="cpf">CPF</Label>
          <FormInput
            {...register('cpf')}
            id="cpf"
            placeholder="123.456.789-12"
            maxLength={14}
            onChange={handleCpfChange}
            error={errors.cpf?.message}
          />
        </div>

        <div className="col-span-6 space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <FormInput
            {...register('password')}
            id="password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
          />
        </div>

        <div className="col-span-6 space-y-1.5">
          <Label htmlFor="confirm_password">Confirmar senha</Label>
          <FormInput
            {...register('confirm_password')}
            id="confirm_password"
            type="password"
            autoComplete="new-password"
            error={errors.confirm_password?.message}
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
