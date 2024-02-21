"use server"

import prisma from "@/lib/server/prisma"
import { getSession } from "@/lib/server/utils/session"

export async function joinAsContributor() {
  const res = await getSession()

  try {
    if (!res?.user) throw new Error("Unauthorized")

    const { user } = res

    if (user.role !== "user") throw new Error("User role not in a user state")

    await prisma.user.update({
      where: { id: user.id },
      data: { role: "pending" }
    })

    return { success: true }
  } catch (e) {
    return { success: false, message: (e as Error).message }
  }
}
