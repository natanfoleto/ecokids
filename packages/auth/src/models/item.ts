import { z } from 'zod'

export const itemSchema = z.object({
  id: z.string(),
})

export type Item = z.infer<typeof itemSchema>
