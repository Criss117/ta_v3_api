import { z } from "zod";

export const findManyByClient = z.object({
  clientId: z.string(),
});

export type FindManyByClient = z.infer<typeof findManyByClient>;
