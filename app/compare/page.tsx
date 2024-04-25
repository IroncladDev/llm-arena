import { formatError } from "@/lib/errors"
import prisma from "@/lib/server/prisma"
import Content from "./content"
import { optionsSchema, OptionsType } from "./state"

export default async function ComparePage({
  searchParams,
}: {
  searchParams: OptionsType
}) {
  try {
    const { llms: llmIds } = optionsSchema.parse(searchParams)

    const ids = llmIds.split(",").map(Number)

    if (ids.length < 2) {
      throw new Error("You need to select at least two LLMS to compare.")
    }

    const llms = await prisma.lLM.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        fields: {
          include: {
            metaProperty: true,
          },
        },
        user: true,
      },
    })

    return <Content initialLLMs={llms} />
  } catch (e) {
    throw new Error(formatError(e))
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: OptionsType
}) {
  try {
    const params = optionsSchema.parse(searchParams)

    const llms = await prisma.lLM.findMany({
      where: {
        id: {
          in: params.llms.split(",").map(Number),
        },
      },
    })

    let title: string
    let description: string

    if (llms.length < 2) {
      throw new Error("Not enough LLMs to compare")
    } else if (llms.length >= 2 && llms.length <= 3) {
      title = llms.map(llm => llm.name).join(" vs ")
    } else {
      title = `${llms[0].name} vs ${llms[1].name} and ${llms.length - 2} others`
    }

    if (llms.length < 2) {
      throw new Error("Not enough LLMs to compare")
    } else if (llms.length === 2) {
      description = `See the comparison between ${llms[0].name} and ${llms[1].name}`
    } else if (llms.length === 3) {
      description = `See the comparison between ${llms[0].name}, ${llms[1].name}, and ${llms[2].name}`
    } else {
      description = `See the comparison between ${llms[0].name}, ${llms[1].name} and ${llms.length - 2} others`
    }

    return {
      title,
      description,
    }
  } catch {
    return {
      title: "Error",
      description: "An error occurred",
    }
  }
}

export const dynamic = "force-dynamic"
