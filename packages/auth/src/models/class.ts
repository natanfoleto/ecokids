import { z } from 'zod'

export const classSchema = z.object({
  __typename: z.literal('Class').default('Class'),
  id: z.string(),
})

export type Class = z.infer<typeof classSchema>
