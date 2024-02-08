"use server";

import { User, VoteStatus } from "@prisma/client";
import prisma from "@/lib/server/prisma";
import { requireSession } from "@/lib/server/utils/session";
import { send } from "@/lib/server/email";
import { emailTemplates } from "@/lib/constants";
import { requireAdmin } from "@/lib/server/utils/auth";
import { z } from "zod";

export const updatePendingContributorInput = z
  .object({
    userId: z.string(),
    status: z.nativeEnum(VoteStatus),
  })
  .superRefine((data, ctx) => {
    if (isNaN(Number(data.userId))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid User ID",
        path: ["userId"],
      });
    }
  });

export async function updatePendingContributor(
  users: Array<User>,
  e: FormData,
): Promise<Array<User>> {
  try {
    const { user } = await requireSession();
    requireAdmin(user);

    const { status, userId: userIdString } =
      updatePendingContributorInput.parse(Object.fromEntries(e.entries()));

    const userId = Number(userIdString);

    const userToUpdate = await prisma.user.findFirst({
      where: { id: userId, role: "pending" },
    });

    if (userToUpdate) {
      await prisma.user.update({
        where: { id: userId },
        data: { role: status === VoteStatus.approve ? "contributor" : "user" },
      });

      // TODO: Send email to user
      if (status === VoteStatus.approve) {
        send({
          from: "noreply@ai-to.ai",
          replyTo: "conner@connerow.dev",
          to: userToUpdate.email,
          templateId: emailTemplates.contributorAccepted,
        });
      } else {
        send({
          from: "noreply@ai-to.ai",
          replyTo: "conner@connerow.dev",
          to: userToUpdate.email,
          templateId: emailTemplates.contributorRejected,
        });
      }

      return users.filter((u) => u.id !== userId);
    }

    throw new Error("User not found");
  } catch (e) {
    console.log(e);
    return users;
  }
}
