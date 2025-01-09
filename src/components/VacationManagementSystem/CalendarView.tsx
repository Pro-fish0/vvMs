import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, eachDayOfInterval } from "date-fns";
import { parseDate } from "../../utils/dates";
import { Vacation } from "./types";

interface CalendarViewProps {
  vacations: Vacation[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const CalendarView = ({
  vacations,
  currentDate,
  setCurrentDate,
}: CalendarViewProps) => {
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, [currentDate]);

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return vacations.filter((vacation) => {
      const start = parseDate(vacation.startDate);
      const end = parseDate(vacation.endDate);
      if (!start || !end) return false;

      const vacationDays = eachDayOfInterval({ start, end });
      return vacationDays.some(
        (date) => date.getMonth() === month && date.getFullYear() === year
      );
    });
  }, [vacations, currentDate]);

  const employeeVacations = useMemo(() => {
    const employeeMap = new Map();

    monthData.forEach((vacation) => {
      if (!employeeMap.has(vacation.employeeId)) {
        employeeMap.set(vacation.employeeId, {
          name: vacation.employeeName,
          days: new Set(),
        });
      }

      const start = parseDate(vacation.startDate);
      const end = parseDate(vacation.endDate);
      if (start && end) {
        eachDayOfInterval({ start, end }).forEach((date) => {
          if (date.getMonth() === currentDate.getMonth()) {
            employeeMap.get(vacation.employeeId).days.add(date.getDate());
          }
        });
      }
    });

    return Array.from(employeeMap.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      days: Array.from(data.days),
    }));
  }, [monthData, currentDate]);

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.setMonth(currentDate.getMonth() - 1))
              )
            }
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.setMonth(currentDate.getMonth() + 1))
              )
            }
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="border rounded">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border-b p-2 bg-gray-50">Employee</th>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <th
                  key={i}
                  className="border-b p-2 bg-gray-50 min-w-8 text-center"
                >
                  {i + 1}
                </th>
              ))}
              <th className="border-b p-2 bg-gray-50">Total</th>
            </tr>
          </thead>
          <tbody>
            {employeeVacations.map(({ id, name, days }) => (
              <tr key={id}>
                <td className="border-b p-2">{name}</td>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <td
                    key={i}
                    className={`border-b p-2 text-center ${
                      days.includes(i + 1) ? "bg-blue-100" : ""
                    }`}
                  >
                    {days.includes(i + 1) ? "✓" : ""}
                  </td>
                ))}
                <td className="border-b p-2 text-center">{days.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarView;
