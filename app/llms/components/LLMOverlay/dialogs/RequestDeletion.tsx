import { LLMWithRelations } from "@/app/api/search/types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Flex from "@/components/ui/flex"
import Text from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"
import { abbrNumber } from "@/lib/numbers"
import { MetaPropertyType } from "@prisma/client"
import { Dispatch, SetStateAction, useState } from "react"
import { FieldWithMeta, Table } from "../Fields"
import requestDeleteField from "./actions/request-deletion"

export default function RequestDeletionDialog({
  field,
  setField,
  llm,
  refetch,
}: {
  field: FieldWithMeta | null
  setField: Dispatch<SetStateAction<FieldWithMeta | null>>
  llm: Omit<LLMWithRelations, "fields">
  refetch: () => void
}) {
  const [sourceDescription, setSourceDescription] = useState("")

  const reset = () => {
    setSourceDescription("")
    setField(null)
  }

  const handleRequestDeletion = async () => {
    if (!field) return

    const res = await requestDeleteField({
      fieldId: field.id,
      llmId: llm.id,
      sourceDescription,
    })

    if (!res.success) {
      alert(res.message)

      return
    }

    refetch()
    reset()
  }

  return (
    <Dialog open={Boolean(field)} onOpenChange={() => setField(null)}>
      <DialogContent>
        <Flex col gap={1}>
          <Text size="lg" weight="medium">
            Request Deletion
          </Text>
          <Text color="dimmer" multiline>
            Deletion Requests are useful for removing duplicate or nonexistant
            fields on an LLM
          </Text>
        </Flex>
        {field && (
          <Table.Container>
            <Table.Row>
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
          </Table.Container>
        )}
        <Flex col gap={1}>
          <Text asChild weight="medium">
            <label htmlFor="delete-request-reason">Source Description</label>
          </Text>
          <Text size="xs" color="dimmer" multiline className="pl-1">
            Provide one or more sources to back the reasoning of this deletion
            request
          </Text>
          <Textarea
            id="delete-request-reason"
            placeholder="Benchmark not shown on research paper https://..."
            value={sourceDescription}
            onChange={e => setSourceDescription(e.target.value)}
          />
        </Flex>
        <Flex row gap={2} align="center" justify="end">
          <Button onClick={() => setField(null)}>Cancel</Button>
          <Button variant="highlightElevated" onClick={handleRequestDeletion}>
            Request Deletion
          </Button>
        </Flex>
      </DialogContent>
    </Dialog>
  )
}
