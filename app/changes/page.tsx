import { getSession } from "@/lib/server/utils/session"
import { notFound, redirect } from "next/navigation"
import { getChangeRequests } from "./actions/get-change-requests"
import ChangesPage from "./content"

export default async function LLMs() {
  const { user } = await getSession()

  if (!user) {
    return redirect("/login")
  }

  if (user.role !== "admin" && user.role !== "contributor") {
    return notFound()
  }

  const initialRequests = await getChangeRequests()

  return <ChangesPage initialRequests={initialRequests} />
}
