import type { GetSchoolResponse } from '@ecokids/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getCurrentSchool } from '@/auth'
import { FormError } from '@/components/form/form-error'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-actions'
import { compressImage } from '@/lib/compressorjs'
import { queryClient } from '@/lib/react-query'

import { updateSchoolLogoAction } from '../../actions'

export const updateSchoolLogoSchema = z.object({
  logoFile: z
    .instanceof(File)
    .refine((file) => {
      if (!file) return true
      return file.size <= 510 * 1024
    }, 'Logo pode ter no máximo 512KB')
    .nullable(),
})

export type UpdateSchoolLogo = z.infer<typeof updateSchoolLogoSchema>

interface LogoFormProps {
  initialData: GetSchoolResponse['school']
}

export default function LogoForm({ initialData: { logoUrl } }: LogoFormProps) {
  const currentSchool = getCurrentSchool()

  const [hasChanges, setHasChanges] = useState(false)
  const [sourceLogo, setSourceLogo] = useState(logoUrl)

  const initialValues = { logoFile: null }

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateSchoolLogo>({
    resolver: zodResolver(updateSchoolLogoSchema),
    defaultValues: initialValues,
  })

  function handleInputClick() {
    document.getElementById('logo')?.click()
  }

  function handleDeleteLoadedLogo() {
    setHasChanges(true)
    setSourceLogo(null)
    setValue('logoFile', null, { shouldDirty: true, shouldValidate: true })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files.length > 0) {
      setValue('logoFile', files[0], {
        shouldDirty: true,
        shouldValidate: true,
      })
    } else {
      setValue('logoFile', null, { shouldDirty: true, shouldValidate: true })
    }

    setHasChanges(true)
    setSourceLogo(null)
  }

  const [, handleAction, isPending] = useAction()

  async function onSubmit({ logoFile }: UpdateSchoolLogo) {
    const compressedLogo = logoFile
      ? await compressImage(logoFile, {
          quality: 0.6,
          maxWidth: 1920,
          maxHeight: 1080,
        })
      : logoFile

    const file =
      compressedLogo && logoFile
        ? new File([compressedLogo], logoFile.name, {
            type: compressedLogo.type,
          })
        : logoFile

    const formData = new FormData()

    if (file) formData.append('logoFile', file)

    handleAction(
      () =>
        updateSchoolLogoAction({
          params: { schoolSlug: currentSchool! },
          body: formData,
        }),
      (data) => {
        if (data.success) {
          setHasChanges(false)

          queryClient.invalidateQueries({
            queryKey: ['schools'],
          })
        }
      },
    )
  }

  const logoFile = getValues('logoFile')
  const logoFileString =
    logoFile instanceof File ? URL.createObjectURL(logoFile) : undefined

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-end justify-between"
    >
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-3">
          <Avatar className="size-20 cursor-pointer" onClick={handleInputClick}>
            <AvatarImage
              src={sourceLogo || logoFileString || undefined}
              alt="Logo"
            />
            <AvatarFallback />

            {!getValues('logoFile') && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity hover:opacity-50">
                <Camera className="size-5" />
              </div>
            )}
          </Avatar>

          {getValues('logoFile') || sourceLogo ? (
            <div
              onClick={handleDeleteLoadedLogo}
              className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-center text-xs transition-colors"
            >
              <X className="size-4" />
              <span>{getValues('logoFile')?.name || 'Remover foto'}</span>
            </div>
          ) : null}
        </div>

        <FormError error={errors.logoFile?.message?.toString()} />

        <input
          hidden
          id="logo"
          type="file"
          accept="image/*"
          {...register('logoFile', { onChange: handleFileChange })}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending || !hasChanges}
        className="cursor-pointer bg-emerald-500 hover:bg-emerald-600"
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
