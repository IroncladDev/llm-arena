"use server"

import { formatError } from "@/lib/errors"
import prisma from "@/lib/server/prisma"
import { requireSession } from "@/lib/server/utils/session"
import { LLM, MetaProperty, MetaPropertyType, UserRole } from "@prisma/client"
import { z } from "zod"

export type SubmitReturn = {
  success: boolean
  message?: string
  data?: {
    llm: LLM
  }
} | null

export async function submit(_prevState: SubmitReturn, e: FormData) {
  try {
    const { user } = await requireSession()

    if (user.role !== UserRole.admin && user.role !== UserRole.contributor)
      throw new Error("Unauthorized")

    const { name, description, metadata } = formInput.parse(
      Object.fromEntries(e.entries())
    )
    const meta = z.array(metaField).parse(JSON.parse(metadata))

    if (meta.some(x => String(x.value).length === 0))
      throw new Error("Empty values are not allowed")

    const { hasDuplicates } = meta.reduce(
      (acc, { name }) => {
        if (acc.names[name]) {
          acc.hasDuplicates = true
        }
        acc.names[name] = true

        return acc
      },
      {
        names: {} as Record<string, boolean>,
        hasDuplicates: false
      }
    )

    if (hasDuplicates)
      throw new Error("Duplicate Metadata fields are not allowed")

    const llm = await prisma.lLM.create({
      data: {
        name,
        sourceDescription: description,
        userId: user.id
      }
    })

    for (const field of meta) {
      const createField = async (property: MetaProperty) => {
        await prisma.field.create({
          data: {
            value: String(field.value),
            metaPropertyId: property.id,
            llmId: llm.id
          }
        })

        await prisma.metaProperty.update({
          where: {
            id: property.id
          },
          data: {
            useCount: property.useCount + 1
          }
        })
      }

      if (field.property) {
        const existingProperty = await prisma.metaProperty.findFirst({
          where: {
            id: field.property.id
          }
        })

        // Ensure the existing property matches the field
        if (
          existingProperty &&
          existingProperty.name === field.property.name &&
          existingProperty.type === field.property.type
        )
          await createField(existingProperty)
      } else {
        // Avoid creating duplicate properties with the same name
        const existingProperty = await prisma.metaProperty.findFirst({
          where: {
            name: field.name
          }
        })

        if (existingProperty) {
          // Avoid creating properties if they don't match the original type
          if (existingProperty.type === field.type)
            await createField(existingProperty)
        } else {
          const property = await prisma.metaProperty.create({
            data: {
              type: field.type,
              name: field.name
            }
          })

          await prisma.field.create({
            data: {
              value: String(field.value),
              metaPropertyId: property.id,
              llmId: llm.id
            }
          })
        }
      }
    }

    return {
      success: true,
      data: {
        llm
      }
    }
  } catch (e) {
    return {
      success: false,
      message: formatError(e)
    }
  }
}

const metaProperty = z.enum([
  MetaPropertyType.Number,
  MetaPropertyType.String,
  MetaPropertyType.Boolean
])

const property = z.object({
  id: z.number(),
  name: z.string(),
  type: metaProperty,
  useCount: z.number(),
  createdAt: z.string()
})

const metaField = z.object({
  type: metaProperty,
  value: z.union([z.string(), z.number(), z.boolean()]),
  name: z.string(),
  property: property.nullish()
})

const formInput = z.object({
  name: z.string(),
  metadata: z.string(),
  description: z.string()
})
