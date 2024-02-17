import prisma from "@/lib/server/prisma"
import { getServerSession } from "next-auth"

/**
 * Requires a session and user for an API route or Server Action.
 * If no session, email, or user, throws an error.
 */
export async function requireSession() {
  const session = await getServerSession()

  if (!session) {
    throw new Error("Unauthorized")
  }

  const email = session.user?.email

  if (!email) {
    throw new Error("No email found")
  }

  const user = await prisma.user.findFirst({
    where: {
      email
    }
  })

  if (!user) {
    throw new Error("User not found")
  }

  return { session, user }
}

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
