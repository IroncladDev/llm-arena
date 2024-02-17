import { styled } from "react-tailwind-variants"

const OverflowContainer = styled("div", {
  base: "grow relative"
})

const OverflowContent = styled("div", {
  base: "absolute inset-0 flex flex-col overflow-y-auto"
})

export default function OverflowScroll(
  props: React.ComponentProps<typeof OverflowContent>
) {
  return (
    <OverflowContainer>
      <OverflowContent {...props} />
    </OverflowContainer>
  )
}
