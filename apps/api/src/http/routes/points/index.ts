import { FastifyInstance } from 'fastify'

import { getStudentPoints } from './get-student-points'

export async function registerPointRoutes(app: FastifyInstance) {
  app.register(getStudentPoints)
}
