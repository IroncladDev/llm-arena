import { Skeleton } from "@/components/ui/skeleton"
import { styled } from "react-tailwind-variants"
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

const ContentContainer = styled("div", {
  base: "flex flex-col gap-4 h-auto"
})
