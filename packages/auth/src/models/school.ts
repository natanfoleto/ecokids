import { z } from 'zod'

export const schoolSchema = z.object({
  __typename: z.literal('School').default('School'),
  id: z.string(),
  ownerId: z.string(),
})

export type School = z.infer<typeof schoolSchema>
