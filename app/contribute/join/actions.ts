"use server"

import { siteUrl } from "@/lib/env"
import prisma from "@/lib/server/prisma"
import { getSession } from "@/lib/server/utils/session"
import { formatDistanceToNow } from "date-fns"
import { EmbedBuilder, WebhookClient } from "discord.js"

const webhook = new WebhookClient({
  url: process.env.DISCORD_WEBHOOK_URL_ADMIN,
})

export async function joinAsContributor() {
  const res = await getSession()

  try {
    if (!res?.user) throw new Error("Unauthorized")

    const { user } = res

    if (user.role !== "user") throw new Error("User role not in a user state")

    await prisma.user.update({
      where: { id: user.id },
      data: { role: "pending" },
    })

    const pendingUsers = await prisma.user.findMany({
      where: { role: "pending" },
      orderBy: { updatedAt: "asc" },
      take: 100,
    })

    if (pendingUsers.length % 5 === 0) {
      const embed = new EmbedBuilder()
        .setTitle(
          `[Reminder] ${pendingUsers.length === 100 ? "100+" : pendingUsers.length} pending users on waitlist`,
        )
        .setDescription("Longest-waiting users:")
        .setURL(new URL("/admin", siteUrl).toString())
        .setColor(0xef4444)

      const fields = pendingUsers.slice(0, 5).map(u => ({
        name: u.handle,
        value: `Waiting for ${formatDistanceToNow(u.updatedAt)}`,
      }))

      embed.addFields(fields)

      await webhook.send({
        embeds: [embed],
      })
    }

    return { success: true }
  } catch (e) {
    return { success: false, message: (e as Error).message }
  }
}
