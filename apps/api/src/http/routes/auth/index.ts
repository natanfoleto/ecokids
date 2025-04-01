import { FastifyInstance } from 'fastify'

import { authenticateStudentWithPassword } from './authenticate-student-with-password'
import { authenticateUserWithPassword } from './authenticate-user-with-password'
import { requestStudentPasswordRecover } from './request-student-password-recover'
import { requestUserPasswordRecover } from './request-user-password-recover'
import { resetStudentPassword } from './reset-student-password'
import { resetUserPassword } from './reset-user-password'

export async function registerAuthRoutes(app: FastifyInstance) {
  app.register(authenticateUserWithPassword)
  app.register(requestUserPasswordRecover)
  app.register(resetUserPassword)
  app.register(authenticateStudentWithPassword)
  app.register(requestStudentPasswordRecover)
  app.register(resetStudentPassword)
}
