"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { OptionsType } from "./state"
import { FilterEnum, ModeEnum, ThemeEnum, ViewEnum } from "./types"

export function useURLState() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const {
    llms,
    theme = ThemeEnum.crimson,
    view = ViewEnum.grid,
    filter = [
      FilterEnum.number,
      FilterEnum.string,
      FilterEnum.boolean,
      FilterEnum.nullFields,
    ].join(","),
    mode = ModeEnum.view,
    padding = "24",
    spacing = "16",
    width = "1600",
    omit,
    hideHeader = "false",
  }: OptionsType = Object.fromEntries(
    searchParams.entries(),
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
      fts.length > 0 ? fts.filter(x => !!FilterEnum[x]).join(",") : "",
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
      omtd.length > 0 ? omtd.filter(x => x.length > 0).join(",") : "",
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
    hideHeader: hideHeader !== "false",
    padding: Number(padding),
    spacing: Number(spacing),
    width: Number(width),
  }
}
