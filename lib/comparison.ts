import { LLMWithMetadata } from "@/app/compare/state"
import { MetaPropertyType } from "@prisma/client"

export type ComparableField =
  | {
      name: string
      nonNullCount: number
      type: typeof MetaPropertyType.String
      values: [string, string | null][]
    }
  | {
      name: string
      nonNullCount: number
      type: typeof MetaPropertyType.Number
      values: [string, number | null][]
    }
  | {
      name: string
      nonNullCount: number
      type: typeof MetaPropertyType.Boolean
      values: [string, boolean | null][]
    }

export function toMutualMetadata(
  llms: LLMWithMetadata[]
): Array<ComparableField> {
  const fieldsMap = new Map<
    string,
    Map<string, string | number | boolean | null>
  >()

  llms.forEach(llm => {
    llm.fields.forEach(({ value, metaProperty }) => {
      let llmValuesMap: Map<string, string | number | boolean | null>

      if (fieldsMap.has(metaProperty.name)) {
        llmValuesMap = fieldsMap.get(metaProperty.name)!
      } else {
        llmValuesMap = new Map<string, string | number | boolean | null>()
        llms.forEach(innerLlm => llmValuesMap.set(innerLlm.name, null))

        fieldsMap.set(metaProperty.name, llmValuesMap)
      }

      llmValuesMap.set(
        llm.name,
        metaProperty.type === MetaPropertyType.Number
          ? Number(value)
          : metaProperty.type === MetaPropertyType.Boolean
            ? value.toLowerCase() === "true"
            : String(value)
      )
    })
  })

  const sortedFields: Array<ComparableField> = Array.from(fieldsMap)
    .map(([name, values]) => {
      const valuesArray = Array.from(values).sort(([, a], [, b]) =>
        a !== null && b === null ? -1 : a === null && b !== null ? 1 : 0
      )
      const nonNullCount = valuesArray.filter(([, v]) => v !== null).length

      return {
        name,
        values: valuesArray,
        nonNullCount,
        type:
          typeof valuesArray[0][1] === "number"
            ? MetaPropertyType.Number
            : typeof valuesArray[0][1] === "boolean"
              ? MetaPropertyType.Boolean
              : MetaPropertyType.String
      }
    })
    .sort((a, b) => b.nonNullCount - a.nonNullCount) as Array<ComparableField>

  return sortedFields
}
