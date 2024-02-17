import determineConsensus from "@/lib/consensus"
import { UserRole, Vote, VoteStatus } from "@prisma/client"
import {
  adjectives,
  animals,
  languages,
  starWars,
  uniqueNamesGenerator
} from "unique-names-generator"
import { prisma } from "./client"

export default async function seedLLMs() {
  const contributors = await prisma.user.findMany({
    where: {
      role: UserRole.contributor
    }
  })

  const generateName = () =>
    uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: " ",
      style: "capital"
    }) + ` v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`

  const generateDescription = () =>
    uniqueNamesGenerator({
      dictionaries: [adjectives, languages, starWars],
      separator: " ",
      style: "lowerCase"
    })

  const generateVotes = () => {
    const length = 3 + Math.floor(Math.random() * 5)

    const votes = new Array(length).fill(null).map(() => {
      const status =
        Math.random() > 0.5 ? VoteStatus.reject : VoteStatus.approve

      const commentText = uniqueNamesGenerator({
        dictionaries: [adjectives]
      })

      return {
        userId:
          contributors[Math.floor(Math.random() * contributors.length)].id,
        status,
        comment:
          status === VoteStatus.reject
            ? commentText
            : Math.random() > 0.5
              ? commentText
              : undefined
      }
    }) as Array<Vote>

    return votes
  }

  for (const contributor of contributors) {
    for (let i = 2; i--; ) {
      const votes = generateVotes()
      const { status } = determineConsensus(votes)

      await prisma.lLM.create({
        data: {
          name: generateName(),
          sourceDescription: generateDescription(),
          userId: contributor.id,
          status,
          votes: {
            create: votes
          }
        }
      })
    }
  }
}
