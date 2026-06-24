import type { FastifyInstance } from 'fastify'

import { closeSeason } from './close-season'
import { createSeason } from './create-season'
import { deleteSeason } from './delete-season'
import { getSeasons } from './get-seasons'
import { reopenSeason } from './reopen-season'

export async function registerSeasonRoutes(app: FastifyInstance) {
  app.register(createSeason)
  app.register(closeSeason)
  app.register(getSeasons)
  app.register(reopenSeason)
  app.register(deleteSeason)
}
