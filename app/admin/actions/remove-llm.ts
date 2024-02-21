"use server"

import { formatError } from "@/lib/errors"
import { baseEmail, send } from "@/lib/server/email"
import prisma from "@/lib/server/prisma"
import { requireAdmin } from "@/lib/server/utils/auth"
import { getSession } from "@/lib/server/utils/session"
import { z } from "zod"

const removeLLMInput = z.object({
  llmId: z.number()
})

export type RemoveLLMInput = z.infer<typeof removeLLMInput>

export async function removeLLM(e: RemoveLLMInput) {
  const res = await getSession()

  try {
    if (!res?.user) throw new Error("Unauthorized")

    const { user } = res
    requireAdmin(user)

    const { llmId } = removeLLMInput.parse(e)

    const llm = await prisma.lLM.findFirst({
      where: {
        id: llmId
      }
    })

    if (!llm) throw new Error("LLM not found")

    await prisma.field.deleteMany({
      where: {
        llmId
      }
    })

    await prisma.vote.deleteMany({
      where: {
        llmId
      }
    })

    await prisma.lLM.delete({
      where: { id: llmId }
    })

    await send({
      from: "AI to AI <noreply@ai-to.ai>",
      replyTo: "conner@connerow.dev",
      to: user.email,
      subject: `Your LLM "${llm.name}" has been removed`,
      text: "",
      html: baseEmail({
        title: `Your LLM "${llm.name}" has been removed`,
        paragraphs: [
          `Your LLM with the name "${llm.name}" has been removed from AI to AI by an administrator. If you have any questions or if you believe this was done in error, you may respond directly to this email.`
        ],
        buttonLinks: []
      })
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
