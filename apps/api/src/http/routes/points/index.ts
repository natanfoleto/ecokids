import { FastifyInstance } from 'fastify'

import { createPoint } from './create-point'
import { getStudentPoints } from './get-student-points'

export async function registerPointRoutes(app: FastifyInstance) {
  app.register(createPoint)
  app.register(getStudentPoints)
}
