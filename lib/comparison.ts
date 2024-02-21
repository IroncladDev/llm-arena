import { LLMWithMetadata } from "@/app/compare/state"
import { MetaPropertyType } from "@prisma/client"

/**
 * Converts an array of LLMs with metadata to a comparable format grouped by field name
 */
export function toMutualMetadata(
  llms: LLMWithMetadata[]
): Array<ComparableFieldGroup> {
  // Create a map of each field name and all its values
  const fieldsMap = new Map<string, Array<[string, ValuesValue]>>()

  llms.forEach(llm => {
    llm.fields.forEach(({ value, metaProperty, note }) => {
      let llmValuesMap: Array<[string, ValuesValue]>

      // Populate llmValuesMap with null or existing values
      if (fieldsMap.has(metaProperty.name)) {
        llmValuesMap = fieldsMap.get(metaProperty.name)!
      } else {
        llmValuesMap = []
        llms.forEach(innerLlm => {
          llmValuesMap.push([
            innerLlm.name,
            {
              value: null,
              type: metaProperty.type
            }
          ])
        })

        fieldsMap.set(metaProperty.name, llmValuesMap)
      }

      // Typed value
      const fieldValue =
        metaProperty.type === MetaPropertyType.Number
          ? Number(value)
          : metaProperty.type === MetaPropertyType.Boolean
            ? value.toLowerCase() === "true"
            : String(value)

      const nullSlot = llmValuesMap.findIndex(
        ([name, { value }]) => name === llm.name && value === null
      )

      // If a null slot for the field name exists, populate it. Otherwise, add a new one
      if (nullSlot !== -1) {
        llmValuesMap[nullSlot] = [
          llm.name,
          {
            value: fieldValue,
            note: note || undefined,
            type: metaProperty.type
          }
        ]
      } else {
        llmValuesMap.push([
          llm.name,
          {
            value: fieldValue,
            note: note || undefined,
            type: metaProperty.type
          }
        ])
      }
    })
  })

  // Sort fields by non-null count
  const sortedFields: Array<ComparableFieldGroup> = Array.from(fieldsMap)
    .map(([name, values]) => {
      const valuesArray = Array.from(values).sort(([, a], [, b]) =>
        a.value !== null && b.value === null
          ? -1
          : a.value === null && b.value !== null
            ? 1
            : 0
      )
      const nonNullCount = valuesArray.filter(
        ([, v]) => v.value !== null
      ).length

      return {
        name,
        values: valuesArray,
        nonNullCount,
        type: valuesArray[0][1].type
      }
    })
    .sort(
      (a, b) => b.nonNullCount - a.nonNullCount
    ) as Array<ComparableFieldGroup>

  return sortedFields
}

export type ComparableFieldGroup =
  | {
      name: string
      nonNullCount: number
      type: typeof MetaPropertyType.String
      values: [string, ValuesValue<string>][]
    }
  | {
      name: string
      nonNullCount: number
      type: typeof MetaPropertyType.Number
      values: [string, ValuesValue<number>][]
    }
  | {
      name: string
      nonNullCount: number
      type: typeof MetaPropertyType.Boolean
      values: [string, ValuesValue<boolean>][]
    }

type ValuesValue<
  T extends string | number | boolean = string | number | boolean
> = {
  value: T | null
  note?: string
  type: MetaPropertyType
}
