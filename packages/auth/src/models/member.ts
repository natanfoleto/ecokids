import { z } from 'zod'

import { roleSchema } from '../roles'

export const memberSchema = z.object({
  id: z.string(),
  role: roleSchema,
})

export type Member = z.infer<typeof memberSchema>
