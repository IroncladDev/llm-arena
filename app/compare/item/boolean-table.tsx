import Text from "@/components/ui/text"
import { ComparableFieldGroup } from "@/lib/comparison"
import { CheckIcon, XIcon } from "lucide-react"
import { FieldSort, FilterType } from "../state"
import Table from "./tables"

export default function BooleanTable({
  field,
  filter,
  sort
}: {
  field: ComparableFieldGroup
  filter: Array<FilterType>
  sort: FieldSort
}) {
  const fields = (
    filter.includes("nullFields")
      ? field.values
      : field.values.filter(([, v]) => v.value !== null)
  ).sort((a, b) => {
    switch (sort) {
      case "value-asc":
        return a[1] && !b[1] ? 1 : !a[1] && b[1] ? -1 : 0
      case "value-desc":
        return a[1] && !b[1] ? -1 : !a[1] && b[1] ? 1 : 0
      case "alpha-asc":
        return a[0].localeCompare(b[0])
      case "alpha-desc":
        return b[0].localeCompare(a[0])
      default:
        return 0
    }
  })

  return (
    <Table.Container>
      {fields.map(([key, { value, note }], i) => (
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
            {value === null ? (
              <Text color="dimmest" size="xs" className="opacity-50">
                N/A
              </Text>
            ) : value ? (
              <CheckIcon className="w-4 h-4 text-accent-dimmer" />
            ) : (
              <XIcon className="w-4 h-4 text-foreground-dimmer" />
            )}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Container>
  )
}
