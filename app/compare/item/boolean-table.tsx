import Text from "@/components/ui/text"
import { ComparableFieldGroup } from "@/lib/comparison"
import { CheckIcon, XIcon } from "lucide-react"
import { useURLState } from "../state"
import { FilterEnum, themeData } from "../types"
import Table from "./tables"

export default function BooleanTable({
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
          <Table.Cell style={{ borderColor: fg1 + "65" }}>
            {value === null ? (
              <Text color="dimmest" size="xs" className="opacity-50">
                N/A
              </Text>
            ) : value ? (
              <CheckIcon className="w-4 h-4" style={{ color: fg1 }} />
            ) : (
              <XIcon className="w-4 h-4 text-foreground-dimmest" />
            )}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Container>
  )
}
