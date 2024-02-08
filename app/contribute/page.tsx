import { getSession } from "@/lib/server/utils/session";
import { redirect } from "next/navigation";
import Contribute from "./content";

export default async function Page() {
  const { user } = await getSession();

  if (!user) {
    return redirect("/login");
  }

  if (user.role === "contributor" || user.role === "admin") {
    return redirect("/submit");
  }

  if (user.role === "pending") {
    return redirect("/compare");
  }

  return <Contribute />;
}
