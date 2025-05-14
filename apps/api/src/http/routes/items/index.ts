import { FastifyInstance } from 'fastify'

import { createItem } from './create-item'
import { deleteItem } from './delete-item'
import { getItem } from './get-item'
import { getItems } from './get-items'
import { updateItem } from './update-item'
import { updateItemPhoto } from './update-item-photo'

export async function registerItemRoutes(app: FastifyInstance) {
  app.register(createItem)
  app.register(updateItem)
  app.register(deleteItem)
  app.register(getItem)
  app.register(getItems)
  app.register(updateItemPhoto)
}
