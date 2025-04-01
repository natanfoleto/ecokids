import { z } from 'zod'

export const studentSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.literal('Student'),
])

export type StudentSubject = z.infer<typeof studentSubject>
