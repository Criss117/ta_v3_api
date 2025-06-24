import { z } from "zod";

export const searchQuery = z.string().max(100).nullish();
export const limit = z.number().min(10).max(50).int();
export const searchDto = z.object({
  limit: z.number().int().positive().default(10),
  searchQuery: z.string().max(100).nullish(),
});

export type SearchDto = z.infer<typeof searchDto>;
