import Text from "@/components/ui/text"
import { ComparableFieldGroup } from "@/lib/comparison"
import Table from "./tables"
import { FilterEnum, themeData } from "../types"
import { useURLState } from "../state"

export default function StringTable({
  field
}: {
  field: ComparableFieldGroup
}) {
  const { theme, filters } = useURLState()

  const {
    foreground: [fg1]
  } = themeData[theme]

  const fields = filters.includes(FilterEnum.nullFields)
    ? field.values
    : field.values.filter(([, v]) => v.value !== null)

  return (
    <Table.Container>
      {fields.map(([key, { value, note }], i) => (
        <Table.Row key={i}>
          <Table.Cell style={{ borderColor: fg1 + "65" }}>
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
          <Table.Cell
            className={`leading-none border-b border-outline-dimmest ${i === fields.length - 1 ? "border-b-0" : ""}`}
            style={{ borderBottomStyle: "dashed", borderColor: fg1 + "65" }}
          >
            <Text
              color="dimmest"
              size="xs"
              multiline
              className={value === null ? "opacity-50" : undefined}
            >
              {value === null ? "N/A" : value}{" "}
            </Text>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Container>
  )
}
