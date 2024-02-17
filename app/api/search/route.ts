import { formatError } from "@/lib/errors"
import prisma from "@/lib/server/prisma"
import { getSession } from "@/lib/server/utils/session"
import { LLMStatus, Prisma, UserRole } from "@prisma/client"
import { searchInput } from "./types"

export async function POST(req: Request) {
  const res = await getSession()
  try {
    if (!res?.user) throw new Error("Unauthorized")
    const user = res.user

    if (user.role !== UserRole.admin && user.role !== UserRole.contributor) {
      throw new Error("Unauthorized")
    }

    const body = await req.json()

    const { query, advanced, status, skip, limit, searchBy } =
      searchInput.parse(body)

    const results = await prisma.lLM.findMany({
      where: {
        status:
          status === "all"
            ? undefined
            : status === "pending"
              ? LLMStatus.pending
              : status === "approved"
                ? LLMStatus.approved
                : LLMStatus.rejected,
        OR: [
          searchBy.name && {
            name: advanced
              ? {
                  search: query
                }
              : {
                  contains: query,
                  mode: "insensitive"
                }
          },
          searchBy.sourceDescription && {
            sourceDescription: advanced
              ? {
                  search: query
                }
              : {
                  contains: query,
                  mode: "insensitive"
                }
          },
          searchBy.fields && {
            fields: {
              some: {
                metaProperty: {
                  name: advanced
                    ? {
                        search: query
                      }
                    : {
                        contains: query,
                        mode: "insensitive"
                      }
                }
              }
            }
          }
        ].filter(Boolean) as Array<Prisma.LLMWhereInput>
      },
      take: Math.min(limit, 100),
      skip,
      include: {
        fields: {
          include: {
            metaProperty: true
          }
        },
        votes: true,
        user: true
      },
      orderBy: {
        createdAt: status === LLMStatus.pending ? "asc" : "desc"
      }
    })

    return Response.json({
      success: true,
      data: results
    })
  } catch (err) {
    console.error(err)

    return Response.json({
      success: false,
      error: formatError(err)
    })
  }
}
