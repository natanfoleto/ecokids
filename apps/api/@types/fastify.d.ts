import 'fastify'

import type { Member, School } from '@prisma/client'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    getUserMembership(
      schoolSlug: string,
    ): Promise<{ school: School; membership: Member }>
  }
}
