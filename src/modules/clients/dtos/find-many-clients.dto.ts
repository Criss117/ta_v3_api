import { z } from "zod";
import { clientsCursorDto } from "./clients-cursor.dto";
import { limit, searchQuery } from "@/modules/shared/dtos/search.dto";

export const findManyClientsDto = z.object({
  cursor: clientsCursorDto,
  limit: limit,
  searchQuery: searchQuery,
});

export type FindManyClientsDto = z.infer<typeof findManyClientsDto>;
