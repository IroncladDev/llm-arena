import prisma from "@/lib/server/prisma"
import { getSession } from "@/lib/server/utils/session"
import { notFound, redirect } from "next/navigation"
import AdminPage from "./content"

export default async function Admin() {
  const { user } = await getSession()

  if (!user) {
    return redirect("/login")
  }

  if (user.role !== "admin") {
    return notFound()
  }

  const waitlist = await prisma.user.findMany({
    where: {
      role: "pending"
    }
  })

  return <AdminPage waitlist={waitlist} />
}
