import { formatError } from "@/lib/errors"
import { requireContributorOrAdmin } from "@/lib/server/utils/auth"
import { requireSession } from "@/lib/server/utils/session"
import prisma from "@/lib/server/prisma"

export async function GET(req: Request) {
  try {
    const { user } = await requireSession()
    requireContributorOrAdmin(user)

    const searchParams = new URL(req.url).searchParams

    const id = Number(searchParams.get("id"))

    if (isNaN(id)) {
      throw new Error("Invalid LLM Id")
    }

    const llm = await prisma.lLM.findFirst({
      where: {
        id
      },
      include: {
        fields: {
          include: {
            metaProperty: true
          }
        },
        votes: {
          include: {
            user: true
          }
        },
        user: true
      }
    })

    if (!llm) {
      throw new Error("LLM not found")
    }

    return Response.json({
      data: llm,
      success: true
    })
  } catch (e) {
    return Response.json({
      message: formatError(e),
      success: false
    })
  }
}
