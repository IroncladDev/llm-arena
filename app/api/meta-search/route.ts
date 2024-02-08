import { requireContributorOrAdmin } from "@/lib/server/utils/auth";
import { requireSession } from "@/lib/server/utils/session";

export async function GET(request: Request) {
  try {
    const { user } = await requireSession();
    requireContributorOrAdmin(user);

    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query");

    const mostUsed = await prisma?.metaProperty.findMany({
      orderBy: {
        useCount: "desc",
      },
      take: 5,
    });

    if (!query) {
      return Response.json(mostUsed);
    }

    const results = await prisma?.metaProperty.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      take: 10,
    });

    return Response.json(results);
  } catch {
    return Response.json([]);
  }
}
