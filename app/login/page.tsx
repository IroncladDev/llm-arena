import { getSession } from "@/lib/server/utils/session"
import { redirect } from "next/navigation"
import LoginPage from "./content"

export default async function Login() {
  const { user } = await getSession()

  if (user?.role === "contributor") {
    return redirect("/llms")
  }

  if (user?.role === "admin") {
    return redirect("/admin")
  }

  if (user?.role === "pending") {
    return redirect("/contribute/waitlist")
  }

  if (user?.role === "user") {
    return redirect("/contribute/join")
  }

  return <LoginPage />
}
