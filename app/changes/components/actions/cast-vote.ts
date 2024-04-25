"use server"

import determineConsensus from "@/lib/consensus"
import { siteUrl } from "@/lib/env"
import { formatError } from "@/lib/errors"
import prisma from "@/lib/server/prisma"
import { requireContributorOrAdmin } from "@/lib/server/utils/auth"
import { getSession } from "@/lib/server/utils/session"
import { LLMStatus, VoteStatus } from "@prisma/client"
import { EmbedBuilder, WebhookClient } from "discord.js"
import { z } from "zod"

const webhook = new WebhookClient({
  url: process.env.DISCORD_WEBHOOK_URL_PUBLIC,
})

const castVoteInput = z.object({
  changeRequestId: z.number(),
  action: z.nativeEnum(VoteStatus),
})

type CastVoteReturn =
  | {
      success: true
    }
  | {
      success: false
      message: string
    }

export async function castVote(
  input: z.infer<typeof castVoteInput>,
): Promise<CastVoteReturn> {
  const res = await getSession()

  try {
    if (!res?.user) throw new Error("Unauthorized")

    const { user } = res
    requireContributorOrAdmin(user)

    const { changeRequestId, action } = castVoteInput.parse(input)

    const request = await prisma.changeRequest.findFirst({
      where: {
        id: changeRequestId,
      },
      include: {
        votes: true,
        metaProperty: {
          select: {
            name: true,
          },
        },
        llm: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!request) throw new Error("Change Request not found")

    if (request.status !== LLMStatus.pending)
      throw new Error("Change Request Has already been " + request.status)

    const existingVote = await prisma.changeRequestVote.findFirst({
      where: {
        changeRequestId,
        userId: user.id,
      },
    })

    if (existingVote)
      throw new Error("You have already voted on this Change Request")

    const newVote = await prisma.changeRequestVote.create({
      data: {
        changeRequestId,
        userId: user.id,
        status: action,
      },
    })

    if (!newVote) throw new Error("Failed to cast vote")

    const consensus = determineConsensus([...request.votes, newVote])

    if (consensus.status !== request.status)
      await prisma.changeRequest.update({
        where: {
          id: changeRequestId,
        },
        data: {
          status: consensus.status,
        },
      })

    if (consensus.status === "approved") {
      if (request.type === "delete" && request.fieldId) {
        await prisma.field.delete({
          where: {
            id: request.fieldId,
          },
        })
      } else if (
        request.type === "edit" &&
        request.fieldId &&
        (request.newNote || request.newValue)
      ) {
        await prisma.field.update({
          where: { id: request.fieldId },
          data: {
            ...(request.newNote
              ? {
                  note: request.newNote,
                }
              : {}),
            ...(request.newValue
              ? {
                  value: request.newValue,
                }
              : {}),
          },
        })
      } else if (request.newValue) {
        await prisma.field.create({
          data: {
            llmId: request.llmId,
            note: request.newNote,
            value: request.newValue,
            metaPropertyId: request.metaPropertyId,
          },
        })
      }
    }

    if (consensus.status !== LLMStatus.pending) {
      const allVotes = [...request.votes, newVote]

      const embed = new EmbedBuilder()
        .setTitle(
          `[Change Request ${consensus.status}] ${request.type} ${request.metaProperty.name} on ${request.llm.name}`,
        )
        .setURL(new URL("/llms?llm=" + request.llmId, siteUrl).toString())
        .setDescription(
          `${consensus.status} after ${allVotes.filter(v => v.status === VoteStatus.approve).length} approvals, ${allVotes.filter(v => v.status === VoteStatus.reject).length} rejections.`,
        )
        .setColor(consensus.status === "approved" ? 0x34d399 : 0xef4444)

      await webhook.send({
        embeds: [embed],
      })
    }

    return {
      success: true,
    }
  } catch (e) {
    console.error(e)

    return {
      success: false,
      message: formatError(e),
    }
  }
}
