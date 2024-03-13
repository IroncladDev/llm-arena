import { Field, LLM, MetaProperty, MetaPropertyType } from "@prisma/client"
import { create } from "zustand"

export const useCompareState = create<ControlOptions>(set => ({
  view: "list",
  sort: "default",
  filter: [
    MetaPropertyType.String,
    MetaPropertyType.Number,
    MetaPropertyType.Boolean,
    "nullFields"
  ],
  llms: [],
  sidebar: false,
  setView: (view: ControlOptions["view"]) => set({ view }),
  setSort: (sort: FieldSort) => set({ sort }),
  setFilter: (filter: FilterType[]) => set({ filter }),
  setSidebar: (sidebar: boolean) => set({ sidebar }),
  setLLMs: (llms: LLMWithMetadata[]) => set({ llms }),
  setFilterValue: (value: FilterType, enabled: boolean) => {
    set(state => {
      const filter = enabled
        ? [...state.filter, value]
        : state.filter.filter(f => f !== value)

      return { filter }
    })
  }
}))

export type LLMWithMetadata = LLM & {
  fields: Array<Field & { metaProperty: MetaProperty }>
}

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
  llms: LLMWithMetadata[]
  sidebar: boolean
  setView: (view: ControlOptions["view"]) => void
  setSort: (sort: FieldSort) => void
  setFilter: (filter: FilterType[]) => void
  setFilterValue: (value: FilterType, enabled: boolean) => void
  setSidebar: (sidebar: boolean) => void
  setLLMs: (llms: LLMWithMetadata[]) => void
}

export const filterOptions = {
  [MetaPropertyType.Number]: "Numeric fields",
  [MetaPropertyType.String]: "String fields",
  [MetaPropertyType.Boolean]: "Boolean fields",
  nullFields: "Null fields",
  standalone: "Standalone fields"
}

export type FilterType = keyof typeof filterOptions
