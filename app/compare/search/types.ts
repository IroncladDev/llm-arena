import { z } from "zod"

export const searchInput = z.object({
  query: z.string()
})

export type SearchInput = z.infer<typeof searchInput>
