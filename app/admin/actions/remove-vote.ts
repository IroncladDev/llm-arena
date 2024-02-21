"use server"

import determineConsensus from "@/lib/consensus"
import { formatError } from "@/lib/errors"
import prisma from "@/lib/server/prisma"
import { requireAdmin } from "@/lib/server/utils/auth"
import { getSession } from "@/lib/server/utils/session"
import { z } from "zod"

const removeVoteInput = z.object({
  voteId: z.number()
})

export type RemoveVoteInput = z.infer<typeof removeVoteInput>

export async function removeVote(e: RemoveVoteInput) {
  const res = await getSession()

  try {
    if (!res?.user) throw new Error("Unauthorized")

    const { user } = res
    requireAdmin(user)

    const { voteId } = removeVoteInput.parse(e)

    const vote = await prisma.vote.findFirst({
      where: {
        id: voteId
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
