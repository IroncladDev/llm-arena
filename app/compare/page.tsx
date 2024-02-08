import { getSession } from "@/lib/server/utils/session";
import Link from "next/link";

export default async function ComparePage() {
  const { user } = await getSession();

  return (
    <div>
      {(user?.role === "admin" || user?.role === "contributor") && (
        <Link href="/submit">submit</Link>
      )}
    </div>
  );
}
