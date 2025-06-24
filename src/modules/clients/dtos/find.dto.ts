import { z } from "zod";

export const findOneClientByDto = z.object({
  clientId: z.string().max(100).nullish(),
  clientCode: z.string().max(100).nullish(),
});

export type FindOneClientDto = z.infer<typeof findOneClientByDto>;

export type ThereAreClientBy = {
  id: string;
  email?: string | null;
  clientCode?: string | null;
  phone?: string | null;
};
