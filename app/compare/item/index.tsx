import Text from "@/components/ui/text"
import { ComparableField } from "@/lib/comparison"
import { snakeToTitleCase } from "@/lib/utils"
import { MetaPropertyType } from "@prisma/client"
import { styled } from "react-tailwind-variants"
import { useCompareState } from "../state"
import BooleanTable from "./boolean-table"
import NumericChart from "./numeric-chart"
import StringTable from "./string-table"

export default function CompareItem({ field }: { field: ComparableField }) {
  const { view, filter, sort } = useCompareState()

  return (
    <Container variant={view}>
      <Text size="lg" weight="bold">
        {snakeToTitleCase(field.name)}
      </Text>
      {field.type === MetaPropertyType.String ? (
        <StringTable field={field} filter={filter} sort={sort} />
      ) : field.type === MetaPropertyType.Number ? (
        <NumericChart field={field} filter={filter} sort={sort} />
      ) : (
        <BooleanTable field={field} filter={filter} sort={sort} />
      )}
    </Container>
  )
}

const Container = styled("div", {
  base: "flex flex-col gap-4 p-6 bg-root/50 rounded-lg border-2 border-outline-dimmest/50 min-w-[360px] w-full max-w-[540px] shadow-xl",
  variants: {
    variant: {
      grid: "",
      list: "self-center"
    }
  }
})
