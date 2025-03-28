import { FastifyInstance } from 'fastify'

import { registerAuthRoutes } from './auth'
import { registerSchoolRoutes } from './schools'

export default async function (app: FastifyInstance) {
  await registerAuthRoutes(app)
  await registerSchoolRoutes(app)
}
