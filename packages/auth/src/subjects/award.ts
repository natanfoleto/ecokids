import { z } from 'zod'

export const awardSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.literal('Award'),
])

export type AwardSubject = z.infer<typeof awardSubject>
