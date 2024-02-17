import { Field, LLM, MetaProperty } from "@prisma/client"
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
  showNullFields: boolean
  sort: FieldSort
}

export const optionsAtom = atom<ControlOptions>({
  view: "grid",
  showNullFields: true,
  sort: "default"
})
