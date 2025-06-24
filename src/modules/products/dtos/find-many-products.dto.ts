import { baseCursorDto } from "@/modules/shared/dtos/cursor.dto";
import { limit, searchQuery } from "@/modules/shared/dtos/search.dto";
import { z } from "zod";

export const findManyProductsDto = z.object({
  limit: limit,
  searchQuery: searchQuery,
  cursor: baseCursorDto,
});

export type FindManyProductsDto = z.infer<typeof findManyProductsDto>;
