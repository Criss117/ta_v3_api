import type { InstallmentModality } from "@/integrations/db/shared";
import type { clients } from "@/integrations/db/tables";

export type ClientDB = typeof clients.$inferSelect;

export interface ClientSummary {
  isActive: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  creditLimit: number;
  clientCode: string;
  globalNumberOfInstallments: number;
  globalInstallmentModality: InstallmentModality;
}

export interface ClientDetail {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  creditLimit: number;
  clientCode: string;
  globalNumberOfInstallments: number;
  globalInstallmentModality: InstallmentModality;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  totalTickets: number;
  totalTicketsUnpaid: number;
  totalTicketsPaid: number;
  totalDebt: number;
  totalInstallments: number;
  lastTicketDate: Date | null;
}
