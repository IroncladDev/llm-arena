import Text from "@/components/ui/text"
import { ComparableFieldGroup } from "@/lib/comparison"
import gr from "@/lib/gradients"
import { abbrNumber } from "@/lib/numbers"
import { tokens } from "@/tailwind.config"
import { styled } from "react-tailwind-variants"
import { useURLState } from "../state"
import { FilterEnum, themeData } from "../types"
import Table from "./tables"

export default function NumericChart({
  field
}: {
  field: ComparableFieldGroup
}) {
  const { theme, filters } = useURLState()

  const {
    foreground: [fg1, fg2]
  } = themeData[theme]

  const rows = filters.includes(FilterEnum.nullFields)
    ? field.values
    : field.values.filter(([, v]) => v.value !== null)

  const greatestValue = Math.max(...rows.map(([, { value }]) => Number(value)))

  return (
    <Table.Container>
      {rows.map(([key, { value, note }], i) => (
        <Table.Row key={i}>
          <Table.Cell style={{ borderColor: fg1 + "75" }}>
            <Table.CellContent>
              <Text color="dimmer" size="xs">
                {key}
              </Text>
              <Text
                size="xxs"
                color="dimmest"
                className="absolute -bottom-[7px] left-2"
              >
                {note}
              </Text>
            </Table.CellContent>
          </Table.Cell>
          <Table.Cell style={{ borderColor: fg1 + "65" }}>
            <BarContainer>
              <Bar
                key={i}
                style={{
                  width: value
                    ? `${(Number(value) / greatestValue) * 100}%`
                    : 8,
                  background:
                    value === null
                      ? "transparent"
                      : gr.linear(90, "transparent", fg2),
                  borderColor:
                    value === null
                      ? tokens.colors.foreground.dimmest + "9f"
                      : fg1
                }}
              />
              <BarValue
                color="dimmer"
                size="xs"
                multiline
                isNullValue={value === null}
              >
                {value === null ? "N/A" : abbrNumber(value as number)}
              </BarValue>
            </BarContainer>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Container>
  )
}

const { Bar, BarContainer, BarValue } = {
  Bar: styled("div", {
    base: "h-5 rounded-r-md my-0.5 border-2 border-l-0"
  }),
  BarContainer: styled("div", {
    base: "flex gap-2 items-center w-full absolute top-1/2 transform -translate-y-1/2"
  }),
  BarValue: styled(Text, {
    variants: {
      isNullValue: {
        true: "opacity-50"
      }
    }
  })
}
