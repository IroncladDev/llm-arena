import { getSession } from "@/lib/server/utils/session"
import { redirect } from "next/navigation"
import Content from "./content"
import prisma from "@/lib/server/prisma"

export default async function Page() {
  const { user } = await getSession()

  if (!user) {
    return redirect("/login")
  }

  if (user.role !== "contributor" && user.role !== "admin") {
    return redirect("/contribute")
  }

  const commonMeta = await prisma.metaProperty.findMany({
    orderBy: {
      useCount: "desc"
    },
    take: 3
  })

  return <Content commonMeta={commonMeta || []} />
}
