import { LLMWithRelations } from "@/app/api/search/types"
import { MetaFieldRow } from "@/app/submit/components/MetaField"
import { MetaField } from "@/app/submit/content"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Flex from "@/components/ui/flex"
import Text from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"
import { MetaPropertyType } from "@prisma/client"
import { DialogClose } from "@radix-ui/react-dialog"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { styled } from "react-tailwind-variants"
import requestAddField, { RequestAddResult } from "./actions/request-add"

export default function RequestAddDialog({
  llm,
  refetch,
}: {
  llm: Omit<LLMWithRelations, "fields">
  refetch: () => void
}) {
  const [open, setOpen] = useState(false)
  const [sourceDescription, setSourceDescription] = useState("")
  const [metaField, setMetaField] = useState<MetaField>({
    property: null,
    id: Math.random(),
    type: MetaPropertyType.Number,
    name: "",
    value: "",
  })

  const reset = () => {
    setOpen(false)
    setSourceDescription("")
    setMetaField({
      property: null,
      id: Math.random(),
      type: MetaPropertyType.Number,
      name: "",
      value: "",
    })
  }

  const handleRequestAddField = async () => {
    let res: RequestAddResult

    if (metaField.property) {
      res = await requestAddField({
        llmId: llm.id,
        metaPropertyId: metaField.property.id,
        value: String(metaField.value),
        note: metaField.note,
        sourceDescription,
      })
    } else {
      res = await requestAddField({
        llmId: llm.id,
        name: metaField.name,
        value: String(metaField.value),
        type: metaField.type,
        note: metaField.note,
        sourceDescription,
      })
    }

    if (!res.success) {
      alert(res.message)

      return
    }

    refetch()
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AddFieldButton>
          <PlusIcon className="w-4 h-4" />
          <Text color="dimmer">Add a Field</Text>
        </AddFieldButton>
      </DialogTrigger>
      <DialogContent>
        <Flex col gap={1}>
          <Text size="lg" weight="medium">
            Request to add a field
          </Text>
          <Text color="dimmer" multiline>
            If a metadata field is missing, you can request to add one
          </Text>
        </Flex>
        <Flex col>
          <MetaFieldRow
            field={metaField}
            metadata={[]}
            onChange={args => {
              console.log(args)
              setMetaField(f => ({ ...f, ...args }))
            }}
          />
        </Flex>
        <Flex col gap={1}>
          <Text weight="medium">Source Description</Text>
          <Text color="dimmer" size="xs">
            Provide one or more sources that include the additonal field
          </Text>
          <Textarea
            value={sourceDescription}
            onChange={e => setSourceDescription(e.target.value)}
            placeholder="Additional benchmark is included in research paper https://..."
          />
        </Flex>
        <Flex gap={2} align="center" justify="end">
          <DialogClose>
            <Button>Cancel</Button>
          </DialogClose>
          <Button variant="highlightElevated" onClick={handleRequestAddField}>
            Submit
          </Button>
        </Flex>
      </DialogContent>
    </Dialog>
  )
}

const AddFieldButton = styled("button", {
  base: "flex w-full items-center justify-center text-foreground-dimmer hover:bg-higher gap-2 p-2",
})
