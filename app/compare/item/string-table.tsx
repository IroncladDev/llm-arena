import Text from "@/components/ui/text"
import { ComparableFieldGroup } from "@/lib/comparison"
import { FieldSort, FilterType } from "../state"
import { TableCell, TableCellContent, TableContainer, TableRow } from "./tables"

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
  ).toSorted((a, b) => {
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
    <TableContainer>
      {fields.map(([key, { value, note }], i) => (
        <TableRow key={i}>
          <TableCell>
            <TableCellContent>
              <Text color="dimmer">{key}</Text>
              {note && (
                <Text size="xs" color="dimmest">
                  {note}
                </Text>
              )}
            </TableCellContent>
          </TableCell>
          <TableCell
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
          </TableCell>
        </TableRow>
      ))}
    </TableContainer>
  )
}
