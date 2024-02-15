import LoginPage from "./content";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/server/utils/session";

export default async function Login() {
  const { user } = await getSession();

  if (user) {
    return redirect("/llms");
  }

  return <LoginPage />;
}
