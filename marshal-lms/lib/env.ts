import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";
 
export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
       BETTER_AUTH_SECRET: z.string().min(1),
        BETTER_AUTH_URL: z.string().url(),
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),
       RESEND_API_KEY: z.string().min(1),
    ARCJET_KEY: z.string().min(1),
    AWS_S3_ACCESSKEY: z.string().min(1),
    AWS_S3_SECRETKEY:z.string().min(1),
    AWS_REGION: z.string().min(1),
    AWS_BUCKET_NAME: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET:z.string().min(1)
  },

  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: { }
});