import 'fastify'

import type { Member, School } from '@prisma/client'

declare module 'fastify' {
  export interface FastifyInstance {
    s3Client: S3ClientWrapper
  }

  export interface FastifyRequest {
    getCurrentEntityId(): Promise<string>
    getUserMembership(
      schoolSlug: string,
    ): Promise<{ school: School; membership: Member }>
  }
}
