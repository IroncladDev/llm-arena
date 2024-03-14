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
    <Table.Container>
      {fields.slice(0, capLength).map((field, i) => (
        <Table.Row key={i}>
          <Table.Cell>
            <Table.CellContent>
              <Text weight="medium" color="dimmer" size="sm">
                {field.metaProperty.name}
              </Text>
              {field.note && (
                <Text size="xs" color="dimmest">
                  {field.note}
                </Text>
              )}
            </Table.CellContent>
          </Table.Cell>
          <Table.Cell>
            <Table.CellContent>
              <Text weight="medium" color="dimmer">
                {field.metaProperty.type}
              </Text>
            </Table.CellContent>
          </Table.Cell>
          <Table.Cell>
            <Table.CellContent>
              <Text color="dimmer" multiline>
                {field.metaProperty.type === MetaPropertyType.Number
                  ? abbrNumber(Number(field.value))
                  : field.value}
              </Text>
            </Table.CellContent>
          </Table.Cell>
        </Table.Row>
      ))}
      {typeof capLength === "number" && fields.length > capLength ? (
        <Table.Row>
          <Table.Cell className="col-span-2 text-center">
            <Text>{fields.length - capLength} more</Text>
          </Table.Cell>
        </Table.Row>
      ) : null}
    </Table.Container>
  )
}

const Table = {
  Container: styled("div", {
    base: "table border border-outline-dimmer w-full max-w-[640px]"
  }),
  Row: styled("div", {
    base: "table-row"
  }),
  Cell: styled("div", {
    base: "table-cell min-h-10 first:max-w-[200px] last:w-full border border-outline-dimmer align-middle"
  }),
  CellContent: styled("div", {
    base: "flex flex-col h-full min-h-10 px-2 justify-center"
  })
}
