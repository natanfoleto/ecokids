import { z } from 'zod'

export const pointSchema = z.object({
  id: z.string(),
})

export type Point = z.infer<typeof pointSchema>
