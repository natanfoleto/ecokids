import { z } from 'zod'

export const getStudentPointsResponseSchema = z.object({
  points: z.array(
    z.object({
      id: z.string().uuid(),
      amount: z.number(),
      createdAt: z.date(),
      scoreItems: z.array(
        z.object({
          id: z.string().uuid(),
          amount: z.number(),
          value: z.number(),
          item: z.object({
            id: z.string().uuid(),
            name: z.string(),
            photoUrl: z.string().nullable(),
          }),
        }),
      ),
    }),
  ),
  totalPoints: z.number(),
})

export type GetStudentPointsResponse = z.infer<
  typeof getStudentPointsResponseSchema
>
