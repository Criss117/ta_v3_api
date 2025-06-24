import type { InstallmentsPaymentSchema } from "@/modules/clients/mappers/schemas";

export function distributePayment(
	total: number,
	data: InstallmentsPaymentSchema[],
) {
	let remainingAmount = total;
	const paymentsToUpdate: InstallmentsPaymentSchema[] = [];

	// Iterar sobre los pagos en orden
	for (const payment of data) {
		// Si no hay más cantidad que distribuir, salir del bucle
		if (remainingAmount <= 0) break;

		// Calcular cuánto falta por pagar en este pago
		const remainingDebt = payment.subtotal - payment.subtotalPaid;

		// Si ya está completamente pagado, continuar con el siguiente
		if (remainingDebt <= 0) continue;

		// Calcular cuánto se puede asignar a este pago
		const amountToAssign = Math.min(remainingAmount, remainingDebt);

		// Asignar la cantidad
		payment.subtotalPaid += amountToAssign;
		remainingAmount -= amountToAssign;

		// Actualizar el estado según las reglas
		if (payment.subtotalPaid >= payment.subtotal) {
			payment.status = "paid";
		} else if (payment.subtotalPaid > 0) {
			payment.status = "partial";
		} else {
			payment.status = "unpaid";
		}

		paymentsToUpdate.push(payment);
	}

	return paymentsToUpdate;
}

export function updateInstallmentStatus(
	installments: InstallmentsPaymentSchema[],
	total: number,
): InstallmentsPaymentSchema[] {
	// Crear una copia del array para no mutar el original
	const updatedInstallments = [...installments];
	const changedInstallments: InstallmentsPaymentSchema[] = [];
	let remainingTotal = total;

	for (let i = 0; i < updatedInstallments.length && remainingTotal > 0; i++) {
		const installment = updatedInstallments[i];
		const originalStatus = installment.status;
		const originalSubtotalPaid = installment.subtotalPaid;

		// Solo procesar si la cuota tiene subtotalPaid > 0
		if (installment.subtotalPaid > 0) {
			// Calcular cuánto restar de esta cuota
			const amountToSubtract = Math.min(
				installment.subtotalPaid,
				remainingTotal,
			);

			// Restar del subtotalPaid
			installment.subtotalPaid -= amountToSubtract;

			// Restar del total restante
			remainingTotal -= amountToSubtract;

			// Actualizar el estado según la nueva condición
			if (installment.subtotalPaid === 0) {
				installment.status = "unpaid";
			} else {
				installment.status = "partial";
			}

			// Verificar si hubo cambios
			if (
				originalStatus !== installment.status ||
				originalSubtotalPaid !== installment.subtotalPaid
			) {
				changedInstallments.push({ ...installment });
			}
		}
	}

	return changedInstallments;
}
