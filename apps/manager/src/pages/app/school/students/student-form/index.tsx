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
import { useCurrentSchoolSlug } from '@/hooks/use-school'
import { getClasses } from '@/http/classes/get-classes'
import { queryClient } from '@/lib/react-query'
import { formatCPF } from '@/utils/format-cpf'

import { createStudentAction, updateStudentAction } from '../actions'

interface StudentFormProps {
  isUpdating?: boolean
  initialData?: Omit<SaveStudentBody, 'password' | 'confirmPassword'>
  studentId?: string
}

export function StudentForm({
  isUpdating,
  initialData,
  studentId,
}: StudentFormProps) {
  const schoolSlug = useCurrentSchoolSlug()

  const { data } = useQuery<GetClassesResponse>({
    queryKey: ['schools', schoolSlug, 'classes'],
    queryFn: async () => {
      const data = await getClasses({
        params: {
          schoolSlug: schoolSlug!,
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
    confirmPassword: '',
    classId: initialData?.classId ?? '',
  }

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SaveStudentBody>({
    resolver: zodResolver(
      saveStudentBodySchema
        .refine(
          (data) => {
            if (!isUpdating) return !!data.password
            return true
          },
          {
            message: 'Senha é obrigatória',
            path: ['password'],
          },
        )
        .refine(
          (data) => {
            if (data.password || data.confirmPassword) {
              return data.password === data.confirmPassword
            }
            return true
          },
          {
            message: 'Senhas não conferem',
            path: ['confirmPassword'],
          },
        ),
    ),
    defaultValues,
  })

  const [, handleAction, isPending] = useAction()

  async function onSubmit(data: SaveStudentBody) {
    const formAction =
      isUpdating && studentId
        ? () =>
            updateStudentAction({
              params: {
                schoolSlug: schoolSlug!,
                studentId,
              },
              body: data,
            })
        : () =>
            createStudentAction({
              params: { schoolSlug: schoolSlug! },
              body: data,
            })

    handleAction(formAction, ({ success }) => {
      if (success) {
        if (!isUpdating || !studentId) reset()
        else reset(data)

        queryClient.invalidateQueries({
          queryKey: ['schools', schoolSlug, 'students'],
        })
      }
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
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <FormInput
            {...register('confirmPassword')}
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
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
