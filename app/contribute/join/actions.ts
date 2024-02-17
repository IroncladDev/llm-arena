"use server"

import prisma from "@/lib/server/prisma"
import { requireSession } from "@/lib/server/utils/session"

export async function joinAsContributor() {
  try {
    const { user } = await requireSession()

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
