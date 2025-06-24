import type { TicketStaus } from "@/integrations/db/shared";

export type UpdateTotalPaidDto = {
  id: number;
  totalPaid: number;
  status: TicketStaus;
};
