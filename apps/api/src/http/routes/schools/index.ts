import { FastifyInstance } from 'fastify'

import { createSchool } from './create-school'
import { getMembership } from './get-membership'
import { getSchool } from './get-school'
import { getSchools } from './get-schools'
import { shutdownSchool } from './shutdown-school'
import { updateSchool } from './update-school'

export async function registerSchoolRoutes(app: FastifyInstance) {
  app.register(createSchool)
  app.register(updateSchool)
  app.register(getSchools)
  app.register(getSchool)
  app.register(getMembership)
  app.register(shutdownSchool)
}
