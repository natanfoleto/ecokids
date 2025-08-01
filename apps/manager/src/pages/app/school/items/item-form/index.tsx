import {
  type CreateItemResponse,
  type SaveItemBody,
  saveItemBodySchema,
  type UpdateItemResponse,
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
  createItemAction,
  updateItemAction,
  updateItemPhotoAction,
} from '../actions'

interface ItemFormProps {
  isUpdating?: boolean
  initialData?: SaveItemBody
  itemId?: string
}

export function ItemForm({ isUpdating, initialData, itemId }: ItemFormProps) {
  const schoolSlug = useCurrentSchoolSlug()

  const [photo, setPhoto] = useState<File | string | null>(
    initialData?.photoUrl || null,
  )

  const defaultValues: SaveItemBody = initialData || {
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
  } = useForm<SaveItemBody>({
    resolver: zodResolver(saveItemBodySchema),
    defaultValues,
  })

  const [, handleAction, isPending] = useAction<
    CreateItemResponse | UpdateItemResponse
  >()

  async function onSubmit(data: SaveItemBody) {
    const formAction =
      isUpdating && itemId
        ? () =>
            updateItemAction({
              params: {
                schoolSlug: schoolSlug!,
                itemId,
              },
              body: data,
            })
        : () =>
            createItemAction({
              params: { schoolSlug: schoolSlug! },
              body: data,
            })

    handleAction(formAction, async ({ success, data: responseData }) => {
      if (success) {
        const id = itemId || responseData?.itemId

        if (!isUpdating || !itemId) reset()
        else reset(data)

        if (id) await handleUploadPhoto(id)

        queryClient.invalidateQueries({
          queryKey: ['schools', schoolSlug, 'items'],
        })
      }
    })
  }

  async function handleUploadPhoto(itemId: string) {
    if (photo === null) {
      await updateItemPhotoAction({
        params: { schoolSlug: schoolSlug!, itemId },
        body: new FormData(),
      })
    }

    if (photo instanceof File) {
      const formData = new FormData()
      formData.append('file', photo)

      await updateItemPhotoAction({
        params: { schoolSlug: schoolSlug!, itemId },
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
          <Label htmlFor="name">Nome do item</Label>
          <FormInput
            {...register('name')}
            id="name"
            placeholder="Garrafa pet"
            error={errors.name?.message}
          />
        </div>

        <div className="col-span-6 space-y-1.5">
          <Label htmlFor="description">Descrição</Label>
          <FormInput
            {...register('description')}
            id="description"
            placeholder="Garrafa pet verde"
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
            <Label>Foto do item</Label>

            {photo && (
              <div
                onClick={handleFileRemove}
                className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-0.5 text-xs transition-colors"
              >
                <X className="size-4" />
                <span>
                  {photo instanceof File ? photo.name : 'Remover foto do item'}
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
                alt="Foto do item"
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
