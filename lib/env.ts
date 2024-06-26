import { z } from "zod"

const envSchema = z.object({
  RESEND_API_KEY: z.string(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string(),
  GITHUB_ID: z.string(),
  GITHUB_SECRET: z.string(),
  POSTGRES_PRISMA_URL: z.string(),
  DISCORD_WEBHOOK_URL_PUBLIC: z.string(),
  DISCORD_WEBHOOK_URL_ADMIN: z.string(),
  DISCORD_INVITE: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
})

envSchema.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL)
