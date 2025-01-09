import { Vacation } from "../components/VacationManagementSystem/types";
import { parseDate } from "./dates";

export const validateVacations = (
  vacations: Vacation[],
  existingVacations: Vacation[]
) => {
  const errors: string[] = [];

  vacations.forEach((vacation, index) => {
    const start = parseDate(vacation.startDate);
    const end = parseDate(vacation.endDate);

    if (!start || !end) {
      errors.push(`Row ${index + 1}: Invalid date format`);
      return;
    }

    if (start > end) {
      errors.push(`Row ${index + 1}: Start date must be before end date`);
    }

    // Check for overlapping vacations
    const overlapping = existingVacations.some((existing) => {
      const existingStart = parseDate(existing.startDate);
      const existingEnd = parseDate(existing.endDate);

      if (!existingStart || !existingEnd) return false;

      return (
        vacation.employeeId === existing.employeeId &&
        !(end < existingStart || start > existingEnd)
      );
    });

    if (overlapping) {
      errors.push(`Row ${index + 1}: Overlapping vacation dates`);
    }
  });

  return errors;
};
