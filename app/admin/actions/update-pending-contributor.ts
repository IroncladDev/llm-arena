"use server"

import { formatError } from "@/lib/errors"
import { baseEmail, send } from "@/lib/server/email"
import prisma from "@/lib/server/prisma"
import { requireAdmin } from "@/lib/server/utils/auth"
import { getSession } from "@/lib/server/utils/session"
import { UserRole, VoteStatus } from "@prisma/client"
import { EmbedBuilder, WebhookClient } from "discord.js"
import { z } from "zod"

const webhook = new WebhookClient({
  url: process.env.DISCORD_WEBHOOK_URL_ADMIN
})

const updatePendingContributorInput = z.object({
  userId: z.number(),
  status: z.nativeEnum(VoteStatus)
})

export async function updatePendingContributor(
  input: z.infer<typeof updatePendingContributorInput>
): Promise<
  | {
      success: true
    }
  | {
      success: false
      message: string
    }
> {
  const res = await getSession()

  try {
    if (!res?.user) throw new Error("Unauthorized")

    const { user } = res
    requireAdmin(user)

    const { status, userId } = updatePendingContributorInput.parse(input)

    const userToUpdate = await prisma.user.findFirst({
      where: { id: userId }
    })

    if (!userToUpdate) throw new Error("User not found")

    if (userToUpdate.role !== UserRole.pending)
      throw new Error("User is not pending")

    await prisma.user.update({
      where: { id: userId },
      data: {
        role:
          status === VoteStatus.approve ? UserRole.contributor : UserRole.user
      }
    })

    if (status === VoteStatus.approve) {
      await send({
        from: `LLM Arena <noreply@llmarena.ai>`,
        replyTo: user.email,
        to: userToUpdate.email,
        subject: "Contribution Request Approved",
        text: "Congratulations! We've approved your request to become a contributor to LLM Arena. To get started, check out the Contributor Guide: https://github.com/IroncladDev/llm-arena/blob/main/docs/contributor-guide.md",
        html: baseEmail({
          title: "Contribution Request Approved",
          paragraphs: [
            "Congratulations! We've approved your request to become a contributor to LLM Arena.",
            'To get started, check out the <a href="https://github.com/IroncladDev/llm-arena/blob/main/docs/contributor-guide.md">Contributor Guide</a>',
            `Join the <a href="${process.env.DISCORD_INVITE}">Discord Server</a> to stay up-to-date on announcements, updates, and more.`
          ],
          buttonLinks: [
            {
              href: "https://github.com/IroncladDev/llm-arena/blob/main/docs/contributor-guide.md",
              text: "Start Contributing"
            }
          ]
        })
      })
    } else {
      await send({
        from: `LLM Arena <noreply@llmarena.ai>`,
        replyTo: user.email,
        to: userToUpdate.email,
        subject: "Contribution Request Denied",
        text: "Thanks for your interest in contributing to LLM Arena. At the moment we've decided not to move forward with your request.\n\nIf you have any questions, you may respond to this email directly.",
        html: baseEmail({
          title: "Contribution Request Denied",
          paragraphs: [
            "Thanks for your interest in contributing to LLM Arena. At the moment we've decided not to move forward with your request.",
            "If you have any questions, you may respond to this email directly."
          ],
          buttonLinks: []
        })
      })
    }

    const embed = new EmbedBuilder()
      .setTitle(
        `[Contributor ${status === VoteStatus.approve ? "Accepted" : "Rejected"}] ${userToUpdate.handle}`
      )
      .setURL(`https://github.com/${userToUpdate.handle}`)
      .setColor(status === VoteStatus.approve ? 0x34d399 : 0xef4444)

    await webhook.send({
      embeds: [embed]
    })

    return { success: true }
  } catch (e) {
    console.log(e)

    return { success: false, message: formatError(e) }
  }
}
