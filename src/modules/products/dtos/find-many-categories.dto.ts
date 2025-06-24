import { baseCursorDto } from "@/modules/shared/dtos/cursor.dto";
import { limit, searchQuery } from "@/modules/shared/dtos/search.dto";
import { z } from "zod";

export const findManyCategoriesDto = z.object({
  limit: limit,
  searchQuery: searchQuery.nullish(),
  cursor: baseCursorDto,
});

export type FindManyCategoriesDto = z.infer<typeof findManyCategoriesDto>;
