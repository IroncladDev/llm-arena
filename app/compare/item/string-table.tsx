import Text from "@/components/ui/text"
import { ComparableFieldGroup } from "@/lib/comparison"
import { FieldSort, FilterType } from "../state"
import Table from "./tables"

export default function StringTable({
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
        return String(a[1]).localeCompare(String(b[1]))
      case "value-desc":
        return String(b[1]).localeCompare(String(a[1]))
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
          <Table.Cell
            className={`leading-none border-b border-outline-dimmest ${i === fields.length - 1 ? "border-b-0" : ""}`}
            style={{ borderBottomStyle: "dashed" }}
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
