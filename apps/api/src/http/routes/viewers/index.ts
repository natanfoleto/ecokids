import { FastifyInstance } from 'fastify'

import { getSchoolShop } from './get-school-shop'
import { getStudentPoints } from './get-student-points'
import { getStudentProfile } from './get-student-profile'

export async function registerViewerRoutes(app: FastifyInstance) {
  app.register(getStudentProfile)
  app.register(getStudentPoints)
  app.register(getSchoolShop)
}
