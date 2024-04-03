import { Skeleton } from "@/components/ui/skeleton"
import Header from "./Header"
import Flex from "@/components/ui/flex"

export default function Loading() {
  return (
    <Flex col gap={4} height="auto">
      <Header>
        <Skeleton className="grow h-4" />
      </Header>
    </Flex>
  )
}
