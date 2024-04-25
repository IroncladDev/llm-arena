import prisma from "@/lib/server/prisma"
import { getSession } from "@/lib/server/utils/session"
import { redirect } from "next/navigation"
import WaitlistPage from "./content"

export default async function Login() {
  const { user } = await getSession()

  if (!user) {
    return redirect("/login")
  }

  if (user.role === "contributor") {
    return redirect("/llms")
  }

  if (user.role === "admin") {
    return redirect("/admin")
  }

  const waitlistNumber = await prisma.user.count({
    where: {
      role: "pending",
      id: { lte: user.id },
      createdAt: { lt: new Date() },
    },
  })

  return <WaitlistPage position={waitlistNumber} />
}
