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
            Object.values(FilterEnum).includes(option as FilterEnum),
          )
        )
      },
      { message: "Invalid filter option" },
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
        message: "Invalid ommitted field",
      },
    )
    .optional(),
  mode: z.nativeEnum(ModeEnum).optional(),
  padding: z.string().optional(),
  spacing: z.string().optional(),
  width: z.string().optional(),
})

export type OptionsType = z.infer<typeof optionsSchema>
