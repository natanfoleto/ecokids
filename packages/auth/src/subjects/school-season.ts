import { z } from 'zod'

export const schoolSeasonSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('download_report'),
  ]),
  z.literal('SchoolSeason'),
])

export type SchoolSeasonSubject = z.infer<typeof schoolSeasonSubject>
