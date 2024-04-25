import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Text from "@/components/ui/text"
import { abbrNumber } from "@/lib/numbers"
import {
  ChangeRequestType,
  Field,
  MetaProperty,
  MetaPropertyType,
} from "@prisma/client"
import { GitPullRequestIcon, MoreVerticalIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { styled } from "react-tailwind-variants"
import { OverlayLLM } from "."
import RequestAddDialog from "./dialogs/RequestAdd"
import RequestChangeDialog from "./dialogs/RequestChange"
import RequestDeletionDialog from "./dialogs/RequestDeletion"

export type FieldWithMeta = Field & { metaProperty: MetaProperty }

export default function Fields({
  llm: { fields, ...llm },
  refetch,
}: {
  llm: OverlayLLM
  refetch: () => void
}) {
  const [fieldToChange, setFieldToChange] = useState<FieldWithMeta | null>(null)
  const [fieldToDelete, setFieldToDelete] = useState<FieldWithMeta | null>(null)

  return (
    <Wrapper>
      <Table.Container>
        {fields.map((field, i) => (
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
              <Table.CellContent className="relative">
                <Text color="dimmer" multiline>
                  {field.metaProperty.type === MetaPropertyType.Number
                    ? abbrNumber(Number(field.value))
                    : field.value}
                </Text>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <OptionsButton>
                      <MoreVerticalIcon className="w-4 h-4" />
                    </OptionsButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="pl-2 flex gap-2 items-center"
                      onSelect={() => setFieldToChange(field)}
                    >
                      <GitPullRequestIcon className="w-4 h-4" />
                      Request Changes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="pl-2 flex gap-2 items-center"
                      onSelect={() => setFieldToDelete(field)}
                    >
                      <TrashIcon className="w-4 h-4" />
                      Request Deletion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Table.CellContent>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Container>
      <RequestAddDialog llm={llm} refetch={refetch} />
      <RequestChangeDialog
        field={fieldToChange}
        setField={setFieldToChange}
        llm={llm}
        refetch={refetch}
      />
      <RequestDeletionDialog
        llm={llm}
        refetch={refetch}
        field={fieldToDelete}
        setField={setFieldToDelete}
      />
    </Wrapper>
  )
}

const { Wrapper, OptionsButton, ...Table } = {
  Wrapper: styled("div", {
    base: "flex flex-col",
  }),
  Container: styled("div", {
    base: "table border w-full max-w-[640px] border-outline-dimmer",
  }),
  Row: styled("div", {
    base: "table-row group",
  }),
  Cell: styled("div", {
    base: "table-cell min-h-10 first:max-w-[200px] last:w-full border align-middle",
    variants: {
      variant: {
        [ChangeRequestType.delete]: "border-accent/30 bg-accent-dimmer/15",
        [ChangeRequestType.add]: "bg-emerald-700/15 border-emerald-500/30",
        default: "border-outline-dimmer",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }),
  CellContent: styled("div", {
    base: "flex flex-col h-full min-h-10 px-2 justify-center",
  }),
  OptionsButton: styled("button", {
    base: "absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center px-1 opacity-0 group/item group-hover:opacity-100 transition-opacity",
  }),
}

export { Table }
