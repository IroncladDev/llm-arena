import Text from "@/components/ui/text"
import { abbrNumber } from "@/lib/numbers"
import { Field, MetaProperty, MetaPropertyType } from "@prisma/client"
import { styled } from "react-tailwind-variants"

export default function FieldTable({
  fields,
  capLength
}: {
  fields: Array<Field & { metaProperty: MetaProperty }>
  capLength?: number
}) {
  return (
    <TableContainer>
      {fields.slice(0, capLength).map((field, i) => (
        <TableRow key={i}>
          <TableCell>
            <TableCellContent>
              <Text weight="medium">{field.metaProperty.name}</Text>
              {field.note && (
                <Text size="xs" color="dimmest">
                  {field.note}
                </Text>
              )}
            </TableCellContent>
          </TableCell>
          <TableCell>
            <TableCellContent>
              <Text color="dimmer">
                {field.metaProperty.type === MetaPropertyType.Number
                  ? abbrNumber(Number(field.value))
                  : field.value}
              </Text>
            </TableCellContent>
          </TableCell>
        </TableRow>
      ))}
      {typeof capLength === "number" && fields.length > capLength ? (
        <TableRow>
          <TableCell className="col-span-2 text-center">
            <Text>{fields.length - capLength} more</Text>
          </TableCell>
        </TableRow>
      ) : null}
    </TableContainer>
  )
}

const TableContainer = styled("div", {
  base: "table border border-outline-dimmer"
})

const TableRow = styled("div", {
  base: "table-row"
})

const TableCell = styled("div", {
  base: "table-cell h-10 last:w-full border border-outline-dimmer align-middle"
})

const TableCellContent = styled("div", {
  base: "flex flex-col h-10 px-2 justify-center"
})
