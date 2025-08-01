import {
  type CreateAwardResponse,
  type SaveAwardBody,
  saveAwardBodySchema,
  type UpdateAwardResponse,
} from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon, Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { FormInput } from '@/components/form/form-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAction } from '@/hooks/use-actions'
import { useCurrentSchoolSlug } from '@/hooks/use-school'
import { queryClient } from '@/lib/react-query'

import {
  createAwardAction,
  updateAwardAction,
  updateAwardPhotoAction,
} from '../actions'

interface AwardFormProps {
  isUpdating?: boolean
  initialData?: SaveAwardBody
  awardId?: string
}

export function AwardForm({
  isUpdating,
  initialData,
  awardId,
}: AwardFormProps) {
  const schoolSlug = useCurrentSchoolSlug()

  const [photo, setPhoto] = useState<File | string | null>(
    initialData?.photoUrl || null,
  )

  const defaultValues: SaveAwardBody = initialData || {
    name: '',
    description: null,
    value: 0,
    photoUrl: null,
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<SaveAwardBody>({
    resolver: zodResolver(saveAwardBodySchema),
    defaultValues,
  })

  const [, handleAction, isPending] = useAction<
    CreateAwardResponse | UpdateAwardResponse
  >()

  async function onSubmit(data: SaveAwardBody) {
    const formAction =
      isUpdating && awardId
        ? () =>
            updateAwardAction({
              params: {
                schoolSlug: schoolSlug!,
                awardId,
              },
              body: data,
            })
        : () =>
            createAwardAction({
              params: { schoolSlug: schoolSlug! },
              body: data,
            })

    handleAction(formAction, async ({ success, data: responseData }) => {
      if (success) {
        const id = awardId || responseData?.awardId

        if (!isUpdating || !awardId) reset()
        else reset(data)

        if (id) await handleUploadPhoto(id)

        queryClient.invalidateQueries({
          queryKey: ['schools', schoolSlug, 'awards'],
        })
      }
    })
  }

  async function handleUploadPhoto(awardId: string) {
    if (photo === null) {
      await updateAwardPhotoAction({
        params: { schoolSlug: schoolSlug!, awardId },
        body: new FormData(),
      })
    }

    if (photo instanceof File) {
      const formData = new FormData()
      formData.append('file', photo)

      await updateAwardPhotoAction({
        params: { schoolSlug: schoolSlug!, awardId },
        body: formData,
      })
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setPhoto(file)
    setValue('photoUrl', '', { shouldDirty: true })

    setTimeout(() => {
      event.target.value = ''
    }, 0)
  }

  const handleFileRemove = () => {
    setPhoto(null)
    setValue('photoUrl', null, { shouldDirty: true })
  }

  return (
    <form className="flex flex-col space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full grid-cols-12 gap-4">
        <div className="col-span-6 space-y-1.5">
          <Label htmlFor="name">Nome do prêmio</Label>
          <FormInput
            {...register('name')}
            id="name"
            placeholder="Camiseta"
            error={errors.name?.message}
          />
        </div>

        <div className="col-span-6 space-y-1.5">
          <Label htmlFor="description">Descrição</Label>
          <FormInput
            {...register('description')}
            id="description"
            placeholder="Camiseta manga curta"
            error={errors.description?.message}
          />
        </div>

        <div className="col-span-12 space-y-1.5">
          <Label htmlFor="value">Preço</Label>
          <FormInput
            {...register('value', { valueAsNumber: true })}
            id="value"
            placeholder="200"
            error={errors.value?.message}
          />
        </div>

        <div className="col-span-12 space-y-1.5">
          <div className="flex items-center justify-between">
            <Label>Foto do prêmio</Label>

            {photo && (
              <div
                onClick={handleFileRemove}
                className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-0.5 text-xs transition-colors"
              >
                <X className="size-4" />
                <span>
                  {photo instanceof File
                    ? photo.name
                    : 'Remover foto do prêmio'}
                </span>
              </div>
            )}
          </div>

          <div className="relative space-y-2">
            {photo ? (
              <img
                src={
                  photo instanceof File
                    ? URL.createObjectURL(photo)
                    : photo || undefined
                }
                alt="Foto do prêmio"
                className="h-80 w-full cursor-pointer rounded-sm border object-cover"
                onClick={() => document.getElementById('file')?.click()}
              />
            ) : (
              <div
                onClick={() => document.getElementById('file')?.click()}
                className="flex h-80 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border"
              >
                <ImageIcon className="text-muted-foreground size-20 stroke-[0.375]" />
                <p className="text-muted-foreground text-xs">
                  Clique para selecionar uma imagem
                </p>
              </div>
            )}

            <input
              hidden
              id="file"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e)}
            />
          </div>
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
