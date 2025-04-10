import { type SaveSchoolBody, saveSchoolBodySchema } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, School } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { FormError } from '@/components/form/form-error'
import { FormInput } from '@/components/form/form-input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useAction } from '@/hooks/use-actions'
import { queryClient } from '@/lib/react-query'

import { createSchoolAction, updateSchoolAction } from './actions'

interface SchoolFormProps {
  isUpdating?: boolean
  initialData?: SaveSchoolBody
  onSuccess?: () => void
}

export function SchoolForm({ isUpdating, initialData }: SchoolFormProps) {
  const defaultValues: SaveSchoolBody = initialData || {
    name: '',
    domain: null,
    shouldAttachUsersByDomain: false,
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SaveSchoolBody>({
    resolver: zodResolver(saveSchoolBodySchema),
    defaultValues,
  })

  const [{ success, message }, handleAction, isPending] = useAction()

  const formAction = isUpdating ? updateSchoolAction : createSchoolAction

  async function onSubmit(data: SaveSchoolBody) {
    handleAction(
      () => formAction({ body: data }),
      () => queryClient.invalidateQueries({ queryKey: ['schools'] }),
    )
  }

  function updateShouldAttachUsersByDomain(value: boolean) {
    setValue('shouldAttachUsersByDomain', value)
  }

  return (
    <form className="flex flex-col space-y-8" onSubmit={handleSubmit(onSubmit)}>
      {success && message && (
        <Alert>
          <School className="size-4" />
          <AlertTitle>Uhuul!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {!success && message && (
        <Alert variant="destructive">
          <School className="size-4" />
          <AlertTitle>Oooops!!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="w-full space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome da escola</Label>
          <FormInput
            id="name"
            {...register('name')}
            error={errors.name?.message}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="domain">Domínio de e-email</Label>
          <FormInput
            id="domain"
            {...register('domain')}
            error={errors.domain?.message}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline space-x-2">
            <Checkbox
              onCheckedChange={updateShouldAttachUsersByDomain}
              className="translate-y-0.5"
              id="shouldAttachUsersByDomain"
            />
            <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
              <span className="text-sm font-medium leading-none">
                Convidar automaticamente os novos membros
              </span>
              <p className="text-muted-foreground text-sm">
                Isso convidará automaticamente todos os membros com o mesmo
                domínio de e-mail para esta imobiliária.
              </p>
            </label>
          </div>

          <FormError error={errors?.shouldAttachUsersByDomain?.message} />
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
