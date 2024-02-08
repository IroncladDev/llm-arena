"use server";

import { formatError } from "@/lib/errors";
import { requireAdmin } from "@/lib/server/utils/auth";
import { requireSession } from "@/lib/server/utils/session";
import { z } from "zod";
import prisma from "@/lib/server/prisma";

const removeLLMInput = z.object({
  llmId: z.number(),
});

export type RemoveLLMInput = z.infer<typeof removeLLMInput>;

export async function removeLLM(e: RemoveLLMInput) {
  try {
    const { user } = await requireSession();
    requireAdmin(user);

    const { llmId } = removeLLMInput.parse(e);

    const llm = await prisma.lLM.findFirst({
      where: {
        id: llmId,
      },
    });

    if (!llm) throw new Error("LLM not found");

    await prisma.field.deleteMany({
      where: {
        llmId,
      },
    });

    await prisma.vote.deleteMany({
      where: {
        llmId,
      },
    });

    await prisma.lLM.delete({
      where: { id: llmId },
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
