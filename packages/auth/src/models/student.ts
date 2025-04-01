import { z } from 'zod'

export const studentSchema = z.object({
  id: z.string(),
})

export type Student = z.infer<typeof studentSchema>
