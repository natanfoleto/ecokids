import type { FastifyInstance } from 'fastify'

import { createSchoolSeason } from './create-school-season'
import { finishSchoolSeason } from './finish-school-season'
import { getSchoolSeasons } from './get-school-seasons'

export async function registerSchoolSeasonRoutes(app: FastifyInstance) {
  app.register(createSchoolSeason)
  app.register(finishSchoolSeason)
  app.register(getSchoolSeasons)
}
