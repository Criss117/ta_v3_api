import { z } from "zod";

export const clientsCursorDto = z.object({
  createdAt: z.date().nullish(),
  lastClientCode: z.string().max(100).nullish(),
});

export type ClientsCursorDto = z.infer<typeof clientsCursorDto>;
