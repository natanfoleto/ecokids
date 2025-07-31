import { z } from 'zod'

export const getSchoolShopParamsSchema = z.object({
  schoolId: z.string().uuid(),
})

export type GetSchoolShopParams = z.infer<typeof getSchoolShopParamsSchema>

export const getSchoolShopRequestSchema = z.object({
  params: getSchoolShopParamsSchema,
})

export type GetSchoolShopRequest = z.infer<typeof getSchoolShopRequestSchema>

export const getSchoolShopResponseSchema = z.object({
  itens: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string().nullable(),
      value: z.number(),
      photoUrl: z.string().nullable(),
    }),
  ),
})

export type GetSchoolShopResponse = z.infer<typeof getSchoolShopResponseSchema>
