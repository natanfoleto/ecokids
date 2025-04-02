import { FastifyInstance } from 'fastify'

import { getStudentPoints } from './get-student-points'

export async function registerPointsRoutes(app: FastifyInstance) {
  app.register(getStudentPoints)
}
