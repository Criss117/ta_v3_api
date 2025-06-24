import { z } from "zod";

export const baseCursorDto = z.object({
  createdAt: z.date().nullable(),
  lastId: z.number().nullable(),
});

export type BaseCursorDto = z.infer<typeof baseCursorDto>;

export interface Paginated<T, Y> {
  items: T[];
  nextCursor: Y;
}
