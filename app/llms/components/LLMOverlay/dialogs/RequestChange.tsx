import { LLMWithRelations } from "@/app/api/search/types"
import { MetaFieldRow } from "@/app/submit/components/MetaField"
import { MetaField } from "@/app/submit/content"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Flex from "@/components/ui/flex"
import Text from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { FieldWithMeta } from "../Fields"
import requestChangeField from "./actions/request-change"

export default function RequestChangeDialog({
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
  const [metaField, setMetaField] = useState<MetaField | null>(null)

  const reset = () => {
    setSourceDescription("")
    setMetaField(null)
    setField(null)
  }

  const handleRequestChange = async () => {
    if (!metaField || !field) return

    console.log(metaField)

    const res = await requestChangeField({
      llmId: llm.id,
      fieldId: field.id,
      value: metaField.value ? String(metaField.value) : null,
      note: metaField.note ?? null,
      sourceDescription,
    })

    if (!res.success) {
      alert(res.message)

      return
    }

    refetch()
    reset()
  }

  useEffect(() => {
    if (field)
      setMetaField({
        id: field.id,
        value: String(field.value),
        type: field.metaProperty.type,
        name: field.metaProperty.name,
        note: field.note || undefined,
      })
  }, [field])

  return (
    <Dialog open={Boolean(field)} onOpenChange={() => setField(null)}>
      <DialogContent>
        <Flex col gap={1}>
          <Text size="lg" weight="medium">
            Request Changes
          </Text>
          <Text color="dimmer" multiline>
            Request to change the value of a potentially inaccurate metadata
            field
          </Text>
        </Flex>
        <Flex col>
          {metaField && (
            <MetaFieldRow
              field={metaField}
              metadata={[]}
              onChange={f =>
                setMetaField({
                  ...metaField,
                  ...f,
                  ...(typeof f.value !== "undefined" ? { value: f.value } : {}),
                })
              }
              canChangeName={false}
              canChangeType={false}
            />
          )}
        </Flex>
        <Flex col gap={1}>
          <Text weight="medium">Source Description</Text>
          <Text color="dimmer" size="xs">
            Provide one or more sources that include the correct value of this
            field
          </Text>
          <Textarea
            value={sourceDescription}
            onChange={e => setSourceDescription(e.target.value)}
            placeholder="The field's value is incorrect according to https://..."
          />
        </Flex>
        <Flex row justify="end" align="center" gap={2}>
          <Button onClick={() => setField(null)}>Cancel</Button>
          <Button variant="highlightElevated" onClick={handleRequestChange}>
            Submit
          </Button>
        </Flex>
      </DialogContent>
    </Dialog>
  )
}
