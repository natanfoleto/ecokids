import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_GOOGLE_API_KEY: z.string(),
    NEXT_PUBLIC_FINDCEP_URL: z.string().url(),
    NEXT_PUBLIC_FINDCEP_REFERER: z.string(),
  },
  server: {},
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    NEXT_PUBLIC_FINDCEP_URL: process.env.NEXT_PUBLIC_FINDCEP_URL,
    NEXT_PUBLIC_FINDCEP_REFERER: process.env.NEXT_PUBLIC_FINDCEP_REFERER,
  },
})
