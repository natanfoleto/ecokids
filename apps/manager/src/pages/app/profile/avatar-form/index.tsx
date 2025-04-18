import {
  type GetUserProfileResponse,
  type UpdateUserResponse,
} from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Loader2, Trash2, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormError } from '@/components/form/form-error'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useAction } from '@/hooks/use-actions'
import { compressImage } from '@/lib/compressorjs'
import { queryClient } from '@/lib/react-query'
import { getInitialsName } from '@/utils/get-initials-name'

import { updateUserAvatarAction } from '../actions'

export const updateUserAvatarSchema = z.object({
  avatarFile: z
    .instanceof(File)
    .refine((file) => {
      if (!file) return true
      return file.size <= 510 * 1024
    }, 'Avatar pode ter no máximo 512KB')
    .nullable(),
})

export type UpdateUserAvatar = z.infer<typeof updateUserAvatarSchema>

interface AvatarFormProps {
  initialData: GetUserProfileResponse['user']
}

export function AvatarForm({
  initialData: { name, avatarUrl },
}: AvatarFormProps) {
  const [hasChanges, setHasChanges] = useState(false)
  const [sourceAvatar, setSourceAvatar] = useState(avatarUrl)

  const defaultValues = { avatarFile: null }

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserAvatar>({
    resolver: zodResolver(updateUserAvatarSchema),
    defaultValues,
  })

  const [, handleAction, isPending] = useAction<UpdateUserResponse>()

  async function onSubmit({ avatarFile }: UpdateUserAvatar) {
    const compressedAvatar = avatarFile
      ? await compressImage(avatarFile, {
        quality: 0.6,
        maxWidth: 1920,
        maxHeight: 1080,
      })
      : avatarFile

    const file =
      compressedAvatar && avatarFile
        ? new File([compressedAvatar], avatarFile.name, {
          type: compressedAvatar.type,
        })
        : avatarFile

    const formData = new FormData()

    if (file) formData.append('avatarFile', file)

    handleAction(
      () => updateUserAvatarAction({ body: formData }),
      (data) => {
        if (data.success) {
          setHasChanges(false)

          queryClient.invalidateQueries({
            queryKey: ['profile', 'users'],
          })
        }
      },
    )
  }

  function handleInputClick() {
    document.getElementById('avatar')?.click()
  }

  function handleDeleteLoadedAvatar() {
    setHasChanges(true)
    setSourceAvatar(null)
    setValue('avatarFile', null, { shouldDirty: true, shouldValidate: true })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files.length > 0) {
      setValue('avatarFile', files[0], {
        shouldDirty: true,
        shouldValidate: true,
      })
    } else {
      setValue('avatarFile', null, { shouldDirty: true, shouldValidate: true })
    }

    setHasChanges(true)
    setSourceAvatar(null)
  }

  const avatarFile = getValues('avatarFile')
  const avatarFileString =
    avatarFile instanceof File ? URL.createObjectURL(avatarFile) : undefined

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Avatar className="size-32 cursor-pointer">
          <AvatarImage src={avatarUrl || undefined} />
          {name && (
            <AvatarFallback className="hover:bg-foreground/10 transition-colors">
              {getInitialsName(name)}
            </AvatarFallback>
          )}

          {avatarUrl && (
            <div className="hover:bg-foreground/25 absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity hover:opacity-100">
              <Camera className="text-muted size-5" />
            </div>
          )}
        </Avatar>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar foto de perfil</DialogTitle>
          <DialogDescription>
            Escolha uma foto do seu computador para subir
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-1.5" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-between gap-6"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Avatar className="size-36">
                <AvatarImage
                  src={sourceAvatar || avatarFileString || undefined}
                  alt="Avatar"
                />

                {name && (
                  <AvatarFallback>{getInitialsName(name)}</AvatarFallback>
                )}
              </Avatar>

              {getValues('avatarFile') || sourceAvatar ? (
                <div className="text-muted-foreground hover:text-foreground cursor-pointer text-xs transition-colors">
                  <span>{getValues('avatarFile')?.name}</span>
                </div>
              ) : null}
            </div>

            <FormError error={errors.avatarFile?.message?.toString()} />

            <input
              hidden
              id="avatar"
              type="file"
              accept="image/*"
              {...register('avatarFile', { onChange: handleFileChange })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-x-1">
              <Button
                type="button"
                variant="destructive"
                className="cursor-pointer"
                onClick={handleDeleteLoadedAvatar}
              >
                <Trash2 className="size-4" />
                Remover
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="cursor-pointer"
                onClick={handleInputClick}
              >
                <UploadCloud className="size-4" />
                Nova foto
              </Button>
            </div>

            <Button
              type="submit"
              className="cursor-pointer self-end bg-emerald-500 hover:bg-emerald-600"
              disabled={isPending || !hasChanges}
            >
              {isPending ? (
                <Loader2 className="text-muted-foreground size-4 animate-spin" />
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
