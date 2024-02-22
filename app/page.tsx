import { getSession } from "@/lib/server/utils/session"
import Content from "./compare/content"

export default async function Home() {
  const res = await getSession()

  return <Content currentUser={res?.user} />
}
