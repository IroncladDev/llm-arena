import { Field, LLM, MetaProperty, MetaPropertyType } from "@prisma/client"
import { atom } from "jotai"

export type LLMWithMetadata = LLM & {
  fields: Array<Field & { metaProperty: MetaProperty }>
}

export const llmsAtom = atom<LLMWithMetadata[]>([])
export const sidebarAtom = atom<boolean>(false)

export type FieldSort =
  | "alpha-asc"
  | "alpha-desc"
  | "value-asc"
  | "value-desc"
  | "default"

export interface ControlOptions {
  view: "grid" | "list"
  sort: FieldSort
  filter: Array<FilterType>
}

export const filterOptions = {
  [MetaPropertyType.Number]: "Numeric fields",
  [MetaPropertyType.String]: "String fields",
  [MetaPropertyType.Boolean]: "Boolean fields",
  nullFields: "Null fields",
  standalone: "Standalone fields"
}

export type FilterType = keyof typeof filterOptions

export const optionsAtom = atom<ControlOptions>({
  view: "grid",
  sort: "default",
  filter: [
    MetaPropertyType.String,
    MetaPropertyType.Number,
    MetaPropertyType.Boolean,
    "nullFields"
  ]
})
