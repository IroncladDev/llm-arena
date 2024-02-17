import { Skeleton } from "@/components/ui/skeleton"
import { ContentContainer } from "."
import Header from "./Header"

export default function Loading() {
  return (
    <ContentContainer>
      <Header>
        <Skeleton className="grow h-4" />
      </Header>
    </ContentContainer>
  )
}
