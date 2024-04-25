import prisma from "@/lib/server/prisma"
import { requireContributorOrAdmin } from "@/lib/server/utils/auth"
import { getSession } from "@/lib/server/utils/session"

export async function GET(request: Request) {
  const res = await getSession()
  try {
    if (!res.user) throw new Error("Unauthorized")
    const user = res.user
    requireContributorOrAdmin(user)

    const { searchParams } = new URL(request.url)

    const query = searchParams.get("query")

    const mostUsed = await prisma.metaProperty.findMany({
      orderBy: {
        useCount: "desc",
      },
      take: 10,
    })

    if (!query) {
      return Response.json(mostUsed)
    }

    const results = await prisma.metaProperty.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      orderBy: {
        useCount: "desc",
      },
      take: 10,
    })

    return Response.json(results)
  } catch (e) {
    console.error(e)

    return Response.json([])
  }
}
