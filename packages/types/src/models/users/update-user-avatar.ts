import { z } from 'zod'

export const updateUserAvatarParamsSchema = z.object({
  userId: z.string(),
})

export type UpdateUserAvatarParams = z.infer<
  typeof updateUserAvatarParamsSchema
>

export const updateUserAvatarRequestSchema = z.object({
  params: updateUserAvatarParamsSchema,
})

export type UpdateUserAvatarRequest = z.infer<
  typeof updateUserAvatarRequestSchema
>

export const updateUserAvatarResponseSchema = z.null()

export type UpdateUserAvatarResponse = z.infer<
  typeof updateUserAvatarResponseSchema
>
