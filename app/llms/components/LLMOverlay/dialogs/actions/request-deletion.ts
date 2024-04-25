"use server"

import { formatError } from "@/lib/errors"
import prisma from "@/lib/server/prisma"
import { getSession } from "@/lib/server/utils/session"
import { ChangeRequestType } from "@prisma/client"
import { z } from "zod"

const requestDeleteInput = z.object({
  llmId: z.number(),
  fieldId: z.number(),
  sourceDescription: z.string(),
})

export type RequestAddResult =
  | {
      success: true
    }
  | {
      success: false
      message: string
    }

export default async function requestDeleteField(
  requestDeleteArgs: z.infer<typeof requestDeleteInput>,
): Promise<RequestAddResult> {
  const res = await getSession()

  try {
    if (!res.user) throw new Error("Unauthorized")

    const { fieldId, llmId, sourceDescription } =
      requestDeleteInput.parse(requestDeleteArgs)

    const llm = await prisma.lLM.findFirst({
      where: {
        id: llmId,
      },
      include: {
        fields: true,
      },
    })

    if (!llm) throw new Error("LLM Not Found")

    const fieldToDelete = llm.fields.find(f => f.id === fieldId)

    if (!fieldToDelete) throw new Error("Field not found")

    await prisma.changeRequest.create({
      data: {
        llmId,
        type: ChangeRequestType.delete,
        userId: res.user.id,
        fieldId,
        sourceDescription: sourceDescription,
        metaPropertyId: fieldToDelete.metaPropertyId,
      },
    })

    return {
      success: true,
    }
  } catch (e) {
    return { success: false, message: formatError(e) }
  }
}
