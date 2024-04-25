import { MetaPropertyType } from "@prisma/client"
import {
  animals,
  languages,
  uniqueNamesGenerator,
} from "unique-names-generator"
import { prisma } from "./client"

export default async function seedMeta() {
  const generateName = () =>
    uniqueNamesGenerator({
      dictionaries: [languages, animals],
      separator: "_",
      style: "lowerCase",
    })

  await prisma.metaProperty.createMany({
    data: new Array(20).fill(null).map(() => ({
      name: generateName(),
      type: MetaPropertyType.Number,
    })),
  })

  const allProperties = await prisma.metaProperty.findMany()
  const allLLMs = await prisma.lLM.findMany()

  const addRandomField = async (llmId: number) => {
    const llm = await prisma.lLM.findFirst({
      where: { id: llmId },
      include: { fields: true },
    })

    const property =
      allProperties[Math.floor(Math.random() * allProperties.length)]

    const value = Math.floor(Math.random() * 10000)

    if (llm?.fields?.some(field => field.metaPropertyId === property.id)) return

    await prisma.field.create({
      data: {
        value: String(value),
        metaPropertyId: property.id,
        llmId: llmId,
      },
    })
  }

  for (const llm of allLLMs) {
    for (let i = 5; i--; ) await addRandomField(llm.id)
  }
}
