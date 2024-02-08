import { getSession } from "@/lib/server/utils/session";
import { notFound, redirect } from "next/navigation";
import LLMsPage from "./content";

export default async function LLMs() {
  const { user } = await getSession();

  if (!user) {
    return redirect("/login");
  }

  if (user.role !== "admin" && user.role !== "contributor") {
    return notFound();
  }

  return <LLMsPage />;
}
