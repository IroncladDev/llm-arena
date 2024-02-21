import { LLMWithMetadata } from "@/app/compare/state"
import { MetaPropertyType } from "@prisma/client"

export type ComparableField =
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

export function toMutualMetadata(
  llms: LLMWithMetadata[]
): Array<ComparableField> {
  const fieldsMap = new Map<string, Array<[string, ValuesValue]>>()

  llms.forEach(llm => {
    llm.fields.forEach(({ value, metaProperty, note }) => {
      let llmValuesMap: Array<[string, ValuesValue]>

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

      const fieldValue =
        metaProperty.type === MetaPropertyType.Number
          ? Number(value)
          : metaProperty.type === MetaPropertyType.Boolean
            ? value.toLowerCase() === "true"
            : String(value)

      const nullSlot = llmValuesMap.findIndex(
        ([name, { value }]) => name === llm.name && value === null
      )

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

  const sortedFields: Array<ComparableField> = Array.from(fieldsMap)
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
    .sort((a, b) => b.nonNullCount - a.nonNullCount) as Array<ComparableField>

  return sortedFields
}
