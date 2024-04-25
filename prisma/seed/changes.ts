import { ChangeRequestType } from "@prisma/client"
import {
  adjectives,
  animals,
  languages,
  starWars,
  uniqueNamesGenerator,
} from "unique-names-generator"
import { prisma } from "./client"

export default async function seedChangeRequests() {
  const llms = await prisma.lLM.findMany({
    include: {
      fields: {
        include: {
          metaProperty: true,
        },
      },
    },
  })

  const randomUsers = await prisma.user.findMany({
    take: 10,
  })

  const getRandomUser = () =>
    randomUsers[Math.floor(Math.random() * randomUsers.length)]

  const generateDescription = () =>
    uniqueNamesGenerator({
      dictionaries: [adjectives, languages, starWars],
      separator: " ",
      style: "lowerCase",
    })

  const generateNote = () =>
    uniqueNamesGenerator({
      dictionaries: [animals],
      style: "lowerCase",
    })

  for (const llm of llms) {
    if (Math.random() > 0.5) continue

    const getRandomField = () =>
      llm.fields[Math.floor(Math.random() * llm.fields.length)]

    for (let i = 0; i < 5; i++) {
      const fieldType =
        Math.random() < 0.33
          ? ChangeRequestType.add
          : Math.random() < 0.66
            ? ChangeRequestType.edit
            : ChangeRequestType.delete

      let f = getRandomField()

      switch (fieldType) {
        case ChangeRequestType.add:
          await prisma.changeRequest.create({
            data: {
              llmId: f.llmId,
              type: ChangeRequestType.add,
              userId: getRandomUser().id,
              sourceDescription: generateDescription(),
              newValue: String(
                f.metaProperty.type === "Number"
                  ? Math.floor(Math.random() * 1000)
                  : f.metaProperty.type === "Boolean"
                    ? "true"
                    : generateNote(),
              ),
              newNote: generateNote(),
              metaPropertyId: f.metaPropertyId,
            },
          })
          break
        case ChangeRequestType.edit:
          await prisma.changeRequest.create({
            data: {
              llmId: f.llmId,
              fieldId: f.id,
              type: ChangeRequestType.edit,
              userId: getRandomUser().id,
              sourceDescription: generateDescription(),
              newValue: String(
                f.metaProperty.type === "Number"
                  ? Math.floor(Math.random() * 1000)
                  : f.metaProperty.type === "Boolean"
                    ? "true"
                    : generateNote(),
              ),
              newNote: generateNote(),
              metaPropertyId: f.metaPropertyId,
            },
          })
          break
        case ChangeRequestType.delete:
          await prisma.changeRequest.create({
            data: {
              llmId: f.llmId,
              type: ChangeRequestType.delete,
              userId: getRandomUser().id,
              fieldId: f.id,
              sourceDescription: generateDescription(),
              metaPropertyId: f.metaPropertyId,
            },
          })
          break
      }
    }
  }
}
