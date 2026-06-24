import type { FastifyInstance } from 'fastify'

import { createSchoolSeason } from './create-school-season'
import { finishSchoolSeason } from './finish-school-season'
import { getSchoolSeasonReport } from './get-school-season-report'
import { getSchoolSeasons } from './get-school-seasons'
import { reopenSchoolSeason } from './reopen-school-season'
import { resetSchoolSeason } from './reset-school-season'

export async function registerSchoolSeasonRoutes(app: FastifyInstance) {
  app.register(createSchoolSeason)
  app.register(finishSchoolSeason)
  app.register(getSchoolSeasons)
  app.register(reopenSchoolSeason)
  app.register(resetSchoolSeason)
  app.register(getSchoolSeasonReport)
}
