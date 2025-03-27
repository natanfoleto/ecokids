import { z } from 'zod'

import { schoolSchema } from '../models/school'

export const schoolSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('transfer_ownership'),
  ]),
  z.union([z.literal('School'), schoolSchema]),
])

export type SchoolSubject = z.infer<typeof schoolSubject>
