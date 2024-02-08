"use server";

import { requireSession } from "@/lib/server/utils/session";
import prisma from "@/lib/server/prisma";
import { requireUserRole } from "@/lib/server/utils/auth";
import { formatError } from "@/lib/errors";

export async function joinAsContributor() {
  try {
    const { user } = await requireSession();
    requireUserRole(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { role: "pending" },
    });

    const waitlistNumber = await prisma.user.count({
      where: { role: "pending", createdAt: { lt: new Date() } },
    });

    return {
      success: true,
      waitlistNumber,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
