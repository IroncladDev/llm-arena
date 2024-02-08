import { Field, LLM, MetaProperty, User, Vote } from "@prisma/client";
import { z } from "zod";

export const searchInput = z.object({
  query: z.string(),
  advanced: z.boolean().default(false),
  status: z.enum(["all", "pending", "approved", "rejected"]).default("pending"),
  skip: z.number().default(0),
  limit: z.number().default(20),
  searchBy: z.object({
    name: z.boolean().default(true),
    sourceDescription: z.boolean().default(true),
    fields: z.boolean().default(true),
  }),
});

export type SearchInput = z.infer<typeof searchInput>;

export type LLMWithRelations<T = Vote> = LLM & {
  fields: Array<Field & { metaProperty: MetaProperty }>;
  votes: Array<T>;
  user: User;
};
