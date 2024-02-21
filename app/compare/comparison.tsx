import { Button } from "@/components/ui/button"
import Text from "@/components/ui/text"
import { toMutualMetadata } from "@/lib/comparison"
import { MetaPropertyType } from "@prisma/client"
import { styled } from "react-tailwind-variants"
import Controls from "./controls"
import CompareItem from "./item"
import { useCompareState } from "./state"

export default function Comparison() {
  const { view, filter, llms, setSidebar } = useCompareState(
    ({ view, filter, llms, setSidebar }) => ({ view, filter, llms, setSidebar })
  )

  const items = toMutualMetadata(llms)
    .filter(l => (filter.includes("standalone") ? true : l.nonNullCount > 1))
    .filter(l =>
      filter.includes(MetaPropertyType.Number)
        ? true
        : l.type !== MetaPropertyType.Number
    )
    .filter(l =>
      filter.includes(MetaPropertyType.String)
        ? true
        : l.type !== MetaPropertyType.String
    )
    .filter(l =>
      filter.includes(MetaPropertyType.Boolean)
        ? true
        : l.type !== MetaPropertyType.Boolean
    )
    .filter(l => (filter.includes("nullFields") ? true : l.nonNullCount > 0))

  return (
    <Container>
      <Controls />
      <ContainerOverflow>
        {llms.length > 1 ? (
          <ItemsContainer view={view}>
            {items.map((x, i) => (
              <CompareItem key={i} field={x} />
            ))}
          </ItemsContainer>
        ) : (
          <EmptyStateContainer>
            <Text size="lg" weight="medium" className="text-center">
              Compare LLMs
            </Text>
            <Text color="dimmer" multiline>
              Select two or more LLMs in the sidebar to compare them
            </Text>
            <Button
              asChild
              onClick={() => {
                setSidebar(true)
              }}
            >
              <label htmlFor="llm-sidebar-search">Show me</label>
            </Button>
          </EmptyStateContainer>
        )}
      </ContainerOverflow>
    </Container>
  )
}

const EmptyStateContainer = styled("div", {
  base: "flex flex-col gap-4 p-6 bg-root/50 rounded-lg border-2 border-outline-dimmest/50 min-w-[320px] w-full max-w-[360px] shadow-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
})
const Container = styled("div", {
  base: "grow h-full flex flex-col relative"
})
const ContainerOverflow = styled("div", {
  base: "grow h-full relative"
})

const ItemsContainer = styled("div", {
  base: "flex flex-col absolute top-0 left-0 right-0 max-h-[100%] overflow-y-auto overflow-x-hidden gap-4 p-8 max-sm:p-2 max-sm:gap-2",
  variants: {
    view: {
      grid: "grid grid-cols-[repeat(auto-fit,_minmax(360px,_1fr))] justify-center justify-items-center",
      list: "flex flex-col gap-4 p-4"
    }
  }
})
