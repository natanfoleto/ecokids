import { z } from 'zod'

export const awardSchema = z.object({
  id: z.string(),
})

export type Award = z.infer<typeof awardSchema>
