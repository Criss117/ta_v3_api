export function calculateInstallments(
  totalDebt: number,
  totalInstallments: number,
) {
  const baseInstallment = Math.ceil(totalDebt / totalInstallments);
  const installments = new Array<number>(totalInstallments).fill(
    baseInstallment,
  );

  const totalParcial = baseInstallment * totalInstallments;
  const excess = Math.floor(totalParcial - totalDebt);

  installments[totalInstallments - 1] -= excess;

  return installments;
}
