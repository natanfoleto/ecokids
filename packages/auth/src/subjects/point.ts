import { z } from 'zod'

export const pointSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.literal('Point'),
])

export type PointSubject = z.infer<typeof pointSubject>
