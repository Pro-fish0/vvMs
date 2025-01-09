import React, { useMemo } from "react";
import { parseDate } from "../../utils/dates";
import { Vacation, Employee } from "./types";

interface ReportsProps {
  vacations: Vacation[];
  employees: Employee[];
  currentDate: Date;
}

const Reports = ({ vacations, employees, currentDate }: ReportsProps) => {
  const yearlyStats = useMemo(() => {
    const year = currentDate.getFullYear();
    const yearVacations = vacations.filter((vacation) => {
      const start = parseDate(vacation.startDate);
      return start?.getFullYear() === year;
    });

    const stats = {
      total: yearVacations.length,
      byType: {} as Record<string, number>,
      byMonth: Array(12).fill(0),
      byEmployee: {} as Record<string, number>,
    };

    yearVacations.forEach((vacation) => {
      // Count by type
      stats.byType[vacation.type] = (stats.byType[vacation.type] || 0) + 1;

      // Count by month
      const start = parseDate(vacation.startDate);
      if (start) {
        stats.byMonth[start.getMonth()]++;
      }

      // Count by employee
      stats.byEmployee[vacation.employeeId] =
        (stats.byEmployee[vacation.employeeId] || 0) + 1;
    });

    return stats;
  }, [vacations, currentDate]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Total Vacations</h3>
          <p className="text-2xl">{yearlyStats.total}</p>
        </div>

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">By Type</h3>
          <ul className="space-y-2">
            {Object.entries(yearlyStats.byType).map(([type, count]) => (
              <li key={type} className="flex justify-between">
                <span>{type}</span>
                <span>{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Monthly Average</h3>
          <p className="text-2xl">{(yearlyStats.total / 12).toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
