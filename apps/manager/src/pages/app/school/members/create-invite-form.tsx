import type { Role } from '@ecokids/auth'
import { type CreateInviteBody, createInviteBodySchema } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { getCurrentSchool } from '@/auth'
import { FormInput } from '@/components/form/form-input'
import { FormSelect } from '@/components/form/form-select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SelectItem } from '@/components/ui/select'
import { useAction } from '@/hooks/use-actions'
import { queryClient } from '@/lib/react-query'

import { createInviteAction } from './actions'

export function CreateInviteForm() {
  const currentSchool = getCurrentSchool()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateInviteBody>({
    resolver: zodResolver(createInviteBodySchema),
    defaultValues: {
      email: '',
      role: 'MEMBER',
    },
  })
  const [, handleAction, isPending] = useAction()

  async function onSubmit(data: CreateInviteBody) {
    await handleAction(
      () =>
        createInviteAction({
          params: {
            schoolSlug: currentSchool!,
          },
          body: data,
        }),
      (data) => {
        if (data.success) {
          queryClient.invalidateQueries({
            queryKey: ['schools', currentSchool, 'invites'],
          })

          setValue('email', '')
        }
      },
    )
  }

  function updateRole(role: Role) {
    setValue('role', role)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1 space-y-2">
          <Label
            htmlFor="email"
            className="text-muted-foreground text-xs font-normal"
          >
            Endereço de e-mail
          </Label>

          <FormInput
            {...register('email')}
            id="email"
            placeholder="john@example.com"
            error={errors?.email?.message}
          />
        </div>

        <div className="col-span-1 space-y-2">
          <Label className="text-muted-foreground text-xs font-normal">
            Cargo
          </Label>

          <FormSelect onValueChange={updateRole} defaultValue="MEMBER">
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MEMBER">Membro</SelectItem>
          </FormSelect>
        </div>
      </div>

      <Button
        type="submit"
        className="cursor-pointer"
        variant="outline"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            <UserPlus className="mr-1 size-4" />
            Convidar usuário
          </>
        )}
      </Button>
    </form>
  )
}
