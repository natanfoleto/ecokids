import { z } from 'zod'

export const exchangeSeasonSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.literal('ExchangeSeason'),
])

export type ExchangeSeasonSubject = z.infer<typeof exchangeSeasonSubject>
