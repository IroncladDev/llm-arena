import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { FilterEnum, ModeEnum, ThemeEnum, ViewEnum } from "./types"

export const optionsSchema = z.object({
  // Comma-separated list of LLM IDs
  llms: z.string().regex(/^\d+(,\d+)*$/, "Invalid set of model IDs"),
  // Theme
  theme: z.nativeEnum(ThemeEnum).optional(),
  // List or Grid view
  view: z.nativeEnum(ViewEnum).optional(),
  // Active Filters (comma-separated)
  filter: z
    .string()
    .regex(/^([a-zA-Z]+,)*[a-zA-Z]*$/, "Invalid filter format")
    .refine(
      arg => {
        const options = arg.split(",").filter(x => x.length > 0)

        return (
          options.length === 0 ||
          options.every(option =>
            Object.values(FilterEnum).includes(option as FilterEnum)
          )
        )
      },
      { message: "Invalid filter option" }
    )
    .optional(),
  // Omit particular meta fields
  omit: z
    .string()
    .regex(/^([a-z0-9\_]+,)*[a-z0-\_]*$/, "Invalid format")
    .refine(
      arg => {
        const fields = arg.split(",").filter(x => x.length > 0)

        return fields.length === 0 || fields.every(x => /[a-z0-9\_]*/.test(x))
      },
      {
        message: "Invalid ommitted field"
      }
    )
    .optional(),
  mode: z.nativeEnum(ModeEnum).optional(),
  padding: z.string().optional(),
  spacing: z.string().optional(),
  width: z.string().optional()
})

export type OptionsType = z.infer<typeof optionsSchema>

export function useURLState() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const {
    llms,
    theme = ThemeEnum.crimson,
    view = ViewEnum.grid,
    filter = [FilterEnum.number, FilterEnum.string, FilterEnum.boolean].join(
      ","
    ),
    mode = ModeEnum.view,
    padding = "24",
    spacing = "16",
    width = "1600",
    omit
  }: OptionsType = Object.fromEntries(
    searchParams.entries()
  ) as unknown as OptionsType

  const set = (arg: Partial<OptionsType>, replace: boolean = false) => {
    const url = new URL(window.location.href)

    for (const [key, value] of Object.entries(arg)) {
      if (String(value).length > 0) url.searchParams.set(key, String(value))
      else url.searchParams.delete(key)
    }

    if (replace) {
      router.replace(url.pathname + url.search, { scroll: false })
    } else {
      router.push(url.pathname + url.search, { scroll: false })
    }
  }

  const filters: Array<FilterEnum> = (filter
    ?.split(",")
    .filter(x => x.length > 0) || []) as Array<FilterEnum>

  const ommitted: Array<string> =
    omit?.split(",").filter(x => x.length > 0) || []

  const setFilterValue = (value: FilterEnum, enabled: boolean) => {
    const url = new URL(window.location.href)

    const fts = enabled
      ? Array.from(new Set([...filters, value]))
      : filters.filter(f => f !== value)

    url.searchParams.set(
      "filter",
      fts.length > 0 ? fts.filter(x => !!FilterEnum[x]).join(",") : ""
    )

    router.push(url.pathname + url.search, { scroll: false })
  }

  const setOmmittedField = (field: string, enabled: boolean) => {
    const url = new URL(window.location.href)

    const omtd = enabled
      ? Array.from(new Set([...ommitted, field]))
      : ommitted.filter(x => x !== field)

    url.searchParams.set(
      "omit",
      omtd.length > 0 ? omtd.filter(x => x.length > 0).join(",") : ""
    )

    router.push(url.pathname + url.search, { scroll: false })
  }

  return {
    llms,
    theme,
    view,
    filter,
    mode,
    set,
    filters,
    setFilterValue,
    omit,
    ommitted,
    setOmmittedField,
    padding: Number(padding),
    spacing: Number(spacing),
    width: Number(width)
  }
}
