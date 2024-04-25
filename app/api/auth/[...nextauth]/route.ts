import prisma from "@/lib/server/prisma"
import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider, { GithubProfile } from "next-auth/providers/github"

const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user || !profile || !account) return false

      const handle = (profile as GithubProfile).login

      const existingUser = await prisma.user.findFirst({
        where: {
          handle,
        },
      })

      if (existingUser) return true

      const newUser = await prisma.user.create({
        data: {
          handle,
          provider: account.provider as "github",
          email: user.email as string,
        },
      })

      if (newUser) {
        return true
      } else {
        return false
      }
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
