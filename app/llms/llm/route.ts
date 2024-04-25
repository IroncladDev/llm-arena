import { formatError } from "@/lib/errors"
import prisma from "@/lib/server/prisma"
import { requireContributorOrAdmin } from "@/lib/server/utils/auth"
import { getSession } from "@/lib/server/utils/session"

export async function GET(req: Request) {
  const res = await getSession()
  try {
    if (!res?.user) throw new Error("Unauthorized")
    const user = res.user
    requireContributorOrAdmin(user)

    const searchParams = new URL(req.url).searchParams

    const id = Number(searchParams.get("id"))

    if (isNaN(id)) {
      throw new Error("Invalid LLM Id")
    }

    const llm = await prisma.lLM.findFirst({
      where: {
        id,
      },
      include: {
        fields: {
          include: {
            metaProperty: true,
          },
        },
        votes: {
          include: {
            user: true,
          },
        },
        changeRequests: {
          where: {
            status: "pending",
          },
          include: {
            user: true,
            votes: {
              include: {
                user: true,
              },
            },
            field: true,
            metaProperty: true,
            llm: true,
          },
          orderBy: {
            votes: {
              _count: "desc",
            },
          },
        },
        user: true,
      },
    })

    if (!llm) {
      throw new Error("LLM not found")
    }

    return Response.json({
      data: llm,
      success: true,
    })
  } catch (e) {
    return Response.json({
      message: formatError(e),
      success: false,
    })
  }
}
