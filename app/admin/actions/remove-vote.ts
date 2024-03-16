"use server"

import determineConsensus from "@/lib/consensus"
import { siteUrl } from "@/lib/env"
import { formatError } from "@/lib/errors"
import prisma from "@/lib/server/prisma"
import { requireAdmin } from "@/lib/server/utils/auth"
import { getSession } from "@/lib/server/utils/session"
import { EmbedBuilder, WebhookClient } from "discord.js"
import { z } from "zod"

const webhook = new WebhookClient({
  url: process.env.DISCORD_WEBHOOK_URL_ADMIN
})

const removeVoteInput = z.object({
  voteId: z.number(),
  reason: z.string().min(3).max(255)
})

export type RemoveVoteInput = z.infer<typeof removeVoteInput>

export async function removeVote(e: RemoveVoteInput) {
  const res = await getSession()

  try {
    if (!res?.user) throw new Error("Unauthorized")

    const { user } = res
    requireAdmin(user)

    const { voteId, reason } = removeVoteInput.parse(e)

    const vote = await prisma.vote.findFirst({
      where: {
        id: voteId
      },
      include: {
        user: true
      }
    })

    if (!vote?.comment)
      throw new Error("Cannot remove a vote lacking a comment")

    await prisma.vote.delete({
      where: { id: voteId }
    })

    const llm = await prisma.lLM.findFirst({
      where: {
        id: vote.llmId
      },
      include: {
        votes: true
      }
    })

    if (!llm) throw new Error("LLM not found")

    const consensus = determineConsensus(llm.votes)

    await prisma.lLM.update({
      where: {
        id: llm.id
      },
      data: {
        status: consensus.status
      }
    })

    const embed = new EmbedBuilder()
      .setTitle(`[Vote Removed]`)
      .setURL(new URL("/llms?llm=" + llm.id, siteUrl).toString())
      .setDescription(`"${vote.comment}"`)
      .setFields({
        name: "Reason",
        value: reason
      })
      .setFooter({
        text: `- ${vote.user.handle}`
      })
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
