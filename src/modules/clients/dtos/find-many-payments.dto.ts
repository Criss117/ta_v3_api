import { z } from "zod";
import { limit } from "@/modules/shared/dtos/search.dto";
import { baseCursorDto } from "@/modules/shared/dtos/cursor.dto";
import { clientId } from "./value-objects";

export const findManyPaymentsDto = z.object({
  cursor: baseCursorDto,
  limit: limit,
  clientId: clientId,
});

export type FindManyPaymentsDto = z.infer<typeof findManyPaymentsDto>;
