import { FastifyInstance } from 'fastify'

import { createStudent } from './create-student'
import { getStudent } from './get-student'
import { getStudents } from './get-students'
import { updateStudent } from './update-student'

export async function registerStudentRoutes(app: FastifyInstance) {
  app.register(createStudent)
  app.register(getStudent)
  app.register(getStudents)
  app.register(updateStudent)
}
