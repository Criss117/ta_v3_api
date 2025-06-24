import type { InstallmentModality } from "@/integrations/db/shared";

export function generateDueDates(
  modality: InstallmentModality,
  numberOfInstallments: number,
  defaulrStartDate?: Date,
) {
  // Establecer fecha de inicio
  let startDate: Date;
  if (defaulrStartDate) {
    startDate = new Date(defaulrStartDate);
  } else {
    // If no startDate provided, create one based on frequency
    startDate = new Date();
    const originalDay = startDate.getDate();

    switch (modality) {
      case "weekly":
        startDate.setDate(startDate.getDate() + 7);
        break;
      case "biweekly":
        startDate.setDate(startDate.getDate() + 14);
        break;
      case "monthly":
        startDate.setMonth(startDate.getMonth() + 1);

        // Handle month overflow bug (e.g., Jan 30 -> Mar 2)
        if (startDate.getDate() !== originalDay) {
          startDate.setDate(0); // Go to last day of previous month
        }
        break;
    }
  }

  // Generar array de fechas
  const dates = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < numberOfInstallments; i++) {
    dates.push(new Date(currentDate));

    const originalDay = currentDate.getDate();

    // Calcular siguiente fecha según modalidad
    switch (modality) {
      case "weekly":
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case "biweekly":
        currentDate.setDate(currentDate.getDate() + 14);
        break;
      case "monthly":
        // Handle the date bug for cases like Jan 30 -> Feb (skips to March)
        currentDate.setMonth(currentDate.getMonth() + 1);

        // If day changed due to date bug, adjust to last day of the month
        if (currentDate.getDate() !== originalDay) {
          currentDate.setDate(0);
        }
        break;
    }
  }

  return dates;
}
