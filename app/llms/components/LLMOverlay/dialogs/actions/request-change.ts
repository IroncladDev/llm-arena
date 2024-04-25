"use server"

import { formatError } from "@/lib/errors"
import prisma from "@/lib/server/prisma"
import { getSession } from "@/lib/server/utils/session"
import { ChangeRequest, ChangeRequestType } from "@prisma/client"
import { z } from "zod"

const requestChangeInput = z.object({
  llmId: z.number(),
  fieldId: z.number(),
  value: z.string().nullable(),
  note: z.string().nullable(),
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

export default async function requestChangeField(
  requestAddArgs: z.infer<typeof requestChangeInput>,
): Promise<RequestAddResult> {
  const res = await getSession()

  try {
    if (!res.user) throw new Error("Unauthorized")

    const { llmId, fieldId, value, note, sourceDescription } =
      requestChangeInput.parse(requestAddArgs)

    const llm = await prisma.lLM.findFirst({
      where: {
        id: llmId,
      },
      include: {
        fields: true,
      },
    })

    if (!llm) throw new Error("LLM Not Found")

    const fieldToChange = llm.fields.find(f => f.id === fieldId)

    if (!fieldToChange) throw new Error("Field not found")

    const changeRequestData: Omit<
      ChangeRequest,
      "id" | "createdAt" | "status"
    > = {
      llmId,
      fieldId,
      type: ChangeRequestType.edit,
      userId: res.user.id,
      sourceDescription,
      newValue: fieldToChange.value,
      newNote: fieldToChange.note,
      metaPropertyId: fieldToChange.metaPropertyId,
    }

    if (note && typeof note === "string") changeRequestData.newNote = note

    if (value && typeof value === "string") changeRequestData.newValue = value

    await prisma.changeRequest.create({ data: changeRequestData })

    return {
      success: true,
    }
  } catch (e) {
    return { success: false, message: formatError(e) }
  }
}
