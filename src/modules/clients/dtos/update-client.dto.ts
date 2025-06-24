import { z } from "zod";
import { createClientDto } from "./create-client.dto";
import { installmentModality } from "@/integrations/db/shared";
import { clientId } from "./value-objects";

export const updateClientDto = createClientDto.partial().extend({
  clientId: clientId,
  numberOfInstallments: z.number().min(1).max(36).int().nullish(),
  modality: z.enum(installmentModality).nullish(),
});

export type UpdateClientDto = z.infer<typeof updateClientDto>;
