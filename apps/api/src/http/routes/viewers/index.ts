import { FastifyInstance } from 'fastify'

import { getSchoolClasses } from './get-school-classes'
import { getSchoolRanking } from './get-school-ranking'
import { getSchoolShop } from './get-school-shop'
import { getStudentPoints } from './get-student-points'
import { getStudentProfile } from './get-student-profile'

export async function registerViewerRoutes(app: FastifyInstance) {
  app.register(getStudentProfile)
  app.register(getStudentPoints)
  app.register(getSchoolShop)
  app.register(getSchoolRanking)
  app.register(getSchoolClasses)
}
