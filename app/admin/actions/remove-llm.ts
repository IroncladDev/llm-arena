"use server"

import { siteUrl } from "@/lib/env"
import { formatError } from "@/lib/errors"
import { baseEmail, send } from "@/lib/server/email"
import prisma from "@/lib/server/prisma"
import { requireAdmin } from "@/lib/server/utils/auth"
import { getSession } from "@/lib/server/utils/session"
import { EmbedBuilder, WebhookClient } from "discord.js"
import { z } from "zod"

const webhook = new WebhookClient({
  url: process.env.DISCORD_WEBHOOK_URL_ADMIN
})

const removeLLMInput = z.object({
  llmId: z.number(),
  reason: z.string().min(3).max(255)
})

export type RemoveLLMInput = z.infer<typeof removeLLMInput>

export async function removeLLM(e: RemoveLLMInput) {
  const res = await getSession()

  try {
    if (!res?.user) throw new Error("Unauthorized")

    const { user } = res
    requireAdmin(user)

    const { llmId, reason } = removeLLMInput.parse(e)

    const llm = await prisma.lLM.findFirst({
      where: {
        id: llmId
      },
      include: {
        fields: true,
        votes: true,
        user: true
      }
    })

    if (!llm) throw new Error("LLM not found")

    await prisma.field.deleteMany({
      where: {
        llmId
      }
    })

    await prisma.vote.deleteMany({
      where: {
        llmId
      }
    })

    await prisma.lLM.delete({
      where: { id: llmId }
    })

    await send({
      from: `AI to AI <noreply@${siteUrl.hostname}>`,
      replyTo: user.email,
      to: llm.user.email,
      subject: `Your LLM "${llm.name}" has been removed`,
      text: `Your LLM with the name "${llm.name}" has been removed from AI to AI by an administrator for this reason: "${reason}". If you have any questions or if you believe this was done in error, you may respond directly to this email.`,
      html: baseEmail({
        title: `Your LLM "${llm.name}" has been removed`,
        paragraphs: [
          `Your LLM with the name "${llm.name}" has been removed from AI to AI by an administrator for this reason: "${reason}". If you have any questions or if you believe this was done in error, you may respond directly to this email.`
        ],
        buttonLinks: []
      })
    })

    const embed = new EmbedBuilder()
      .setTitle(`[LLM Removed] ${llm.name}`)
      .setFields({
        name: "Reason",
        value: reason
      })
      .setDescription(`${llm.votes.length} votes • ${llm.fields.length} fields`)
      .setColor(0xef4444)

    await webhook.send({
      embeds: [embed]
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
