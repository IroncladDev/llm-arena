import { getSession } from "@/lib/server/utils/session"
import { redirect } from "next/navigation"
import ContributorLoginPage from "./content"

export default async function ContributorLogin() {
  const { user } = await getSession()

  if (!user) {
    return redirect("/login")
  }

  if (user.role === "pending") {
    return redirect("/contribute/waitlist")
  }

  if (user.role === "admin") {
    return redirect("/admin")
  }

  return <ContributorLoginPage />
}
