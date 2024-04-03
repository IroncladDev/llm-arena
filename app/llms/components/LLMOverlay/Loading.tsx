import Flex from "@/components/ui/flex"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "./Header"

export default function Loading() {
  return (
    <Flex col gap={4} height="auto">
      <Header>
        <Skeleton className="grow h-4" />
      </Header>
    </Flex>
  )
}
