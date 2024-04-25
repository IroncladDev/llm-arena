"use server"

import { formatError } from "@/lib/errors"
import prisma from "@/lib/server/prisma"
import { getSession } from "@/lib/server/utils/session"
import { ChangeRequestType, MetaPropertyType } from "@prisma/client"
import { z } from "zod"

const requestAddInput = z.object({
  llmId: z.number(),
  metaPropertyId: z.number().optional(),
  name: z.string().optional(),
  value: z.string(),
  note: z.string().optional(),
  type: z.nativeEnum(MetaPropertyType).optional(),
  sourceDescription: z.string(),
})

interface InputExistingProperty {
  llmId: number
  sourceDescription: string
  value: string
  note?: string
  metaPropertyId: number
}

interface InputNewProperty {
  llmId: number
  value: string
  sourceDescription: string
  name: string
  note?: string
  type: MetaPropertyType
}

type RequestAddInput = InputNewProperty | InputExistingProperty

export type RequestAddResult =
  | {
      success: true
    }
  | {
      success: false
      message: string
    }

export default async function requestAddField(
  requestAddArgs: RequestAddInput,
): Promise<RequestAddResult> {
  const res = await getSession()

  try {
    if (!res.user) throw new Error("Unauthorized")

    const input = requestAddInput.parse(requestAddArgs) as RequestAddInput

    console.log(input)

    const llm = await prisma.lLM.findFirst({
      where: {
        id: input.llmId,
      },
    })

    if (!llm) throw new Error("LLM Not Found")

    if ("metaPropertyId" in input) {
      const metaProperty = await prisma.metaProperty.findFirst({
        where: {
          id: input.metaPropertyId,
        },
      })

      if (!metaProperty) throw new Error("Existing Meta Property not found")

      await prisma.changeRequest.create({
        data: {
          llmId: input.llmId,
          type: ChangeRequestType.add,
          userId: res.user.id,
          sourceDescription: input.sourceDescription,
          newValue: input.value,
          newNote: input.note,
          metaPropertyId: metaProperty.id,
        },
      })

      return {
        success: true,
      }
    }

    const metaProperty = await prisma.metaProperty.create({
      data: { type: input.type, name: input.name },
    })

    await prisma.changeRequest.create({
      data: {
        llmId: input.llmId,
        type: ChangeRequestType.add,
        userId: res.user.id,
        sourceDescription: input.sourceDescription,
        newValue: input.value,
        newNote: input.note,
        metaPropertyId: metaProperty.id,
      },
    })

    return {
      success: true,
    }
  } catch (e) {
    return { success: false, message: formatError(e) }
  }
}
