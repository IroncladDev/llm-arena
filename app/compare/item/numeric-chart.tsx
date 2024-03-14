import Text from "@/components/ui/text"
import { ComparableFieldGroup } from "@/lib/comparison"
import { abbrNumber } from "@/lib/numbers"
import { styled } from "react-tailwind-variants"
import { FieldSort, FilterType } from "../state"
import Table from "./tables"

export default function NumericChart({
  field,
  filter,
  sort
}: {
  field: ComparableFieldGroup
  filter: Array<FilterType>
  sort: FieldSort
}) {
  const rows = (
    filter.includes("nullFields")
      ? field.values
      : field.values.filter(([, v]) => v.value !== null)
  ).sort((a, b) => {
    switch (sort) {
      case "value-asc":
        return Number(a[1]) - Number(b[1])
      case "value-desc":
        return Number(b[1]) - Number(a[1])
      case "alpha-asc":
        return a[0].localeCompare(b[0])
      case "alpha-desc":
        return b[0].localeCompare(a[0])
      default:
        return 0
    }
  })

  const greatestValue = Math.max(...rows.map(([, { value }]) => Number(value)))

  return (
    <Table.Container>
      {rows.map(([key, { value, note }], i) => (
        <Table.Row key={i}>
          <Table.Cell>
            <Table.CellContent>
              <Text color="dimmer">{key}</Text>
              {note && (
                <Text size="xs" color="dimmest">
                  {note}
                </Text>
              )}
            </Table.CellContent>
          </Table.Cell>
          <Table.Cell>
            <BarContainer>
              <Bar
                key={i}
                style={{
                  width: value ? `${(Number(value) / greatestValue) * 100}%` : 8
                }}
                isNullValue={value === null}
              />
              <Text
                size="xs"
                color="dimmest"
                multiline
                className={value === null ? "opacity-50" : undefined}
              >
                {value === null ? "N/A" : abbrNumber(value as number)}
              </Text>
            </BarContainer>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Container>
  )
}

const { Bar, BarContainer } = {
  Bar: styled("div", {
    base: "h-6 rounded-r-lg my-0.5",
    variants: {
      isNullValue: {
        true: "bg-gradient-to-r from-higher/0 to-higher border-2 border-l-0 border-outline-dimmer rounded-r-md",
        false:
          "bg-gradient-to-r from-accent-dimmest/0 to-accent-dimmest border-accent-dimmer border-2 border-l-0"
      }
    }
  }),
  BarContainer: styled("div", {
    base: "flex gap-2 items-center w-full absolute top-1/2 transform -translate-y-1/2"
  })
}
