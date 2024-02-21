import prisma from "@/lib/server/prisma"
import { getServerSession } from "next-auth"

/**
 * Gets a session and user for an API route or Server Action.
 * Returns nullable user and session fields.
 */
export async function getSession() {
  const session = await getServerSession()

  const email = session?.user?.email

  const user = email
    ? await prisma.user.findFirst({
        where: {
          email
        }
      })
    : null

  return { session, user }
}
