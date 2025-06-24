import { dbClient } from "@/integrations/db";
import { TRPCError } from "@trpc/server";
import type { TX } from "@/modules/shared/models/types";
import type { TicketsCommandRepository } from "../repositories/tickets-command.repository";
import type { CreateTicketDto } from "../dtos/create-ticket.dto";
import type { UpdateProductStockUseCase } from "@/modules/products/use-cases/update-product-stock.usecase";
import type { CreateInstallmentPlanUseCase } from "@/modules/clients/use-cases/installments/create-installment-plan.usecase";

export class CreateTicketUseCase {
  constructor(
    private readonly ticketsCommandRepository: TicketsCommandRepository,
    private readonly updateProductStockUseCase: UpdateProductStockUseCase,
    private readonly createInstallmentPlanUseCase: CreateInstallmentPlanUseCase,
  ) {}

  public async execute(data: CreateTicketDto) {
    if (data.payType === "cash") {
      await this.createAndUpdateStock({
        items: data.items,
        payType: data.payType,
        clientId: data.clientId,
      });

      return;
    }

    if (!data.clientId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }

    return this.createCreditTicket(data);
  }

  private async createCreditTicket(data: CreateTicketDto) {
    const { items, ...ticket } = data;

    const total = items.reduce((acc, t) => acc + t.price * t.quantity, 0);

    return dbClient.transaction(async (tx) => {
      if (!ticket.clientId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
      await this.createAndUpdateStock(
        {
          items: items,
          payType: ticket.payType,
          clientId: ticket.clientId,
        },
        tx,
      );

      await this.createInstallmentPlanUseCase.execute(
        {
          clientId: ticket.clientId,
          total: total,
        },
        tx,
      );
    });
  }

  private async createAndUpdateStock(data: CreateTicketDto, tx?: TX) {
    const transaction = async (dbTX: TX) => {
      const ticketId = await this.ticketsCommandRepository.create(data, dbTX);

      const updateStockPromises = data.items.map((i) =>
        this.updateProductStockUseCase.execute(
          {
            productId: i.productId,
            quantity: i.quantity,
          },
          dbTX,
        ),
      );

      await Promise.all(updateStockPromises);

      return ticketId;
    };

    if (tx) {
      return tx.transaction(transaction);
    }

    return dbClient.transaction(transaction);
  }
}
