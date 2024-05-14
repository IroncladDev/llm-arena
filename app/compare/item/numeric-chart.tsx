import Text from "@/components/ui/text"
import useClientRect from "@/hooks/useElementSize"
import { ComparableFieldGroup } from "@/lib/comparison"
import gr from "@/lib/gradients"
import { abbrNumber } from "@/lib/numbers"
import { tokens } from "@/tailwind.config"
import { styled } from "react-tailwind-variants"
import { FilterEnum, themeData } from "../types"
import { useURLState } from "../use-url-state"
import Table from "./tables"

export default function NumericChart({
  field,
}: {
  field: ComparableFieldGroup
}) {
  const { filters } = useURLState()

  const rows = filters.includes(FilterEnum.nullFields)
    ? field.values
    : field.values.filter(([, v]) => v.value !== null)

  const greatestValue = Math.max(...rows.map(([, { value }]) => Number(value)))

  return (
    <Table.Container>
      {rows.map(([key, { value, note }], i) => (
        <RowItem
          key={i}
          keyName={key}
          value={value}
          note={note}
          greatestValue={greatestValue}
        />
      ))}
    </Table.Container>
  )
}

function RowItem({
  keyName,
  value,
  note,
  greatestValue,
}: {
  keyName: string
  value: string | number | boolean | null
  note?: string
  greatestValue: number
}) {
  const { theme } = useURLState()

  const [ref, box] = useClientRect<HTMLDivElement>()

  const {
    foreground: [fg1, fg2, fg3],
  } = themeData[theme]

  let widthPercent =
    typeof value === "number" ? (Number(value) / greatestValue) * 100 : null

  const isBarTooSmall = box ? box.width < 32 : false

  return (
    <Table.Row>
      <Table.Cell style={{ borderColor: fg1 + "75" }}>
        <Table.CellContent>
          <Text color="dimmer" size="xs">
            {keyName}
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
            style={{
              width: widthPercent + "%" ?? 8,
              background:
                value === null
                  ? "transparent"
                  : gr.linear(90, "transparent", fg2),
              borderColor:
                value === null ? tokens.colors.foreground.dimmest + "9f" : fg1,
              color: fg3,
            }}
            ref={ref}
          >
            {value === null || isBarTooSmall
              ? undefined
              : abbrNumber(value as number)}
          </Bar>
          {value === null ? (
            <Text color="dimmer" size="xs" multiline className="opacity-50">
              N/A
            </Text>
          ) : isBarTooSmall ? (
            <Text style={{ color: fg3 }} size="xs">
              {abbrNumber(value as number)}
            </Text>
          ) : null}
        </BarContainer>
      </Table.Cell>
    </Table.Row>
  )
}

const { Bar, BarContainer } = {
  Bar: styled("div", {
    base: "h-5 rounded-r-md my-0.5 border-2 border-l-0 text-right text-xs pr-1 align-middle",
  }),
  BarContainer: styled("div", {
    base: "flex gap-2 items-center w-full absolute top-1/2 transform -translate-y-1/2",
  }),
}
