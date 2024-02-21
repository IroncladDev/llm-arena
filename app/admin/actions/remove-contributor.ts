"use server"

import { formatError } from "@/lib/errors"
import { baseEmail, send } from "@/lib/server/email"
import prisma from "@/lib/server/prisma"
import { requireAdmin } from "@/lib/server/utils/auth"
import { getSession } from "@/lib/server/utils/session"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const removeContributorInput = z.object({
  userId: z.number()
})

export type RemoveContributorInput = z.infer<typeof removeContributorInput>

export async function removeContributor(e: RemoveContributorInput) {
  const res = await getSession()

  try {
    if (!res?.user) throw new Error("Unauthorized")

    const { user } = res
    requireAdmin(user)

    const { userId } = removeContributorInput.parse(e)

    const contributor = await prisma.user.findFirst({
      where: {
        id: userId
      }
    })

    if (!contributor) throw new Error("Contributor not found")

    if (contributor.role === UserRole.admin)
      throw new Error("Cannot remove admin")

    if (contributor.role !== UserRole.contributor)
      throw new Error("User is not a contributor")

    await prisma.user.update({
      where: { id: userId },
      data: {
        role: UserRole.user
      }
    })

    await send({
      from: "AI to AI <noreply@ai-to.ai>",
      replyTo: "conner@connerow.dev",
      to: user.email,
      subject: "Your contributor status has been removed",
      text: "",
      html: baseEmail({
        title: "Your contributor status has been removed",
        paragraphs: [
          "Your contributor status has been revoked by an administrator. If you have any questions or if you believe this was done in error, you may respond directly to this email."
        ],
        buttonLinks: []
      })
    })

    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}
