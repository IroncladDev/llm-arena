"use server"

import determineConsensus from "@/lib/consensus"
import { formatError } from "@/lib/errors"
import prisma from "@/lib/server/prisma"
import { requireContributorOrAdmin } from "@/lib/server/utils/auth"
import { requireSession } from "@/lib/server/utils/session"
import { LLMStatus, VoteStatus } from "@prisma/client"
import { z } from "zod"

const castVoteInput = z
  .object({
    llmId: z.string(),
    comment: z.string().nullish(),
    action: z.nativeEnum(VoteStatus)
  })
  .superRefine((data, ctx) => {
    if (data.action === VoteStatus.reject && !data.comment) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "required when rejecting an LLM",
        path: ["comment"]
      })
    }

    if (isNaN(Number(data.llmId))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid ID",
        path: ["llmId"]
      })
    }
  })

type CastVoteReturn = {
  success: boolean
  message?: string
} | null

export async function castVoteAction(_prevState: CastVoteReturn, e: FormData) {
  try {
    const { user } = await requireSession()
    requireContributorOrAdmin(user)

    const { llmId, comment, action } = castVoteInput.parse(
      Object.fromEntries(e.entries())
    )

    const id = Number(llmId)

    const llm = await prisma.lLM.findFirst({
      where: {
        id
      },
      include: {
        votes: true
      }
    })

    if (!llm) throw new Error("LLM not found")

    if (llm.status !== LLMStatus.pending)
      throw new Error("LLM Has already been " + llm.status)

    const existingVote = await prisma.vote.findFirst({
      where: {
        llmId: id,
        userId: user.id
      }
    })

    if (existingVote) throw new Error("You have already voted on this LLM")

    const newVote = await prisma.vote.create({
      data: {
        comment,
        llmId: id,
        userId: user.id,
        status: action
      }
    })

    if (!newVote) throw new Error("Failed to cast vote")

    const consensus = determineConsensus([...llm.votes, newVote])

    await prisma.lLM.update({
      where: {
        id
      },
      data: {
        status: consensus.status
      }
    })

    return {
      success: true
    }
  } catch (e) {
    console.error(e)

    return {
      success: false,
      message: formatError(e)
    }
  }
}
