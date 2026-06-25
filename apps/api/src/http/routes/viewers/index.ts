import { FastifyInstance } from 'fastify'

import { cancelRedemption } from './cancel-redemption'
import { createRedemption } from './create-redemption'
import { getSchoolClasses } from './get-school-classes'
import { getSchoolRanking } from './get-school-ranking'
import { getSchoolShop } from './get-school-shop'
import { getStudentPoints } from './get-student-points'
import { getStudentProfile } from './get-student-profile'
import { getStudentRedemptions } from './get-student-redemptions'
import { updateStudentPassword } from './update-student-password'

export async function registerViewerRoutes(app: FastifyInstance) {
  app.register(getStudentProfile)
  app.register(getStudentPoints)
  app.register(getSchoolShop)
  app.register(getSchoolRanking)
  app.register(getSchoolClasses)
  app.register(createRedemption)
  app.register(getStudentRedemptions)
  app.register(cancelRedemption)
  app.register(updateStudentPassword)
}
