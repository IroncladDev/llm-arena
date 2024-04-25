"use server"
import { ChangeRequestWithVote } from "@/app/llms/components/LLMOverlay"
import prisma from "@/lib/server/prisma"

export async function getChangeRequests(): Promise<
  Array<ChangeRequestWithVote>
> {
  const changeRequests = await prisma.changeRequest.findMany({
    where: {
      status: "pending",
    },
    include: {
      user: true,
      votes: {
        include: {
          user: true,
        },
      },
      field: true,
      metaProperty: true,
      llm: true,
    },
    orderBy: {
      id: "asc",
    },
  })

  return changeRequests
}
