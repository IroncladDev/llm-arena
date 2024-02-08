"use server";

import { formatError } from "@/lib/errors";
import { requireAdmin } from "@/lib/server/utils/auth";
import { requireSession } from "@/lib/server/utils/session";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const removeContributorInput = z.object({
  userId: z.number(),
});

export type RemoveContributorInput = z.infer<typeof removeContributorInput>;

export async function removeContributor(e: RemoveContributorInput) {
  try {
    const { user } = await requireSession();
    requireAdmin(user);

    const { userId } = removeContributorInput.parse(e);

    const contributor = await prisma?.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!contributor) throw new Error("Contributor not found");

    if (contributor.role === UserRole.admin)
      throw new Error("Cannot remove admin");

    if (contributor.role !== UserRole.contributor)
      throw new Error("User is not a contributor");

    await prisma?.user.update({
      where: { id: userId },
      data: {
        role: UserRole.user,
      },
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
