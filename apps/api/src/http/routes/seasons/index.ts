import type { FastifyInstance } from 'fastify'

import { closeSeason } from './close-season'
import { createSeason } from './create-season'
import { getSeasons } from './get-seasons'

export async function registerSeasonRoutes(app: FastifyInstance) {
  app.register(createSeason)
  app.register(closeSeason)
  app.register(getSeasons)
}
