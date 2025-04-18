import { z } from 'zod'

export const updateUserAvatarResponseSchema = z.null()

export type UpdateUserAvatarResponse = z.infer<
  typeof updateUserAvatarResponseSchema
>
